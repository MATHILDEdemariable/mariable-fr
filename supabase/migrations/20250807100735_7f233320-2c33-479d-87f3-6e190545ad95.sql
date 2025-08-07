-- Créer une table pour le pense-bête manuel
CREATE TABLE public.pense_bete (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  coordination_id UUID,
  content TEXT NOT NULL,
  is_checked BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.pense_bete ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own pense bete"
ON public.pense_bete
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pense bete"
ON public.pense_bete
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pense bete"
ON public.pense_bete
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pense bete"
ON public.pense_bete
FOR DELETE
USING (auth.uid() = user_id);

-- Créer un trigger pour mettre à jour updated_at
CREATE TRIGGER update_pense_bete_updated_at
  BEFORE UPDATE ON public.pense_bete
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Améliorer la table planning_avant_jour_j pour supporter les catégories et icônes
ALTER TABLE public.planning_avant_jour_j 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS icon TEXT;