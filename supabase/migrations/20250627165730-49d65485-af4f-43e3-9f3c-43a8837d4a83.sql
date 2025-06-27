
-- Ajouter une politique RLS pour permettre l'accès public aux photos des prestataires visibles
CREATE POLICY "Public can view visible prestataire photos"
  ON public.prestataires_photos_preprod
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.prestataires_rows 
      WHERE id = prestataires_photos_preprod.prestataire_id 
      AND visible = true
    )
  );

-- Ajouter une politique RLS pour permettre l'accès public aux brochures des prestataires visibles
CREATE POLICY "Public can view visible prestataire brochures"
  ON public.prestataires_brochures_preprod
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 
      FROM public.prestataires_rows 
      WHERE id = prestataires_brochures_preprod.prestataire_id 
      AND visible = true
    )
  );

-- Supprimer les anciennes politiques si elles existent pour éviter les conflits
DROP POLICY IF EXISTS "Public can view prestataire photos in storage" ON storage.objects;
DROP POLICY IF EXISTS "Public can view prestataire brochures in storage" ON storage.objects;

-- Créer les nouvelles politiques pour l'accès public aux buckets de storage
CREATE POLICY "Public can view prestataire photos in storage"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-photos');

CREATE POLICY "Public can view prestataire brochures in storage"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-brochures');
