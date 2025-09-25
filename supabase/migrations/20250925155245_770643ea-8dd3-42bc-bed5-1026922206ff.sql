-- Ajouter une colonne status à la table vendor_contact_requests
ALTER TABLE public.vendor_contact_requests 
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending', 'processed'));