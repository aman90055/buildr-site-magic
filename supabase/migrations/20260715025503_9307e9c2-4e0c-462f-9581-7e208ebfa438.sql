
-- 1) Fix mutable search_path on premium_plan_rank
ALTER FUNCTION public.premium_plan_rank(text) SET search_path = public;

-- 2) Revoke anon/public EXECUTE on SECURITY DEFINER functions that must not be callable anonymously.
--    Keep authenticated + service_role able to call them; RPCs themselves check has_role(admin) internally.
REVOKE ALL ON FUNCTION public.admin_grant_premium_by_email(text, text, text) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_revoke_premium_by_email(text, text)      FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_premium()                            FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.claim_daily_checkin()                           FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role)                 FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.admin_grant_premium_by_email(text, text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_revoke_premium_by_email(text, text)      TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.admin_list_premium()                            TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_daily_checkin()                           TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role)                 TO authenticated, service_role;

-- 3) The owner-email grant function is only meant to fire from the auth.users trigger.
REVOKE ALL ON FUNCTION public.grant_premium_for_owner_emails() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.grant_premium_for_owner_emails() TO service_role;
