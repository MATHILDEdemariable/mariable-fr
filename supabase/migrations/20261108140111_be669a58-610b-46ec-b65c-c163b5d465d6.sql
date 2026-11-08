ALTER TABLE public.wedding_jour_j_handoffs ADD COLUMN IF NOT EXISTS snapshot jsonb;
CREATE OR REPLACE FUNCTION public.validate_jour_j_module()
 RETURNS trigger LANGUAGE plpgsql SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.module NOT IN ('seating','drinks','decor','trombinoscope','ceremony_religious','ceremony_civil','music','catering','retroplanning_couple') THEN RAISE EXCEPTION 'Module invalide'; END IF;
  RETURN NEW;
END; $function$;