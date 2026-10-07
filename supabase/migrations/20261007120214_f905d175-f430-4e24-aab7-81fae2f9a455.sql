CREATE TABLE public.wedding_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  invited_by uuid NOT NULL,
  invited_email text NOT NULL,
  user_id uuid,
  role text NOT NULL DEFAULT 'couple',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, invited_email)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_collaborators TO authenticated;
GRANT ALL ON public.wedding_collaborators TO service_role;
ALTER TABLE public.wedding_collaborators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage collaborators" ON public.wedding_collaborators
  FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) AND invited_by = auth.uid());
CREATE POLICY "Invitees see their invitations" ON public.wedding_collaborators
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE TRIGGER update_wedding_collaborators_updated_at
  BEFORE UPDATE ON public.wedding_collaborators
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.is_wedding_collaborator(_user_id uuid, _wedding_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT _user_id IS NOT NULL AND _wedding_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.wedding_collaborators c
    WHERE c.wedding_id = _wedding_id AND c.user_id = _user_id AND c.status = 'accepted'
  );
$$;

-- Le couple relie les invitations envoyées à son email
CREATE OR REPLACE FUNCTION public.accept_wedding_invitations()
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _email text; _count integer;
BEGIN
  IF auth.uid() IS NULL THEN RETURN 0; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = auth.uid();
  UPDATE public.wedding_collaborators
     SET user_id = auth.uid(), status = 'accepted'
   WHERE lower(invited_email) = _email AND (user_id IS NULL OR status = 'pending');
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END; $$;
GRANT EXECUTE ON FUNCTION public.accept_wedding_invitations() TO authenticated;

-- Consultation
CREATE POLICY "Collaborators read weddings" ON public.weddings
  FOR SELECT TO authenticated USING (public.is_wedding_collaborator(auth.uid(), id));

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['wedding_coordination','checklist_mariage_manuel','wedding_accommodations','wedding_documents','wedding_retroplanning'] LOOP
    EXECUTE format('CREATE POLICY "Collaborators read %s" ON public.%I FOR SELECT TO authenticated USING (public.is_wedding_collaborator(auth.uid(), wedding_id))', t, t);
  END LOOP;
  FOREACH t IN ARRAY ARRAY['budgets_dashboard','budgets_detail','wedding_guest_list','wedding_rsvp_events','seating_plans','wedding_drinks_plan'] LOOP
    EXECUTE format('CREATE POLICY "Collaborators edit %s" ON public.%I FOR ALL TO authenticated USING (public.is_wedding_collaborator(auth.uid(), wedding_id)) WITH CHECK (public.is_wedding_collaborator(auth.uid(), wedding_id))', t, t);
  END LOOP;
END $$;

CREATE POLICY "Collaborators read coordination_planning" ON public.coordination_planning
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_collaborator(auth.uid(), wc.wedding_id)));
CREATE POLICY "Collaborators read coordination_team" ON public.coordination_team
  FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.wedding_coordination wc WHERE wc.id = coordination_id AND public.is_wedding_collaborator(auth.uid(), wc.wedding_id)));

CREATE POLICY "Collaborators edit seating_tables" ON public.seating_tables
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.seating_plans sp WHERE sp.id = seating_plan_id AND public.is_wedding_collaborator(auth.uid(), sp.wedding_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.seating_plans sp WHERE sp.id = seating_plan_id AND public.is_wedding_collaborator(auth.uid(), sp.wedding_id)));
CREATE POLICY "Collaborators edit seating_assignments" ON public.seating_assignments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.seating_plans sp WHERE sp.id = seating_plan_id AND public.is_wedding_collaborator(auth.uid(), sp.wedding_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.seating_plans sp WHERE sp.id = seating_plan_id AND public.is_wedding_collaborator(auth.uid(), sp.wedding_id)));
CREATE POLICY "Collaborators edit rsvp sub events" ON public.wedding_rsvp_sub_events
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wedding_rsvp_events e WHERE e.id = parent_event_id AND public.is_wedding_collaborator(auth.uid(), e.wedding_id)))
  WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_rsvp_events e WHERE e.id = parent_event_id AND public.is_wedding_collaborator(auth.uid(), e.wedding_id)));
CREATE POLICY "Collaborators read rsvp responses" ON public.wedding_rsvp_responses
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wedding_rsvp_events e WHERE e.id = event_id AND public.is_wedding_collaborator(auth.uid(), e.wedding_id)));

ALTER TABLE public.wedding_rsvp_events ADD COLUMN IF NOT EXISTS customization jsonb NOT NULL DEFAULT '{}'::jsonb;