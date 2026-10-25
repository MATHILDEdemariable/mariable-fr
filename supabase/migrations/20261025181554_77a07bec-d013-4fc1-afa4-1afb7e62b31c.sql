ALTER TABLE public.budgets_detail ADD COLUMN IF NOT EXISTS payment_schedule jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE TABLE public.wedding_ceremony_plans (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id uuid NOT NULL,
  ceremony_type text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, ceremony_type)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_ceremony_plans TO authenticated;
GRANT ALL ON public.wedding_ceremony_plans TO service_role;
ALTER TABLE public.wedding_ceremony_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ceremony plan readable by wedding members" ON public.wedding_ceremony_plans FOR SELECT TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id));
CREATE POLICY "Ceremony plan editable by owner or planner" ON public.wedding_ceremony_plans FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_planner_collaborator(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_planner_collaborator(auth.uid(), wedding_id));

CREATE OR REPLACE FUNCTION public.validate_ceremony_type()
RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public' AS $$
BEGIN
  IF NEW.ceremony_type NOT IN ('religious','civil') THEN RAISE EXCEPTION 'Type de cérémonie invalide'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_ceremony_type BEFORE INSERT OR UPDATE ON public.wedding_ceremony_plans FOR EACH ROW EXECUTE FUNCTION public.validate_ceremony_type();
CREATE TRIGGER update_wedding_ceremony_plans_updated_at BEFORE UPDATE ON public.wedding_ceremony_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.schedule('budget-deposit-reminders-daily', '0 7 * * *', $$
  SELECT net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/budget-deposit-reminders',
    headers := '{"Content-Type":"application/json","Authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjM1MTYsImV4cCI6MjA1ODk5OTUxNn0.ij6dWi7LiWNk9mh3SknY1N8-upp9l20R7CZZDeAMEys"}'::jsonb,
    body := '{}'::jsonb
  );
$$);