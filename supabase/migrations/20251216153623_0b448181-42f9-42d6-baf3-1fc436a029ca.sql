-- Table pour les messages envoyés aux prestataires
CREATE TABLE public.vendor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES prestataires_rows(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Index pour les performances
CREATE INDEX idx_vendor_messages_user ON vendor_messages(user_id);
CREATE INDEX idx_vendor_messages_vendor ON vendor_messages(vendor_id);
CREATE INDEX idx_vendor_messages_created ON vendor_messages(created_at DESC);

-- Enable RLS
ALTER TABLE vendor_messages ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own messages"
ON vendor_messages FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own messages"
ON vendor_messages FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages"
ON vendor_messages FOR DELETE
USING (auth.uid() = user_id);