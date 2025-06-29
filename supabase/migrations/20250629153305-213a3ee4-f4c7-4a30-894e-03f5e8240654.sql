
-- Diagnostiquer et corriger les politiques RLS pour les uploads d'images

-- 1. Supprimer les anciennes politiques qui posent problème
DROP POLICY IF EXISTS "Admins can manage blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage prestataire photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view prestataire photos" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage prestataire brochures" ON storage.objects;
DROP POLICY IF EXISTS "Public can view prestataire brochures" ON storage.objects;

-- 2. Créer des politiques plus permissives pour le bucket blog-images
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Authenticated users can delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- 3. Créer des politiques pour le bucket prestataires-photos
CREATE POLICY "Public can view prestataire photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-photos');

CREATE POLICY "Authenticated users can upload prestataire photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'prestataires-photos');

CREATE POLICY "Authenticated users can update prestataire photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'prestataires-photos')
  WITH CHECK (bucket_id = 'prestataires-photos');

CREATE POLICY "Authenticated users can delete prestataire photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'prestataires-photos');

-- 4. Créer des politiques pour le bucket prestataires-brochures
CREATE POLICY "Public can view prestataire brochures"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-brochures');

CREATE POLICY "Authenticated users can upload prestataire brochures"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'prestataires-brochures');

CREATE POLICY "Authenticated users can update prestataire brochures"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'prestataires-brochures')
  WITH CHECK (bucket_id = 'prestataires-brochures');

CREATE POLICY "Authenticated users can delete prestataire brochures"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'prestataires-brochures');
