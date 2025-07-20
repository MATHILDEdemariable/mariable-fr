
-- Ajouter les colonnes pour la gestion premium dans la table profiles
ALTER TABLE public.profiles 
ADD COLUMN subscription_type TEXT DEFAULT 'free' CHECK (subscription_type IN ('free', 'premium')),
ADD COLUMN subscription_expires_at TIMESTAMP WITH TIME ZONE NULL;

-- Créer un index pour optimiser les requêtes sur le type d'abonnement
CREATE INDEX idx_profiles_subscription_type ON public.profiles(subscription_type);

-- Fonction pour vérifier si un utilisateur est premium et actif
CREATE OR REPLACE FUNCTION public.is_user_premium(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_uuid 
    AND subscription_type = 'premium'
    AND (subscription_expires_at IS NULL OR subscription_expires_at > NOW())
  );
END;
$$;

-- Politique RLS pour permettre aux utilisateurs de voir leur propre statut premium
CREATE POLICY "Users can view their own subscription status" ON public.profiles
FOR SELECT USING (auth.uid() = id);
