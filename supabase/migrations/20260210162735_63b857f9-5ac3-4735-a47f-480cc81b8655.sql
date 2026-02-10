DROP POLICY IF EXISTS "Only service role can view subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Only service role can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
USING (auth.role() = 'service_role'::text);