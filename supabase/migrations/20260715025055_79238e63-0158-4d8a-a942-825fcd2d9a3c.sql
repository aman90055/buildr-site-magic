
-- 1) Audit log
CREATE TABLE IF NOT EXISTS public.premium_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  action text NOT NULL, -- 'granted' | 'revoked' | 'plan_changed' | 'skipped_conflict'
  rule text NOT NULL,   -- 'owner_email_trigger' | 'admin_manual' | 'payment_verification' | 'system'
  plan text,
  previous_plan text,
  actor_id uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.premium_audit_log TO authenticated;
GRANT ALL ON public.premium_audit_log TO service_role;

ALTER TABLE public.premium_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view premium audit log"
  ON public.premium_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_premium_audit_email ON public.premium_audit_log(email);
CREATE INDEX IF NOT EXISTS idx_premium_audit_user ON public.premium_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_premium_audit_created ON public.premium_audit_log(created_at DESC);

-- 2) Plan rank helper to prevent downgrades
CREATE OR REPLACE FUNCTION public.premium_plan_rank(_plan text)
RETURNS integer
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE lower(coalesce(_plan,''))
    WHEN 'lifetime' THEN 100
    WHEN 'enterprise' THEN 80
    WHEN 'pro' THEN 60
    WHEN 'basic' THEN 40
    WHEN 'starter' THEN 20
    ELSE 10
  END
$$;

-- 3) Rewritten owner-email trigger with conflict guard + audit
CREATE OR REPLACE FUNCTION public.grant_premium_for_owner_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_plan text;
  v_existing_active boolean;
BEGIN
  IF lower(NEW.email) NOT IN ('documentai999@gmail.com','aman9005573@gmail.com','ananttripathi206@gmail.com') THEN
    RETURN NEW;
  END IF;

  SELECT plan, is_active INTO v_existing_plan, v_existing_active
  FROM public.user_premium_status WHERE user_id = NEW.id;

  IF v_existing_plan IS NOT NULL
     AND v_existing_active
     AND public.premium_plan_rank(v_existing_plan) >= public.premium_plan_rank('lifetime') THEN
    INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, notes)
    VALUES (NEW.id, NEW.email, 'skipped_conflict', 'owner_email_trigger', 'lifetime', v_existing_plan,
            'User already has equal-or-higher plan; no change');
    RETURN NEW;
  END IF;

  INSERT INTO public.user_premium_status (user_id, plan, is_active, expires_at)
  VALUES (NEW.id, 'lifetime', true, NULL)
  ON CONFLICT (user_id) DO UPDATE
    SET plan = 'lifetime', is_active = true, expires_at = NULL, updated_at = now();

  INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, notes)
  VALUES (NEW.id, NEW.email,
          CASE WHEN v_existing_plan IS NULL THEN 'granted' ELSE 'plan_changed' END,
          'owner_email_trigger', 'lifetime', v_existing_plan,
          'Auto-grant from allow-listed owner email');
  RETURN NEW;
END;
$$;

-- Ensure trigger exists (recreate to be safe, keeps behavior)
DROP TRIGGER IF EXISTS on_auth_user_created_grant_premium ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_premium
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_premium_for_owner_emails();

-- 4) Admin function: grant premium by email
CREATE OR REPLACE FUNCTION public.admin_grant_premium_by_email(_email text, _plan text DEFAULT 'lifetime', _notes text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_existing_plan text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    INSERT INTO public.premium_audit_log (email, action, rule, plan, actor_id, notes)
    VALUES (_email, 'pending_signup', 'admin_manual', _plan, auth.uid(),
            coalesce(_notes,'Email not yet registered; will apply on signup if added to allow-list'));
    RETURN jsonb_build_object('success', false, 'error', 'No user with that email yet', 'logged', true);
  END IF;

  SELECT plan INTO v_existing_plan FROM public.user_premium_status WHERE user_id = v_user_id;

  IF v_existing_plan IS NOT NULL
     AND public.premium_plan_rank(v_existing_plan) > public.premium_plan_rank(_plan) THEN
    INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
    VALUES (v_user_id, _email, 'skipped_conflict', 'admin_manual', _plan, v_existing_plan, auth.uid(),
            'Refused downgrade');
    RETURN jsonb_build_object('success', false, 'error', 'User has a higher plan; refused downgrade');
  END IF;

  INSERT INTO public.user_premium_status (user_id, plan, is_active, expires_at)
  VALUES (v_user_id, _plan, true, CASE WHEN _plan = 'lifetime' THEN NULL ELSE now() + interval '1 year' END)
  ON CONFLICT (user_id) DO UPDATE
    SET plan = EXCLUDED.plan, is_active = true, expires_at = EXCLUDED.expires_at, updated_at = now();

  INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
  VALUES (v_user_id, _email,
          CASE WHEN v_existing_plan IS NULL THEN 'granted' ELSE 'plan_changed' END,
          'admin_manual', _plan, v_existing_plan, auth.uid(), _notes);

  RETURN jsonb_build_object('success', true, 'user_id', v_user_id, 'plan', _plan);
END;
$$;

-- 5) Admin function: revoke
CREATE OR REPLACE FUNCTION public.admin_revoke_premium_by_email(_email text, _notes text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
  v_existing_plan text;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  SELECT plan INTO v_existing_plan FROM public.user_premium_status WHERE user_id = v_user_id;

  UPDATE public.user_premium_status SET is_active = false, updated_at = now() WHERE user_id = v_user_id;

  INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
  VALUES (v_user_id, _email, 'revoked', 'admin_manual', v_existing_plan, v_existing_plan, auth.uid(), _notes);

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 6) Admin function: list premium users with email
CREATE OR REPLACE FUNCTION public.admin_list_premium()
RETURNS TABLE (
  user_id uuid,
  email text,
  plan text,
  is_active boolean,
  activated_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  SELECT ups.user_id, u.email::text, ups.plan, ups.is_active,
         ups.activated_at, ups.expires_at, ups.updated_at
  FROM public.user_premium_status ups
  LEFT JOIN auth.users u ON u.id = ups.user_id
  ORDER BY ups.updated_at DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_grant_premium_by_email(text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_revoke_premium_by_email(text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_premium() TO authenticated;
