
-- Désactiver RLS sur la table prestataires_photos_preprod pour cohérence avec prestataires_rows
-- Cela permettra aux opérations CRUD de fonctionner sans authentification comme pour les autres champs prestataires

-- Supprimer toutes les politiques RLS existantes
DROP POLICY IF EXISTS "Admins can view prestataire photos" ON prestataires_photos_preprod;
DROP POLICY IF EXISTS "Admins can insert prestataire photos" ON prestataires_photos_preprod;
DROP POLICY IF EXISTS "Admins can update prestataire photos" ON prestataires_photos_preprod;
DROP POLICY IF EXISTS "Admins can delete prestataire photos" ON prestataires_photos_preprod;
DROP POLICY IF EXISTS "Public can view visible prestataire photos" ON prestataires_photos_preprod;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON prestataires_photos_preprod;

-- Désactiver RLS sur la table
ALTER TABLE prestataires_photos_preprod DISABLE ROW LEVEL SECURITY;
