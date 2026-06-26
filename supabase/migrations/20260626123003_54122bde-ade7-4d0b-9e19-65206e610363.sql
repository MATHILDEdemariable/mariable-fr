DROP POLICY IF EXISTS "Service can manage usage" ON public.ai_usage_tracking;
CREATE POLICY "Users can insert their own usage" ON public.ai_usage_tracking FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own usage" ON public.ai_usage_tracking FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own usage" ON public.ai_usage_tracking FOR DELETE TO authenticated USING (auth.uid() = user_id);