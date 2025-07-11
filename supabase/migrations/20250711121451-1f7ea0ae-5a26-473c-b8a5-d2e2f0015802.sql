-- Ajouter la colonne parallel_group à la table coordination_planning
ALTER TABLE public.coordination_planning 
ADD COLUMN parallel_group uuid DEFAULT NULL;

-- Ajouter un index pour optimiser les requêtes sur les groupes parallèles
CREATE INDEX idx_coordination_planning_parallel_group 
ON public.coordination_planning(parallel_group) 
WHERE parallel_group IS NOT NULL;

-- Ajouter un commentaire pour documenter la colonne
COMMENT ON COLUMN public.coordination_planning.parallel_group IS 'Identifiant du groupe pour les tâches qui se déroulent en parallèle au même moment';