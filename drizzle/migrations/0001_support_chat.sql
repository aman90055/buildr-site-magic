CREATE TABLE public.support_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'New conversation',
  status text NOT NULL DEFAULT 'open',
  handoff_reason text,
  handoff_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_threads TO authenticated;
GRANT ALL ON public.support_threads TO service_role;
ALTER TABLE public.support_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own support threads" ON public.support_threads FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users create own support threads" ON public.support_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'open');
CREATE POLICY "Users delete own support threads" ON public.support_threads FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view support threads" ON public.support_threads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX support_threads_user_idx ON public.support_threads(user_id, updated_at DESC);

CREATE TABLE public.support_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES public.support_threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL,
  message_id text NOT NULL,
  message jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (thread_id, message_id)
);
GRANT SELECT ON public.support_messages TO authenticated;
GRANT ALL ON public.support_messages TO service_role;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own support messages" ON public.support_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins view support messages" ON public.support_messages FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX support_messages_thread_idx ON public.support_messages(thread_id, created_at);

CREATE TRIGGER support_threads_updated_at BEFORE UPDATE ON public.support_threads FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();