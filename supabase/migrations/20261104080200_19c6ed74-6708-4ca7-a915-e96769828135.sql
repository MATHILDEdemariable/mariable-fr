CREATE TABLE public.wedding_module_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL,
  module text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, module)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_module_plans TO authenticated;
GRANT ALL ON public.wedding_module_plans TO service_role;
ALTER TABLE public.wedding_module_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members manage module plans" ON public.wedding_module_plans FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id));
CREATE TRIGGER update_wedding_module_plans_updated_at BEFORE UPDATE ON public.wedding_module_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_jour_j_module()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.module NOT IN ('seating','drinks','decor','trombinoscope','ceremony_religious','ceremony_civil','music','catering') THEN RAISE EXCEPTION 'Module invalide'; END IF;
  RETURN NEW;
END; $function$;