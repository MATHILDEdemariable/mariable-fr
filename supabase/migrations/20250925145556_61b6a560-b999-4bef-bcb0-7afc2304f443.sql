-- Créer la table pour les demandes de contact aux prestataires
CREATE TABLE public.vendor_contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  wedding_date_text TEXT NOT NULL,
  message TEXT NOT NULL,
  vendor_id UUID NOT NULL,
  vendor_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vendor_contact_requests ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (sans connexion)
CREATE POLICY "Public can insert vendor contact requests" 
ON public.vendor_contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Politique pour que les admins puissent voir toutes les demandes
CREATE POLICY "Admins can view all vendor contact requests" 
ON public.vendor_contact_requests 
FOR SELECT 
USING (is_admin());

-- Trigger pour mettre à jour updated_at
CREATE TRIGGER update_vendor_contact_requests_updated_at
BEFORE UPDATE ON public.vendor_contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();