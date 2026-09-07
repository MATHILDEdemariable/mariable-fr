-- Champs d'identité professionnelle sur le profil (additif, sans impact B2C)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS city text;
