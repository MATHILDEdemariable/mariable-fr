
-- Ajouter des colonnes pour les descriptifs des formules de prix
ALTER TABLE prestataires_rows 
ADD COLUMN first_price_package_description TEXT,
ADD COLUMN second_price_package_description TEXT,
ADD COLUMN third_price_package_description TEXT;

-- Ajouter des colonnes pour contrôler la visibilité des éléments en front
ALTER TABLE prestataires_rows 
ADD COLUMN show_prices BOOLEAN DEFAULT true,
ADD COLUMN show_contact_form BOOLEAN DEFAULT true,
ADD COLUMN show_description BOOLEAN DEFAULT true,
ADD COLUMN show_photos BOOLEAN DEFAULT true,
ADD COLUMN show_brochures BOOLEAN DEFAULT true,
ADD COLUMN show_responsable BOOLEAN DEFAULT true;

-- Ajouter une colonne pour marquer une photo comme photo de couverture principale
ALTER TABLE prestataires_photos_preprod 
ADD COLUMN is_cover BOOLEAN DEFAULT false;

-- Créer une table pour gérer l'accès admin simple
CREATE TABLE IF NOT EXISTS admin_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Insérer le token par défaut "2025"
INSERT INTO admin_access_tokens (token, is_active) 
VALUES ('2025', true)
ON CONFLICT (token) DO NOTHING;
