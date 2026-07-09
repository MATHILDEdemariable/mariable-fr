
-- 1) Table
CREATE TABLE public.ebook_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  access_token text NOT NULL UNIQUE,
  guide_slug text NOT NULL,
  stripe_session_id text UNIQUE,
  amount_paid integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_ebook_purchases_token ON public.ebook_purchases(access_token);
CREATE INDEX idx_ebook_purchases_email ON public.ebook_purchases(email);
CREATE INDEX idx_ebook_purchases_session ON public.ebook_purchases(stripe_session_id);

-- 2) GRANTs (service_role uniquement — pas d'accès direct client)
GRANT ALL ON public.ebook_purchases TO service_role;

-- 3) RLS
ALTER TABLE public.ebook_purchases ENABLE ROW LEVEL SECURITY;

-- Aucune policy pour anon/authenticated → accès via RPC uniquement

-- 4) RPCs SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_purchases_by_token(token_value text)
RETURNS TABLE(guide_slug text, email text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ep.guide_slug, ep.email, ep.created_at
  FROM public.ebook_purchases ep
  WHERE ep.email = (
    SELECT email FROM public.ebook_purchases WHERE access_token = token_value LIMIT 1
  )
  AND EXISTS (SELECT 1 FROM public.ebook_purchases WHERE access_token = token_value);
$$;

GRANT EXECUTE ON FUNCTION public.get_purchases_by_token(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_token_by_session(session_id_value text)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT access_token
  FROM public.ebook_purchases
  WHERE stripe_session_id = session_id_value
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.get_token_by_session(text) TO anon, authenticated;

-- 5) RLS sur storage.objects pour le bucket 'ebooks' (privé, lecture via URL signée uniquement)
CREATE POLICY "ebooks bucket - no public access"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'ebooks' AND false);
