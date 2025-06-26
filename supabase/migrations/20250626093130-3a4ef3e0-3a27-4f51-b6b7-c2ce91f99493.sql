
-- Créer le bucket pour les documents si il n'existe pas déjà
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-documents', 'wedding-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can upload their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

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

-- Ajouter les politiques RLS pour la table coordination_documents
DROP POLICY IF EXISTS "Users can view their own coordination documents" ON coordination_documents;
DROP POLICY IF EXISTS "Users can insert their own coordination documents" ON coordination_documents;
DROP POLICY IF EXISTS "Users can update their own coordination documents" ON coordination_documents;
DROP POLICY IF EXISTS "Users can delete their own coordination documents" ON coordination_documents;

-- Activer RLS sur la table coordination_documents
ALTER TABLE coordination_documents ENABLE ROW LEVEL SECURITY;

-- Créer les politiques pour coordination_documents
CREATE POLICY "Users can view their own coordination documents"
ON coordination_documents FOR SELECT
USING (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own coordination documents"
ON coordination_documents FOR INSERT
WITH CHECK (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own coordination documents"
ON coordination_documents FOR UPDATE
USING (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own coordination documents"
ON coordination_documents FOR DELETE
USING (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);

-- S'assurer que les autres tables ont aussi RLS activé
ALTER TABLE wedding_coordination ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordination_planning ENABLE ROW LEVEL SECURITY;
ALTER TABLE coordination_team ENABLE ROW LEVEL SECURITY;

-- Politiques pour wedding_coordination
DROP POLICY IF EXISTS "Users can manage their own coordination" ON wedding_coordination;
CREATE POLICY "Users can manage their own coordination"
ON wedding_coordination FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Politiques pour coordination_planning
DROP POLICY IF EXISTS "Users can manage their own planning" ON coordination_planning;
CREATE POLICY "Users can manage their own planning"
ON coordination_planning FOR ALL
USING (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);

-- Politiques pour coordination_team
DROP POLICY IF EXISTS "Users can manage their own team" ON coordination_team;
CREATE POLICY "Users can manage their own team"
ON coordination_team FOR ALL
USING (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  coordination_id IN (
    SELECT id FROM wedding_coordination WHERE user_id = auth.uid()
  )
);
