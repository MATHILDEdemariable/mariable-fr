-- Améliorer la fonction RLS pour contourner les problèmes d'accès admin
CREATE OR REPLACE FUNCTION public.get_user_registrations()
RETURNS TABLE(id uuid, email text, created_at timestamp with time zone, raw_user_meta_data jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Vérifier que l'utilisateur est admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Nouvelle approche : d'abord essayer d'accéder à auth.users
  BEGIN
    RETURN QUERY
    SELECT 
      au.id,
      au.email,
      au.created_at,
      au.raw_user_meta_data
    FROM auth.users au
    ORDER BY au.created_at DESC;
  EXCEPTION
    WHEN others THEN
      -- Si l'accès à auth.users échoue, utiliser profiles comme fallback
      RETURN QUERY
      SELECT 
        p.id,
        'Email non disponible'::text as email,
        p.created_at,
        jsonb_build_object(
          'first_name', p.first_name,
          'last_name', p.last_name
        ) as raw_user_meta_data
      FROM profiles p
      ORDER BY p.created_at DESC;
  END;
END;
$$;

-- Corriger la politique RLS pour paiement_accompagnement pour permettre l'accès admin
DROP POLICY IF EXISTS "Allow admin read on paiement_accompagnement" ON public.paiement_accompagnement;

CREATE POLICY "Allow admin read on paiement_accompagnement" 
ON public.paiement_accompagnement 
FOR SELECT 
USING (is_admin());

-- Permettre aux admins de mettre à jour le statut des paiements
CREATE POLICY "Allow admin update on paiement_accompagnement" 
ON public.paiement_accompagnement 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());