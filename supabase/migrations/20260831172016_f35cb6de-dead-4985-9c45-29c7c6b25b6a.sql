ALTER TABLE public.vendors_contact_preprod ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit a vendor contact" ON public.vendors_contact_preprod FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view vendor contacts" ON public.vendors_contact_preprod FOR SELECT TO authenticated USING (public.is_admin());
GRANT INSERT ON public.vendors_contact_preprod TO anon;

ALTER TABLE public.prestataires_photos_preprod ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view prestataire photos" ON public.prestataires_photos_preprod FOR SELECT USING (true);
CREATE POLICY "Anyone can add prestataire photos" ON public.prestataires_photos_preprod FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage prestataire photos" ON public.prestataires_photos_preprod FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
GRANT SELECT, INSERT ON public.prestataires_photos_preprod TO anon;

ALTER TABLE public.prestataires_timeline ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage prestataires timeline" ON public.prestataires_timeline FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());