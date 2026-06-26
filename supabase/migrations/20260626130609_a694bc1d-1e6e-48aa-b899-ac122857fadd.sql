
-- 1) documents bucket: remove permissive policies, add owner-scoped ones
DROP POLICY IF EXISTS "Full acces flreew_0" ON storage.objects;
DROP POLICY IF EXISTS "Full acces flreew_1" ON storage.objects;
DROP POLICY IF EXISTS "Full acces flreew_2" ON storage.objects;
DROP POLICY IF EXISTS "Full acces flreew_3" ON storage.objects;

CREATE POLICY "documents: users read own folder"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "documents: users upload own folder"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "documents: users update own folder"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "documents: users delete own folder"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "documents: admins full access"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'documents' AND public.is_admin())
WITH CHECK (bucket_id = 'documents' AND public.is_admin());

-- 2) jour-m-documents bucket: restrict DELETE to admins
DROP POLICY IF EXISTS "Allow public delete from jour-m-documents" ON storage.objects;
DROP POLICY IF EXISTS "Permettre la suppression des documents Jour M pour les admins" ON storage.objects;

CREATE POLICY "jour-m-documents: admins delete only"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'jour-m-documents' AND public.is_admin());

-- 3) prestataires_rows: enable RLS + column-level grants
ALTER TABLE public.prestataires_rows ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.prestataires_rows FROM anon, authenticated;

GRANT SELECT (
  id, created_at, updated_at, nom, categorie, description, ville,
  latitude, longitude, prix_a_partir_de, prix_par_personne,
  responsable_nom, responsable_bio, site_web, visible, styles,
  categorie_lieu, capacite_invites, hebergement_inclus, nombre_couchages,
  prix_minimum, featured, slug, description_more, partner,
  first_price_package, second_price_package, third_price_package, fourth_price_package,
  first_price_package_description, second_price_package_description,
  third_price_package_description, fourth_price_package_description,
  first_price_package_name, second_price_package_name,
  third_price_package_name, fourth_price_package_name,
  show_prices, show_contact_form, show_description, show_photos,
  show_brochures, show_responsable,
  google_rating, google_reviews_count, google_place_id, google_business_url,
  regions, avantage_propose
) ON public.prestataires_rows TO anon, authenticated;

GRANT ALL ON public.prestataires_rows TO service_role;

CREATE POLICY "prestataires_rows: public read visible"
ON public.prestataires_rows FOR SELECT TO anon, authenticated
USING (visible = true);

CREATE POLICY "prestataires_rows: admins full access"
ON public.prestataires_rows FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());
