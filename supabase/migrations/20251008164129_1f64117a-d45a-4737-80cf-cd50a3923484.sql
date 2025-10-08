-- Migration 1: Ajouter colonne phone à vendor_contact_requests
ALTER TABLE vendor_contact_requests 
ADD COLUMN IF NOT EXISTS phone text;

-- Migration 2: Convertir region en regions JSONB pour prestataires_rows
-- Étape 1: Ajouter colonne regions en JSONB
ALTER TABLE prestataires_rows 
ADD COLUMN IF NOT EXISTS regions jsonb DEFAULT '[]'::jsonb;

-- Étape 2: Migrer les données existantes (region → regions array)
UPDATE prestataires_rows 
SET regions = jsonb_build_array(region::text)
WHERE region IS NOT NULL AND (regions IS NULL OR regions = '[]'::jsonb);

-- Étape 3: Pour les prestataires sans région, mettre un array vide
UPDATE prestataires_rows 
SET regions = '[]'::jsonb
WHERE regions IS NULL;

-- Étape 4: Supprimer l'ancienne colonne region
ALTER TABLE prestataires_rows 
DROP COLUMN IF EXISTS region;

-- Étape 5: Index GIN pour optimiser les recherches dans le JSONB
CREATE INDEX IF NOT EXISTS idx_prestataires_regions_gin 
ON prestataires_rows USING GIN (regions);

-- Migration 3: Ajouter nouvelles catégories Cocktail et Foodtruck
DO $$ 
BEGIN
    -- Ajouter Cocktail si n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'Cocktail' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prestataire_categorie')
    ) THEN
        ALTER TYPE prestataire_categorie ADD VALUE 'Cocktail';
    END IF;
    
    -- Ajouter Foodtruck si n'existe pas
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'Foodtruck' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prestataire_categorie')
    ) THEN
        ALTER TYPE prestataire_categorie ADD VALUE 'Foodtruck';
    END IF;
END $$;