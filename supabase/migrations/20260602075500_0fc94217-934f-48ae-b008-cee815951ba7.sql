
-- Remove self-insert on user_premium_status; only service_role writes
DROP POLICY IF EXISTS "Users can insert own premium status" ON public.user_premium_status;

CREATE POLICY "Service role manages premium status"
  ON public.user_premium_status FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

-- Remove self insert/update on user_referral_stats; only service_role writes
DROP POLICY IF EXISTS "Users can insert own stats" ON public.user_referral_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON public.user_referral_stats;
