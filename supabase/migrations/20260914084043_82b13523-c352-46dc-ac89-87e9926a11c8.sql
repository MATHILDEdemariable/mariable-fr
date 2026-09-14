CREATE TABLE public.price_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  category text NOT NULL,
  name text NOT NULL,
  description text,
  base_price numeric NOT NULL DEFAULT 0,
  price_unit text NOT NULL DEFAULT 'forfait',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.price_catalog TO authenticated;
GRANT ALL ON public.price_catalog TO service_role;

ALTER TABLE public.price_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "price_catalog_select_own" ON public.price_catalog FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "price_catalog_insert_own" ON public.price_catalog FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "price_catalog_update_own" ON public.price_catalog FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "price_catalog_delete_own" ON public.price_catalog FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX idx_price_catalog_user ON public.price_catalog (user_id, category, name);

CREATE TRIGGER update_price_catalog_updated_at
BEFORE UPDATE ON public.price_catalog
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();