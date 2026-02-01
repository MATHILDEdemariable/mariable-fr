-- Nouvelle table pour les sous-événements RSVP (ex: Brunch lendemain)
CREATE TABLE public.wedding_rsvp_sub_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_event_id UUID NOT NULL REFERENCES public.wedding_rsvp_events(id) ON DELETE CASCADE,
  sub_event_name TEXT NOT NULL,
  sub_event_date DATE,
  sub_event_time TEXT,
  sub_event_location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Nouvelle table pour les réponses aux sous-événements
CREATE TABLE public.wedding_rsvp_sub_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id UUID NOT NULL REFERENCES public.wedding_rsvp_responses(id) ON DELETE CASCADE,
  sub_event_id UUID NOT NULL REFERENCES public.wedding_rsvp_sub_events(id) ON DELETE CASCADE,
  attending BOOLEAN DEFAULT false,
  number_of_adults INTEGER DEFAULT 0,
  number_of_children INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour les performances
CREATE INDEX idx_sub_events_parent ON public.wedding_rsvp_sub_events(parent_event_id);
CREATE INDEX idx_sub_responses_response ON public.wedding_rsvp_sub_responses(response_id);
CREATE INDEX idx_sub_responses_sub_event ON public.wedding_rsvp_sub_responses(sub_event_id);

-- Trigger pour updated_at
CREATE TRIGGER update_wedding_rsvp_sub_events_updated_at
BEFORE UPDATE ON public.wedding_rsvp_sub_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.wedding_rsvp_sub_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wedding_rsvp_sub_responses ENABLE ROW LEVEL SECURITY;

-- Policies pour wedding_rsvp_sub_events
CREATE POLICY "Users can view sub_events of their events" 
ON public.wedding_rsvp_sub_events 
FOR SELECT 
USING (
  parent_event_id IN (
    SELECT id FROM public.wedding_rsvp_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create sub_events for their events" 
ON public.wedding_rsvp_sub_events 
FOR INSERT 
WITH CHECK (
  parent_event_id IN (
    SELECT id FROM public.wedding_rsvp_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can update sub_events of their events" 
ON public.wedding_rsvp_sub_events 
FOR UPDATE 
USING (
  parent_event_id IN (
    SELECT id FROM public.wedding_rsvp_events WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete sub_events of their events" 
ON public.wedding_rsvp_sub_events 
FOR DELETE 
USING (
  parent_event_id IN (
    SELECT id FROM public.wedding_rsvp_events WHERE user_id = auth.uid()
  )
);

-- Policies pour wedding_rsvp_sub_responses (accès public pour les réponses)
CREATE POLICY "Public can insert sub_responses" 
ON public.wedding_rsvp_sub_responses 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Public can view sub_responses" 
ON public.wedding_rsvp_sub_responses 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage sub_responses of their events" 
ON public.wedding_rsvp_sub_responses 
FOR ALL 
USING (
  response_id IN (
    SELECT r.id FROM public.wedding_rsvp_responses r
    JOIN public.wedding_rsvp_events e ON r.event_id = e.id
    WHERE e.user_id = auth.uid()
  )
);