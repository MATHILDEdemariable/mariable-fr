ALTER TABLE public.prestataires_rows ADD COLUMN IF NOT EXISTS pays text DEFAULT 'France';

CREATE OR REPLACE FUNCTION public.guard_owner_prestataire_fields()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_admin() OR auth.uid() IS NULL THEN RETURN NEW; END IF;
  IF TG_OP = 'INSERT' THEN
    -- Publication immédiate dans le catalogue, sans validation
    NEW.visible := true;
    NEW.status_crm := 'actif';
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
REVOKE EXECUTE ON FUNCTION public.guard_owner_prestataire_fields() FROM PUBLIC, anon, authenticated;

UPDATE public.prestataires_rows SET visible = true, status_crm = 'actif'
WHERE source_inscription = 'fiche_guide_pro' AND owner_user_id IS NOT NULL AND status_crm = 'a_valider';