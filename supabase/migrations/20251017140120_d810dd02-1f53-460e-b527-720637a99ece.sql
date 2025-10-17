-- Ajouter la colonne status si elle n'existe pas déjà
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'professional_payment_leads' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.professional_payment_leads 
    ADD COLUMN status TEXT NOT NULL DEFAULT 'nouveau';
  END IF;
END $$;

-- Créer les RLS policies pour professional_payment_leads si elles n'existent pas
DO $$
BEGIN
  -- Policy pour que les admins puissent tout lire
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'professional_payment_leads' 
    AND policyname = 'Admins can view all payment leads'
  ) THEN
    CREATE POLICY "Admins can view all payment leads"
      ON public.professional_payment_leads
      FOR SELECT
      USING (is_admin());
  END IF;

  -- Policy pour que les admins puissent mettre à jour
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'professional_payment_leads' 
    AND policyname = 'Admins can update payment leads'
  ) THEN
    CREATE POLICY "Admins can update payment leads"
      ON public.professional_payment_leads
      FOR UPDATE
      USING (is_admin())
      WITH CHECK (is_admin());
  END IF;

  -- Vérifier que la policy d'insertion publique existe toujours
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'professional_payment_leads' 
    AND policyname = 'Public can insert payment leads'
  ) THEN
    CREATE POLICY "Public can insert payment leads"
      ON public.professional_payment_leads
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;