-- Add new columns to carnet_adresses_requests table for extended form
ALTER TABLE public.carnet_adresses_requests 
ADD COLUMN categories_prestataires jsonb DEFAULT '[]'::jsonb,
ADD COLUMN commentaires text;