-- Ajouter un champ pour stocker les styles CSS des articles HTML importés
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS custom_styles text;

COMMENT ON COLUMN blog_posts.custom_styles IS 'Styles CSS personnalisés pour les articles HTML importés';