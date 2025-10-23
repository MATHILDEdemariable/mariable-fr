-- Rendre table_id nullable dans seating_assignments
ALTER TABLE public.seating_assignments 
  ALTER COLUMN table_id DROP NOT NULL;

-- Ajouter colonne seating_plan_id
ALTER TABLE public.seating_assignments 
  ADD COLUMN seating_plan_id UUID REFERENCES public.seating_plans(id) ON DELETE CASCADE;

-- Index pour performance
CREATE INDEX idx_seating_assignments_plan_id ON public.seating_assignments(seating_plan_id);

-- Mettre à jour les données existantes (lier aux plans via les tables)
UPDATE public.seating_assignments sa
SET seating_plan_id = st.seating_plan_id
FROM public.seating_tables st
WHERE sa.table_id = st.id;

-- Pour les assignments sans table (si existants), on les lie au premier plan de l'utilisateur
-- Ceci est une sécurité pour les données existantes
UPDATE public.seating_assignments sa
SET seating_plan_id = (
  SELECT id FROM public.seating_plans 
  WHERE user_id = auth.uid() 
  LIMIT 1
)
WHERE sa.seating_plan_id IS NULL;

-- Rendre NOT NULL après migration des données
ALTER TABLE public.seating_assignments 
  ALTER COLUMN seating_plan_id SET NOT NULL;

-- Supprimer les anciennes policies
DROP POLICY IF EXISTS "Users can view their own seating assignments" ON public.seating_assignments;
DROP POLICY IF EXISTS "Users can create assignments for their own tables" ON public.seating_assignments;
DROP POLICY IF EXISTS "Users can update their own seating assignments" ON public.seating_assignments;
DROP POLICY IF EXISTS "Users can delete their own seating assignments" ON public.seating_assignments;

-- Nouvelles policies basées sur seating_plan_id
CREATE POLICY "Users can view assignments in their plans"
  ON public.seating_assignments FOR SELECT
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create assignments in their plans"
  ON public.seating_assignments FOR INSERT
  WITH CHECK (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update assignments in their plans"
  ON public.seating_assignments FOR UPDATE
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete assignments in their plans"
  ON public.seating_assignments FOR DELETE
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));