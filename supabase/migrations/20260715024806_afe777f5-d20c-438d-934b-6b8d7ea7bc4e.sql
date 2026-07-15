
CREATE OR REPLACE FUNCTION public.grant_premium_for_owner_emails()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF lower(NEW.email) IN ('documentai999@gmail.com','aman9005573@gmail.com','ananttripathi206@gmail.com') THEN
    INSERT INTO public.user_premium_status (user_id, plan, is_active, expires_at)
    VALUES (NEW.id, 'lifetime', true, NULL)
    ON CONFLICT (user_id) DO UPDATE
      SET plan = 'lifetime', is_active = true, expires_at = NULL, updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created_grant_premium ON auth.users;
CREATE TRIGGER on_auth_user_created_grant_premium
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_premium_for_owner_emails();
