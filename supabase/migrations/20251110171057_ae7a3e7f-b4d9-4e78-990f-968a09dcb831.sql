-- Create partnership_requests table
CREATE TABLE public.partnership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT,
  phone TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- Public can insert partnership requests
CREATE POLICY "Public can insert partnership requests"
ON public.partnership_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can view all partnership requests
CREATE POLICY "Admins can view partnership requests"
ON public.partnership_requests
FOR SELECT
TO authenticated
USING (is_admin());

-- Admins can update partnership requests
CREATE POLICY "Admins can update partnership requests"
ON public.partnership_requests
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for faster queries
CREATE INDEX idx_partnership_requests_status ON public.partnership_requests(status);
CREATE INDEX idx_partnership_requests_created_at ON public.partnership_requests(created_at DESC);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION public.update_partnership_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_partnership_requests_updated_at
BEFORE UPDATE ON public.partnership_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_partnership_requests_updated_at();