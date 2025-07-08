-- Étape 1: Nettoyer les doublons existants dans coordination_planning
-- Supprimer les doublons en gardant seulement l'entrée la plus récente pour chaque titre + coordination_id

WITH duplicate_planning AS (
  SELECT id, 
         ROW_NUMBER() OVER (
           PARTITION BY title, coordination_id 
           ORDER BY created_at DESC, id DESC
         ) as rn
  FROM coordination_planning 
  WHERE category = 'jour-m'
)
DELETE FROM coordination_planning 
WHERE id IN (
  SELECT id FROM duplicate_planning WHERE rn > 1
);

-- Ajouter une contrainte unique pour prévenir les futurs doublons
-- (titre + coordination_id doit être unique pour la catégorie jour-m)
CREATE UNIQUE INDEX IF NOT EXISTS idx_coordination_planning_unique_title_coordination 
ON coordination_planning (title, coordination_id) 
WHERE category = 'jour-m';