CREATE TABLE public.pro_satisfaction_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  rating smallint NOT NULL,
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.pro_satisfaction_feedback TO authenticated;
GRANT ALL ON public.pro_satisfaction_feedback TO service_role;
ALTER TABLE public.pro_satisfaction_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pros insert own feedback" ON public.pro_satisfaction_feedback FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND rating BETWEEN 1 AND 5 AND (comment IS NULL OR length(comment) <= 2000));
CREATE POLICY "Admins read pro feedback" ON public.pro_satisfaction_feedback FOR SELECT TO authenticated
  USING (public.is_admin());
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS pro_onboarding_sequence jsonb NOT NULL DEFAULT '{}'::jsonb;