
-- Modifier la table coordination_planning pour corriger les problèmes
-- 1. Changer start_time en TEXT pour stocker le format HH:MM
-- 2. Supprimer la colonne status qui cause des problèmes
ALTER TABLE coordination_planning 
ALTER COLUMN start_time TYPE TEXT;

-- Supprimer la colonne status
ALTER TABLE coordination_planning 
DROP COLUMN IF EXISTS status;

-- Mettre à jour les données existantes pour normaliser les heures
UPDATE coordination_planning 
SET start_time = '09:00' 
WHERE start_time IS NULL;
