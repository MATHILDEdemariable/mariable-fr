-- Create wedding_accommodations table
CREATE TABLE public.wedding_accommodations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nom_logement TEXT NOT NULL,
  type_logement TEXT NOT NULL DEFAULT 'hotel',
  nombre_chambres INTEGER NOT NULL DEFAULT 1,
  capacite_totale INTEGER NOT NULL DEFAULT 2,
  statut TEXT NOT NULL DEFAULT 'non_reserve',
  prix_par_nuit NUMERIC,
  date_arrivee DATE,
  date_depart DATE,
  adresse TEXT,
  contact TEXT,
  commentaires TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create accommodation_assignments table (link accommodations to guests)
CREATE TABLE public.accommodation_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  accommodation_id UUID NOT NULL REFERENCES public.wedding_accommodations(id) ON DELETE CASCADE,
  guest_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.wedding_accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for wedding_accommodations
CREATE POLICY "Users can view their own accommodations"
  ON public.wedding_accommodations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own accommodations"
  ON public.wedding_accommodations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accommodations"
  ON public.wedding_accommodations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accommodations"
  ON public.wedding_accommodations
  FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for accommodation_assignments
CREATE POLICY "Users can view assignments for their accommodations"
  ON public.accommodation_assignments
  FOR SELECT
  USING (
    accommodation_id IN (
      SELECT id FROM public.wedding_accommodations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create assignments for their accommodations"
  ON public.accommodation_assignments
  FOR INSERT
  WITH CHECK (
    accommodation_id IN (
      SELECT id FROM public.wedding_accommodations
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete assignments for their accommodations"
  ON public.accommodation_assignments
  FOR DELETE
  USING (
    accommodation_id IN (
      SELECT id FROM public.wedding_accommodations
      WHERE user_id = auth.uid()
    )
  );

-- Create updated_at trigger for wedding_accommodations
CREATE TRIGGER update_wedding_accommodations_updated_at
  BEFORE UPDATE ON public.wedding_accommodations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_wedding_accommodations_user_id ON public.wedding_accommodations(user_id);
CREATE INDEX idx_accommodation_assignments_accommodation_id ON public.accommodation_assignments(accommodation_id);