
-- Ajouter colonne user_email à vendor_messages
ALTER TABLE public.vendor_messages ADD COLUMN IF NOT EXISTS user_email text;

-- Créer le trigger pour notifier par email à chaque nouveau message
CREATE OR REPLACE FUNCTION public.notify_new_vendor_message()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notify-vendor-message',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$function$;

CREATE TRIGGER on_vendor_message_created
  AFTER INSERT ON public.vendor_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_vendor_message();
