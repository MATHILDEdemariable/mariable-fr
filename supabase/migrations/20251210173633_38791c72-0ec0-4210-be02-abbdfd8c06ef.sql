-- Add column to store Club Mariable notification preference
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notify_club_mariable boolean DEFAULT false;