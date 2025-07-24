-- Ajouter une colonne slug à la table wedding_coordination
ALTER TABLE public.wedding_coordination 
ADD COLUMN slug text;

-- Créer un index unique sur la colonne slug
CREATE UNIQUE INDEX wedding_coordination_slug_unique ON public.wedding_coordination(slug);

-- Fonction pour générer un slug unique
CREATE OR REPLACE FUNCTION public.generate_coordination_slug(title_input text, coordination_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 0;
BEGIN
  -- Nettoyer le titre pour créer le slug de base
  base_slug := lower(trim(title_input));
  base_slug := regexp_replace(base_slug, '[^a-z0-9\s\-]', '', 'g');
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := regexp_replace(base_slug, '-+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Si le slug est vide, utiliser un défaut
  IF base_slug = '' OR base_slug IS NULL THEN
    base_slug := 'planning-mariage';
  END IF;
  
  final_slug := base_slug;
  
  -- Vérifier l'unicité et ajouter un suffixe si nécessaire
  WHILE EXISTS (
    SELECT 1 FROM public.wedding_coordination 
    WHERE slug = final_slug 
    AND (coordination_id IS NULL OR id != coordination_id)
  ) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

-- Générer des slugs pour les coordinations existantes
UPDATE public.wedding_coordination 
SET slug = public.generate_coordination_slug(title, id)
WHERE slug IS NULL;

-- Trigger pour générer automatiquement le slug lors de l'insertion
CREATE OR REPLACE FUNCTION public.set_coordination_slug()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug := public.generate_coordination_slug(NEW.title, NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER coordination_set_slug
  BEFORE INSERT ON public.wedding_coordination
  FOR EACH ROW
  EXECUTE FUNCTION public.set_coordination_slug();