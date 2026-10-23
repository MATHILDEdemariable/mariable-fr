-- 1. Suivi prestataires
ALTER TYPE public.vendor_status ADD VALUE IF NOT EXISTS 'validé';

ALTER TABLE public.vendors_tracking_preprod ADD COLUMN IF NOT EXISTS wedding_id uuid;
CREATE INDEX IF NOT EXISTS idx_vendors_tracking_preprod_wedding ON public.vendors_tracking_preprod(wedding_id);

UPDATE public.vendors_tracking_preprod v SET wedding_id = v.user_id
WHERE v.wedding_id IS NULL AND EXISTS (SELECT 1 FROM public.weddings w WHERE w.id = v.user_id);

CREATE POLICY "Owners update own vendor tracking" ON public.vendors_tracking_preprod
  FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owners delete own vendor tracking" ON public.vendors_tracking_preprod
  FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Wedding owners access vendors_tracking_preprod" ON public.vendors_tracking_preprod
  FOR ALL TO authenticated USING (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (wedding_id IS NOT NULL AND public.has_wedding_access(auth.uid(), wedding_id));
CREATE POLICY "Planner collaborators edit vendors_tracking_preprod" ON public.vendors_tracking_preprod
  FOR ALL TO authenticated USING (public.is_wedding_planner_collaborator(auth.uid(), wedding_id))
  WITH CHECK (public.is_wedding_planner_collaborator(auth.uid(), wedding_id));
CREATE POLICY "Collaborators read vendors_tracking_preprod" ON public.vendors_tracking_preprod
  FOR SELECT TO authenticated USING (public.is_wedding_collaborator(auth.uid(), wedding_id));

-- 2. Colonnes de liaison
ALTER TABLE public.coordination_team ADD COLUMN IF NOT EXISTS photo_url text;
ALTER TABLE public.coordination_team ADD COLUMN IF NOT EXISTS source_vendor_id uuid;
ALTER TABLE public.checklist_mariage_manuel ADD COLUMN IF NOT EXISTS source_vendor_id uuid;
ALTER TABLE public.coordination_planning ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending';
ALTER TABLE public.coordination_planning ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Rattache automatiquement une nouvelle ligne de suivi au mariage par défaut du couple
CREATE OR REPLACE FUNCTION public.set_vendor_tracking_wedding()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.wedding_id IS NULL AND NEW.user_id IS NOT NULL
     AND EXISTS (SELECT 1 FROM weddings w WHERE w.id = NEW.user_id) THEN
    NEW.wedding_id := NEW.user_id;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER set_vendor_tracking_wedding BEFORE INSERT ON public.vendors_tracking_preprod
  FOR EACH ROW EXECUTE FUNCTION public.set_vendor_tracking_wedding();

-- Suivi → Checklist / Équipe Jour J
CREATE OR REPLACE FUNCTION public.sync_vendor_tracking_links()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _status text := NEW.status::text; _coordination_id uuid; _category text;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status IS NOT DISTINCT FROM OLD.status THEN RETURN NEW; END IF;

  IF _status = 'à contacter' THEN
    IF NOT EXISTS (SELECT 1 FROM checklist_mariage_manuel WHERE source_vendor_id = NEW.id) THEN
      _category := CASE
        WHEN NEW.category ILIKE '%traiteur%' OR NEW.category ILIKE '%food%' OR NEW.category ILIKE '%cocktail%' THEN 'traiteur'
        WHEN NEW.category ILIKE '%lieu%' OR NEW.category ILIKE '%domaine%' THEN 'lieu'
        WHEN NEW.category ILIKE '%photo%' OR NEW.category ILIKE '%vid%' THEN 'image'
        WHEN NEW.category ILIKE '%fleur%' OR NEW.category ILIKE '%déco%' OR NEW.category ILIKE '%deco%' THEN 'decorations'
        WHEN NEW.category ILIKE '%robe%' OR NEW.category ILIKE '%costume%' THEN 'tenues'
        WHEN NEW.category ILIKE '%beaut%' OR NEW.category ILIKE '%coiff%' OR NEW.category ILIKE '%maquill%' THEN 'beaute'
        ELSE 'autres' END;
      INSERT INTO checklist_mariage_manuel (user_id, wedding_id, title, category, status, priority, completed, position, source_vendor_id)
      VALUES (NEW.user_id, NEW.wedding_id, 'Contacter ' || NEW.vendor_name, _category, 'pending', 'medium', false, 0, NEW.id);
    ELSE
      UPDATE checklist_mariage_manuel SET status = 'pending', completed = false, updated_at = now() WHERE source_vendor_id = NEW.id;
    END IF;
  ELSE
    UPDATE checklist_mariage_manuel SET status = 'completed', completed = true, updated_at = now()
    WHERE source_vendor_id = NEW.id AND completed = false;
  END IF;

  IF _status = 'validé' THEN
    IF NEW.wedding_id IS NOT NULL THEN
      SELECT id INTO _coordination_id FROM wedding_coordination WHERE wedding_id = NEW.wedding_id ORDER BY created_at DESC LIMIT 1;
    END IF;
    IF _coordination_id IS NULL THEN
      SELECT id INTO _coordination_id FROM wedding_coordination WHERE user_id = NEW.user_id ORDER BY created_at DESC LIMIT 1;
    END IF;
    IF _coordination_id IS NOT NULL AND NOT EXISTS (
      SELECT 1 FROM coordination_team WHERE coordination_id = _coordination_id
        AND (source_vendor_id = NEW.id OR lower(name) = lower(NEW.vendor_name))
    ) THEN
      INSERT INTO coordination_team (coordination_id, name, role, type, email, phone, source_vendor_id, notes)
      VALUES (_coordination_id, NEW.vendor_name, 'Prestataires : ' || COALESCE(NULLIF(NEW.category, ''), 'Autre'), 'vendor',
              NULLIF(COALESCE(NEW.email, NEW.email_presta), ''), NULLIF(NEW.phone, ''), NEW.id, 'Ajouté depuis le suivi des prestataires');
    END IF;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER sync_vendor_tracking_links AFTER INSERT OR UPDATE OF status ON public.vendors_tracking_preprod
  FOR EACH ROW EXECUTE FUNCTION public.sync_vendor_tracking_links();

-- 3. Trombinoscope
CREATE TABLE public.wedding_key_people (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id uuid NOT NULL,
  user_id uuid NOT NULL,
  full_name text NOT NULL,
  key_role text NOT NULL DEFAULT 'Famille',
  phone text,
  photo_url text,
  notes text,
  position integer NOT NULL DEFAULT 0,
  team_member_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_key_people TO authenticated;
GRANT ALL ON public.wedding_key_people TO service_role;
ALTER TABLE public.wedding_key_people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members manage key people" ON public.wedding_key_people FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id) OR user_id = auth.uid())
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id) OR user_id = auth.uid());
CREATE INDEX idx_wedding_key_people_wedding ON public.wedding_key_people(wedding_id);
CREATE TRIGGER update_wedding_key_people_updated_at BEFORE UPDATE ON public.wedding_key_people
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Décoration
CREATE TABLE public.wedding_decor_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id uuid NOT NULL,
  user_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'ambiance',
  zone text NOT NULL DEFAULT 'diner',
  responsible text NOT NULL DEFAULT 'couple',
  status text NOT NULL DEFAULT 'to_find',
  quantity integer,
  notes text,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_decor_items TO authenticated;
GRANT ALL ON public.wedding_decor_items TO service_role;
ALTER TABLE public.wedding_decor_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members manage decor items" ON public.wedding_decor_items FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id) OR user_id = auth.uid())
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id) OR user_id = auth.uid());
CREATE INDEX idx_wedding_decor_items_wedding ON public.wedding_decor_items(wedding_id);
CREATE TRIGGER update_wedding_decor_items_updated_at BEFORE UPDATE ON public.wedding_decor_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Validations vers le Jour J
CREATE TABLE public.wedding_jour_j_handoffs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id uuid NOT NULL,
  module text NOT NULL,
  validated_by uuid,
  validated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (wedding_id, module)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_jour_j_handoffs TO authenticated;
GRANT ALL ON public.wedding_jour_j_handoffs TO service_role;
ALTER TABLE public.wedding_jour_j_handoffs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members manage handoffs" ON public.wedding_jour_j_handoffs FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) OR public.is_wedding_collaborator(auth.uid(), wedding_id));
CREATE TRIGGER update_wedding_jour_j_handoffs_updated_at BEFORE UPDATE ON public.wedding_jour_j_handoffs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.validate_jour_j_module()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.module NOT IN ('seating','drinks','decor','trombinoscope') THEN RAISE EXCEPTION 'Module invalide'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER validate_jour_j_module BEFORE INSERT OR UPDATE ON public.wedding_jour_j_handoffs
  FOR EACH ROW EXECUTE FUNCTION public.validate_jour_j_module();

-- Trombinoscope → équipe Jour J (le couple invité n'écrit pas directement dans l'équipe du pro)
CREATE OR REPLACE FUNCTION public.sync_key_people_to_jour_j(target_wedding_id uuid)
RETURNS integer LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _coordination_id uuid; _owner uuid; _person record; _team_id uuid; _count integer := 0;
BEGIN
  IF auth.uid() IS NULL OR NOT (has_wedding_access(auth.uid(), target_wedding_id) OR is_wedding_collaborator(auth.uid(), target_wedding_id)) THEN
    RAISE EXCEPTION 'Accès refusé';
  END IF;
  SELECT owner_id INTO _owner FROM weddings WHERE id = target_wedding_id;
  SELECT id INTO _coordination_id FROM wedding_coordination WHERE wedding_id = target_wedding_id ORDER BY created_at DESC LIMIT 1;
  IF _coordination_id IS NULL THEN
    INSERT INTO wedding_coordination (user_id, wedding_id, title, description)
    VALUES (COALESCE(_owner, auth.uid()), target_wedding_id, 'Mon Mariage', 'Organisation de mon mariage')
    RETURNING id INTO _coordination_id;
  END IF;

  FOR _person IN SELECT * FROM wedding_key_people WHERE wedding_id = target_wedding_id ORDER BY position, created_at LOOP
    _team_id := NULL;
    IF _person.team_member_id IS NOT NULL THEN
      UPDATE coordination_team SET name = _person.full_name, role = _person.key_role, phone = _person.phone,
             photo_url = _person.photo_url, notes = _person.notes, updated_at = now()
      WHERE id = _person.team_member_id AND coordination_id = _coordination_id
      RETURNING id INTO _team_id;
    END IF;
    IF _team_id IS NULL THEN
      INSERT INTO coordination_team (coordination_id, name, role, type, phone, photo_url, notes)
      VALUES (_coordination_id, _person.full_name, _person.key_role, 'person', _person.phone, _person.photo_url, _person.notes)
      RETURNING id INTO _team_id;
      UPDATE wedding_key_people SET team_member_id = _team_id WHERE id = _person.id;
    END IF;
    _count := _count + 1;
  END LOOP;

  INSERT INTO wedding_jour_j_handoffs (wedding_id, module, validated_by, validated_at)
  VALUES (target_wedding_id, 'trombinoscope', auth.uid(), now())
  ON CONFLICT (wedding_id, module) DO UPDATE SET validated_by = EXCLUDED.validated_by, validated_at = now();
  RETURN _count;
END; $$;

-- Planning public : renvoyer aussi les photos et statuts (to_jsonb transmet déjà toutes les colonnes)
ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_decor_items;