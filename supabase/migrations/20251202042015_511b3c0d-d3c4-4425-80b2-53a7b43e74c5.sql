-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can create PDF jobs" ON public.pdf_jobs;
DROP POLICY IF EXISTS "Anyone can view their PDF jobs" ON public.pdf_jobs;
DROP POLICY IF EXISTS "Anyone can update their PDF jobs" ON public.pdf_jobs;

-- Create secure RLS policies with proper user ownership checks
CREATE POLICY "Users can create their own PDF jobs"
  ON public.pdf_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own PDF jobs"
  ON public.pdf_jobs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own PDF jobs"
  ON public.pdf_jobs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own PDF jobs"
  ON public.pdf_jobs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);