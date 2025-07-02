
-- Ajouter le champ source_inscription à la table prestataires_rows
ALTER TABLE public.prestataires_rows 
ADD COLUMN source_inscription TEXT DEFAULT 'manuel';

-- Ajouter le nouveau statut CRM "à traiter"
ALTER TYPE prestataire_status ADD VALUE 'a_traiter';

-- Créer une fonction sécurisée pour récupérer les données d'inscription des utilisateurs
CREATE OR REPLACE FUNCTION public.get_user_registrations()
RETURNS TABLE (
  id UUID,
  email TEXT,
  created_at TIMESTAMPTZ,
  raw_user_meta_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at,
    au.raw_user_meta_data
  FROM auth.users au
  ORDER BY au.created_at DESC;
END;
$$;

-- Ajouter une politique RLS pour la nouvelle fonction
GRANT EXECUTE ON FUNCTION public.get_user_registrations() TO authenticated;
