-- Champs d'identité professionnelle sur le profil (additif, sans impact B2C)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS company_name text,
  ADD COLUMN IF NOT EXISTS city text;

-- Sécurise les valeurs possibles du type de compte
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_account_type_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_account_type_check
  CHECK (account_type IN ('b2c', 'b2b'));

-- Rattrapage : comptes déjà inscrits en tant que professionnel
UPDATE public.profiles p
SET account_type = 'b2b'
FROM auth.users u
WHERE u.id = p.id
  AND COALESCE(u.raw_user_meta_data ->> 'account_type', '') = 'b2b'
  AND p.account_type IS DISTINCT FROM 'b2b';
