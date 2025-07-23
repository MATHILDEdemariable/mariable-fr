-- Créer des triggers pour déclencher l'envoi automatique d'emails

-- Trigger pour notifyNewContact après insertion dans vendors_contact_preprod
CREATE OR REPLACE TRIGGER trigger_notify_new_contact
  AFTER INSERT ON public.vendors_contact_preprod
  FOR EACH ROW
  EXECUTE FUNCTION public."notifyNewContact"();

-- Trigger pour notifyNewProspect après insertion dans vendors_tracking_preprod avec status 'en attente'
CREATE OR REPLACE TRIGGER trigger_notify_new_prospect
  AFTER INSERT ON public.vendors_tracking_preprod
  FOR EACH ROW
  WHEN (NEW.status = 'en attente')
  EXECUTE FUNCTION public."notifyNewProspect"();

-- Améliorer la fonction notifyUpdateDate pour qu'elle soit appelée lors des mises à jour de statut
CREATE OR REPLACE TRIGGER trigger_notify_update_date
  AFTER UPDATE ON public.vendors_tracking_preprod
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION public."notifyUpdateDate"();