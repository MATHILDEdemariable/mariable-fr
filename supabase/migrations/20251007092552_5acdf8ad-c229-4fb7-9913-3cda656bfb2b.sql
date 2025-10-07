-- Création des tables pour le module RSVP

-- Table principale pour les événements RSVP
CREATE TABLE wedding_rsvp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_name TEXT NOT NULL DEFAULT 'Mon mariage',
  event_date DATE,
  event_location TEXT,
  unique_link_slug TEXT UNIQUE NOT NULL,
  welcome_message TEXT,
  require_phone BOOLEAN DEFAULT false,
  require_dietary_restrictions BOOLEAN DEFAULT true,
  max_guests_per_invite INTEGER DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table pour les réponses des invités
CREATE TABLE wedding_rsvp_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES wedding_rsvp_events(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  guest_email TEXT,
  guest_phone TEXT,
  attendance_status TEXT NOT NULL CHECK (attendance_status IN ('oui', 'non', 'peut-être')),
  number_of_guests INTEGER DEFAULT 1,
  dietary_restrictions TEXT,
  message TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT
);

-- Index pour les performances
CREATE INDEX idx_rsvp_events_user_id ON wedding_rsvp_events(user_id);
CREATE INDEX idx_rsvp_events_slug ON wedding_rsvp_events(unique_link_slug);
CREATE INDEX idx_rsvp_responses_event_id ON wedding_rsvp_responses(event_id);
CREATE INDEX idx_rsvp_responses_status ON wedding_rsvp_responses(attendance_status);

-- Activer RLS
ALTER TABLE wedding_rsvp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Policies pour wedding_rsvp_events
CREATE POLICY "Users can view their own events"
ON wedding_rsvp_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
ON wedding_rsvp_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
ON wedding_rsvp_events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
ON wedding_rsvp_events FOR DELETE
USING (auth.uid() = user_id);

-- Policy pour accès public aux événements via slug (lecture seule pour le formulaire)
CREATE POLICY "Public can view events by slug"
ON wedding_rsvp_events FOR SELECT
USING (true);

-- Policies pour wedding_rsvp_responses
CREATE POLICY "Anyone can submit RSVP responses"
ON wedding_rsvp_responses FOR INSERT
WITH CHECK (true);

CREATE POLICY "Event owners can view responses"
ON wedding_rsvp_responses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM wedding_rsvp_events
    WHERE id = event_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Event owners can update responses"
ON wedding_rsvp_responses FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM wedding_rsvp_events
    WHERE id = event_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Event owners can delete responses"
ON wedding_rsvp_responses FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM wedding_rsvp_events
    WHERE id = event_id AND user_id = auth.uid()
  )
);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_rsvp_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_rsvp_events_updated_at
BEFORE UPDATE ON wedding_rsvp_events
FOR EACH ROW
EXECUTE FUNCTION update_rsvp_events_updated_at();