-- Créer table pour les détails individuels des invités RSVP
CREATE TABLE IF NOT EXISTS public.wedding_rsvp_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.wedding_rsvp_responses(id) ON DELETE CASCADE,
  guest_first_name TEXT NOT NULL,
  guest_last_name TEXT NOT NULL,
  guest_type TEXT NOT NULL CHECK (guest_type IN ('adult', 'child')),
  dietary_restrictions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_rsvp_guests_response_id ON public.wedding_rsvp_guests(response_id);

-- RLS Policies
ALTER TABLE public.wedding_rsvp_guests ENABLE ROW LEVEL SECURITY;

-- Public peut insérer des invités pour leurs réponses
CREATE POLICY "Public can insert guests for their response"
  ON public.wedding_rsvp_guests
  FOR INSERT
  WITH CHECK (true);

-- Les utilisateurs peuvent voir les invités de leurs événements
CREATE POLICY "Users can view guests for their events"
  ON public.wedding_rsvp_guests
  FOR SELECT
  USING (
    response_id IN (
      SELECT r.id FROM public.wedding_rsvp_responses r
      JOIN public.wedding_rsvp_events e ON r.event_id = e.id
      WHERE e.user_id = auth.uid()
    )
  );