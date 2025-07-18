-- Ajouter seulement les nouvelles catégories qui n'existent pas encore
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Mise en beauté' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prestataire_categorie')) THEN
        ALTER TYPE prestataire_categorie ADD VALUE 'Mise en beauté';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Voiture' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prestataire_categorie')) THEN
        ALTER TYPE prestataire_categorie ADD VALUE 'Voiture';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'Invités' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'prestataire_categorie')) THEN
        ALTER TYPE prestataire_categorie ADD VALUE 'Invités';
    END IF;
END $$;