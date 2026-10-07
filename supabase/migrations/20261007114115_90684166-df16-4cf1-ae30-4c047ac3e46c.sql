CREATE TABLE public.wedding_drinks_plan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id uuid NOT NULL UNIQUE,
  created_by uuid NOT NULL,
  title text,
  rows jsonb NOT NULL DEFAULT '[]'::jsonb,
  share_token text UNIQUE,
  share_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.wedding_drinks_plan TO authenticated;
GRANT ALL ON public.wedding_drinks_plan TO service_role;
ALTER TABLE public.wedding_drinks_plan ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wedding members manage drinks plan" ON public.wedding_drinks_plan
  FOR ALL TO authenticated
  USING (public.has_wedding_access(auth.uid(), wedding_id))
  WITH CHECK (public.has_wedding_access(auth.uid(), wedding_id) AND created_by = auth.uid() OR public.has_wedding_access(auth.uid(), wedding_id));
CREATE TRIGGER update_wedding_drinks_plan_updated_at BEFORE UPDATE ON public.wedding_drinks_plan
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.get_public_drinks_plan(token_value text)
RETURNS TABLE(title text, rows jsonb, wedding_title text, wedding_date date)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT p.title, p.rows, w.title, w.wedding_date::date
  FROM public.wedding_drinks_plan p
  LEFT JOIN public.weddings w ON w.id = p.wedding_id
  WHERE p.share_token = token_value AND p.share_active = true
  LIMIT 1;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_drinks_plan(text) TO anon, authenticated;