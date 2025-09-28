-- Corriger le bucket devis-pdf pour le rendre public
UPDATE storage.buckets 
SET public = true 
WHERE id = 'devis-pdf';

-- Ajouter les politiques RLS manquantes pour l'accès aux fichiers de devis
CREATE POLICY "Public can view devis files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'devis-pdf');

CREATE POLICY "Admins can manage devis files" 
ON storage.objects 
FOR ALL 
USING (bucket_id = 'devis-pdf' AND is_admin())
WITH CHECK (bucket_id = 'devis-pdf' AND is_admin());