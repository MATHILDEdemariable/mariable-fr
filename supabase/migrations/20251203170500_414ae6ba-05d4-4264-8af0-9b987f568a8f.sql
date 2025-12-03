-- Ajouter les colonnes whatsapp et consent_contact à la table carnet_adresses_requests
ALTER TABLE public.carnet_adresses_requests 
ADD COLUMN whatsapp text,
ADD COLUMN consent_contact boolean DEFAULT false;