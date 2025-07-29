-- Créer un bucket pour les vidéos de fond
INSERT INTO storage.buckets (id, name, public) VALUES ('background-videos', 'background-videos', true);

-- Créer les politiques pour le bucket des vidéos
CREATE POLICY "Vidéos publiquement accessibles" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'background-videos');

CREATE POLICY "Admins peuvent uploader des vidéos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'background-videos' AND is_admin());

CREATE POLICY "Admins peuvent modifier des vidéos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'background-videos' AND is_admin());

CREATE POLICY "Admins peuvent supprimer des vidéos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'background-videos' AND is_admin());