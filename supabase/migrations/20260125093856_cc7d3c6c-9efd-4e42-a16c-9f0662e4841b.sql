-- Permettre l'upload anonyme vers prestataires-photos pour le formulaire d'inscription
CREATE POLICY "Allow anonymous uploads to prestataires-photos"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'prestataires-photos');

-- Permettre la lecture publique des photos prestataires
CREATE POLICY "Allow public read access to prestataires-photos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'prestataires-photos');