-- Migration: Ajout du champ referral_source pour capturer la source d'acquisition des utilisateurs

-- Étape 1: Ajouter la colonne referral_source à la table profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_source TEXT;

-- Étape 2: Créer un commentaire pour documenter la colonne
COMMENT ON COLUMN profiles.referral_source IS 'Source d''acquisition de l''utilisateur (Instagram, TikTok, Facebook, LinkedIn, Pinterest, Google, Bouche à oreille, Autre)';

-- Étape 3: Mettre à jour la fonction handle_new_user pour inclure referral_source
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name,
    phone,
    referral_source
  )
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'referral_source'
  );
  RETURN new;
END;
$$;