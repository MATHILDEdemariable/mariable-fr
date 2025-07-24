-- Créer la table jeunes_maries
CREATE TABLE public.jeunes_maries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_complet TEXT NOT NULL,
  email TEXT NOT NULL,
  telephone TEXT,
  lieu_mariage TEXT NOT NULL,
  date_mariage DATE NOT NULL,
  nombre_invites INTEGER,
  budget_approximatif TEXT,
  photo_principale_url TEXT,
  photos_mariage JSONB DEFAULT '[]'::jsonb,
  experience_partagee TEXT,
  conseils_couples TEXT,
  prestataires_recommandes JSONB DEFAULT '[]'::jsonb,
  note_experience INTEGER CHECK (note_experience >= 1 AND note_experience <= 5),
  slug TEXT UNIQUE,
  visible BOOLEAN DEFAULT false,
  status_moderation TEXT DEFAULT 'en_attente' CHECK (status_moderation IN ('en_attente', 'approuve', 'rejete')),
  date_soumission TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date_approbation TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.jeunes_maries ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour la sécurité
CREATE POLICY "Public peut voir les profils approuvés et visibles"
ON public.jeunes_maries
FOR SELECT
USING (status_moderation = 'approuve' AND visible = true);

CREATE POLICY "Admins peuvent tout voir et modifier"
ON public.jeunes_maries
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Insertion publique autorisée"
ON public.jeunes_maries
FOR INSERT
WITH CHECK (true);

-- Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION public.generate_jeunes_maries_slug(nom_input text, jeune_marie_id uuid DEFAULT NULL::uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Nettoyer le nom pour créer le slug de base
  base_slug := lower(trim(nom_input));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s\-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Si le slug est vide, utiliser un défaut
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'jeunes-maries';
  END IF;
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un suffixe si nécessaire
  WHILE EXISTS (
    SELECT 1 FROM public.jeunes_maries 
    WHERE slug = final_slug 
    AND (jeune_marie_id IS NULL OR id != jeune_marie_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$function$;

-- Trigger pour générer automatiquement le slug
CREATE OR REPLACE FUNCTION public.set_jeunes_maries_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := public.generate_jeunes_maries_slug(NEW.nom_complet, NEW.id);
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER trigger_set_jeunes_maries_slug
  BEFORE INSERT OR UPDATE ON public.jeunes_maries
  FOR EACH ROW
  EXECUTE FUNCTION public.set_jeunes_maries_slug();

-- Trigger pour updated_at
CREATE TRIGGER update_jeunes_maries_updated_at
  BEFORE UPDATE ON public.jeunes_maries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();