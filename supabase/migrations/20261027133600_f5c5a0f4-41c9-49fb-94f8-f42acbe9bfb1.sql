CREATE TABLE public.pro_client_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  intro TEXT,
  form_type TEXT NOT NULL DEFAULT 'custom',
  language TEXT NOT NULL DEFAULT 'fr',
  questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  is_open BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pro_client_forms TO authenticated;
GRANT ALL ON public.pro_client_forms TO service_role;
ALTER TABLE public.pro_client_forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their client forms" ON public.pro_client_forms FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX idx_pro_client_forms_owner ON public.pro_client_forms(owner_id);
CREATE TRIGGER update_pro_client_forms_updated_at BEFORE UPDATE ON public.pro_client_forms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.pro_client_form_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.pro_client_forms(id) ON DELETE CASCADE,
  respondent_name TEXT,
  respondent_email TEXT,
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  questions_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, DELETE ON public.pro_client_form_responses TO authenticated;
GRANT ALL ON public.pro_client_form_responses TO service_role;
ALTER TABLE public.pro_client_form_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Form owners read responses" ON public.pro_client_form_responses FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.pro_client_forms f WHERE f.id = form_id AND f.owner_id = auth.uid()));
CREATE POLICY "Form owners delete responses" ON public.pro_client_form_responses FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.pro_client_forms f WHERE f.id = form_id AND f.owner_id = auth.uid()));
CREATE INDEX idx_pro_client_form_responses_form ON public.pro_client_form_responses(form_id);

CREATE OR REPLACE FUNCTION public.get_public_client_form(token_value text)
RETURNS TABLE(title text, intro text, language text, questions jsonb, is_open boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT f.title, f.intro, f.language, f.questions, f.is_open
  FROM public.pro_client_forms f
  WHERE f.share_token = token_value
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.submit_client_form_response(token_value text, respondent_name_value text, respondent_email_value text, answers_value jsonb)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  target_form public.pro_client_forms%ROWTYPE;
BEGIN
  SELECT * INTO target_form FROM public.pro_client_forms WHERE share_token = token_value LIMIT 1;
  IF target_form.id IS NULL OR NOT target_form.is_open THEN
    RETURN false;
  END IF;
  IF jsonb_typeof(answers_value) <> 'object' OR length(answers_value::text) > 50000 THEN
    RETURN false;
  END IF;
  INSERT INTO public.pro_client_form_responses (form_id, respondent_name, respondent_email, answers, questions_snapshot)
  VALUES (target_form.id, left(respondent_name_value, 200), left(respondent_email_value, 200), answers_value, target_form.questions);
  RETURN true;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_client_form(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_client_form_response(text, text, text, jsonb) TO anon, authenticated;