CREATE TABLE public.wedding_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL,
  actor_id uuid,
  actor_name text,
  actor_role text,
  module text NOT NULL,
  action text NOT NULL,
  summary text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX wedding_activity_logs_wedding_idx ON public.wedding_activity_logs (wedding_id, created_at DESC);
GRANT SELECT ON public.wedding_activity_logs TO authenticated;
GRANT ALL ON public.wedding_activity_logs TO service_role;
ALTER TABLE public.wedding_activity_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members read activity" ON public.wedding_activity_logs FOR SELECT TO authenticated
USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id));

CREATE TABLE public.wedding_activity_reads (
  user_id uuid NOT NULL,
  wedding_id uuid NOT NULL,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, wedding_id)
);
GRANT SELECT, INSERT, UPDATE ON public.wedding_activity_reads TO authenticated;
GRANT ALL ON public.wedding_activity_reads TO service_role;
ALTER TABLE public.wedding_activity_reads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own reads" ON public.wedding_activity_reads FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.log_wedding_activity()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  rec record; v_wedding uuid; v_module text; v_summary text; v_action text;
  v_name text; v_role text; v_uid uuid := auth.uid();
BEGIN
  IF v_uid IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;
  v_action := lower(TG_OP);
  IF TG_OP = 'DELETE' THEN rec := OLD; ELSE rec := NEW; END IF;

  IF TG_TABLE_NAME = 'vendors_tracking_preprod' THEN
    v_module := 'vendors'; v_wedding := rec.wedding_id;
    IF TG_OP = 'INSERT' THEN v_summary := 'a ajouté le prestataire ' || coalesce(rec.vendor_name,'');
    ELSIF TG_OP = 'DELETE' THEN v_summary := 'a retiré le prestataire ' || coalesce(rec.vendor_name,'');
    ELSIF NEW.status IS DISTINCT FROM OLD.status THEN v_summary := 'a passé ' || coalesce(rec.vendor_name,'') || ' en « ' || NEW.status::text || ' »';
    ELSE RETURN NEW; END IF;
  ELSIF TG_TABLE_NAME = 'wedding_guest_list' THEN
    v_module := 'guests'; v_wedding := rec.wedding_id;
    IF TG_OP = 'INSERT' THEN v_summary := 'a ajouté l''invité ' || trim(coalesce(rec.guest_first_name,'') || ' ' || coalesce(rec.guest_last_name,''));
    ELSIF TG_OP = 'DELETE' THEN v_summary := 'a retiré l''invité ' || trim(coalesce(rec.guest_first_name,'') || ' ' || coalesce(rec.guest_last_name,''));
    ELSIF NEW.rsvp_status IS DISTINCT FROM OLD.rsvp_status THEN v_summary := 'a mis à jour la réponse de ' || trim(coalesce(rec.guest_first_name,'') || ' ' || coalesce(rec.guest_last_name,'')) || ' (' || coalesce(NEW.rsvp_status,'') || ')';
    ELSIF NEW.notes IS DISTINCT FROM OLD.notes THEN v_summary := 'a modifié les notes / régime de ' || trim(coalesce(rec.guest_first_name,'') || ' ' || coalesce(rec.guest_last_name,''));
    ELSE RETURN NEW; END IF;
  ELSIF TG_TABLE_NAME = 'seating_assignments' THEN
    v_module := 'seating';
    SELECT wedding_id INTO v_wedding FROM seating_plans WHERE id = rec.seating_plan_id;
    IF TG_OP = 'INSERT' THEN v_summary := 'a placé ' || coalesce(rec.guest_name,'') || ' au plan de table';
    ELSIF TG_OP = 'DELETE' THEN v_summary := 'a retiré ' || coalesce(rec.guest_name,'') || ' du plan de table';
    ELSIF NEW.table_id IS DISTINCT FROM OLD.table_id THEN v_summary := 'a changé ' || coalesce(rec.guest_name,'') || ' de table';
    ELSE RETURN NEW; END IF;
  ELSIF TG_TABLE_NAME = 'budgets_detail' THEN
    v_module := 'budget'; v_wedding := rec.wedding_id;
    IF TG_OP = 'INSERT' THEN v_summary := 'a ajouté la dépense ' || coalesce(rec.item_name, rec.category_name, '');
    ELSIF TG_OP = 'DELETE' THEN v_summary := 'a supprimé la dépense ' || coalesce(rec.item_name, rec.category_name, '');
    ELSIF NEW.deposit IS DISTINCT FROM OLD.deposit OR NEW.payment_schedule IS DISTINCT FROM OLD.payment_schedule THEN v_summary := 'a mis à jour les acomptes de ' || coalesce(rec.item_name, rec.category_name, '');
    ELSIF NEW.actual IS DISTINCT FROM OLD.actual THEN v_summary := 'a modifié le montant de ' || coalesce(rec.item_name, rec.category_name, '');
    ELSE RETURN NEW; END IF;
  END IF;

  IF v_wedding IS NULL THEN RETURN COALESCE(NEW, OLD); END IF;
  SELECT nullif(trim(coalesce(first_name,'') || ' ' || coalesce(last_name,'')), ''),
         CASE WHEN account_type = 'b2b' THEN 'pro' ELSE 'couple' END
    INTO v_name, v_role FROM profiles WHERE id = v_uid;
  INSERT INTO wedding_activity_logs (wedding_id, actor_id, actor_name, actor_role, module, action, summary)
  VALUES (v_wedding, v_uid, v_name, coalesce(v_role,'couple'), v_module, v_action, left(v_summary, 300));
  RETURN COALESCE(NEW, OLD);
EXCEPTION WHEN others THEN
  RAISE WARNING 'log_wedding_activity failed: %', SQLERRM;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER trg_activity_vendors AFTER INSERT OR UPDATE OR DELETE ON public.vendors_tracking_preprod FOR EACH ROW EXECUTE FUNCTION public.log_wedding_activity();
CREATE TRIGGER trg_activity_guests AFTER INSERT OR UPDATE OR DELETE ON public.wedding_guest_list FOR EACH ROW EXECUTE FUNCTION public.log_wedding_activity();
CREATE TRIGGER trg_activity_seating AFTER INSERT OR UPDATE OR DELETE ON public.seating_assignments FOR EACH ROW EXECUTE FUNCTION public.log_wedding_activity();
CREATE TRIGGER trg_activity_budget AFTER INSERT OR UPDATE OR DELETE ON public.budgets_detail FOR EACH ROW EXECUTE FUNCTION public.log_wedding_activity();