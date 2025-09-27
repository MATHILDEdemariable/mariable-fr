-- Création de la table pour les devis professionnels
CREATE TABLE public.devis_professionnels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nom_professionnel TEXT NOT NULL,
  email_professionnel TEXT NOT NULL,
  email_client TEXT NOT NULL,
  message TEXT,
  fichier_url TEXT NOT NULL,
  fichier_nom TEXT NOT NULL,
  fichier_taille INTEGER NOT NULL,
  statut TEXT NOT NULL DEFAULT 'nouveau' CHECK (statut IN ('nouveau', 'vu', 'traité')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.devis_professionnels ENABLE ROW LEVEL SECURITY;

-- Politique pour insertion publique
CREATE POLICY "Public can insert devis"
ON public.devis_professionnels
FOR INSERT
WITH CHECK (true);

-- Politique pour lecture admin uniquement
CREATE POLICY "Admins can view all devis"
ON public.devis_professionnels
FOR SELECT
USING (is_admin());

-- Politique pour mise à jour admin uniquement
CREATE POLICY "Admins can update devis"
ON public.devis_professionnels
FOR UPDATE
USING (is_admin());

-- Trigger pour updated_at
CREATE TRIGGER update_devis_professionnels_updated_at
  BEFORE UPDATE ON public.devis_professionnels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Création de la table pour les retours de satisfaction
CREATE TABLE public.user_satisfaction_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  score_nps INTEGER NOT NULL CHECK (score_nps >= 0 AND score_nps <= 10),
  commentaire TEXT,
  page_courante TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_satisfaction_feedback ENABLE ROW LEVEL SECURITY;

-- Politique pour que les utilisateurs puissent créer leurs retours
CREATE POLICY "Users can create their own feedback"
ON public.user_satisfaction_feedback
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Politique pour que les utilisateurs puissent voir leurs retours
CREATE POLICY "Users can view their own feedback"
ON public.user_satisfaction_feedback
FOR SELECT
USING (auth.uid() = user_id);

-- Politique pour que les admins puissent voir tous les retours
CREATE POLICY "Admins can view all feedback"
ON public.user_satisfaction_feedback
FOR SELECT
USING (is_admin());

-- Création du bucket pour les devis PDF
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES ('devis-pdf', 'devis-pdf', false, ARRAY['application/pdf'], 10485760);

-- Politique pour upload public des devis
CREATE POLICY "Public can upload devis PDF"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'devis-pdf');

-- Politique pour lecture admin des devis PDF
CREATE POLICY "Admins can view devis PDF"
ON storage.objects
FOR SELECT
USING (bucket_id = 'devis-pdf' AND is_admin());