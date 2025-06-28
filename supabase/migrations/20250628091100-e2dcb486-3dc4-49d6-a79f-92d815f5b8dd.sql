
-- Créer la table pour les tokens de partage de planning
CREATE TABLE public.planning_share_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  coordination_id UUID NOT NULL REFERENCES public.wedding_coordination(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  roles_filter JSONB DEFAULT NULL,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer un index sur le token pour améliorer les performances
CREATE INDEX idx_planning_share_tokens_token ON public.planning_share_tokens(token);
CREATE INDEX idx_planning_share_tokens_coordination_id ON public.planning_share_tokens(coordination_id);

-- Activer RLS
ALTER TABLE public.planning_share_tokens ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs peuvent gérer les tokens de leurs propres coordinations
CREATE POLICY "Users can manage their coordination share tokens"
  ON public.planning_share_tokens
  FOR ALL
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

-- Politique RLS : Accès public en lecture pour les tokens actifs et valides
CREATE POLICY "Public can read active share tokens"
  ON public.planning_share_tokens
  FOR SELECT
  USING (
    is_active = true 
    AND (expires_at IS NULL OR expires_at > now())
  );

-- Trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER on_planning_share_tokens_update
  BEFORE UPDATE ON public.planning_share_tokens
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_timestamp();
