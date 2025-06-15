
-- ### Étape 1: Créer le bucket pour les brochures des prestataires ###

-- Insérer le nouveau bucket de stockage 'prestataires-brochures'
-- Ce bucket sera public, avec une limite de taille de 10MB et n'acceptera que les PDF.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('prestataires-brochures', 'prestataires-brochures', TRUE, 10485760, ARRAY['application/pdf']);

-- Politique de sécurité pour la lecture publique des brochures
-- Permet à n'importe qui de voir les brochures, nécessaire pour les liens publics.
CREATE POLICY "Public can view prestataire brochures"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-brochures');

-- Politique de sécurité pour la gestion des brochures par les administrateurs
-- Seuls les administrateurs pourront ajouter, modifier ou supprimer des brochures.
CREATE POLICY "Admins can manage prestataire brochures"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'prestataires-brochures')
  WITH CHECK (public.is_admin() AND bucket_id = 'prestataires-brochures');


-- ### Étape 2: Créer le bucket pour les photos des prestataires ###

-- Insérer le nouveau bucket de stockage 'prestataires-photos'
-- Ce bucket sera public, avec une limite de 5MB et pour les formats d'image courants.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('prestataires-photos', 'prestataires-photos', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

-- Politique de sécurité pour la lecture publique des photos
-- Permet à n'importe qui de voir les photos.
CREATE POLICY "Public can view prestataire photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'prestataires-photos');

-- Politique de sécurité pour la gestion des photos par les administrateurs
-- Seuls les administrateurs pourront gérer les photos.
CREATE POLICY "Admins can manage prestataire photos"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'prestataires-photos')
  WITH CHECK (public.is_admin() AND bucket_id = 'prestataires-photos');
