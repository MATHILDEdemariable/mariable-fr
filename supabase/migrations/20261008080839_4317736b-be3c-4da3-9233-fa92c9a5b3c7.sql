DROP POLICY IF EXISTS "Enable read access for all users" ON public.admin_users;
CREATE POLICY "Users can check their own admin row" ON public.admin_users FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Enable read access for all users" ON public.quiz_email_captures;
CREATE POLICY "Users read own quiz capture or admin" ON public.quiz_email_captures FOR SELECT TO authenticated USING (email = (auth.jwt() ->> 'email') OR public.is_admin());

DROP POLICY IF EXISTS "Public can read system settings" ON public.system_settings;

DROP POLICY IF EXISTS "Enable read access for all users" ON public.vendors_tracking_preprod;
CREATE POLICY "Users read own vendor tracking or admin" ON public.vendors_tracking_preprod FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Public can insert sub_responses" ON public.wedding_rsvp_sub_responses;
CREATE POLICY "Public can insert sub_responses for existing responses" ON public.wedding_rsvp_sub_responses FOR INSERT TO public WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_rsvp_responses r WHERE r.id = response_id));