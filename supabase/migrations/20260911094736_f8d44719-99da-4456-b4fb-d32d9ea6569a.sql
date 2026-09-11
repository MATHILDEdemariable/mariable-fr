ALTER TABLE public.weddings ADD COLUMN IF NOT EXISTS archived_at timestamptz;
CREATE INDEX IF NOT EXISTS weddings_owner_archived_idx ON public.weddings (owner_id, archived_at);