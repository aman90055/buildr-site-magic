-- Fix 1: Drop overly permissive storage policies on 'pdfs' bucket
DROP POLICY IF EXISTS "Anyone can upload PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view PDFs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete PDFs" ON storage.objects;

-- Create user-scoped storage policies
CREATE POLICY "Authenticated users can upload own PDFs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'pdfs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can view own PDFs"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'pdfs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Authenticated users can delete own PDFs"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'pdfs' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Fix 2: Restrict newsletter_subscribers SELECT to service_role only
CREATE POLICY "Only service role can view subscribers"
ON public.newsletter_subscribers
FOR SELECT TO service_role
USING (true);

-- Fix 3: Create rate limiting table for edge functions
CREATE TABLE public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  function_name text NOT NULL,
  request_count integer NOT NULL DEFAULT 1,
  window_start timestamp with time zone NOT NULL DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only service role can access rate limits
CREATE POLICY "Service role manages rate limits"
ON public.rate_limits FOR ALL TO service_role
USING (true) WITH CHECK (true);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (identifier, function_name, window_start);