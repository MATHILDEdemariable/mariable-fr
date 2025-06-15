
-- Créer un nouveau type pour le statut des articles de blog
CREATE TYPE public.blog_status AS ENUM ('draft', 'published');

-- Créer la table pour les articles de blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  title TEXT NOT NULL,
  subtitle TEXT,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  background_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  h1_title TEXT,
  h2_titles JSONB DEFAULT '[]'::jsonb,
  status public.blog_status DEFAULT 'draft'::public.blog_status NOT NULL,
  featured BOOLEAN DEFAULT false NOT NULL,
  order_index INTEGER DEFAULT 0 NOT NULL,
  tags JSONB DEFAULT '[]'::jsonb,
  category TEXT
);

-- Créer un trigger pour mettre à jour automatiquement la date de modification
CREATE TRIGGER on_blog_posts_update
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE PROCEDURE public.update_updated_at_timestamp();

-- Créer une fonction pour vérifier si l'utilisateur est un administrateur
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Retourne faux si aucun utilisateur n'est authentifié
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Activer la sécurité au niveau des lignes (RLS) pour la table des articles
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Politique RLS : Les utilisateurs publics peuvent lire les articles publiés
CREATE POLICY "Public can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published'::public.blog_status);

-- Politique RLS : Les administrateurs peuvent gérer tous les articles (CRUD)
CREATE POLICY "Admins can manage all blog posts"
  ON public.blog_posts
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

