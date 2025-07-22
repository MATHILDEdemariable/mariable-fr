
-- Table d'audit pour tracer tous les événements de paiement
CREATE TABLE public.payment_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id TEXT NOT NULL,
  stripe_event_type TEXT NOT NULL,
  customer_email TEXT,
  session_id TEXT,
  payment_intent_id TEXT,
  amount INTEGER,
  currency TEXT,
  status TEXT NOT NULL,
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Index pour améliorer les performances de recherche
CREATE INDEX idx_payment_audit_event_id ON public.payment_audit(stripe_event_id);
CREATE INDEX idx_payment_audit_email ON public.payment_audit(customer_email);
CREATE INDEX idx_payment_audit_session ON public.payment_audit(session_id);

-- Politique RLS pour permettre aux admins de voir tous les audits
ALTER TABLE public.payment_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment audit"
  ON public.payment_audit
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE admin_users.user_id = auth.uid()
    )
  );

-- Politique pour permettre aux fonctions edge d'insérer des audits
CREATE POLICY "Edge functions can insert payment audit"
  ON public.payment_audit
  FOR INSERT
  WITH CHECK (true);
