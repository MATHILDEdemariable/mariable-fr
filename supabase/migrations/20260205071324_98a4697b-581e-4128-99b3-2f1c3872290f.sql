-- Allow visitors to read RSVP responses they just inserted
-- This fixes the RLS error when using .select() after INSERT
CREATE POLICY "Public can read recently inserted response" 
ON public.wedding_rsvp_responses 
FOR SELECT 
USING (
  submitted_at > now() - interval '10 seconds'
);