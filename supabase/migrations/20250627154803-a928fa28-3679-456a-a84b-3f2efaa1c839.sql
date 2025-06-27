
-- Étendre la table dashboard_share_tokens pour inclure le filtrage par rôle
ALTER TABLE public.dashboard_share_tokens 
ADD COLUMN filter_role TEXT;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.dashboard_share_tokens.filter_role IS 'Rôle pour filtrer les tâches dans la vue partagée (optionnel)';
