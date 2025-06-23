
-- Créer un type enum pour les statuts CRM
CREATE TYPE public.prestataire_status AS ENUM (
  'acquisition',
  'verification', 
  'a_valider',
  'valide',
  'en_attente',
  'actif',
  'inactif',
  'blackliste',
  'exclu'
);

-- Ajouter les nouveaux champs CRM à la table prestataires
ALTER TABLE public.prestataires 
ADD COLUMN status_crm public.prestataire_status DEFAULT 'acquisition',
ADD COLUMN date_derniere_contact timestamp with time zone,
ADD COLUMN commentaires_internes text,
ADD COLUMN timeline_actions jsonb DEFAULT '[]'::jsonb;

-- Créer une table pour les actions timeline
CREATE TABLE public.prestataires_timeline (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  prestataire_id uuid REFERENCES public.prestataires(id) ON DELETE CASCADE,
  type_action text NOT NULL, -- 'appel', 'email', 'mission', 'relance', 'note'
  description text NOT NULL,
  date_action timestamp with time zone NOT NULL DEFAULT now(),
  utilisateur text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Ajouter un index pour les performances
CREATE INDEX idx_prestataires_timeline_prestataire_id ON public.prestataires_timeline(prestataire_id);
CREATE INDEX idx_prestataires_timeline_date ON public.prestataires_timeline(date_action);

-- Créer une fonction pour mettre à jour la date de dernier contact
CREATE OR REPLACE FUNCTION update_derniere_contact()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.type_action IN ('appel', 'email') THEN
    UPDATE public.prestataires 
    SET date_derniere_contact = NEW.date_action 
    WHERE id = NEW.prestataire_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger
CREATE TRIGGER trigger_update_derniere_contact
  AFTER INSERT ON public.prestataires_timeline
  FOR EACH ROW
  EXECUTE FUNCTION update_derniere_contact();
