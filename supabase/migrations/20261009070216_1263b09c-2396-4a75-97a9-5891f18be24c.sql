DROP POLICY IF EXISTS "Allow token viewers to see todos" ON public.todos_planification;
DROP POLICY IF EXISTS "Allow token viewers to see generated tasks" ON public.generated_tasks;
DROP POLICY IF EXISTS "Allow token viewers to see projects" ON public.projects;
DROP POLICY IF EXISTS "Allow token viewers to see vendors tracking" ON public.vendors_tracking;
CREATE POLICY "Allow token viewers to see todos" ON public.todos_planification FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow token viewers to see generated tasks" ON public.generated_tasks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow token viewers to see projects" ON public.projects FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Allow token viewers to see vendors tracking" ON public.vendors_tracking FOR SELECT TO authenticated USING (auth.uid() = user_id);