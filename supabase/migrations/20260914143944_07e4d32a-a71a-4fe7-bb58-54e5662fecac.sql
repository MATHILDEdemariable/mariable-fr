ALTER TABLE public.checklist_mariage_manuel
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'medium';

UPDATE public.checklist_mariage_manuel
SET status = 'completed' WHERE completed = true AND status = 'pending';

CREATE INDEX IF NOT EXISTS idx_checklist_manuel_status
  ON public.checklist_mariage_manuel (wedding_id, status);