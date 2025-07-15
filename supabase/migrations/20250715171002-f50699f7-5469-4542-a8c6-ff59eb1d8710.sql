-- Add "France entière" to the region enum
ALTER TYPE region_france ADD VALUE 'France entière';

-- Add indexes for better performance on vendor searches
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_region ON prestataires_rows(region);
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_categorie ON prestataires_rows(categorie);
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_visible ON prestataires_rows(visible);
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_featured ON prestataires_rows(featured);
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_prix ON prestataires_rows(prix_a_partir_de);

-- Composite index for common filter combinations
CREATE INDEX IF NOT EXISTS idx_prestataires_rows_search ON prestataires_rows(region, categorie, visible) WHERE visible = true;