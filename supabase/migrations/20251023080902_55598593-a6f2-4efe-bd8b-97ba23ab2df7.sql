-- Table 1: Plans de table
CREATE TABLE public.seating_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date DATE,
  venue_name TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table 2: Tables du plan de table
CREATE TABLE public.seating_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seating_plan_id UUID NOT NULL REFERENCES public.seating_plans(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  table_number INTEGER NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity >= 2 AND capacity <= 20),
  shape TEXT NOT NULL DEFAULT 'round' CHECK (shape IN ('round', 'rectangle', 'oval')),
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  color TEXT DEFAULT '#8B7355',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Table 3: Assignations des invités aux tables
CREATE TABLE public.seating_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.seating_tables(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  rsvp_response_id UUID REFERENCES public.wedding_rsvp_responses(id) ON DELETE SET NULL,
  guest_type TEXT NOT NULL DEFAULT 'adult' CHECK (guest_type IN ('adult', 'child', 'vip')),
  dietary_restrictions TEXT,
  seat_number INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes pour performance
CREATE INDEX idx_seating_plans_user_id ON public.seating_plans(user_id);
CREATE INDEX idx_seating_tables_plan_id ON public.seating_tables(seating_plan_id);
CREATE INDEX idx_seating_assignments_table_id ON public.seating_assignments(table_id);
CREATE INDEX idx_seating_assignments_rsvp ON public.seating_assignments(rsvp_response_id);

-- RLS Policies pour seating_plans
ALTER TABLE public.seating_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own seating plans"
  ON public.seating_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own seating plans"
  ON public.seating_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own seating plans"
  ON public.seating_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own seating plans"
  ON public.seating_plans FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies pour seating_tables
ALTER TABLE public.seating_tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own seating tables"
  ON public.seating_tables FOR SELECT
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can create tables for their own plans"
  ON public.seating_tables FOR INSERT
  WITH CHECK (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own seating tables"
  ON public.seating_tables FOR UPDATE
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own seating tables"
  ON public.seating_tables FOR DELETE
  USING (seating_plan_id IN (
    SELECT id FROM public.seating_plans WHERE user_id = auth.uid()
  ));

-- RLS Policies pour seating_assignments
ALTER TABLE public.seating_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own seating assignments"
  ON public.seating_assignments FOR SELECT
  USING (table_id IN (
    SELECT st.id FROM public.seating_tables st
    JOIN public.seating_plans sp ON st.seating_plan_id = sp.id
    WHERE sp.user_id = auth.uid()
  ));

CREATE POLICY "Users can create assignments for their own tables"
  ON public.seating_assignments FOR INSERT
  WITH CHECK (table_id IN (
    SELECT st.id FROM public.seating_tables st
    JOIN public.seating_plans sp ON st.seating_plan_id = sp.id
    WHERE sp.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own seating assignments"
  ON public.seating_assignments FOR UPDATE
  USING (table_id IN (
    SELECT st.id FROM public.seating_tables st
    JOIN public.seating_plans sp ON st.seating_plan_id = sp.id
    WHERE sp.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own seating assignments"
  ON public.seating_assignments FOR DELETE
  USING (table_id IN (
    SELECT st.id FROM public.seating_tables st
    JOIN public.seating_plans sp ON st.seating_plan_id = sp.id
    WHERE sp.user_id = auth.uid()
  ));

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_seating_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seating_plans_updated_at
  BEFORE UPDATE ON public.seating_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_seating_plan_updated_at();