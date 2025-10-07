-- Correction de la fonction avec search_path sécurisé
CREATE OR REPLACE FUNCTION update_rsvp_events_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;