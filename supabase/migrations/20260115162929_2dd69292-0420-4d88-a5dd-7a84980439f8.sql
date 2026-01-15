-- Ajouter la colonne registration_purpose à profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS registration_purpose TEXT;

-- Mettre à jour le trigger handle_new_user pour copier registration_purpose
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public 
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, referral_source, registration_purpose)
  VALUES (
    new.id, 
    new.raw_user_meta_data ->> 'first_name', 
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'referral_source',
    new.raw_user_meta_data ->> 'registration_purpose'
  );
  RETURN new;
END;
$$;