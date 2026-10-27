CREATE TABLE public.pro_task_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Organisation',
  stakeholder TEXT NOT NULL DEFAULT 'planner',
  months_before NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pro_task_templates TO authenticated;
GRANT ALL ON public.pro_task_templates TO service_role;
ALTER TABLE public.pro_task_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners manage their task templates" ON public.pro_task_templates FOR ALL TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE INDEX idx_pro_task_templates_owner ON public.pro_task_templates(owner_id);