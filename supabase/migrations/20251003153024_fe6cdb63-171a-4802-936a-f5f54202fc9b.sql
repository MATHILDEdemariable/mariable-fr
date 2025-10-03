-- Table pour les conversations Vibe Wedding
CREATE TABLE vibe_wedding_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  wedding_data JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_vibe_conversations_user ON vibe_wedding_conversations(user_id);
CREATE INDEX idx_vibe_conversations_session ON vibe_wedding_conversations(session_id);

-- Enable RLS
ALTER TABLE vibe_wedding_conversations ENABLE ROW LEVEL SECURITY;

-- Policies RLS
CREATE POLICY "Users can view their own conversations"
  ON vibe_wedding_conversations
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own conversations"
  ON vibe_wedding_conversations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
  ON vibe_wedding_conversations
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "Service can manage all conversations"
  ON vibe_wedding_conversations
  FOR ALL
  USING (true);
