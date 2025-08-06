-- Rendre le bucket visuels public pour afficher l'image du club
UPDATE storage.buckets 
SET public = true 
WHERE id = 'visuels';