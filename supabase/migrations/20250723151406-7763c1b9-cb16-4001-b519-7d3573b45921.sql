-- Corriger le trigger pour qu'il se déclenche sur le bon statut
DROP TRIGGER IF EXISTS trigger_notify_new_prospect ON public.vendors_tracking_preprod;

-- Nouveau trigger qui se déclenche quand le statut devient 'contactés'
CREATE OR REPLACE TRIGGER trigger_notify_new_prospect
  AFTER UPDATE ON public.vendors_tracking_preprod
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'contactés')
  EXECUTE FUNCTION public."notifyNewProspect"();

-- Améliorer les fonctions avec des logs
CREATE OR REPLACE FUNCTION public."notifyNewContact"()
RETURNS trigger AS $$
BEGIN
  -- Log pour vérifier que la fonction est appelée
  RAISE LOG 'notifyNewContact appelée pour ID: %', NEW.id;
  
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notifyNewContact',  
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public."notifyNewProspect"()
RETURNS trigger AS $$
BEGIN
  -- Log pour vérifier que la fonction est appelée
  RAISE LOG 'notifyNewProspect appelée pour ID: %, statut: %', NEW.id, NEW.status;
  
  PERFORM net.http_post(
    url := 'https://bgidfcqktsttzlwlumtz.functions.supabase.co/notifyNewProspect',  
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Résoudre les contraintes de clé étrangère pour permettre la suppression d'utilisateurs
-- Modifier les contraintes pour utiliser CASCADE ou SET NULL

-- D'abord, identifier et corriger les contraintes problématiques
ALTER TABLE public.wedding_coordination 
DROP CONSTRAINT IF EXISTS wedding_coordination_user_id_fkey;

ALTER TABLE public.wedding_coordination 
ADD CONSTRAINT wedding_coordination_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Vérifier et corriger d'autres tables similaires
DO $$
DECLARE
    constraint_record RECORD;
BEGIN
    -- Chercher toutes les contraintes qui référencent auth.users sans CASCADE
    FOR constraint_record IN 
        SELECT 
            tc.table_schema,
            tc.table_name,
            tc.constraint_name,
            kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.referential_constraints rc 
            ON tc.constraint_name = rc.constraint_name
        JOIN information_schema.table_constraints tc2 
            ON rc.unique_constraint_name = tc2.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc2.table_name = 'users'
            AND tc2.table_schema = 'auth'
            AND tc.table_schema = 'public'
    LOOP
        -- Log des contraintes trouvées
        RAISE LOG 'Contrainte trouvée: %.% - %', 
            constraint_record.table_schema, 
            constraint_record.table_name, 
            constraint_record.constraint_name;
    END LOOP;
END $$;