-- Supprimer les triggers et fonctions défaillants avec CASCADE
DROP FUNCTION IF EXISTS "notifyNewContact"() CASCADE;
DROP FUNCTION IF EXISTS "notifyNewProspect"() CASCADE;