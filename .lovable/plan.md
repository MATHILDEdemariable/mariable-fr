# Section « Frais d'adhésion » — mise en page 2 colonnes

## Objectif
Dans la section Mariable Pro (frais d'adhésion) de `/partenariat`, présenter à gauche la liste des inclusions en bullet points ✓, et à droite un bloc prix avec deux CTA.

## Colonne gauche — liste ✓
- Référencement sur Mariable.fr
- Carrousel Instagram dédié
- Story d'annonce du partenariat
- Article sur Mariable.fr
- Mise en avant LinkedIn
- Actualisation des tarifs toute l'année
- Relais de vos actualités en story à votre demande :-)
- 🎁 5 accès Mariable Premium à offrir à vos mariés (service premium pour la coordination du jour J)

Cette liste remplace la grille actuelle des 5 cartes « features ».

## Colonne droite — bloc prix
- Badge offre de rentrée, prix barré 200 €/an, 149 €/an, mention « soit 12,40 €/mois »
- CTA principal « Rejoindre Mariable Pro » (ouvre le modal de contact, sujet pré-rempli, comme aujourd'hui)
- CTA secondaire « Voir les conditions d'admission » qui ouvre un **modal** sur la même page reprenant le contenu des conditions (métiers éligibles + grille tarifaire détaillée avec l'exemple photographie)

## Détails techniques
- `src/pages/Partenariat.tsx` : section `#mariable-pro` passe en `grid lg:grid-cols-[1fr_380px]` ; liste ✓ à gauche, carte prix sticky à droite. Nouveau state `conditionsOpen` + `Dialog` (shadcn) réutilisant les clés `conditions.*` existantes.
- La section « Conditions d'admission » actuelle reste en place plus bas (le modal en est une reprise), sauf indication contraire.
- i18n : remplacer `pro.features` par un tableau `pro.included` (strings) dans `src/i18n/locales/fr/partenariat.json` et `en/partenariat.json`, ajouter `pro.ctaConditions`.
- Design conservé : beige clair, vert sauge (editorial-olive), `rounded-none`, Playfair.
