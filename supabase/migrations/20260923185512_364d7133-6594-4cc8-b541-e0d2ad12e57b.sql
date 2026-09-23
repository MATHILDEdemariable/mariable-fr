DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'wedding_coordination'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_coordination;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'coordination_documents'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coordination_documents;
  END IF;
END
$$;