ALTER TABLE contact_requests DROP CONSTRAINT IF EXISTS contact_requests_type_check;
ALTER TABLE contact_requests ADD CONSTRAINT contact_requests_type_check 
  CHECK (type = ANY (ARRAY['couple','lieu','marque','prestataire','bug','feature','account','suggestion','other','site_internet']));