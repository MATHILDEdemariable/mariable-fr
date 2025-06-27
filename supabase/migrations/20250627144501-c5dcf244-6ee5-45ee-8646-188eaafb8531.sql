
-- Ajouter les politiques RLS manquantes pour sécuriser les données Mon Jour-M

-- Politiques pour wedding_coordination
ALTER TABLE public.wedding_coordination ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own wedding coordination"
ON public.wedding_coordination FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wedding coordination"
ON public.wedding_coordination FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wedding coordination"
ON public.wedding_coordination FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wedding coordination"
ON public.wedding_coordination FOR DELETE
USING (auth.uid() = user_id);

-- Politiques pour coordination_planning
ALTER TABLE public.coordination_planning ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own planning tasks"
ON public.coordination_planning FOR SELECT
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create planning tasks for their coordination"
ON public.coordination_planning FOR INSERT
WITH CHECK (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own planning tasks"
ON public.coordination_planning FOR UPDATE
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own planning tasks"
ON public.coordination_planning FOR DELETE
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

-- Politiques pour coordination_team
ALTER TABLE public.coordination_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own team members"
ON public.coordination_team FOR SELECT
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create team members for their coordination"
ON public.coordination_team FOR INSERT
WITH CHECK (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own team members"
ON public.coordination_team FOR UPDATE
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own team members"
ON public.coordination_team FOR DELETE
USING (
  coordination_id IN (
    SELECT id FROM public.wedding_coordination 
    WHERE user_id = auth.uid()
  )
);
