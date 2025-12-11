-- Create contact_requests table
CREATE TABLE public.contact_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('couple', 'lieu', 'marque', 'prestataire')),
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'nouveau',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert (public contact form)
CREATE POLICY "Allow public insert for contact requests" 
ON public.contact_requests 
FOR INSERT 
WITH CHECK (true);

-- Allow admin read
CREATE POLICY "Allow admin read for contact requests" 
ON public.contact_requests 
FOR SELECT 
USING (public.is_admin());

-- Allow admin update
CREATE POLICY "Allow admin update for contact requests" 
ON public.contact_requests 
FOR UPDATE 
USING (public.is_admin());

-- Trigger for updated_at
CREATE TRIGGER update_contact_requests_updated_at
BEFORE UPDATE ON public.contact_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();