CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, referral_source, registration_purpose, account_type, preferred_language)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'referral_source',
    new.raw_user_meta_data ->> 'registration_purpose',
    COALESCE(NULLIF(new.raw_user_meta_data ->> 'account_type', ''), 'b2c'),
    CASE WHEN (new.raw_user_meta_data ->> 'preferred_language') = 'en' THEN 'en' ELSE 'fr' END
  );

  INSERT INTO public.weddings (id, owner_id, title, is_default)
  VALUES (new.id, new.id, 'Mon mariage', true)
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;