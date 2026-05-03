## Modifications `/partenariat` — `src/pages/Partenariat.tsx`

### 1. Hero (l. 185-202)
- Garder uniquement le bouton **« Voir les offres »** (centré).
- Déplacer **« Nous contacter »** en haut à gauche, sous le sticky header : nouveau petit bouton fixe/positionné en haut du `<main>` (lien mailto, variant ghost/outline discret, icône Mail).

### 2. Section services (l. 207-262)
- Réduire à **3 cartes** : retirer la carte autonome « Mise en avant Mariable » (l. 56-67).
- Conserver : Création de contenu, Community management, Développement digital.
- Passer la grille `lg:grid-cols-4` → `lg:grid-cols-3`.
- Mettre à jour le sous-titre : « Trois leviers… » au lieu de « Quatre leviers… ».
- Ajouter un **bandeau horizontal** sous la grille des 3 cartes pour la mise en avant Mariable :
  - Fond `premium-sage/10`, icône `Sparkles`, titre « Mise en avant Mariable incluse »,
  - Texte court : publication éditoriale + curation auprès de la communauté Mariable + newsletter +1000 futurs mariés, incluse dans toute formule.

### 3. FAQ (l. 82-123)
- Réécrire toutes les réponses à la **première personne (« je »)** au lieu de « nous » (« j'accompagne », « je conçois », « je construis »…).
- Dans la réponse « Combien coûte… » : préciser **« à partir de 400€ »** (sur devis selon les besoins).
- Adapter aussi la phrase contact (l. 326-327) : « je reviens vers vous sous 48h ».

### 4. Hors scope
- Pas de changement du JSON-LD, des routes, du header, ni du design system.
