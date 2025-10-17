-- Table pour les demandes de démo paiements
CREATE TABLE public.professional_payment_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    category TEXT NOT NULL,
    message TEXT,
    rgpd_consent BOOLEAN NOT NULL DEFAULT false,
    status TEXT DEFAULT 'nouveau',
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_payment_leads_status ON public.professional_payment_leads(status);
CREATE INDEX idx_payment_leads_created ON public.professional_payment_leads(created_at DESC);

-- RLS
ALTER TABLE public.professional_payment_leads ENABLE ROW LEVEL SECURITY;

-- Policy : Public peut insérer
CREATE POLICY "Public can insert payment leads"
ON public.professional_payment_leads FOR INSERT
TO anon
WITH CHECK (rgpd_consent = true);

-- Policy : Admins peuvent tout voir
CREATE POLICY "Admins can view all payment leads"
ON public.professional_payment_leads FOR SELECT
TO authenticated
USING (is_admin());

-- Policy : Admins peuvent mettre à jour
CREATE POLICY "Admins can update payment leads"
ON public.professional_payment_leads FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());