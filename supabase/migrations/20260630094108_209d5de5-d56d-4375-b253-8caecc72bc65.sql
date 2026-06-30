GRANT ALL ON public.rate_limits TO service_role;

DROP POLICY IF EXISTS "Backend service manages rate limits" ON public.rate_limits;
CREATE POLICY "Backend service manages rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');