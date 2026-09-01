CREATE TABLE public.devis_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  categorie TEXT NOT NULL,
  commentaire TEXT,
  file_path TEXT,
  statut TEXT NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.devis_analyses TO anon;
GRANT SELECT, INSERT ON public.devis_analyses TO authenticated;
GRANT ALL ON public.devis_analyses TO service_role;

ALTER TABLE public.devis_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a devis analysis"
ON public.devis_analyses FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can read devis analyses"
ON public.devis_analyses FOR SELECT
TO authenticated
USING (public.is_admin());

CREATE POLICY "Public can upload devis files"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'devis-analyses');

CREATE POLICY "Admins can read devis files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'devis-analyses' AND public.is_admin());