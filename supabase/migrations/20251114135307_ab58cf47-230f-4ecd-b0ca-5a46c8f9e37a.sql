-- Ajouter le champ thumbnail_url pour stocker les miniatures optimisées
ALTER TABLE public.prestataires_photos_preprod 
ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- Ajouter un index pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_prestataires_photos_thumbnail 
ON public.prestataires_photos_preprod(thumbnail_url) 
WHERE thumbnail_url IS NOT NULL;