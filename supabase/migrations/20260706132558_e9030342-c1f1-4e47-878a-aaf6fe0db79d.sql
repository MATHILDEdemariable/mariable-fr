CREATE TABLE public.instagram_highlights (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instagram_url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  prestataire_id UUID REFERENCES public.prestataires_rows(id) ON DELETE SET NULL,
  context TEXT NOT NULL DEFAULT 'both' CHECK (context IN ('blog','professionnels','both')),
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.instagram_highlights TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.instagram_highlights TO authenticated;
GRANT ALL ON public.instagram_highlights TO service_role;

ALTER TABLE public.instagram_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active highlights"
  ON public.instagram_highlights FOR SELECT
  USING (active = true OR public.is_admin());

CREATE POLICY "Admins can insert highlights"
  ON public.instagram_highlights FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update highlights"
  ON public.instagram_highlights FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete highlights"
  ON public.instagram_highlights FOR DELETE
  TO authenticated
  USING (public.is_admin());

CREATE TRIGGER update_instagram_highlights_updated_at
  BEFORE UPDATE ON public.instagram_highlights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_instagram_highlights_context ON public.instagram_highlights(context, active, display_order);