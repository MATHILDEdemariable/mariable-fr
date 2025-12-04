-- Add type_selection column to carnet_adresses_requests
ALTER TABLE public.carnet_adresses_requests 
ADD COLUMN type_selection text;