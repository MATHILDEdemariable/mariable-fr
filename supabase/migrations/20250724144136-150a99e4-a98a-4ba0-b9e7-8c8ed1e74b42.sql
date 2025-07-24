-- Corriger les erreurs de sécurité critiques
-- Activer RLS sur storage.objects si pas déjà fait
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Corriger la fonction notify_new_jeune_marie avec search_path
CREATE OR REPLACE FUNCTION public.notify_new_jeune_marie()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, storage
AS $$
BEGIN
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notifyNewProspect',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'type', 'jeune_marie',
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$;