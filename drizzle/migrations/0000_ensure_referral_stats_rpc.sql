CREATE OR REPLACE FUNCTION public.ensure_referral_stats()
RETURNS public.user_referral_stats
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_row public.user_referral_stats;
  v_code text;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_row FROM public.user_referral_stats WHERE user_id = v_user_id;
  IF FOUND THEN
    RETURN v_row;
  END IF;

  v_code := 'REF-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));

  INSERT INTO public.user_referral_stats (user_id, referral_code)
  VALUES (v_user_id, v_code)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_row FROM public.user_referral_stats WHERE user_id = v_user_id;
  RETURN v_row;
END;
$$;

REVOKE ALL ON FUNCTION public.ensure_referral_stats() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_referral_stats() TO authenticated;