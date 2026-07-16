
-- Safeguards for premium grant/revoke: protect owner emails and admin minimum plan

CREATE OR REPLACE FUNCTION public.admin_revoke_premium_by_email(_email text, _notes text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_existing_plan text;
  v_is_admin boolean;
  v_is_owner boolean;
  v_other_active_owner_admins int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authorized');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'User not found');
  END IF;

  v_is_owner := lower(_email) IN ('documentai999@gmail.com','aman9005573@gmail.com','ananttripathi206@gmail.com');
  v_is_admin := public.has_role(v_user_id, 'admin');

  -- Safeguard: last active owner admin cannot be revoked
  IF v_is_owner AND v_is_admin THEN
    SELECT count(*) INTO v_other_active_owner_admins
    FROM public.user_premium_status ups
    JOIN auth.users u ON u.id = ups.user_id
    JOIN public.user_roles r ON r.user_id = ups.user_id AND r.role = 'admin'
    WHERE ups.is_active = true
      AND lower(u.email) IN ('documentai999@gmail.com','aman9005573@gmail.com','ananttripathi206@gmail.com')
      AND ups.user_id <> v_user_id;

    IF v_other_active_owner_admins = 0 THEN
      INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
      VALUES (v_user_id, _email, 'skipped_conflict', 'safeguard_last_owner', NULL,
              (SELECT plan FROM public.user_premium_status WHERE user_id = v_user_id),
              auth.uid(), 'Refused: last active owner admin cannot be revoked');
      RETURN jsonb_build_object('success', false, 'error', 'Refused: last active owner admin cannot be revoked');
    END IF;
  END IF;

  SELECT plan INTO v_existing_plan FROM public.user_premium_status WHERE user_id = v_user_id;
  UPDATE public.user_premium_status SET is_active = false, updated_at = now() WHERE user_id = v_user_id;

  INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
  VALUES (v_user_id, _email, 'revoked', 'admin_manual', v_existing_plan, v_existing_plan, auth.uid(), _notes);

  RETURN jsonb_build_object('success', true);
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_grant_premium_by_email(_email text, _plan text DEFAULT 'lifetime'::text, _notes text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_existing_plan text;
  v_is_admin boolean;
  v_min_admin_rank int := 60; -- 'pro'
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

  v_is_admin := public.has_role(v_user_id, 'admin');

  -- Safeguard: admin users cannot be set below minimum plan (pro)
  IF v_is_admin AND public.premium_plan_rank(_plan) < v_min_admin_rank THEN
    INSERT INTO public.premium_audit_log (user_id, email, action, rule, plan, previous_plan, actor_id, notes)
    VALUES (v_user_id, _email, 'skipped_conflict', 'safeguard_admin_min_plan', _plan,
            (SELECT plan FROM public.user_premium_status WHERE user_id = v_user_id),
            auth.uid(), 'Refused: admin cannot be set below minimum plan (pro)');
    RETURN jsonb_build_object('success', false, 'error', 'Admin cannot be set below minimum plan (pro)');
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
$function$;

-- Enable realtime for user_premium_status
ALTER TABLE public.user_premium_status REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_premium_status;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;

-- Owner status view for admin panel
CREATE OR REPLACE FUNCTION public.admin_owner_status()
 RETURNS TABLE(email text, user_id uuid, plan text, is_active boolean, updated_at timestamptz, last_action text, last_action_at timestamptz, last_notes text)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  RETURN QUERY
  WITH owner_emails(email) AS (
    VALUES ('documentai999@gmail.com'),('aman9005573@gmail.com'),('ananttripathi206@gmail.com')
  )
  SELECT
    oe.email::text,
    u.id AS user_id,
    ups.plan,
    ups.is_active,
    ups.updated_at,
    la.action AS last_action,
    la.created_at AS last_action_at,
    la.notes AS last_notes
  FROM owner_emails oe
  LEFT JOIN auth.users u ON lower(u.email) = oe.email
  LEFT JOIN public.user_premium_status ups ON ups.user_id = u.id
  LEFT JOIN LATERAL (
    SELECT action, created_at, notes
    FROM public.premium_audit_log pal
    WHERE lower(pal.email) = oe.email
    ORDER BY created_at DESC
    LIMIT 1
  ) la ON true;
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.admin_owner_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_owner_status() TO authenticated;
