-- Ajouter la colonne responsable à la table checklist_mariage_manuel
ALTER TABLE public.checklist_mariage_manuel 
ADD COLUMN IF NOT EXISTS responsible TEXT;

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_checklist_mariage_manuel_responsible 
ON public.checklist_mariage_manuel(responsible);