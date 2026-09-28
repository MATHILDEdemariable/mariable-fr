CREATE TABLE public.demo_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  job_title text NOT NULL,
  rgpd_consent boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.demo_registrations TO anon, authenticated;
GRANT SELECT ON public.demo_registrations TO authenticated;
GRANT ALL ON public.demo_registrations TO service_role;
ALTER TABLE public.demo_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register to demo" ON public.demo_registrations FOR INSERT TO anon, authenticated
  WITH CHECK (rgpd_consent = true AND length(full_name) BETWEEN 1 AND 100 AND length(email) BETWEEN 3 AND 255 AND length(job_title) BETWEEN 1 AND 100);
CREATE POLICY "Admins can view demo registrations" ON public.demo_registrations FOR SELECT TO authenticated USING (public.is_admin());