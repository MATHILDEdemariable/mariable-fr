CREATE TABLE public.pro_address_book (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  company_name text NOT NULL,
  contact_name text,
  category text NOT NULL DEFAULT 'Autre',
  email text,
  phone text,
  city text,
  website text,
  notes text,
  prestataire_id uuid,
  source text NOT NULL DEFAULT 'personal',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pro_address_book TO authenticated;
GRANT ALL ON public.pro_address_book TO service_role;
ALTER TABLE public.pro_address_book ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their address book" ON public.pro_address_book
  FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE TRIGGER update_pro_address_book_updated_at BEFORE UPDATE ON public.pro_address_book
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();