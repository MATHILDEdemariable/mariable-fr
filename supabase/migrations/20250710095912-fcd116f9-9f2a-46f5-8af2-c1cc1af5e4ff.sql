-- Créer une politique RLS pour permettre l'accès public aux documents via les tokens de partage
CREATE POLICY "Public access to documents via planning share tokens"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'coordination-files' 
  AND EXISTS (
    SELECT 1 
    FROM planning_share_tokens pst
    JOIN wedding_coordination wc ON pst.coordination_id = wc.id
    JOIN coordination_documents cd ON cd.coordination_id = wc.id
    WHERE pst.is_active = true
    AND (pst.expires_at IS NULL OR pst.expires_at > now())
    AND cd.file_url LIKE '%' || (storage.foldername(name))[1] || '%'
  )
);