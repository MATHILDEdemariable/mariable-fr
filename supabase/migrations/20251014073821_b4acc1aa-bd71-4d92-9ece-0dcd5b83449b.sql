-- Ajouter les colonnes pour distinction adultes/enfants dans wedding_rsvp_responses
ALTER TABLE public.wedding_rsvp_responses 
ADD COLUMN number_of_adults INTEGER DEFAULT 1,
ADD COLUMN number_of_children INTEGER DEFAULT 0;

-- Migrer les données existantes : mettre number_of_guests dans adults
UPDATE public.wedding_rsvp_responses 
SET number_of_adults = COALESCE(number_of_guests, 1),
    number_of_children = 0
WHERE number_of_adults IS NULL;

-- Commentaire sur les colonnes
COMMENT ON COLUMN public.wedding_rsvp_responses.number_of_adults IS 'Nombre d''adultes confirmés';
COMMENT ON COLUMN public.wedding_rsvp_responses.number_of_children IS 'Nombre d''enfants confirmés';