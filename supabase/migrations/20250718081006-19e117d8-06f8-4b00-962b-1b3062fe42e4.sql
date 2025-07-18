-- Ajouter "France entière" aux régions
ALTER TYPE region_france ADD VALUE 'France entière';

-- Ajouter les nouvelles catégories de prestataires
ALTER TYPE prestataire_categorie ADD VALUE 'Mise en beauté';
ALTER TYPE prestataire_categorie ADD VALUE 'Voiture';
ALTER TYPE prestataire_categorie ADD VALUE 'Invités';