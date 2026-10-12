CREATE POLICY "Users upload own guest page photos" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'jeunes-maries-photos' AND (storage.foldername(name))[1] = 'guest-pages' AND (storage.foldername(name))[2] = auth.uid()::text);
CREATE POLICY "Users delete own guest page photos" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'jeunes-maries-photos' AND (storage.foldername(name))[1] = 'guest-pages' AND (storage.foldername(name))[2] = auth.uid()::text);