-- Créer la table de synonymes pour mapper les variantes vers les valeurs DB exactes
CREATE TABLE IF NOT EXISTS public.wedding_synonyms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('categorie', 'region')),
  input_value TEXT NOT NULL,
  db_value TEXT NOT NULL,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(type, input_value)
);

-- Index pour optimiser les recherches
CREATE INDEX idx_wedding_synonyms_lookup ON public.wedding_synonyms(type, input_value);

-- Enable RLS
ALTER TABLE public.wedding_synonyms ENABLE ROW LEVEL SECURITY;

-- Policy : lecture publique (pour l'edge function)
CREATE POLICY "Public read access for wedding synonyms"
  ON public.wedding_synonyms
  FOR SELECT
  USING (true);

-- Policy : seuls les admins peuvent modifier
CREATE POLICY "Admins can manage wedding synonyms"
  ON public.wedding_synonyms
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ============================================
-- INSERTION DES SYNONYMES DE CATÉGORIES
-- ============================================

-- Traiteur
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Traiteur', 'Traiteur', 10),
  ('categorie', 'traiteur', 'Traiteur', 10),
  ('categorie', 'TRAITEUR', 'Traiteur', 10),
  ('categorie', 'restauration', 'Traiteur', 5),
  ('categorie', 'catering', 'Traiteur', 5),
  ('categorie', 'buffet', 'Traiteur', 3);

-- Lieu de réception
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Lieu de réception', 'Lieu de réception', 10),
  ('categorie', 'lieu', 'Lieu de réception', 8),
  ('categorie', 'salle', 'Lieu de réception', 8),
  ('categorie', 'domaine', 'Lieu de réception', 8),
  ('categorie', 'château', 'Lieu de réception', 7),
  ('categorie', 'chateau', 'Lieu de réception', 7),
  ('categorie', 'manoir', 'Lieu de réception', 7),
  ('categorie', 'venue', 'Lieu de réception', 5);

-- Photographe
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Photographe', 'Photographe', 10),
  ('categorie', 'photographe', 'Photographe', 10),
  ('categorie', 'photo', 'Photographe', 8),
  ('categorie', 'photos', 'Photographe', 8),
  ('categorie', 'photographie', 'Photographe', 8);

-- Vidéaste
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Vidéaste', 'Vidéaste', 10),
  ('categorie', 'Vidéographe', 'Vidéaste', 10),
  ('categorie', 'videaste', 'Vidéaste', 10),
  ('categorie', 'vidéo', 'Vidéaste', 8),
  ('categorie', 'video', 'Vidéaste', 8),
  ('categorie', 'film', 'Vidéaste', 5);

-- Fleuriste
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Fleuriste', 'Fleuriste', 10),
  ('categorie', 'fleuriste', 'Fleuriste', 10),
  ('categorie', 'fleurs', 'Fleuriste', 8),
  ('categorie', 'bouquet', 'Fleuriste', 5);

-- DJ/Musique
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'DJ/Musique', 'DJ/Musique', 10),
  ('categorie', 'DJ', 'DJ/Musique', 10),
  ('categorie', 'dj', 'DJ/Musique', 10),
  ('categorie', 'musique', 'DJ/Musique', 8),
  ('categorie', 'musicien', 'DJ/Musique', 8),
  ('categorie', 'orchestre', 'DJ/Musique', 7),
  ('categorie', 'groupe', 'DJ/Musique', 5);

-- Coordination (remplace Wedding planner)
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Coordination', 'Coordination', 10),
  ('categorie', 'coordination', 'Coordination', 10),
  ('categorie', 'Wedding planner', 'Coordination', 9),
  ('categorie', 'wedding planner', 'Coordination', 9),
  ('categorie', 'organisateur', 'Coordination', 8),
  ('categorie', 'organisatrice', 'Coordination', 8),
  ('categorie', 'planner', 'Coordination', 7);

-- Décoration (remplace Décorateur)
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Décoration', 'Décoration', 10),
  ('categorie', 'decoration', 'Décoration', 10),
  ('categorie', 'Décorateur', 'Décoration', 9),
  ('categorie', 'decorateur', 'Décoration', 9),
  ('categorie', 'déco', 'Décoration', 8),
  ('categorie', 'deco', 'Décoration', 8);

-- Mise en beauté (remplace Coiffure/Maquillage)
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Mise en beauté', 'Mise en beauté', 10),
  ('categorie', 'mise en beaute', 'Mise en beauté', 10),
  ('categorie', 'Coiffure/Maquillage', 'Mise en beauté', 9),
  ('categorie', 'coiffure', 'Mise en beauté', 8),
  ('categorie', 'maquillage', 'Mise en beauté', 8),
  ('categorie', 'make-up', 'Mise en beauté', 7),
  ('categorie', 'makeup', 'Mise en beauté', 7),
  ('categorie', 'beauté', 'Mise en beauté', 8),
  ('categorie', 'beaute', 'Mise en beauté', 8);

-- Robe de mariée
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Robe de mariée', 'Robe de mariée', 10),
  ('categorie', 'robe', 'Robe de mariée', 8),
  ('categorie', 'robe mariee', 'Robe de mariée', 10),
  ('categorie', 'créateur', 'Robe de mariée', 5),
  ('categorie', 'createur', 'Robe de mariée', 5);

-- Animations
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Animations', 'Animations', 10),
  ('categorie', 'animations', 'Animations', 10),
  ('categorie', 'animation', 'Animations', 10),
  ('categorie', 'jeux', 'Animations', 5),
  ('categorie', 'spectacle', 'Animations', 5);

-- Officiant de cérémonie
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('categorie', 'Officiant de cérémonie', 'Officiant de cérémonie', 10),
  ('categorie', 'officiant', 'Officiant de cérémonie', 10),
  ('categorie', 'ceremonie', 'Officiant de cérémonie', 8),
  ('categorie', 'cérémonie', 'Officiant de cérémonie', 8);

-- ============================================
-- INSERTION DES SYNONYMES DE RÉGIONS
-- ============================================

-- Île-de-France
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Île-de-France', 'Île-de-France', 10),
  ('region', 'Ile-de-France', 'Île-de-France', 10),
  ('region', 'ile de france', 'Île-de-France', 10),
  ('region', 'IDF', 'Île-de-France', 9),
  ('region', 'idf', 'Île-de-France', 9),
  ('region', 'Paris', 'Île-de-France', 8),
  ('region', 'paris', 'Île-de-France', 8),
  ('region', 'région parisienne', 'Île-de-France', 8),
  ('region', 'parisien', 'Île-de-France', 7);

-- Provence-Alpes-Côte d'Azur
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Provence-Alpes-Côte d''Azur', 'Provence-Alpes-Côte d''Azur', 10),
  ('region', 'PACA', 'Provence-Alpes-Côte d''Azur', 9),
  ('region', 'paca', 'Provence-Alpes-Côte d''Azur', 9),
  ('region', 'Côte d''Azur', 'Provence-Alpes-Côte d''Azur', 8),
  ('region', 'cote azur', 'Provence-Alpes-Côte d''Azur', 8),
  ('region', 'Provence', 'Provence-Alpes-Côte d''Azur', 8),
  ('region', 'provence', 'Provence-Alpes-Côte d''Azur', 8),
  ('region', 'Marseille', 'Provence-Alpes-Côte d''Azur', 7),
  ('region', 'Nice', 'Provence-Alpes-Côte d''Azur', 7),
  ('region', 'Cannes', 'Provence-Alpes-Côte d''Azur', 7);

-- Auvergne-Rhône-Alpes
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Auvergne-Rhône-Alpes', 'Auvergne-Rhône-Alpes', 10),
  ('region', 'Auvergne', 'Auvergne-Rhône-Alpes', 8),
  ('region', 'Rhône-Alpes', 'Auvergne-Rhône-Alpes', 8),
  ('region', 'rhone alpes', 'Auvergne-Rhône-Alpes', 8),
  ('region', 'Lyon', 'Auvergne-Rhône-Alpes', 7),
  ('region', 'Grenoble', 'Auvergne-Rhône-Alpes', 7),
  ('region', 'Annecy', 'Auvergne-Rhône-Alpes', 7);

-- Occitanie
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Occitanie', 'Occitanie', 10),
  ('region', 'occitanie', 'Occitanie', 10),
  ('region', 'Toulouse', 'Occitanie', 7),
  ('region', 'Montpellier', 'Occitanie', 7),
  ('region', 'Nîmes', 'Occitanie', 7);

-- Nouvelle-Aquitaine
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Nouvelle-Aquitaine', 'Nouvelle-Aquitaine', 10),
  ('region', 'nouvelle aquitaine', 'Nouvelle-Aquitaine', 10),
  ('region', 'Aquitaine', 'Nouvelle-Aquitaine', 8),
  ('region', 'Bordeaux', 'Nouvelle-Aquitaine', 7),
  ('region', 'Biarritz', 'Nouvelle-Aquitaine', 7);

-- Bretagne
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Bretagne', 'Bretagne', 10),
  ('region', 'bretagne', 'Bretagne', 10),
  ('region', 'Rennes', 'Bretagne', 7),
  ('region', 'Brest', 'Bretagne', 7);

-- Normandie
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Normandie', 'Normandie', 10),
  ('region', 'normandie', 'Normandie', 10),
  ('region', 'Rouen', 'Normandie', 7),
  ('region', 'Caen', 'Normandie', 7);

-- Grand Est
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Grand Est', 'Grand Est', 10),
  ('region', 'grand est', 'Grand Est', 10),
  ('region', 'Strasbourg', 'Grand Est', 7),
  ('region', 'Reims', 'Grand Est', 7),
  ('region', 'Metz', 'Grand Est', 7);

-- Pays de la Loire
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Pays de la Loire', 'Pays de la Loire', 10),
  ('region', 'pays de la loire', 'Pays de la Loire', 10),
  ('region', 'Nantes', 'Pays de la Loire', 7),
  ('region', 'Angers', 'Pays de la Loire', 7);

-- Hauts-de-France
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Hauts-de-France', 'Hauts-de-France', 10),
  ('region', 'hauts de france', 'Hauts-de-France', 10),
  ('region', 'Lille', 'Hauts-de-France', 7),
  ('region', 'Amiens', 'Hauts-de-France', 7);

-- Bourgogne-Franche-Comté
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Bourgogne-Franche-Comté', 'Bourgogne-Franche-Comté', 10),
  ('region', 'bourgogne', 'Bourgogne-Franche-Comté', 8),
  ('region', 'franche comte', 'Bourgogne-Franche-Comté', 8),
  ('region', 'Dijon', 'Bourgogne-Franche-Comté', 7),
  ('region', 'Besançon', 'Bourgogne-Franche-Comté', 7);

-- Centre-Val de Loire
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Centre-Val de Loire', 'Centre-Val de Loire', 10),
  ('region', 'centre val de loire', 'Centre-Val de Loire', 10),
  ('region', 'Centre', 'Centre-Val de Loire', 8),
  ('region', 'Val de Loire', 'Centre-Val de Loire', 8),
  ('region', 'Orléans', 'Centre-Val de Loire', 7),
  ('region', 'Tours', 'Centre-Val de Loire', 7);

-- Corse
INSERT INTO public.wedding_synonyms (type, input_value, db_value, priority) VALUES
  ('region', 'Corse', 'Corse', 10),
  ('region', 'corse', 'Corse', 10),
  ('region', 'Ajaccio', 'Corse', 7),
  ('region', 'Bastia', 'Corse', 7);

COMMENT ON TABLE public.wedding_synonyms IS 'Table de mapping des synonymes et variantes vers les valeurs exactes de la DB pour catégories et régions';