-- Table pour les conversations IA
CREATE TABLE ai_wedding_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  session_id TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  wedding_context JSONB NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_user ON ai_wedding_conversations(user_id);
CREATE INDEX idx_conversations_session ON ai_wedding_conversations(session_id);

ALTER TABLE ai_wedding_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own conversations"
  ON ai_wedding_conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own conversations"
  ON ai_wedding_conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own conversations"
  ON ai_wedding_conversations FOR UPDATE
  USING (auth.uid() = user_id);

-- Table pour le suivi des quotas
CREATE TABLE ai_usage_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NULL,
  session_id TEXT NOT NULL,
  prompts_used_today INTEGER DEFAULT 0,
  last_prompt_date DATE DEFAULT CURRENT_DATE,
  total_prompts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_user_date UNIQUE(user_id, last_prompt_date),
  CONSTRAINT unique_session_date UNIQUE(session_id, last_prompt_date)
);

CREATE INDEX idx_usage_user ON ai_usage_tracking(user_id);
CREATE INDEX idx_usage_session ON ai_usage_tracking(session_id);

ALTER TABLE ai_usage_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own usage"
  ON ai_usage_tracking FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service can manage usage"
  ON ai_usage_tracking FOR ALL
  USING (true);