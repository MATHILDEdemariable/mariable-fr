-- Ajouter le champ accept_email_contact dans la table jeunes_maries
ALTER TABLE public.jeunes_maries 
ADD COLUMN accept_email_contact boolean DEFAULT false;