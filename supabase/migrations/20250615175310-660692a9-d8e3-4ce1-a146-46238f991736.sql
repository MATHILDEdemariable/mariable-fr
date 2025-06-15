
-- Étape 1: Créer le bucket de stockage pour les images du blog
-- Ce bucket sera public, limitera les fichiers à 5MB et n'acceptera que les formats PNG, JPEG, et WEBP.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('blog-images', 'blog-images', TRUE, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp']);

-- Étape 2: Politique de sécurité pour la lecture publique
-- Permet à tout le monde de voir les images du blog, ce qui est nécessaire pour les afficher sur votre site.
CREATE POLICY "Public can view blog images"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'blog-images');

-- Étape 3: Politique de sécurité pour la gestion par les administrateurs
-- Seuls les administrateurs pourront ajouter, modifier ou supprimer des images dans ce bucket.
CREATE POLICY "Admins can manage blog images"
  ON storage.objects
  FOR ALL
  USING (public.is_admin() AND bucket_id = 'blog-images')
  WITH CHECK (public.is_admin() AND bucket_id = 'blog-images');
