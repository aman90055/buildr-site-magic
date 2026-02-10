-- Referral system tables

CREATE TABLE public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL UNIQUE,
  referred_email text,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

CREATE TABLE public.referral_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_type text NOT NULL CHECK (reward_type IN ('credits', 'discount', 'points')),
  amount integer NOT NULL DEFAULT 0,
  description text,
  referral_id uuid REFERENCES public.referrals(id) ON DELETE SET NULL,
  redeemed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE TABLE public.user_referral_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code text NOT NULL UNIQUE,
  total_referrals integer NOT NULL DEFAULT 0,
  successful_referrals integer NOT NULL DEFAULT 0,
  total_points integer NOT NULL DEFAULT 0,
  total_credits integer NOT NULL DEFAULT 0,
  discount_percent integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_referral_stats ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see their own referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id);
CREATE POLICY "Users can create own referrals" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);

-- RLS: Users can only see their own rewards
CREATE POLICY "Users can view own rewards" ON public.referral_rewards FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- RLS: Users can view and manage their own stats
CREATE POLICY "Users can view own stats" ON public.user_referral_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stats" ON public.user_referral_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stats" ON public.user_referral_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Service role for processing referrals
CREATE POLICY "Service role manages referrals" ON public.referrals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages rewards" ON public.referral_rewards FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role manages stats" ON public.user_referral_stats FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Indexes
CREATE INDEX idx_referrals_referrer ON public.referrals (referrer_id);
CREATE INDEX idx_referrals_code ON public.referrals (referral_code);
CREATE INDEX idx_referral_rewards_user ON public.referral_rewards (user_id);
CREATE INDEX idx_user_referral_stats_user ON public.user_referral_stats (user_id);
CREATE INDEX idx_user_referral_stats_code ON public.user_referral_stats (referral_code);

-- Trigger for updated_at
CREATE TRIGGER update_user_referral_stats_updated_at
BEFORE UPDATE ON public.user_referral_stats
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();