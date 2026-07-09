-- Supprimer les anciens highlights pour les sections blog et professionnels
DELETE FROM public.instagram_highlights 
WHERE context IN ('blog', 'professionnels', 'both');

-- Insérer les nouveaux coups de cœur
INSERT INTO public.instagram_highlights (
  instagram_url, 
  image_url, 
  caption, 
  context, 
  display_order, 
  active
) VALUES 
(
  'https://www.instagram.com/p/DadPQR8DJOd/', 
  '/__l5e/assets-v1/8d44eca7-9276-4f8c-834a-d68e5ebf47a3/highlight-provence.png', 
  'Mariage en Provence — la sélection de bastides', 
  'both', 
  1, 
  true
),
(
  'https://www.instagram.com/p/DZzluBBjhDl/', 
  '/__l5e/assets-v1/00a6d6a0-7ddd-4604-a483-101450b6e652/highlight-terrasses-paris.png', 
  'Terrasses cachées à Paris pour un mariage — la sélection Mariable', 
  'both', 
  2, 
  true
),
(
  'https://www.instagram.com/p/DZe5qr1Dk2t/', 
  '/__l5e/assets-v1/a6484149-172b-4416-8994-f5d0557c6c59/highlight-bretagne.png', 
  'Mariage en Bretagne — la sélection de lieux Mariable', 
  'both', 
  3, 
  true
),
(
  'https://www.instagram.com/p/DXd-gK7jCWL/', 
  '/__l5e/assets-v1/d3cc5be0-e5d5-456d-8623-cd88d8bb0bc2/highlight-wedding-planners.png', 
  '8 wedding planners reconnues pour leur univers élégant', 
  'both', 
  4, 
  true
);