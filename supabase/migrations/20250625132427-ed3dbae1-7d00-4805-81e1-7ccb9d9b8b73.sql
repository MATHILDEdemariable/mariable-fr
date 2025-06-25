
-- Étape 1: Supprimer la contrainte de clé étrangère existante
ALTER TABLE public.coordination_planning 
DROP CONSTRAINT IF EXISTS coordination_planning_assigned_to_fkey;

-- Étape 2: Modifier la colonne assigned_to pour supporter les assignations multiples
ALTER TABLE public.coordination_planning 
ALTER COLUMN assigned_to TYPE jsonb USING 
CASE 
  WHEN assigned_to IS NULL THEN NULL
  ELSE to_jsonb(ARRAY[assigned_to::text])
END;

-- Étape 3: Ajouter un commentaire pour documenter le changement
COMMENT ON COLUMN public.coordination_planning.assigned_to IS 'Array of team member IDs assigned to this task, stored as JSONB';

-- Étape 4: Activer les mises à jour en temps réel pour les tables
ALTER TABLE public.coordination_planning REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coordination_planning;

ALTER TABLE public.coordination_team REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coordination_team;
