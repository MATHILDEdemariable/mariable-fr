ALTER TABLE public.prestataires_documents_preprod ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.prestataires_documents_preprod FROM anon, authenticated;
GRANT ALL ON public.prestataires_documents_preprod TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prestataires_documents_preprod TO authenticated;

DROP POLICY IF EXISTS "Admins can manage prestataires_documents_preprod" ON public.prestataires_documents_preprod;
CREATE POLICY "Admins can manage prestataires_documents_preprod"
  ON public.prestataires_documents_preprod
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());