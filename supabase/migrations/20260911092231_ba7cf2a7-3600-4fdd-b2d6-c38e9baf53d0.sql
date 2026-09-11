-- 1. Colonne de rattachement (nullable, additive)
ALTER TABLE public.wedding_retroplanning ADD COLUMN IF NOT EXISTS wedding_id uuid;
ALTER TABLE public.todos_planification ADD COLUMN IF NOT EXISTS wedding_id uuid;
ALTER TABLE public.pense_bete ADD COLUMN IF NOT EXISTS wedding_id uuid;
ALTER TABLE public.generated_tasks ADD COLUMN IF NOT EXISTS wedding_id uuid;
ALTER TABLE public.user_progress ADD COLUMN IF NOT EXISTS wedding_id uuid;

-- 2. Backfill sur le mariage par défaut (id = user_id), seulement s'il existe
UPDATE public.wedding_retroplanning t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);
UPDATE public.todos_planification t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);
UPDATE public.pense_bete t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);
UPDATE public.generated_tasks t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);
UPDATE public.user_progress t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);

-- Lignes orphelines des modules déjà rattachés
UPDATE public.budgets_dashboard t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);
UPDATE public.vendors_tracking t SET wedding_id = t.user_id WHERE t.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = t.user_id);

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_wedding_retroplanning_wedding_id ON public.wedding_retroplanning(wedding_id);
CREATE INDEX IF NOT EXISTS idx_todos_planification_wedding_id ON public.todos_planification(wedding_id);
CREATE INDEX IF NOT EXISTS idx_pense_bete_wedding_id ON public.pense_bete(wedding_id);
CREATE INDEX IF NOT EXISTS idx_generated_tasks_wedding_id ON public.generated_tasks(wedding_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_wedding_id ON public.user_progress(wedding_id);

-- 4. Unicité du suivi de progression par mariage
ALTER TABLE public.user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_step_name_key;
CREATE UNIQUE INDEX IF NOT EXISTS user_progress_user_wedding_step_key
  ON public.user_progress(user_id, wedding_id, step_name);

-- 5. Policies additives (accès via l'espace mariage), les policies existantes restent
CREATE POLICY "Wedding members manage retroplanning"
  ON public.wedding_retroplanning FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id));

CREATE POLICY "Wedding members manage todos"
  ON public.todos_planification FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id));

CREATE POLICY "Wedding members manage pense bete"
  ON public.pense_bete FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id));

CREATE POLICY "Wedding members manage generated tasks"
  ON public.generated_tasks FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id));

CREATE POLICY "Wedding members manage progress"
  ON public.user_progress FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id));