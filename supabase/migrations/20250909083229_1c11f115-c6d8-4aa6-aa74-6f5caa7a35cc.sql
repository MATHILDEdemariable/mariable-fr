-- Créer la table pour la checklist mariage manuelle
CREATE TABLE public.checklist_mariage_manuel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour la checklist après le jour-J manuelle
CREATE TABLE public.apres_jour_j_manuel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  position INTEGER NOT NULL DEFAULT 0,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.checklist_mariage_manuel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apres_jour_j_manuel ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour checklist_mariage_manuel
CREATE POLICY "Users can view their own checklist items" 
ON public.checklist_mariage_manuel 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own checklist items" 
ON public.checklist_mariage_manuel 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own checklist items" 
ON public.checklist_mariage_manuel 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own checklist items" 
ON public.checklist_mariage_manuel 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer les politiques RLS pour apres_jour_j_manuel
CREATE POLICY "Users can view their own after wedding checklist items" 
ON public.apres_jour_j_manuel 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own after wedding checklist items" 
ON public.apres_jour_j_manuel 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own after wedding checklist items" 
ON public.apres_jour_j_manuel 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own after wedding checklist items" 
ON public.apres_jour_j_manuel 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer les triggers pour updated_at
CREATE TRIGGER update_checklist_mariage_manuel_updated_at
BEFORE UPDATE ON public.checklist_mariage_manuel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_apres_jour_j_manuel_updated_at
BEFORE UPDATE ON public.apres_jour_j_manuel
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();