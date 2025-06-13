
-- Créer la table pour les paiements d'accompagnement
CREATE TABLE public.paiement_accompagnement (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR NOT NULL,
  nom_complet VARCHAR NOT NULL,
  telephone_whatsapp VARCHAR NOT NULL,
  date_mariage DATE NOT NULL,
  statut VARCHAR NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'paye', 'annule', 'echec')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  stripe_payment_id VARCHAR,
  stripe_subscription_id VARCHAR,
  montant NUMERIC,
  devise VARCHAR DEFAULT 'EUR',
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter un trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_paiement_accompagnement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_paiement_accompagnement_updated_at_trigger
  BEFORE UPDATE ON public.paiement_accompagnement
  FOR EACH ROW
  EXECUTE FUNCTION update_paiement_accompagnement_updated_at();

-- Activer RLS (Row Level Security) si nécessaire
ALTER TABLE public.paiement_accompagnement ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour permettre l'insertion publique (pour les nouveaux paiements)
CREATE POLICY "Allow public insert on paiement_accompagnement" 
  ON public.paiement_accompagnement 
  FOR INSERT 
  WITH CHECK (true);

-- Créer une politique pour permettre la lecture aux administrateurs uniquement
CREATE POLICY "Allow admin read on paiement_accompagnement" 
  ON public.paiement_accompagnement 
  FOR SELECT 
  USING (false); -- Cette politique sera à ajuster selon vos besoins d'administration
