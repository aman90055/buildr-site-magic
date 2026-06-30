CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  delivery_status text NOT NULL DEFAULT 'pending',
  provider_error jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contact_messages_delivery_status_check CHECK (delivery_status IN ('pending', 'sent', 'failed')),
  CONSTRAINT contact_messages_name_length CHECK (char_length(name) BETWEEN 1 AND 100),
  CONSTRAINT contact_messages_email_length CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT contact_messages_subject_length CHECK (char_length(subject) BETWEEN 1 AND 200),
  CONSTRAINT contact_messages_message_length CHECK (char_length(message) BETWEEN 10 AND 2000)
);

GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manages contact messages" ON public.contact_messages;
CREATE POLICY "Service role manages contact messages"
ON public.contact_messages
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();