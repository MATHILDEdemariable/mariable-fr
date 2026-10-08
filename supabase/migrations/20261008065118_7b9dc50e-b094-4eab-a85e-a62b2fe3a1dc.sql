DROP POLICY IF EXISTS "ebooks bucket - no public access" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update jeunes maries photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload jeunes maries photos" ON storage.objects;
DROP POLICY IF EXISTS "all verif 1io9m69_0" ON storage.objects;
DROP POLICY IF EXISTS "all verif 1io9m69_2" ON storage.objects;
DROP POLICY IF EXISTS "allow update 199w6a7_0" ON storage.objects;
DROP POLICY IF EXISTS "Allow public uploads to brochures" ON storage.objects;
DROP POLICY IF EXISTS "Permettre l'upload de documents Jour M" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to jour-m-documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update prestataire photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload prestataire photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prestataire photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update prestataire brochures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload prestataire brochures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete prestataire brochures" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
CREATE POLICY "Admins manage blog images" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());