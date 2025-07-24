-- Créer un bucket pour les photos des jeunes mariés
INSERT INTO storage.buckets (id, name, public) 
VALUES ('jeunes-maries-photos', 'jeunes-maries-photos', true);

-- Créer les politiques de stockage pour les photos des jeunes mariés
CREATE POLICY "Public can view jeunes maries photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'jeunes-maries-photos');

CREATE POLICY "Anyone can upload jeunes maries photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'jeunes-maries-photos');

CREATE POLICY "Anyone can update jeunes maries photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'jeunes-maries-photos');

-- Modifier la table jeunes_maries pour s'assurer que les valeurs par défaut sont correctes
ALTER TABLE public.jeunes_maries 
ALTER COLUMN visible SET DEFAULT false,
ALTER COLUMN status_moderation SET DEFAULT 'en_attente';

-- Créer une fonction trigger pour notifier l'admin des nouveaux témoignages
CREATE OR REPLACE FUNCTION public.notify_new_jeune_marie()
RETURNS trigger
LANGUAGE plpgsql
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

-- Créer le trigger pour notifier les nouveaux témoignages
CREATE TRIGGER notify_new_jeune_marie_trigger
  AFTER INSERT ON public.jeunes_maries
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_new_jeune_marie();