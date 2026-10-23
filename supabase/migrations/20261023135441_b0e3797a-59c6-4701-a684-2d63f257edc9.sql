REVOKE EXECUTE ON FUNCTION public.set_vendor_tracking_wedding() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_vendor_tracking_links() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.sync_key_people_to_jour_j(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.sync_key_people_to_jour_j(uuid) TO authenticated;