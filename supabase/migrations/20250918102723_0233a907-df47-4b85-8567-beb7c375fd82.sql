-- Create table for Google Maps URLs to process
CREATE TABLE public.google_maps_urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  categorie TEXT NOT NULL DEFAULT 'Lieu de réception',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'error')),
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.google_maps_urls ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage URLs
CREATE POLICY "Admins can manage google maps urls" 
ON public.google_maps_urls 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Add index for performance
CREATE INDEX idx_google_maps_urls_status ON public.google_maps_urls(status);
CREATE INDEX idx_google_maps_urls_created_at ON public.google_maps_urls(created_at);