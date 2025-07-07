-- Migration pour séparer Mission Mariage et Mon Jour-M
-- Étape 1: Mettre à jour la colonne category avec des valeurs par défaut intelligentes

-- Pour coordination_planning: associer les tâches aux bons projets
UPDATE coordination_planning 
SET category = CASE 
  WHEN EXISTS (
    SELECT 1 FROM wedding_coordination wc 
    WHERE wc.id = coordination_planning.coordination_id 
    AND wc.title LIKE '%Mission Mariage%'
  ) THEN 'project'
  ELSE 'jour-m'
END
WHERE category = 'general' OR category IS NULL;

-- Pour coordination_documents: même logique
UPDATE coordination_documents 
SET category = CASE 
  WHEN EXISTS (
    SELECT 1 FROM wedding_coordination wc 
    WHERE wc.id = coordination_documents.coordination_id 
    AND wc.title LIKE '%Mission Mariage%'
  ) THEN 'project'
  ELSE 'jour-m'
END
WHERE category = 'general' OR category IS NULL;

-- Mettre à jour les valeurs par défaut pour les nouvelles données
ALTER TABLE coordination_planning 
ALTER COLUMN category SET DEFAULT 'jour-m';

ALTER TABLE coordination_documents 
ALTER COLUMN category SET DEFAULT 'jour-m';