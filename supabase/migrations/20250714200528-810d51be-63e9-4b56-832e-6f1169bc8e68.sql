-- Créer un bucket pour les documents téléchargeables (livres blancs, guides, etc.)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('white-papers', 'white-papers', true, 10485760, ARRAY['application/pdf']);

-- Politique pour permettre la lecture publique des documents
CREATE POLICY "Public can view white papers"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'white-papers');

-- Politique pour permettre aux administrateurs de gérer les documents
CREATE POLICY "Admins can manage white papers"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'white-papers')
  WITH CHECK (public.is_admin() AND bucket_id = 'white-papers');