CREATE TABLE public.immersion_qr_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  label text NOT NULL,
  target_url text NOT NULL,
  scan_count integer NOT NULL DEFAULT 0,
  last_scanned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.immersion_qr_codes TO service_role;
ALTER TABLE public.immersion_qr_codes ENABLE ROW LEVEL SECURITY;

INSERT INTO public.immersion_qr_codes (slug, label, target_url)
VALUES ('immersion-mariage', 'QR code Immersion Mariage', '/immersion-mariage?source=qr');

-- Public: count a scan and return where to go
CREATE OR REPLACE FUNCTION public.record_immersion_qr_scan(slug_value text)
RETURNS text LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  UPDATE public.immersion_qr_codes
  SET scan_count = scan_count + 1, last_scanned_at = now()
  WHERE slug = slug_value
  RETURNING target_url;
$$;

-- PIN-protected admin read
CREATE OR REPLACE FUNCTION public.get_immersion_qr_stats(pin_value text)
RETURNS TABLE(slug text, label text, target_url text, scan_count integer, last_scanned_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF pin_value IS DISTINCT FROM '2026' THEN RAISE EXCEPTION 'invalid_pin'; END IF;
  RETURN QUERY SELECT q.slug, q.label, q.target_url, q.scan_count, q.last_scanned_at
    FROM public.immersion_qr_codes q ORDER BY q.created_at;
END; $$;

-- PIN-protected target update
CREATE OR REPLACE FUNCTION public.update_immersion_qr_target(pin_value text, slug_value text, target_value text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF pin_value IS DISTINCT FROM '2026' THEN RAISE EXCEPTION 'invalid_pin'; END IF;
  IF target_value IS NULL OR length(trim(target_value)) = 0 THEN RAISE EXCEPTION 'invalid_target'; END IF;
  UPDATE public.immersion_qr_codes SET target_url = trim(target_value), updated_at = now() WHERE slug = slug_value;
  RETURN FOUND;
END; $$;

GRANT EXECUTE ON FUNCTION public.record_immersion_qr_scan(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_immersion_qr_stats(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_immersion_qr_target(text, text, text) TO anon, authenticated;