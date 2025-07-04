-- Ajouter des colonnes pour les prestataires personnels
ALTER TABLE vendors_tracking_preprod 
ADD COLUMN email TEXT,
ADD COLUMN phone TEXT,
ADD COLUMN website TEXT,
ADD COLUMN location TEXT,
ADD COLUMN source TEXT DEFAULT 'mariable' CHECK (source IN ('mariable', 'personal'));