-- Corriger la fonction RPC pour compter les utilisateurs avec des documents
DROP FUNCTION IF EXISTS count_users_with_documents();

CREATE OR REPLACE FUNCTION count_users_with_documents()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COUNT(DISTINCT coordination_id)::bigint
  FROM coordination_documents
  WHERE coordination_id IN (
    SELECT id FROM wedding_coordination
  );
$$;