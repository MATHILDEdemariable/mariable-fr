-- Créer le bucket coordination-files pour les documents Mission Mariage
INSERT INTO storage.buckets (id, name, public) VALUES ('coordination-files', 'coordination-files', true);

-- Créer les politiques RLS pour coordination-files
CREATE POLICY "Users can upload their own coordination files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'coordination-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own coordination files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'coordination-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own coordination files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'coordination-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own coordination files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'coordination-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public read access to coordination files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'coordination-files');