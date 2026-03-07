CREATE TABLE public.payment_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  utr_number TEXT NOT NULL,
  plan TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
);

ALTER TABLE public.payment_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit payment verification"
  ON public.payment_verifications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can manage verifications"
  ON public.payment_verifications
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);