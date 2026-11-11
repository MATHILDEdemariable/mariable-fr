CREATE POLICY "Collaborators edit vendors_tracking_preprod" ON public.vendors_tracking_preprod
FOR ALL TO authenticated
USING (public.is_wedding_collaborator(auth.uid(), wedding_id))
WITH CHECK (public.is_wedding_collaborator(auth.uid(), wedding_id));

CREATE OR REPLACE FUNCTION public.get_wedding_planner_contact(target_wedding_id uuid)
RETURNS TABLE(planner_name text, planner_email text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(NULLIF(trim(concat_ws(' ', p.first_name, p.last_name)), ''), u.email)::text,
         u.email::text
  FROM public.weddings w
  JOIN auth.users u ON u.id = w.owner_id
  LEFT JOIN public.profiles p ON p.id = w.owner_id
  WHERE w.id = target_wedding_id
    AND public.is_wedding_collaborator(auth.uid(), target_wedding_id);
$$;
REVOKE ALL ON FUNCTION public.get_wedding_planner_contact(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_wedding_planner_contact(uuid) TO authenticated;