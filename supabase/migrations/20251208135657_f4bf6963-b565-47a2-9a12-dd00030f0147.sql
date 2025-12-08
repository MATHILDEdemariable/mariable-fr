-- Add source_lieu column to track leads by partner venue
ALTER TABLE carnet_adresses_requests ADD COLUMN IF NOT EXISTS source_lieu TEXT;