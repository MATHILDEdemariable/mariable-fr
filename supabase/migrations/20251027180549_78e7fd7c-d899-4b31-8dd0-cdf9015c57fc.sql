-- Ajouter la colonne phone à la table profiles pour stocker les numéros de téléphone
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT;

-- Ajouter un commentaire pour documentation
COMMENT ON COLUMN public.profiles.phone IS 'Numéro de téléphone de l''utilisateur (optionnel)';