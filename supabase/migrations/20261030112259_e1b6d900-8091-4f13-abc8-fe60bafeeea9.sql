CREATE TABLE public.wedding_meeting_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  meeting_date timestamptz NOT NULL DEFAULT now(),
  next_meeting_date timestamptz,
  type text NOT NULL DEFAULT 'visio',
  title text,
  summary text,
  next_actions text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_wedding_meeting_logs_wedding ON public.wedding_meeting_logs(wedding_id, meeting_date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_meeting_logs TO authenticated;
GRANT ALL ON public.wedding_meeting_logs TO service_role;
ALTER TABLE public.wedding_meeting_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members read meeting logs" ON public.wedding_meeting_logs FOR SELECT TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id));
CREATE POLICY "Owner and planners manage meeting logs" ON public.wedding_meeting_logs FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = wedding_id AND w.owner_id = auth.uid()) OR public.is_wedding_planner_collaborator(auth.uid(), wedding_id))
  WITH CHECK (EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = wedding_id AND w.owner_id = auth.uid()) OR public.is_wedding_planner_collaborator(auth.uid(), wedding_id));
CREATE OR REPLACE FUNCTION public.validate_meeting_log_type() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.type NOT IN ('visio','appel','presentiel','email') THEN RAISE EXCEPTION 'Type invalide'; END IF;
  NEW.updated_at = now();
  RETURN NEW;
END; $$;
CREATE TRIGGER trg_validate_meeting_log BEFORE INSERT OR UPDATE ON public.wedding_meeting_logs FOR EACH ROW EXECUTE FUNCTION public.validate_meeting_log_type();