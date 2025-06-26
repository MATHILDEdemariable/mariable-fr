
-- Ajouter les nouvelles colonnes à la table prestataires
ALTER TABLE public.prestataires 
ADD COLUMN IF NOT EXISTS status_crm public.prestataire_status DEFAULT 'acquisition',
ADD COLUMN IF NOT EXISTS date_derniere_contact timestamp with time zone;

-- Créer une fonction pour mettre à jour automatiquement la date de dernier contact
CREATE OR REPLACE FUNCTION public.update_derniere_contact()
RETURNS trigger AS $$
BEGIN
  IF NEW.type_action IN ('appel', 'email') THEN
    UPDATE public.prestataires 
    SET date_derniere_contact = NEW.date_action 
    WHERE id = NEW.prestataire_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer un trigger pour mettre à jour automatiquement la date de dernier contact
-- quand une action est ajoutée dans la timeline
DROP TRIGGER IF EXISTS trigger_update_derniere_contact ON public.prestataires_timeline;
CREATE TRIGGER trigger_update_derniere_contact
  AFTER INSERT ON public.prestataires_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_derniere_contact();
