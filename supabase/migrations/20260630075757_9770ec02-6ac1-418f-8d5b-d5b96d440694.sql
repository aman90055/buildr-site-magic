-- Drop redundant service_role ALL policies (service_role bypasses RLS by design, these policies are no-ops that trigger linter warnings)
DROP POLICY IF EXISTS "Service role manages rewards" ON public.referral_rewards;
DROP POLICY IF EXISTS "Service role manages stats" ON public.user_referral_stats;
DROP POLICY IF EXISTS "Service role can manage verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Service role manages rate limits" ON public.rate_limits;
DROP POLICY IF EXISTS "Service role manages referrals" ON public.referrals;
DROP POLICY IF EXISTS "Service role manages premium status" ON public.user_premium_status;
DROP POLICY IF EXISTS "Service role manages checkins" ON public.daily_checkins;