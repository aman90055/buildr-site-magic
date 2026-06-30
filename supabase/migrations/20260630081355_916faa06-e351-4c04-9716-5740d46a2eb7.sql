CREATE TABLE public.tool_icons (
  tool_slug text PRIMARY KEY,
  icon_data_url text NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tool_icons TO anon, authenticated;
GRANT ALL ON public.tool_icons TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.tool_icons TO authenticated;
ALTER TABLE public.tool_icons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view tool icons" ON public.tool_icons FOR SELECT USING (true);
CREATE POLICY "Admins can insert tool icons" ON public.tool_icons FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update tool icons" ON public.tool_icons FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete tool icons" ON public.tool_icons FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER tool_icons_updated_at BEFORE UPDATE ON public.tool_icons FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();