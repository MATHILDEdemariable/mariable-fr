
-- Ajouter les nouvelles colonnes pour le suivi utilisateur des prestataires
ALTER TABLE vendors_tracking_preprod 
ADD COLUMN budget text,
ADD COLUMN user_notes text,
ADD COLUMN points_forts text,
ADD COLUMN points_faibles text,
ADD COLUMN feeling text;
