CREATE TABLE public.immersion_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_slug text NOT NULL,
  vendor_name text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  wedding_date date,
  wedding_location text,
  message text,
  wants_quote boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.immersion_leads TO service_role;
ALTER TABLE public.immersion_leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.immersion_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rating_overall smallint NOT NULL,
  rating_vendors smallint NOT NULL,
  rating_ambiance smallint NOT NULL,
  rating_welcome smallint NOT NULL,
  rating_recommend smallint NOT NULL,
  comment text,
  first_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.immersion_feedback TO service_role;
ALTER TABLE public.immersion_feedback ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.submit_immersion_lead(vendor_slug_value text, vendor_name_value text, first_name_value text, last_name_value text, email_value text, phone_value text, wedding_date_value date, wedding_location_value text, message_value text, wants_quote_value boolean)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(trim(first_name_value),'') = '' OR coalesce(trim(last_name_value),'') = '' OR email_value !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid_lead';
  END IF;
  INSERT INTO public.immersion_leads (vendor_slug, vendor_name, first_name, last_name, email, phone, wedding_date, wedding_location, message, wants_quote)
  VALUES (left(vendor_slug_value,100), left(vendor_name_value,200), left(trim(first_name_value),100), left(trim(last_name_value),100), left(trim(email_value),255), left(phone_value,40), wedding_date_value, left(wedding_location_value,200), left(message_value,2000), coalesce(wants_quote_value,true));
  RETURN true;
END; $$;

CREATE OR REPLACE FUNCTION public.submit_immersion_feedback(r1 smallint, r2 smallint, r3 smallint, r4 smallint, r5 smallint, comment_value text, first_name_value text, email_value text)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF least(r1,r2,r3,r4,r5) < 1 OR greatest(r1,r2,r3,r4,r5) > 5 THEN RAISE EXCEPTION 'invalid_rating'; END IF;
  INSERT INTO public.immersion_feedback (rating_overall, rating_vendors, rating_ambiance, rating_welcome, rating_recommend, comment, first_name, email)
  VALUES (r1,r2,r3,r4,r5, left(comment_value,3000), left(first_name_value,100), left(email_value,255));
  RETURN true;
END; $$;

CREATE OR REPLACE FUNCTION public.get_immersion_leads(pin_value text)
RETURNS SETOF public.immersion_leads LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF pin_value IS DISTINCT FROM '2026' THEN RAISE EXCEPTION 'invalid_pin'; END IF;
  RETURN QUERY SELECT * FROM public.immersion_leads ORDER BY created_at DESC;
END; $$;

CREATE OR REPLACE FUNCTION public.get_immersion_feedback(pin_value text)
RETURNS SETOF public.immersion_feedback LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF pin_value IS DISTINCT FROM '2026' THEN RAISE EXCEPTION 'invalid_pin'; END IF;
  RETURN QUERY SELECT * FROM public.immersion_feedback ORDER BY created_at DESC;
END; $$;

GRANT EXECUTE ON FUNCTION public.submit_immersion_lead(text,text,text,text,text,text,date,text,text,boolean) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_immersion_feedback(smallint,smallint,smallint,smallint,smallint,text,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_immersion_leads(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_immersion_feedback(text) TO anon, authenticated;