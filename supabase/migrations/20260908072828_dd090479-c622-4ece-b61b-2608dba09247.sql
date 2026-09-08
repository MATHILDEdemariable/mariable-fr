-- Extension B2B V1 : entité "mariage" (sans organisations) — additive.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'b2c';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_account_type_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_account_type_check CHECK (account_type IN ('b2c', 'b2b'));

CREATE TABLE IF NOT EXISTS public.weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Mon mariage',
  wedding_date date,
  wedding_location text,
  guest_count integer,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.weddings TO authenticated;
GRANT ALL ON public.weddings TO service_role;
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_weddings_owner ON public.weddings(owner_id);

DROP POLICY IF EXISTS "Owners manage their weddings" ON public.weddings;
CREATE POLICY "Owners manage their weddings" ON public.weddings
  FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP TRIGGER IF EXISTS update_weddings_updated_at ON public.weddings;
CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.has_wedding_access(_user_id uuid, _wedding_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _wedding_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.weddings w
    WHERE w.id = _wedding_id AND w.owner_id = _user_id
  );
$$;

INSERT INTO public.weddings (id, owner_id, title, wedding_date, guest_count, is_default)
SELECT p.id, p.id,
       COALESCE(NULLIF(TRIM(CONCAT_WS(' & ', p.first_name, p.last_name)), ''), 'Mon mariage'),
       p.wedding_date,
       p.guest_count,
       true
FROM public.profiles p
ON CONFLICT (id) DO NOTHING;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'budgets_dashboard','budgets_detail','checklist_mariage_manuel','vendors_tracking',
    'wedding_guest_list','wedding_rsvp_events','wedding_coordination','seating_plans',
    'wedding_accommodations','wedding_documents','qr_codes','guest_albums'
  ] LOOP
    EXECUTE format(
      'ALTER TABLE public.%I ADD COLUMN IF NOT EXISTS wedding_id uuid REFERENCES public.weddings(id) ON DELETE SET NULL', t);
    EXECUTE format(
      'CREATE INDEX IF NOT EXISTS idx_%s_wedding_id ON public.%I(wedding_id)', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Wedding owners access %s" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Wedding owners access %s" ON public.%I FOR ALL TO authenticated
         USING (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id))
         WITH CHECK (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id))', t, t);
    EXECUTE format(
      'UPDATE public.%I tbl SET wedding_id = tbl.user_id
        WHERE tbl.wedding_id IS NULL
          AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = tbl.user_id)', t);
  END LOOP;
END $$;

CREATE TABLE IF NOT EXISTS public.wedding_tool_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  wedding_id uuid REFERENCES public.weddings(id) ON DELETE CASCADE,
  tool_key text NOT NULL,
  state jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, wedding_id, tool_key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_tool_states TO authenticated;
GRANT ALL ON public.wedding_tool_states TO service_role;
ALTER TABLE public.wedding_tool_states ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their tool states" ON public.wedding_tool_states;
CREATE POLICY "Users manage their tool states" ON public.wedding_tool_states
  FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (user_id = auth.uid() OR public.has_wedding_access(auth.uid(), wedding_id));

DROP TRIGGER IF EXISTS update_wedding_tool_states_updated_at ON public.wedding_tool_states;
CREATE TRIGGER update_wedding_tool_states_updated_at
  BEFORE UPDATE ON public.wedding_tool_states
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, referral_source, registration_purpose, account_type)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'referral_source',
    new.raw_user_meta_data ->> 'registration_purpose',
    COALESCE(NULLIF(new.raw_user_meta_data ->> 'account_type', ''), 'b2c')
  );

  INSERT INTO public.weddings (id, owner_id, title, is_default)
  VALUES (new.id, new.id, 'Mon mariage', true)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$function$;

UPDATE public.profiles p
SET account_type = 'b2b'
FROM auth.users u
WHERE u.id = p.id
  AND COALESCE(u.raw_user_meta_data ->> 'account_type', '') = 'b2b'
  AND p.account_type IS DISTINCT FROM 'b2b';

ALTER TABLE public.budgets_detail DROP CONSTRAINT IF EXISTS budgets_detail_user_id_item_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS budgets_detail_user_wedding_item_key
  ON public.budgets_detail (user_id, wedding_id, item_id);