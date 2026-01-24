-- Drop existing constraint and add new types for problem reports
ALTER TABLE public.contact_requests 
DROP CONSTRAINT IF EXISTS contact_requests_type_check;

ALTER TABLE public.contact_requests 
ADD CONSTRAINT contact_requests_type_check 
CHECK (type IN (
  'couple', 'lieu', 'marque', 'prestataire',
  'bug', 'feature', 'account', 'suggestion', 'other'
));