-- Créer la table pour les pages personnalisées
CREATE TABLE public.custom_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  iframe_code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.custom_pages ENABLE ROW LEVEL SECURITY;

-- Politique pour les admins
CREATE POLICY "Admins can manage custom pages" 
ON public.custom_pages 
FOR ALL 
USING (is_admin()) 
WITH CHECK (is_admin());

-- Politique pour lecture publique des pages actives
CREATE POLICY "Public can view active custom pages" 
ON public.custom_pages 
FOR SELECT 
USING (is_active = true);

-- Trigger pour updated_at
CREATE TRIGGER update_custom_pages_updated_at
BEFORE UPDATE ON public.custom_pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();