-- Créer la table coordination_pinterest pour stocker les liens Pinterest
CREATE TABLE public.coordination_pinterest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coordination_id UUID NOT NULL,
  title TEXT NOT NULL,
  pinterest_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ajouter les contraintes de clé étrangère
ALTER TABLE public.coordination_pinterest 
ADD CONSTRAINT coordination_pinterest_coordination_id_fkey 
FOREIGN KEY (coordination_id) 
REFERENCES public.wedding_coordination(id) 
ON DELETE CASCADE;

-- Activer RLS
ALTER TABLE public.coordination_pinterest ENABLE ROW LEVEL SECURITY;

-- Créer les politiques RLS
CREATE POLICY "Users can view their own pinterest links" 
ON public.coordination_pinterest 
FOR SELECT 
USING (coordination_id IN (
  SELECT wedding_coordination.id
  FROM wedding_coordination
  WHERE wedding_coordination.user_id = auth.uid()
));

CREATE POLICY "Users can create pinterest links for their coordination" 
ON public.coordination_pinterest 
FOR INSERT 
WITH CHECK (coordination_id IN (
  SELECT wedding_coordination.id
  FROM wedding_coordination
  WHERE wedding_coordination.user_id = auth.uid()
));

CREATE POLICY "Users can update their own pinterest links" 
ON public.coordination_pinterest 
FOR UPDATE 
USING (coordination_id IN (
  SELECT wedding_coordination.id
  FROM wedding_coordination
  WHERE wedding_coordination.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own pinterest links" 
ON public.coordination_pinterest 
FOR DELETE 
USING (coordination_id IN (
  SELECT wedding_coordination.id
  FROM wedding_coordination
  WHERE wedding_coordination.user_id = auth.uid()
));

-- Politique pour accès public via share tokens
CREATE POLICY "Public access via share tokens for pinterest" 
ON public.coordination_pinterest 
FOR SELECT 
USING (EXISTS (
  SELECT 1
  FROM wedding_coordination wc
  JOIN dashboard_share_tokens dst ON dst.user_id = wc.user_id
  WHERE wc.id = coordination_pinterest.coordination_id
    AND dst.active = true
    AND (dst.expires_at IS NULL OR dst.expires_at > now())
));

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_coordination_pinterest_updated_at
BEFORE UPDATE ON public.coordination_pinterest
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();