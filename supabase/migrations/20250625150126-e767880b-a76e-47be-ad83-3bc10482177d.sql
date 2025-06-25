
-- Créer un bucket pour stocker les documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-documents', 'wedding-documents', false);

-- Créer des politiques RLS pour le bucket des documents
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'wedding-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'wedding-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'wedding-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'wedding-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Ajouter une colonne pour stocker l'URL du fichier dans la table coordination_documents
ALTER TABLE coordination_documents 
ADD COLUMN IF NOT EXISTS file_path TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS mime_type TEXT;
