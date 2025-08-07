-- Créer la table planning_apres_jour_j
CREATE TABLE public.planning_apres_jour_j (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Ma checklist après le jour-J',
  original_text TEXT NOT NULL,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  completed_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT,
  icon TEXT
);

-- Créer la table apres_jour_j_share_tokens
CREATE TABLE public.apres_jour_j_share_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL,
  name TEXT NOT NULL,
  token TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur les deux tables
ALTER TABLE public.planning_apres_jour_j ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apres_jour_j_share_tokens ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS pour planning_apres_jour_j
CREATE POLICY "Users can create their own apres jour j planning" 
ON public.planning_apres_jour_j 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own apres jour j planning" 
ON public.planning_apres_jour_j 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own apres jour j planning" 
ON public.planning_apres_jour_j 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own apres jour j planning" 
ON public.planning_apres_jour_j 
FOR DELETE 
USING (auth.uid() = user_id);

-- Créer les politiques RLS pour apres_jour_j_share_tokens
CREATE POLICY "Users can manage their checklist share tokens" 
ON public.apres_jour_j_share_tokens 
FOR ALL 
USING (checklist_id IN (
  SELECT planning_apres_jour_j.id 
  FROM planning_apres_jour_j 
  WHERE planning_apres_jour_j.user_id = auth.uid()
))
WITH CHECK (checklist_id IN (
  SELECT planning_apres_jour_j.id 
  FROM planning_apres_jour_j 
  WHERE planning_apres_jour_j.user_id = auth.uid()
));

CREATE POLICY "Public can read active share tokens" 
ON public.apres_jour_j_share_tokens 
FOR SELECT 
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Créer les fonctions et triggers
CREATE OR REPLACE FUNCTION public.update_planning_apres_jour_j_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_planning_apres_jour_j_updated_at
BEFORE UPDATE ON public.planning_apres_jour_j
FOR EACH ROW
EXECUTE FUNCTION public.update_planning_apres_jour_j_updated_at();

-- Fonction de validation des tokens de partage
CREATE OR REPLACE FUNCTION public.validate_apres_jour_j_share_token(token_value text)
RETURNS TABLE(is_valid boolean, checklist_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF token_value IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    apres_jour_j_share_tokens.checklist_id
  FROM 
    public.apres_jour_j_share_tokens
  WHERE 
    apres_jour_j_share_tokens.token = token_value
    AND apres_jour_j_share_tokens.is_active = true
    AND (apres_jour_j_share_tokens.expires_at IS NULL OR apres_jour_j_share_tokens.expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$$;