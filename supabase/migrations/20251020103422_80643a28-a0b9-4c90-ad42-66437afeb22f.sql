-- Rendre le bucket wedding-documents public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'wedding-documents';