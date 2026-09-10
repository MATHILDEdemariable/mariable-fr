ALTER TABLE public.wedding_retroplanning ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'fr';
ALTER TABLE public.wedding_retroplanning DROP CONSTRAINT IF EXISTS wedding_retroplanning_language_check;
ALTER TABLE public.wedding_retroplanning ADD CONSTRAINT wedding_retroplanning_language_check CHECK (language IN ('fr','en'));