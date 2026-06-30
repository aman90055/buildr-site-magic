DROP POLICY IF EXISTS "Service role manages contact messages" ON public.contact_messages;

CREATE POLICY "Backend service manages contact messages"
ON public.contact_messages
FOR ALL
TO service_role
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');