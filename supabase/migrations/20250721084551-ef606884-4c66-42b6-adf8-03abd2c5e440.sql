
-- Ajouter les colonnes pour les avis Google dans la table prestataires_rows
ALTER TABLE public.prestataires_rows 
ADD COLUMN google_rating NUMERIC(2,1),
ADD COLUMN google_reviews_count INTEGER,
ADD COLUMN google_place_id TEXT,
ADD COLUMN google_business_url TEXT;

-- Ajouter les données pour les coordinateurs existants
UPDATE public.prestataires_rows 
SET 
  google_rating = 4.9,
  google_reviews_count = 36,
  google_business_url = 'https://g.page/virginie-coordination-mariage'
WHERE nom = 'Virginie Martin' AND categorie = 'Coordination';

UPDATE public.prestataires_rows 
SET 
  google_rating = 4.8,
  google_reviews_count = 28,
  google_business_url = 'https://g.page/louise-coordination-events'
WHERE nom = 'Louise Dubois' AND categorie = 'Coordination';

-- Mettre à jour Emma Dubois aussi (fallback du code)
UPDATE public.prestataires_rows 
SET 
  google_rating = 4.7,
  google_reviews_count = 22,
  google_business_url = 'https://g.page/emma-coordination-lyon'
WHERE nom = 'Emma Dubois' AND categorie = 'Coordination';

-- Mettre à jour Claire Moreau aussi (fallback du code)
UPDATE public.prestataires_rows 
SET 
  google_rating = 4.6,
  google_reviews_count = 18,
  google_business_url = 'https://g.page/claire-coordination-bordeaux'
WHERE nom = 'Claire Moreau' AND categorie = 'Coordination';
