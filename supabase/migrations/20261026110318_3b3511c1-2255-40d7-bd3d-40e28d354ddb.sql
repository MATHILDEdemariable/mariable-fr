CREATE POLICY "Wedding members manage coordination documents" ON public.coordination_documents FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_documents.coordination_id AND wc.wedding_id IS NOT NULL AND (public.has_wedding_access(auth.uid(), wc.wedding_id) OR public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id))))
WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_documents.coordination_id AND wc.wedding_id IS NOT NULL AND (public.has_wedding_access(auth.uid(), wc.wedding_id) OR public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id))));

CREATE OR REPLACE FUNCTION public.validate_jour_j_module()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.module NOT IN ('seating','drinks','decor','trombinoscope','ceremony_religious','ceremony_civil') THEN RAISE EXCEPTION 'Module invalide'; END IF;
  RETURN NEW;
END; $$;