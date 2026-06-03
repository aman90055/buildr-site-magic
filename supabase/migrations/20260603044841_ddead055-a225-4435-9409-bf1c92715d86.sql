
CREATE TABLE public.daily_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  checkin_date date NOT NULL DEFAULT (now() AT TIME ZONE 'UTC')::date,
  streak_day integer NOT NULL DEFAULT 1,
  credits_earned integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, checkin_date)
);

GRANT SELECT, INSERT ON public.daily_checkins TO authenticated;
GRANT ALL ON public.daily_checkins TO service_role;

ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own checkins" ON public.daily_checkins
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role manages checkins" ON public.daily_checkins
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX idx_daily_checkins_user_date ON public.daily_checkins(user_id, checkin_date DESC);

CREATE OR REPLACE FUNCTION public.claim_daily_checkin()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_today date := (now() AT TIME ZONE 'UTC')::date;
  v_yesterday date := v_today - 1;
  v_last_date date;
  v_last_streak integer;
  v_new_streak integer := 1;
  v_credits integer;
  v_bonus integer := 0;
  v_code text;
BEGIN
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  IF EXISTS (SELECT 1 FROM public.daily_checkins WHERE user_id = v_user_id AND checkin_date = v_today) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Already claimed today', 'already_claimed', true);
  END IF;

  SELECT checkin_date, streak_day INTO v_last_date, v_last_streak
  FROM public.daily_checkins
  WHERE user_id = v_user_id
  ORDER BY checkin_date DESC
  LIMIT 1;

  IF v_last_date = v_yesterday THEN
    v_new_streak := v_last_streak + 1;
  END IF;

  v_credits := LEAST(5 + (v_new_streak - 1), 25);
  IF v_new_streak % 7 = 0 THEN
    v_bonus := 10;
  END IF;
  v_credits := v_credits + v_bonus;

  INSERT INTO public.daily_checkins (user_id, checkin_date, streak_day, credits_earned)
  VALUES (v_user_id, v_today, v_new_streak, v_credits);

  -- Ensure stats row exists, then add credits
  SELECT referral_code INTO v_code FROM public.user_referral_stats WHERE user_id = v_user_id;
  IF v_code IS NULL THEN
    v_code := 'REF-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));
    INSERT INTO public.user_referral_stats (user_id, referral_code, total_credits)
    VALUES (v_user_id, v_code, v_credits);
  ELSE
    UPDATE public.user_referral_stats
    SET total_credits = total_credits + v_credits, updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'credits_earned', v_credits,
    'streak_day', v_new_streak,
    'bonus', v_bonus
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_daily_checkin() TO authenticated;
