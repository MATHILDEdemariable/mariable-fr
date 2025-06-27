
-- Phase 1: Corriger les politiques RLS pour les tables de photos des prestataires

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Admins can manage prestataire photos" ON public.prestataires_photos_preprod;
DROP POLICY IF EXISTS "Admins can view prestataire photos" ON public.prestataires_photos_preprod;
DROP POLICY IF EXISTS "Admins can manage prestataire brochures" ON public.prestataires_brochures_preprod;
DROP POLICY IF EXISTS "Admins can view prestataire brochures" ON public.prestataires_brochures_preprod;

-- Activer RLS sur les tables si ce n'est pas déjà fait
ALTER TABLE public.prestataires_photos_preprod ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestataires_brochures_preprod ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour les photos des prestataires
CREATE POLICY "Admins can view prestataire photos"
  ON public.prestataires_photos_preprod
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert prestataire photos"
  ON public.prestataires_photos_preprod
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update prestataire photos"
  ON public.prestataires_photos_preprod
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete prestataire photos"
  ON public.prestataires_photos_preprod
  FOR DELETE
  USING (public.is_admin());

-- Créer les politiques RLS pour les brochures des prestataires
CREATE POLICY "Admins can view prestataire brochures"
  ON public.prestataires_brochures_preprod
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can insert prestataire brochures"
  ON public.prestataires_brochures_preprod
  FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update prestataire brochures"
  ON public.prestataires_brochures_preprod
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete prestataire brochures"
  ON public.prestataires_brochures_preprod
  FOR DELETE
  USING (public.is_admin());

-- Phase 2: Vérifier les politiques RLS pour les images du blog
-- Supprimer les anciennes politiques du blog si nécessaire
DROP POLICY IF EXISTS "Admins can manage blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view blog images" ON storage.objects;

-- Recréer les politiques pour les images du blog
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can manage blog images"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'blog-images')
  WITH CHECK (public.is_admin() AND bucket_id = 'blog-images');

-- Vérifier que la politique pour les photos des prestataires existe aussi
CREATE POLICY "Admins can manage prestataire photos storage"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'prestataires-photos')
  WITH CHECK (public.is_admin() AND bucket_id = 'prestataires-photos');

CREATE POLICY "Admins can manage prestataire brochures storage"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'prestataires-brochures')
  WITH CHECK (public.is_admin() AND bucket_id = 'prestataires-brochures');
