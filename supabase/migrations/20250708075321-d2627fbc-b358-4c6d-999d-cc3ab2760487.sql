-- Migration corrective pour "Mon Jour-M" Planning
-- Forcer toutes les tâches de coordination existantes à avoir la bonne catégorie par défaut

-- Mettre à jour toutes les tâches existantes pour avoir 'jour-m' comme catégorie par défaut
-- sauf celles qui sont explicitement liées à des coordinations "Mission Mariage"
UPDATE coordination_planning 
SET category = 'jour-m'
WHERE category != 'project' 
AND NOT EXISTS (
  SELECT 1 FROM wedding_coordination wc 
  WHERE wc.id = coordination_planning.coordination_id 
  AND wc.title LIKE '%Mission Mariage%'
);

-- Même chose pour les documents
UPDATE coordination_documents 
SET category = 'jour-m'
WHERE category != 'project' 
AND NOT EXISTS (
  SELECT 1 FROM wedding_coordination wc 
  WHERE wc.id = coordination_documents.coordination_id 
  AND wc.title LIKE '%Mission Mariage%'
);