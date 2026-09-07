-- ============================================================
-- Extension B2B V1 : entité "mariage" + organisations
-- Migration strictement additive.
-- ============================================================

-- 1. Type de compte sur le profil ------------------------------------------
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_type text NOT NULL DEFAULT 'b2c';

-- 2. Organisations ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Mon organisation',
  owner_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organizations TO authenticated;
GRANT ALL ON public.organizations TO service_role;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.organization_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organization_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.organization_members TO authenticated;
GRANT ALL ON public.organization_members TO service_role;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- 3. Mariages ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.weddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_by uuid NOT NULL,
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

CREATE TABLE IF NOT EXISTS public.wedding_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'owner',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_members TO authenticated;
GRANT ALL ON public.wedding_members TO service_role;
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;

CREATE INDEX IF NOT EXISTS idx_wedding_members_user ON public.wedding_members(user_id);
CREATE INDEX IF NOT EXISTS idx_weddings_created_by ON public.weddings(created_by);

-- 4. Fonction d'accès (security definer, évite la récursion RLS) ------------
CREATE OR REPLACE FUNCTION public.has_wedding_access(_user_id uuid, _wedding_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT _user_id IS NOT NULL AND _wedding_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.wedding_members wm
    WHERE wm.wedding_id = _wedding_id AND wm.user_id = _user_id
  );
$$;

-- 5. Policies sur les nouvelles tables --------------------------------------
DROP POLICY IF EXISTS "Members read their organizations" ON public.organizations;
CREATE POLICY "Members read their organizations" ON public.organizations
  FOR SELECT TO authenticated
  USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners manage their organizations" ON public.organizations;
CREATE POLICY "Owners manage their organizations" ON public.organizations
  FOR ALL TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Users manage their organization membership" ON public.organization_members;
CREATE POLICY "Users manage their organization membership" ON public.organization_members
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Wedding members read weddings" ON public.weddings;
CREATE POLICY "Wedding members read weddings" ON public.weddings
  FOR SELECT TO authenticated
  USING (created_by = auth.uid() OR public.has_wedding_access(auth.uid(), id));

DROP POLICY IF EXISTS "Users create weddings" ON public.weddings;
CREATE POLICY "Users create weddings" ON public.weddings
  FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Wedding members update weddings" ON public.weddings;
CREATE POLICY "Wedding members update weddings" ON public.weddings
  FOR UPDATE TO authenticated
  USING (created_by = auth.uid() OR public.has_wedding_access(auth.uid(), id));

DROP POLICY IF EXISTS "Creators delete weddings" ON public.weddings;
CREATE POLICY "Creators delete weddings" ON public.weddings
  FOR DELETE TO authenticated
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users manage their wedding membership" ON public.wedding_members;
CREATE POLICY "Users manage their wedding membership" ON public.wedding_members
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 6. Colonnes wedding_id sur les tables du périmètre ------------------------
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
    -- Policy additive : accès en plus des règles existantes basées sur user_id
    EXECUTE format('DROP POLICY IF EXISTS "Wedding members access %s" ON public.%I', t, t);
    EXECUTE format(
      'CREATE POLICY "Wedding members access %s" ON public.%I FOR ALL TO authenticated
         USING (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id))
         WITH CHECK (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id))', t, t);
  END LOOP;
END $$;

-- 7. Tables de persistance des outils autrefois locaux ----------------------
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

DROP TRIGGER IF EXISTS update_weddings_updated_at ON public.weddings;
CREATE TRIGGER update_weddings_updated_at
  BEFORE UPDATE ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Migration des données existantes ---------------------------------------
-- Un mariage "par défaut" par utilisateur ayant un profil.
INSERT INTO public.weddings (created_by, title, wedding_date, guest_count, is_default)
SELECT p.id,
       COALESCE(NULLIF(TRIM(CONCAT_WS(' & ', p.first_name, p.last_name)), ''), 'Mon mariage'),
       p.wedding_date,
       p.guest_count,
       true
FROM public.profiles p
WHERE NOT EXISTS (
  SELECT 1 FROM public.weddings w WHERE w.created_by = p.id AND w.is_default
);

INSERT INTO public.wedding_members (wedding_id, user_id, role)
SELECT w.id, w.created_by, 'owner'
FROM public.weddings w
ON CONFLICT (wedding_id, user_id) DO NOTHING;

-- Rattachement des lignes existantes au mariage par défaut de leur propriétaire.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'budgets_dashboard','budgets_detail','checklist_mariage_manuel','vendors_tracking',
    'wedding_guest_list','wedding_rsvp_events','wedding_coordination','seating_plans',
    'wedding_accommodations','wedding_documents','qr_codes','guest_albums'
  ] LOOP
    EXECUTE format(
      'UPDATE public.%I tbl SET wedding_id = w.id
         FROM public.weddings w
        WHERE w.created_by = tbl.user_id AND w.is_default AND tbl.wedding_id IS NULL', t);
  END LOOP;
END $$;

-- 9. Le type de compte choisi à l'inscription est repris sur le profil -------
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
  RETURN new;
END;
$function$;
