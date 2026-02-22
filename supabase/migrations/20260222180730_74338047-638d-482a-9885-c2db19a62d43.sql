
CREATE POLICY "Admins can view all messages"
  ON public.vendor_messages FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all messages"
  ON public.vendor_messages FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete all messages"
  ON public.vendor_messages FOR DELETE
  USING (public.is_admin());
