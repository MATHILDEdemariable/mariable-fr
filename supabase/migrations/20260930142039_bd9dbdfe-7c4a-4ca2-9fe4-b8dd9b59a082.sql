CREATE TABLE public.whitepaper_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  job text NOT NULL,
  resource text NOT NULL DEFAULT 'playbook-ia',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.whitepaper_leads TO anon, authenticated;
GRANT SELECT ON public.whitepaper_leads TO authenticated;
GRANT ALL ON public.whitepaper_leads TO service_role;
ALTER TABLE public.whitepaper_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can register for whitepaper" ON public.whitepaper_leads FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(full_name) BETWEEN 1 AND 100 AND char_length(email) BETWEEN 3 AND 255 AND char_length(job) BETWEEN 1 AND 100);
CREATE POLICY "Admins can read whitepaper leads" ON public.whitepaper_leads FOR SELECT TO authenticated USING (public.is_admin());