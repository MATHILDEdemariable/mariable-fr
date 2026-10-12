CREATE OR REPLACE FUNCTION public.is_wedding_planner_collaborator(_user_id uuid, _wedding_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL AND _wedding_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.wedding_collaborators c
    WHERE c.wedding_id = _wedding_id AND c.user_id = _user_id AND c.status = 'accepted' AND c.role = 'planner'
  );
$$;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['wedding_coordination','checklist_mariage_manuel','wedding_accommodations','wedding_documents','wedding_retroplanning'] LOOP
    EXECUTE format('CREATE POLICY "Planner collaborators edit %s" ON public.%I FOR ALL TO authenticated USING (public.is_wedding_planner_collaborator(auth.uid(), wedding_id)) WITH CHECK (public.is_wedding_planner_collaborator(auth.uid(), wedding_id))', t, t);
  END LOOP;
END $$;

CREATE POLICY "Planner collaborators edit coordination_planning" ON public.coordination_planning
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id)));
CREATE POLICY "Planner collaborators edit coordination_team" ON public.coordination_team
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_planner_collaborator(auth.uid(), wc.wedding_id)));

-- Le rôle d'invitation est limité à 'couple' ou 'planner'
CREATE OR REPLACE FUNCTION public.validate_collaborator_role()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.role NOT IN ('couple','planner') THEN RAISE EXCEPTION 'Rôle invalide'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_wedding_collaborator_role BEFORE INSERT OR UPDATE ON public.wedding_collaborators
  FOR EACH ROW EXECUTE FUNCTION public.validate_collaborator_role();

DROP FUNCTION IF EXISTS public.get_my_pending_wedding_invitations();
CREATE FUNCTION public.get_my_pending_wedding_invitations()
RETURNS TABLE(invitation_id uuid, wedding_title text, inviter_name text, created_at timestamptz, role text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT c.id, w.title,
         COALESCE(NULLIF(trim(concat_ws(' ', p.first_name, p.last_name)), ''), 'Mariable'),
         c.created_at, c.role
  FROM wedding_collaborators c
  JOIN weddings w ON w.id = c.wedding_id
  LEFT JOIN profiles p ON p.id = c.invited_by
  WHERE c.status = 'pending'
    AND auth.uid() IS NOT NULL
    AND lower(c.invited_email) = (SELECT lower(email) FROM auth.users WHERE id = auth.uid());
$$;
REVOKE EXECUTE ON FUNCTION public.get_my_pending_wedding_invitations() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_my_pending_wedding_invitations() TO authenticated;