-- Créer la table pour les checklists "Avant le jour-J" générées par IA
CREATE TABLE public.planning_avant_jour_j (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ma checklist personnalisée',
  original_text TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.planning_avant_jour_j ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own avant jour j planning" 
ON public.planning_avant_jour_j 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own avant jour j planning" 
ON public.planning_avant_jour_j 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own avant jour j planning" 
ON public.planning_avant_jour_j 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own avant jour j planning" 
ON public.planning_avant_jour_j 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer une fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION public.update_planning_avant_jour_j_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Créer le trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_planning_avant_jour_j_updated_at
BEFORE UPDATE ON public.planning_avant_jour_j
FOR EACH ROW
EXECUTE FUNCTION public.update_planning_avant_jour_j_updated_at();