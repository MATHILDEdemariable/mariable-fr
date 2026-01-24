-- Add column for the exclusive advantage proposed by professionals
ALTER TABLE prestataires_rows 
ADD COLUMN IF NOT EXISTS avantage_propose TEXT;