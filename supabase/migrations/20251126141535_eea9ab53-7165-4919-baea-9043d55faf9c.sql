-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdfs',
  'pdfs',
  false,
  52428800, -- 50MB limit
  ARRAY['application/pdf']::text[]
);

-- Create table for PDF merge jobs
CREATE TABLE public.pdf_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  job_type TEXT NOT NULL CHECK (job_type IN ('merge', 'compress', 'split', 'convert')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  input_files JSONB NOT NULL DEFAULT '[]'::jsonb,
  output_file TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pdf_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for pdf_jobs (public access for now, can add auth later)
CREATE POLICY "Anyone can create PDF jobs"
  ON public.pdf_jobs
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their PDF jobs"
  ON public.pdf_jobs
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update their PDF jobs"
  ON public.pdf_jobs
  FOR UPDATE
  TO public
  USING (true);

-- Storage policies for PDFs bucket
CREATE POLICY "Anyone can upload PDFs"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Anyone can view PDFs"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can delete PDFs"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'pdfs');

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.pdf_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();