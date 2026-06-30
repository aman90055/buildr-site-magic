
ALTER TABLE public.contact_messages 
  ADD COLUMN IF NOT EXISTS attempts integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_attempt_at timestamptz,
  ADD COLUMN IF NOT EXISTS next_retry_at timestamptz,
  ADD COLUMN IF NOT EXISTS sent_at timestamptz;

ALTER TABLE public.contact_messages DROP CONSTRAINT IF EXISTS contact_messages_delivery_status_check;
ALTER TABLE public.contact_messages 
  ADD CONSTRAINT contact_messages_delivery_status_check 
  CHECK (delivery_status = ANY (ARRAY['pending'::text, 'sent'::text, 'failed'::text, 'retrying'::text]));

GRANT SELECT ON public.contact_messages TO authenticated;

CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX IF NOT EXISTS idx_contact_messages_retry 
  ON public.contact_messages (delivery_status, next_retry_at)
  WHERE delivery_status IN ('failed', 'retrying', 'pending');
