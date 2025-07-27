-- Phase 1: Sécurité Database CRITIQUE
-- Activer RLS sur toutes les tables vulnérables

-- Table admin_access_tokens
ALTER TABLE public.admin_access_tokens ENABLE ROW LEVEL SECURITY;

-- Politique pour admin_access_tokens - seuls les admins peuvent gérer les tokens
CREATE POLICY "Admins can manage access tokens" 
ON public.admin_access_tokens 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Table prestataires
ALTER TABLE public.prestataires ENABLE ROW LEVEL SECURITY;

-- Politiques pour prestataires
CREATE POLICY "Public can view visible prestataires" 
ON public.prestataires 
FOR SELECT 
USING (visible = true);

CREATE POLICY "Admins can manage all prestataires" 
ON public.prestataires 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Table prestataires_meta
ALTER TABLE public.prestataires_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prestataires meta" 
ON public.prestataires_meta 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage prestataires meta" 
ON public.prestataires_meta 
FOR INSERT, UPDATE, DELETE 
USING (is_admin())
WITH CHECK (is_admin());

-- Table prestataires_photos
ALTER TABLE public.prestataires_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prestataires photos" 
ON public.prestataires_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage prestataires photos" 
ON public.prestataires_photos 
FOR INSERT, UPDATE, DELETE 
USING (is_admin())
WITH CHECK (is_admin());

-- Table prestataires_brochures
ALTER TABLE public.prestataires_brochures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prestataires brochures" 
ON public.prestataires_brochures 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage prestataires brochures" 
ON public.prestataires_brochures 
FOR INSERT, UPDATE, DELETE 
USING (is_admin())
WITH CHECK (is_admin());

-- Table prestataires_documents_preprod
ALTER TABLE public.prestataires_documents_preprod ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage prestataires documents" 
ON public.prestataires_documents_preprod 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Sécuriser les fonctions de base de données en ajoutant SET search_path
CREATE OR REPLACE FUNCTION public.update_todos_planification_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_user_premium(user_uuid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
    AND subscription_type = 'premium'
    AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  RETURN new;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_user_progress_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_budgets_detail_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_jour_m_reservations_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public."notifyNewReservationJourM"()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notifyNewReservationJourM',  
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_paiement_accompagnement_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Retourne faux si aucun utilisateur n'est authentifié
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_modified_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_planning_responses_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_coordination_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_derniere_contact()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.type_action IN ('appel', 'email') THEN
    UPDATE public.prestataires 
    SET date_derniere_contact = NEW.date_action 
    WHERE id = NEW.prestataire_id;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_derniere_contact_rows()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.type_action IN ('appel', 'email') THEN
    UPDATE public.prestataires_rows 
    SET date_derniere_contact = NEW.date_action 
    WHERE id = NEW.prestataire_id;
  END IF;
  RETURN NEW;
END;
$function$;