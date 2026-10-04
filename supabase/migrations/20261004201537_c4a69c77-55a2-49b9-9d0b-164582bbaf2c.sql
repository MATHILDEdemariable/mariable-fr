ALTER TABLE public.wedding_retroplanning ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'ai';

CREATE TABLE public.retroplanning_share_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  retroplanning_id uuid NOT NULL REFERENCES public.wedding_retroplanning(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.retroplanning_share_tokens TO authenticated;
GRANT ALL ON public.retroplanning_share_tokens TO service_role;
ALTER TABLE public.retroplanning_share_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage retroplanning share tokens" ON public.retroplanning_share_tokens
FOR ALL TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid() AND EXISTS (SELECT 1 FROM public.wedding_retroplanning r WHERE r.id = retroplanning_id AND r.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.get_public_retroplanning(token_value text)
RETURNS TABLE(title text, wedding_date date, mode text, timeline_data jsonb, categories jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT r.title, r.wedding_date::date, r.mode, r.timeline_data::jsonb, r.categories::jsonb
  FROM public.retroplanning_share_tokens t
  JOIN public.wedding_retroplanning r ON r.id = t.retroplanning_id
  WHERE t.token = token_value AND t.is_active = true
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_retroplanning(text) TO anon, authenticated;