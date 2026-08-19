REVOKE INSERT ON public.daily_checkins FROM authenticated;

COMMENT ON TABLE public.daily_checkins IS 'Daily check-in streak records. Rows are created only by the SECURITY DEFINER function public.claim_daily_checkin(); direct client writes are intentionally impossible (no INSERT/UPDATE/DELETE policy and no INSERT grant to authenticated). Users can read only their own rows.';