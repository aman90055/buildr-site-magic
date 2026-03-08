CREATE POLICY "Authenticated users can read payment verifications"
  ON public.payment_verifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update payment verifications"
  ON public.payment_verifications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);