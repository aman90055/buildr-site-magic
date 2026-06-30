-- 1. Roles infrastructure
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Seed admin role for the existing admin email
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email = 'support@documenteditpro.ai'
ON CONFLICT DO NOTHING;

-- 2. Fix payment_verifications
DROP POLICY IF EXISTS "Authenticated users can read payment verifications" ON public.payment_verifications;
DROP POLICY IF EXISTS "Authenticated users can update payment verifications" ON public.payment_verifications;

CREATE POLICY "Admins can read all payment verifications"
  ON public.payment_verifications FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update payment verifications"
  ON public.payment_verifications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Fix user_premium_status
DROP POLICY IF EXISTS "Authenticated users can insert premium status" ON public.user_premium_status;
DROP POLICY IF EXISTS "Authenticated users can update premium status" ON public.user_premium_status;

CREATE POLICY "Users can insert own premium status"
  ON public.user_premium_status FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update premium status"
  ON public.user_premium_status FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 4. Newsletter subscribers — restrict to admin role (service_role bypasses RLS anyway)
DROP POLICY IF EXISTS "Only service role can view subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Service role can manage subscribers" ON public.newsletter_subscribers;

CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 5. Storage: add UPDATE policy for pdfs bucket
CREATE POLICY "Users can update their own pdfs"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'pdfs' AND (storage.foldername(name))[1] = auth.uid()::text);
