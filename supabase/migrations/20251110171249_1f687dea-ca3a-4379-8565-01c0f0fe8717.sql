-- Drop trigger first, then function, then recreate both with search_path
DROP TRIGGER IF EXISTS update_partnership_requests_updated_at ON public.partnership_requests;
DROP FUNCTION IF EXISTS public.update_partnership_requests_updated_at();

-- Recreate function with search_path
CREATE OR REPLACE FUNCTION public.update_partnership_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Recreate trigger
CREATE TRIGGER update_partnership_requests_updated_at
BEFORE UPDATE ON public.partnership_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_partnership_requests_updated_at();