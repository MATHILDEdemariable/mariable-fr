DO $$
DECLARE
  tbl record;
  anon_ok boolean;
BEGIN
  FOR tbl IN
    SELECT c.relname AS table_name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind = 'r' AND n.nspname = 'public'
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl.table_name);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl.table_name);

    SELECT EXISTS (
      SELECT 1 FROM pg_policies p
      WHERE p.schemaname = 'public'
        AND p.tablename = tbl.table_name
        AND p.cmd IN ('SELECT','ALL')
        AND p.qual IS NOT NULL
        AND p.qual NOT ILIKE '%auth.uid()%'
        AND p.qual NOT ILIKE '%is_admin()%'
    ) INTO anon_ok;

    IF anon_ok THEN
      EXECUTE format('GRANT SELECT ON public.%I TO anon', tbl.table_name);
    END IF;
  END LOOP;
END;
$$;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated, service_role;