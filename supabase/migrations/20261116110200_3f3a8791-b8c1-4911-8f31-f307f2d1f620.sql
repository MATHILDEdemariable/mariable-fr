-- Sub-responses RSVP : plus de lecture publique
DROP POLICY IF EXISTS "Public can view sub_responses" ON public.wedding_rsvp_sub_responses;
CREATE POLICY "Collaborators can view sub_responses" ON public.wedding_rsvp_sub_responses
FOR SELECT TO authenticated USING (EXISTS (
  SELECT 1 FROM public.wedding_rsvp_responses r JOIN public.wedding_rsvp_events e ON e.id = r.event_id
  WHERE r.id = wedding_rsvp_sub_responses.response_id
    AND (e.user_id = auth.uid() OR (e.wedding_id IS NOT NULL AND (public.has_wedding_access(auth.uid(), e.wedding_id) OR public.is_wedding_collaborator(auth.uid(), e.wedding_id))))
));

-- Suivi prestataires : insertion limitée à son propre compte
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.vendors_tracking_preprod;
CREATE POLICY "Users insert own vendor tracking" ON public.vendors_tracking_preprod
FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- Questionnaire couple : lecture réservée aux comptes connectés
DROP POLICY IF EXISTS "Autoriser la lecture publique" ON public.couple_formulaire;
CREATE POLICY "Authenticated can read couple form" ON public.couple_formulaire
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

-- Documents de coordination : lecture publique uniquement via l'identifiant du planning
DROP POLICY IF EXISTS "Public read access to coordination documents metadata" ON public.coordination_documents;
CREATE OR REPLACE FUNCTION public.get_public_coordination_documents(target_coordination_id uuid)
RETURNS SETOF public.coordination_documents
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.coordination_documents
  WHERE target_coordination_id IS NOT NULL AND coordination_id = target_coordination_id
  ORDER BY created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_coordination_documents(uuid) TO anon, authenticated;