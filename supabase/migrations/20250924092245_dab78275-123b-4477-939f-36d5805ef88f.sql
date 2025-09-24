-- Activer les extensions nécessaires pour pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Créer trigger pour notification immédiate nouvelles inscriptions
CREATE OR REPLACE FUNCTION public.notify_new_user_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Appeler Edge Function pour notification immédiate
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notify-new-registration',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object(
      'user_id', NEW.id,
      'email', NEW.email,
      'created_at', NEW.created_at,
      'raw_user_meta_data', NEW.raw_user_meta_data
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer trigger sur auth.users pour nouvelles inscriptions
DROP TRIGGER IF EXISTS on_new_user_registration ON auth.users;
CREATE TRIGGER on_new_user_registration
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_user_registration();

-- Supprimer l'ancien cron job s'il existe
SELECT cron.unschedule('daily-user-report') WHERE EXISTS (
  SELECT 1 FROM cron.job WHERE jobname = 'daily-user-report'
);

-- Créer le nouveau cron job pour le rapport quotidien
SELECT cron.schedule(
  'daily-user-report',
  '0 9 * * *', -- Tous les jours à 9h
  $$
  SELECT net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/daily-user-report',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('trigger', 'cron', 'time', now())
  ) as request_id;
  $$
);