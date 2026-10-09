CREATE OR REPLACE FUNCTION public.get_my_pending_wedding_invitations()
RETURNS TABLE(invitation_id uuid, wedding_title text, inviter_name text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT c.id, w.title,
         COALESCE(NULLIF(trim(concat_ws(' ', p.first_name, p.last_name)), ''), 'Votre wedding planner'),
         c.created_at
  FROM wedding_collaborators c
  JOIN weddings w ON w.id = c.wedding_id
  LEFT JOIN profiles p ON p.id = c.invited_by
  WHERE c.status = 'pending'
    AND auth.uid() IS NOT NULL
    AND lower(c.invited_email) = (SELECT lower(email) FROM auth.users WHERE id = auth.uid());
$$;

CREATE OR REPLACE FUNCTION public.respond_wedding_invitation(target_invitation_id uuid, accept_invitation boolean)
RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE _email text; _count integer;
BEGIN
  IF auth.uid() IS NULL THEN RETURN false; END IF;
  SELECT lower(email) INTO _email FROM auth.users WHERE id = auth.uid();
  UPDATE wedding_collaborators
     SET user_id = CASE WHEN accept_invitation THEN auth.uid() ELSE NULL END,
         status = CASE WHEN accept_invitation THEN 'accepted' ELSE 'declined' END
   WHERE id = target_invitation_id AND status = 'pending' AND lower(invited_email) = _email;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count > 0;
END; $$;

REVOKE ALL ON FUNCTION public.get_my_pending_wedding_invitations() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.respond_wedding_invitation(uuid, boolean) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_pending_wedding_invitations() TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_wedding_invitation(uuid, boolean) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.accept_wedding_invitations() FROM authenticated, anon, PUBLIC;