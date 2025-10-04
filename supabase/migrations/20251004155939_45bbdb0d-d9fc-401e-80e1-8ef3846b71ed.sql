-- Création de la table wedding_projects pour sauvegarder les projets
CREATE TABLE IF NOT EXISTS public.wedding_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  wedding_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  budget_breakdown JSONB NOT NULL DEFAULT '[]'::jsonb,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  vendors JSONB NOT NULL DEFAULT '[]'::jsonb,
  conversation_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_projects ENABLE ROW LEVEL SECURITY;

-- Policies pour wedding_projects
CREATE POLICY "Users can view their own wedding projects"
  ON public.wedding_projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wedding projects"
  ON public.wedding_projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wedding projects"
  ON public.wedding_projects
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wedding projects"
  ON public.wedding_projects
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour update automatique du updated_at
CREATE TRIGGER update_wedding_projects_updated_at
  BEFORE UPDATE ON public.wedding_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_timestamp();