-- Créer la table pour les tokens de partage des checklists avant jour-j
CREATE TABLE public.avant_jour_j_share_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checklist_id UUID NOT NULL,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.avant_jour_j_share_tokens ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Public can read active share tokens"
ON public.avant_jour_j_share_tokens
FOR SELECT
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

CREATE POLICY "Users can manage their checklist share tokens"
ON public.avant_jour_j_share_tokens
FOR ALL
USING (checklist_id IN (
  SELECT id FROM public.planning_avant_jour_j 
  WHERE user_id = auth.uid()
))
WITH CHECK (checklist_id IN (
  SELECT id FROM public.planning_avant_jour_j 
  WHERE user_id = auth.uid()
));

-- Créer un index pour les tokens
CREATE INDEX idx_avant_jour_j_share_tokens_token ON public.avant_jour_j_share_tokens(token);

-- Créer un index pour checklist_id
CREATE INDEX idx_avant_jour_j_share_tokens_checklist_id ON public.avant_jour_j_share_tokens(checklist_id);

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_avant_jour_j_share_tokens_updated_at
  BEFORE UPDATE ON public.avant_jour_j_share_tokens
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Fonction pour valider les tokens de partage avant jour-j
CREATE OR REPLACE FUNCTION public.validate_avant_jour_j_share_token(token_value text)
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
    avant_jour_j_share_tokens.checklist_id
  FROM 
    public.avant_jour_j_share_tokens
  WHERE 
    avant_jour_j_share_tokens.token = token_value
    AND avant_jour_j_share_tokens.is_active = true
    AND (avant_jour_j_share_tokens.expires_at IS NULL OR avant_jour_j_share_tokens.expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$$;