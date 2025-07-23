-- Supprimer les triggers défaillants et les fonctions PostgreSQL
DROP TRIGGER IF EXISTS trigger_notify_new_contact ON vendors_contact_preprod;
DROP TRIGGER IF EXISTS trigger_notify_new_prospect ON vendors_tracking_preprod;

DROP FUNCTION IF EXISTS "notifyNewContact"();
DROP FUNCTION IF EXISTS "notifyNewProspect"();