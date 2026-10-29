ALTER TABLE public.pro_client_form_responses ADD COLUMN wedding_id uuid REFERENCES public.weddings(id) ON DELETE SET NULL;
CREATE INDEX idx_pro_client_form_responses_wedding ON public.pro_client_form_responses(wedding_id);
GRANT UPDATE (wedding_id) ON public.pro_client_form_responses TO authenticated;
CREATE POLICY "Form owners link responses" ON public.pro_client_form_responses FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.pro_client_forms f WHERE f.id = form_id AND f.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.pro_client_forms f WHERE f.id = form_id AND f.owner_id = auth.uid()));