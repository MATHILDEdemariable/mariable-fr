ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS prestation_type text NOT NULL DEFAULT 'organisation';
CREATE OR REPLACE FUNCTION public.validate_wedding_prestation_type() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.prestation_type NOT IN ('organisation','jourJ') THEN
    RAISE EXCEPTION 'prestation_type invalide';
  END IF;
  RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS validate_wedding_prestation_type ON public.weddings;
CREATE TRIGGER validate_wedding_prestation_type BEFORE INSERT OR UPDATE ON public.weddings FOR EACH ROW EXECUTE FUNCTION public.validate_wedding_prestation_type();