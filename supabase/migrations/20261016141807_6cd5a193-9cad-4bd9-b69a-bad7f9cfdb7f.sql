CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _account_type text := COALESCE(NULLIF(new.raw_user_meta_data ->> 'account_type', ''), 'b2c');
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, phone, referral_source, registration_purpose, account_type, preferred_language)
  VALUES (new.id, new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'referral_source', new.raw_user_meta_data ->> 'registration_purpose', _account_type,
    CASE WHEN (new.raw_user_meta_data ->> 'preferred_language') = 'en' THEN 'en' ELSE 'fr' END);

  -- Les pros créent eux-mêmes leurs mariages (choix Jour J / Organisation complète)
  IF _account_type <> 'b2b' THEN
    INSERT INTO public.weddings (id, owner_id, title, is_default)
    VALUES (new.id, new.id, 'Mon mariage', true) ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$function$;

CREATE POLICY "Collaborators edit wedding_accommodations" ON public.wedding_accommodations
  FOR ALL TO authenticated
  USING (public.is_wedding_collaborator(auth.uid(), wedding_id))
  WITH CHECK (public.is_wedding_collaborator(auth.uid(), wedding_id));

CREATE POLICY "Collaborators manage accommodation_assignments" ON public.accommodation_assignments
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wedding_accommodations a WHERE a.id = accommodation_id AND (a.user_id = auth.uid() OR public.has_wedding_access(auth.uid(), a.wedding_id) OR public.is_wedding_collaborator(auth.uid(), a.wedding_id))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.wedding_accommodations a WHERE a.id = accommodation_id AND (a.user_id = auth.uid() OR public.has_wedding_access(auth.uid(), a.wedding_id) OR public.is_wedding_collaborator(auth.uid(), a.wedding_id))));