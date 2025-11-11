-- Create wedding_guest_list table for manual guest list management
CREATE TABLE wedding_guest_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  guest_address TEXT,
  guest_type TEXT DEFAULT 'adult' CHECK (guest_type IN ('adult', 'child')),
  invited_to TEXT[],
  notes TEXT,
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'excel', 'txt', 'rsvp')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE wedding_guest_list ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own guests"
  ON wedding_guest_list
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own guests"
  ON wedding_guest_list
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own guests"
  ON wedding_guest_list
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own guests"
  ON wedding_guest_list
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_wedding_guest_list_updated_at
  BEFORE UPDATE ON wedding_guest_list
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();