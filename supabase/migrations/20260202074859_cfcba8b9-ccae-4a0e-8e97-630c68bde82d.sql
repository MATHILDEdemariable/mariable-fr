-- Ajouter une politique RLS permettant au public de lire les sous-événements
-- Cela corrige le bug où les visiteurs anonymes ne voyaient pas les sous-événements dans le formulaire RSVP

CREATE POLICY "Public can view sub_events" 
ON public.wedding_rsvp_sub_events 
FOR SELECT 
USING (true);