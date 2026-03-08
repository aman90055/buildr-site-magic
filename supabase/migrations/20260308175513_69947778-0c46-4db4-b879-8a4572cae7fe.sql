CREATE TABLE public.user_premium_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  activated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  payment_verification_id UUID REFERENCES public.payment_verifications(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_premium_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own premium status"
  ON public.user_premium_status
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert premium status"
  ON public.user_premium_status
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update premium status"
  ON public.user_premium_status
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE TRIGGER handle_user_premium_status_updated_at
  BEFORE UPDATE ON public.user_premium_status
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();