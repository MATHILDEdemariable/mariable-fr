
-- Créer les tables pour la coordination du jour de mariage

-- Table principale pour la coordination du mariage
CREATE TABLE public.wedding_coordination (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL DEFAULT 'Mon Mariage',
  wedding_date DATE,
  wedding_location TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour l'équipe (personnes et prestataires) - créée avant coordination_planning
CREATE TABLE public.coordination_team (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coordination_id UUID REFERENCES public.wedding_coordination(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'person', -- person, vendor
  email TEXT,
  phone TEXT,
  prestataire_id UUID REFERENCES public.prestataires(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour le planning et les tâches - maintenant que coordination_team existe
CREATE TABLE public.coordination_planning (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coordination_id UUID REFERENCES public.wedding_coordination(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  duration INTEGER DEFAULT 0, -- en minutes
  assigned_to UUID REFERENCES public.coordination_team(id),
  status TEXT DEFAULT 'todo', -- todo, in_progress, completed
  priority TEXT DEFAULT 'medium', -- low, medium, high
  is_ai_generated BOOLEAN DEFAULT false,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table pour les documents
CREATE TABLE public.coordination_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coordination_id UUID REFERENCES public.wedding_coordination(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  assigned_to UUID REFERENCES public.coordination_team(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter des triggers pour les timestamps
CREATE OR REPLACE FUNCTION update_coordination_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_wedding_coordination_updated_at
  BEFORE UPDATE ON public.wedding_coordination
  FOR EACH ROW EXECUTE FUNCTION update_coordination_updated_at();

CREATE TRIGGER update_coordination_team_updated_at
  BEFORE UPDATE ON public.coordination_team
  FOR EACH ROW EXECUTE FUNCTION update_coordination_updated_at();

CREATE TRIGGER update_coordination_planning_updated_at
  BEFORE UPDATE ON public.coordination_planning
  FOR EACH ROW EXECUTE FUNCTION update_coordination_updated_at();

CREATE TRIGGER update_coordination_documents_updated_at
  BEFORE UPDATE ON public.coordination_documents
  FOR EACH ROW EXECUTE FUNCTION update_coordination_updated_at();

-- Activer RLS sur toutes les tables
ALTER TABLE public.wedding_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coordination_documents ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour wedding_coordination
CREATE POLICY "Users can view their own coordination" 
  ON public.wedding_coordination 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own coordination" 
  ON public.wedding_coordination 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coordination" 
  ON public.wedding_coordination 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coordination" 
  ON public.wedding_coordination 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Politiques RLS pour coordination_team
CREATE POLICY "Users can view their own team" 
  ON public.coordination_team 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_team.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own team" 
  ON public.coordination_team 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_team.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own team" 
  ON public.coordination_team 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_team.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own team" 
  ON public.coordination_team 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_team.coordination_id 
    AND user_id = auth.uid()
  ));

-- Politiques RLS pour coordination_planning
CREATE POLICY "Users can view their own planning" 
  ON public.coordination_planning 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_planning.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own planning" 
  ON public.coordination_planning 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_planning.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own planning" 
  ON public.coordination_planning 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_planning.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own planning" 
  ON public.coordination_planning 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_planning.coordination_id 
    AND user_id = auth.uid()
  ));

-- Politiques RLS pour coordination_documents
CREATE POLICY "Users can view their own documents" 
  ON public.coordination_documents 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_documents.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create their own documents" 
  ON public.coordination_documents 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_documents.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own documents" 
  ON public.coordination_documents 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_documents.coordination_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own documents" 
  ON public.coordination_documents 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE id = coordination_documents.coordination_id 
    AND user_id = auth.uid()
  ));

-- Politiques RLS pour l'accès public via tokens
CREATE POLICY "Public access via share tokens for coordination" 
  ON public.wedding_coordination 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.dashboard_share_tokens 
      WHERE user_id = wedding_coordination.user_id 
      AND active = true 
      AND (expires_at IS NULL OR expires_at > now())
    )
  );

CREATE POLICY "Public access via share tokens for team" 
  ON public.coordination_team 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_coordination wc
      JOIN public.dashboard_share_tokens dst ON dst.user_id = wc.user_id
      WHERE wc.id = coordination_team.coordination_id 
      AND dst.active = true 
      AND (dst.expires_at IS NULL OR dst.expires_at > now())
    )
  );

CREATE POLICY "Public access via share tokens for planning" 
  ON public.coordination_planning 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_coordination wc
      JOIN public.dashboard_share_tokens dst ON dst.user_id = wc.user_id
      WHERE wc.id = coordination_planning.coordination_id 
      AND dst.active = true 
      AND (dst.expires_at IS NULL OR dst.expires_at > now())
    )
  );

CREATE POLICY "Public access via share tokens for documents" 
  ON public.coordination_documents 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.wedding_coordination wc
      JOIN public.dashboard_share_tokens dst ON dst.user_id = wc.user_id
      WHERE wc.id = coordination_documents.coordination_id 
      AND dst.active = true 
      AND (dst.expires_at IS NULL OR dst.expires_at > now())
    )
  );
