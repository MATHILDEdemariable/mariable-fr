-- Create table for carnet d'adresses requests
CREATE TABLE public.carnet_adresses_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  date_mariage DATE,
  region TEXT,
  nombre_invites TEXT,
  style_recherche TEXT,
  budget_approximatif TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.carnet_adresses_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for public insert (anyone can submit)
CREATE POLICY "Public can insert carnet adresses requests" 
ON public.carnet_adresses_requests 
FOR INSERT 
WITH CHECK (true);

-- Create policy for admin read access
CREATE POLICY "Admins can view carnet adresses requests" 
ON public.carnet_adresses_requests 
FOR SELECT 
USING (is_admin());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_carnet_adresses_requests_updated_at
  BEFORE UPDATE ON public.carnet_adresses_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();