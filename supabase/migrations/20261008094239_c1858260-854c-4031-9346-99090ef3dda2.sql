CREATE OR REPLACE FUNCTION public.get_public_coordination(target_coordination_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE WHEN wc.id IS NULL THEN NULL ELSE jsonb_build_object(
    'coordination', to_jsonb(wc),
    'tasks', COALESCE((SELECT jsonb_agg(to_jsonb(cp) ORDER BY cp.position) FROM coordination_planning cp WHERE cp.coordination_id = wc.id), '[]'::jsonb),
    'team', COALESCE((SELECT jsonb_agg(to_jsonb(ct) ORDER BY ct.created_at) FROM coordination_team ct WHERE ct.coordination_id = wc.id), '[]'::jsonb)
  ) END
  FROM wedding_coordination wc
  WHERE wc.id = target_coordination_id;
$$;

REVOKE ALL ON FUNCTION public.get_public_coordination(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_coordination(uuid) TO anon, authenticated;

DROP POLICY IF EXISTS "Public read access to wedding coordination" ON public.wedding_coordination;
DROP POLICY IF EXISTS "Public read access to coordination planning" ON public.coordination_planning;
DROP POLICY IF EXISTS "Public read access to coordination team" ON public.coordination_team;