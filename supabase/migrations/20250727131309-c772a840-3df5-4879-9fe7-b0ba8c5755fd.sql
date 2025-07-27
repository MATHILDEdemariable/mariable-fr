-- Phase 1: Sécurité Database CRITIQUE - Correction syntaxe
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
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update prestataires meta" 
ON public.prestataires_meta 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete prestataires meta" 
ON public.prestataires_meta 
FOR DELETE 
USING (is_admin());

-- Table prestataires_photos
ALTER TABLE public.prestataires_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prestataires photos" 
ON public.prestataires_photos 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert prestataires photos" 
ON public.prestataires_photos 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update prestataires photos" 
ON public.prestataires_photos 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete prestataires photos" 
ON public.prestataires_photos 
FOR DELETE 
USING (is_admin());

-- Table prestataires_brochures
ALTER TABLE public.prestataires_brochures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view prestataires brochures" 
ON public.prestataires_brochures 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert prestataires brochures" 
ON public.prestataires_brochures 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update prestataires brochures" 
ON public.prestataires_brochures 
FOR UPDATE 
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete prestataires brochures" 
ON public.prestataires_brochures 
FOR DELETE 
USING (is_admin());