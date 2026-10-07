REVOKE EXECUTE ON FUNCTION public.is_wedding_collaborator(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.accept_wedding_invitations() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_wedding_collaborator(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_wedding_invitations() TO authenticated;