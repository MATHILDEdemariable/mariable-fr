-- Table pour persister le panier utilisateur
CREATE TABLE IF NOT EXISTS user_cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vendor_id TEXT NOT NULL,
  vendor_name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC,
  price_type TEXT DEFAULT 'catalog',
  guest_count INTEGER,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, vendor_id)
);

-- Enable RLS
ALTER TABLE user_cart_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own cart items"
  ON user_cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items"
  ON user_cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items"
  ON user_cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items"
  ON user_cart_items FOR DELETE
  USING (auth.uid() = user_id);