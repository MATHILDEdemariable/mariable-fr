
-- Phase 1: Corriger la validation des tokens en supprimant d'abord les dépendances

-- Supprimer les politiques RLS qui dépendent de validate_share_token
DROP POLICY IF EXISTS "Allow token viewers to see todos" ON public.todos_planification;
DROP POLICY IF EXISTS "Allow token viewers to see generated tasks" ON public.generated_tasks;
DROP POLICY IF EXISTS "Allow token viewers to see projects" ON public.projects;
DROP POLICY IF EXISTS "Allow token viewers to see vendors tracking" ON public.vendors_tracking;

-- Maintenant on peut supprimer l'ancienne fonction
DROP FUNCTION IF EXISTS public.validate_share_token(text);

-- Créer la nouvelle fonction pour les tokens de planning
CREATE OR REPLACE FUNCTION public.validate_planning_share_token(token_value text)
 RETURNS TABLE(is_valid boolean, coordination_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF token_value IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    coordination_id
  FROM 
    public.planning_share_tokens
  WHERE 
    token = token_value
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$function$;

-- Recréer les politiques RLS avec la nouvelle fonction (si nécessaire pour d'autres fonctionnalités)
-- Note: Ces politiques semblent être pour le dashboard général, pas pour le planning jour-M
-- On les garde pour ne pas casser d'autres fonctionnalités, mais elles utilisent maintenant la table dashboard_share_tokens
CREATE OR REPLACE FUNCTION public.validate_dashboard_share_token(token_value text)
 RETURNS TABLE(is_valid boolean, user_id uuid)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  IF token_value IS NULL THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
    RETURN;
  END IF;
  
  RETURN QUERY
  SELECT 
    TRUE as is_valid,
    user_id
  FROM 
    public.dashboard_share_tokens
  WHERE 
    token = token_value
    AND active = true
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$function$;

-- Recréer les politiques pour le dashboard général
CREATE POLICY "Allow token viewers to see todos" 
  ON public.todos_planification 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM validate_dashboard_share_token(current_setting('request.headers', true)::json->>'authorization') 
      WHERE is_valid = true AND user_id = todos_planification.user_id
    )
  );

CREATE POLICY "Allow token viewers to see generated tasks" 
  ON public.generated_tasks 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM validate_dashboard_share_token(current_setting('request.headers', true)::json->>'authorization') 
      WHERE is_valid = true AND user_id = generated_tasks.user_id
    )
  );

CREATE POLICY "Allow token viewers to see projects" 
  ON public.projects 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM validate_dashboard_share_token(current_setting('request.headers', true)::json->>'authorization') 
      WHERE is_valid = true AND user_id = projects.user_id
    )
  );

CREATE POLICY "Allow token viewers to see vendors tracking" 
  ON public.vendors_tracking 
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM validate_dashboard_share_token(current_setting('request.headers', true)::json->>'authorization') 
      WHERE is_valid = true AND user_id = vendors_tracking.user_id
    )
  );
