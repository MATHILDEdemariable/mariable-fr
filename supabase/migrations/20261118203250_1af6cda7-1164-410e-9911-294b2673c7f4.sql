ALTER TABLE public.prestataires_rows
  ADD COLUMN IF NOT EXISTS owner_user_id uuid UNIQUE,
  ADD COLUMN IF NOT EXISTS instagram text,
  ADD COLUMN IF NOT EXISTS photo_portrait_url text;

-- Le pro propriétaire lit, crée et modifie sa propre fiche
CREATE POLICY "prestataires_rows: owner read" ON public.prestataires_rows
  FOR SELECT TO authenticated USING (owner_user_id = auth.uid());
CREATE POLICY "prestataires_rows: owner insert" ON public.prestataires_rows
  FOR INSERT TO authenticated WITH CHECK (owner_user_id = auth.uid());
CREATE POLICY "prestataires_rows: owner update" ON public.prestataires_rows
  FOR UPDATE TO authenticated USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

-- Un pro ne peut jamais publier lui-même sa fiche : validation admin obligatoire
CREATE OR REPLACE FUNCTION public.guard_owner_prestataire_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin() OR auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    NEW.visible := false;
    NEW.status_crm := 'a_valider';
    NEW.featured := false;
    NEW.partner := false;
    NEW.source_inscription := 'fiche_guide_pro';
  ELSE
    NEW.visible := OLD.visible;
    NEW.status_crm := OLD.status_crm;
    NEW.featured := OLD.featured;
    NEW.partner := OLD.partner;
    NEW.slug := OLD.slug;
    NEW.owner_user_id := OLD.owner_user_id;
  END IF;
  RETURN NEW;
END $$;

CREATE TRIGGER guard_owner_prestataire_fields
  BEFORE INSERT OR UPDATE ON public.prestataires_rows
  FOR EACH ROW EXECUTE FUNCTION public.guard_owner_prestataire_fields();

-- Photos portrait des pros : dossier guide/<uid>/
CREATE POLICY "Pro uploads own guide portrait" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'prestataires-photos' AND (storage.foldername(name))[1] = 'guide' AND (storage.foldername(name))[2] = auth.uid()::text);