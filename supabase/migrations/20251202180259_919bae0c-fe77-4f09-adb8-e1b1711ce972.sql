-- D'abord supprimer la valeur par défaut
ALTER TABLE public.wedding_retroplanning 
ALTER COLUMN progress DROP DEFAULT;

-- Puis changer le type de la colonne progress de INTEGER vers JSONB
ALTER TABLE public.wedding_retroplanning 
ALTER COLUMN progress TYPE JSONB 
USING CASE 
  WHEN progress IS NULL THEN '{}'::jsonb
  WHEN progress = 0 THEN '{}'::jsonb 
  ELSE jsonb_build_object('legacy_progress', progress) 
END;

-- Remettre une nouvelle valeur par défaut en JSONB
ALTER TABLE public.wedding_retroplanning 
ALTER COLUMN progress SET DEFAULT '{}'::jsonb;