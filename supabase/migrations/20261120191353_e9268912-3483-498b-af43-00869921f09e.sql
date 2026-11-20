CREATE OR REPLACE FUNCTION public.get_immersion_feedback(pin_value text)
 RETURNS SETOF immersion_feedback LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'access_denied'; END IF;
  RETURN QUERY SELECT * FROM public.immersion_feedback ORDER BY created_at DESC;
END; $$;
CREATE OR REPLACE FUNCTION public.get_immersion_leads(pin_value text)
 RETURNS SETOF immersion_leads LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'access_denied'; END IF;
  RETURN QUERY SELECT * FROM public.immersion_leads ORDER BY created_at DESC;
END; $$;
CREATE OR REPLACE FUNCTION public.get_immersion_qr_stats(pin_value text)
 RETURNS TABLE(slug text, label text, target_url text, scan_count integer, last_scanned_at timestamp with time zone)
 LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'access_denied'; END IF;
  RETURN QUERY SELECT q.slug, q.label, q.target_url, q.scan_count, q.last_scanned_at FROM public.immersion_qr_codes q ORDER BY q.created_at;
END; $$;
CREATE OR REPLACE FUNCTION public.update_immersion_qr_target(pin_value text, slug_value text, target_value text)
 RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $$ BEGIN
  IF NOT public.is_admin() THEN RAISE EXCEPTION 'access_denied'; END IF;
  IF target_value IS NULL OR length(trim(target_value)) = 0 OR trim(target_value) !~* '^https?://' THEN RAISE EXCEPTION 'invalid_target'; END IF;
  UPDATE public.immersion_qr_codes SET target_url = trim(target_value), updated_at = now() WHERE slug = slug_value;
  RETURN FOUND;
END; $$;
REVOKE EXECUTE ON FUNCTION public.get_immersion_feedback(text), public.get_immersion_leads(text), public.get_immersion_qr_stats(text), public.update_immersion_qr_target(text,text,text) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.get_immersion_feedback(text), public.get_immersion_leads(text), public.get_immersion_qr_stats(text), public.update_immersion_qr_target(text,text,text) TO authenticated;