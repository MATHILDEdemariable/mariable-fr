DROP TRIGGER IF EXISTS trigger_notify_update_date ON public.vendors_tracking_preprod;
DROP TRIGGER IF EXISTS trg_notify_update_tracking ON public.vendors_tracking_preprod;
CREATE TRIGGER trg_notify_update_tracking
  AFTER UPDATE ON public.vendors_tracking_preprod
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status
        AND NEW.status::text IN ('à valider', 'réponse reçue', 'annuler')
        AND (NEW.email_presta IS NOT NULL OR NEW.email_client IS NOT NULL))
  EXECUTE FUNCTION public."notifyUpdateDate"();