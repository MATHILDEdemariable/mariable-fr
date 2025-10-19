-- Créer la table wedding_documents
CREATE TABLE IF NOT EXISTS public.wedding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  document_type TEXT NOT NULL,
  category TEXT,
  vendor_name TEXT,
  ai_summary TEXT,
  ai_key_points JSONB,
  is_analyzed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_wedding_documents_user ON public.wedding_documents(user_id);
CREATE INDEX idx_wedding_documents_type ON public.wedding_documents(document_type);

-- RLS Policies
ALTER TABLE public.wedding_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own documents"
  ON public.wedding_documents
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON public.wedding_documents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
  ON public.wedding_documents
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
  ON public.wedding_documents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION update_wedding_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wedding_documents_updated_at
  BEFORE UPDATE ON public.wedding_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_wedding_documents_updated_at();