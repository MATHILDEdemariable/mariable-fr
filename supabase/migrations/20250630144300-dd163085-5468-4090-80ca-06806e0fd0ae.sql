
-- Corriger la fonction de validation des tokens de planning
-- Le problème est l'ambiguïté sur la colonne coordination_id
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
    planning_share_tokens.coordination_id
  FROM 
    public.planning_share_tokens
  WHERE 
    planning_share_tokens.token = token_value
    AND planning_share_tokens.is_active = true
    AND (planning_share_tokens.expires_at IS NULL OR planning_share_tokens.expires_at > now());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT FALSE, NULL::UUID;
  END IF;
END;
$function$;
