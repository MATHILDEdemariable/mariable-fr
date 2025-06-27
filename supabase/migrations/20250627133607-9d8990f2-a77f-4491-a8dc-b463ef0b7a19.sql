
-- Vérifier et ajouter les colonnes manquantes pour les statuts CRM
ALTER TABLE public.prestataires_rows 
ADD COLUMN IF NOT EXISTS status_crm public.prestataire_status DEFAULT 'acquisition',
ADD COLUMN IF NOT EXISTS date_derniere_contact timestamp with time zone;

-- Mettre à jour la fonction pour gérer les actions de timeline
CREATE OR REPLACE FUNCTION public.update_derniere_contact_rows()
RETURNS trigger AS $$
BEGIN
  IF NEW.type_action IN ('appel', 'email') THEN
    UPDATE public.prestataires_rows 
    SET date_derniere_contact = NEW.date_action 
    WHERE id = NEW.prestataire_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour la table prestataires_rows
DROP TRIGGER IF EXISTS trigger_update_derniere_contact_rows ON public.prestataires_timeline;
CREATE TRIGGER trigger_update_derniere_contact_rows
  AFTER INSERT ON public.prestataires_timeline
  FOR EACH ROW
  EXECUTE FUNCTION public.update_derniere_contact_rows();
