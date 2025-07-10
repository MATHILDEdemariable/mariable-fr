-- Corriger le type du membre "Alain" (Co-organisateur)
UPDATE coordination_team 
SET type = 'person' 
WHERE name = 'Alain' AND role = 'Co-organisateur';

-- Mettre à jour tous les membres avec des rôles "Prestataires :" vers type 'vendor'
UPDATE coordination_team 
SET type = 'vendor' 
WHERE role LIKE 'Prestataires :%';

-- Mettre à jour tous les autres membres vers type 'person' s'ils n'ont pas de type défini
UPDATE coordination_team 
SET type = 'person' 
WHERE type IS NULL OR type NOT IN ('person', 'vendor');

-- Modifier la contrainte de clé étrangère pour permettre la suppression cascade
ALTER TABLE coordination_documents 
DROP CONSTRAINT IF EXISTS coordination_documents_assigned_to_fkey;

ALTER TABLE coordination_documents 
ADD CONSTRAINT coordination_documents_assigned_to_fkey 
FOREIGN KEY (assigned_to) 
REFERENCES coordination_team(id) 
ON DELETE SET NULL;