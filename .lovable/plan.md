
# Plan — /versionjuin26 : mockup dashboard, freemium, e-shop guides, fix paiement

## 1. EspaceApercu.tsx — Remplacer le mockup iPhone par un mockup plateforme web

Refonte du composant pour afficher une fenêtre navigateur stylisée (à la place du téléphone) reprenant la vraie structure du dashboard utilisateur (image 4) :

- Barre navigateur (3 dots rouge/jaune/vert + barre URL `mariable.fr/dashboard`)
- Header interne : logo "M." + bouton "Mon compte"
- Sidebar gauche "Mon espace" avec items : Tableau de bord (actif, fond sage), Check-list, Retroplanning, Budget, Prestataires, Planning Jour-J (badge Exclusif), RSVP Invités, Plan de table, Moodboard, Cérémonie
- Zone principale : 
  - Titre serif "Bienvenue, Mathilde !" + date
  - 3 cartes stats : "Compte à rebours · J-127", "165 invités prévus", "85% organisation complétée" (avec barre de progression sage)
  - Carte "Guide de démarrage" + "Guide vidéo"
- Aesthetic editorial (sage green, beige, serif Playfair pour titres, rounded-none)
- Responsive : mockup pleine largeur sur desktop, version compacte mobile (cacher sidebar ou la mettre au-dessus)

La liste des features à droite du mockup est conservée mais le titre devient "Tout, dans un seul espace web."

## 2. FreemiumSection.tsx — Réécrire les contenus free vs premium

**Mariable Gratuit (0€) :**
- Tous les services en ligne (rétroplanning, budget, invités, plan de table, coordination, calculateur de boissons)
- Liste de prestataires recommandés Mariable
- Accès au blog & conseils
- *Limites :*
  - Génération planning IA limitée
  - Stockage documents & informations limités
  - Exports PDF des espaces & guides non inclus

**Mariable Premium (29€ à vie) :**
- Tous les services sans limite
- Génération planning IA illimitée
- Exports PDF illimités (espaces + guides)
- Stockage illimité
- Accès à toute la bibliothèque de guides & ebooks (témoins, mariée, prestataires, organisation débutant…)
- Support prioritaire & mises à jour à vie

**+ Ajout d'une 3ᵉ carte (ou bandeau bas) :** « E-books & guides digitaux — à l'unité dès 4€ » avec CTA « Voir l'e-shop » → lien vers `/guides`.

## 3. Nouvelle page e-shop `/guides` (GuidesShop.tsx)

Page publique listant les guides PDF achetables à l'unité (sans abonnement). Esthétique editorial cohérente.

Liste des guides (depuis image 2) :
1. Checklist mariage Civil — Mairie
2. Checklist cérémonie (Laïque ou Catholique)
3. Guide témoins
4. Guide planning Jour-J
5. Checklist photo du Jour-J
6. Guide mariée
7. Guide Organisation complète (pour débutants)
8. Guide prestataires de mariage

Pour chaque guide : couverture (placeholder editorial sage/beige avec titre serif), titre, court descriptif, prix (4€ à 9€ selon longueur), bouton "Acheter" (placeholder — Stripe à brancher dans une 2ᵉ étape, voir section technique).

Bandeau haut : « Tous ces guides sont **inclus gratuitement** dans Mariable Premium (29€ à vie) → plus rentable dès 4 guides. » + CTA Premium.

Route ajoutée dans `App.tsx` : `/guides` → `GuidesShop`.

## 4. Lien e-shop dans la nav + footer

Ajouter un lien "E-shop guides" :
- Dans le header (`PremiumHeader`) en lien discret
- Dans le footer (colonne Produit ou Ressources)

## 5. Fix page `/paiement` — Header + prix

Le composant `Paiement.tsx` n'utilise pas le bon header et affiche un mauvais prix. Corrections :
- Remplacer le header actuel par `<PremiumHeader />` (même que le reste du site v2)
- S'assurer que tous les affichages de prix montrent **29€** (et 59€ barré si pertinent), cohérent avec `pricing.json` source of truth
- Garder le footer standard

## Section technique

**Architecture e-shop guides — phase 1 (cette itération) :**
- Création page statique `GuidesShop.tsx` avec données guides en dur dans un fichier `src/data/guides.ts` (titre, slug, prix, description, image placeholder)
- Boutons "Acheter" branchés sur un handler `handlePurchase(slug)` qui pour l'instant ouvre un modal "Bientôt disponible" OU redirige vers `/paiement?guide={slug}` selon préférence — **à confirmer** : je propose modal "Bientôt disponible" + mailto pour ne pas créer de fausse promesse Stripe.

**Phase 2 (hors scope immédiat — à valider séparément) :**
- Table Supabase `guides` + `guide_purchases`, bucket privé `guides-pdf`, edge function `create-guide-checkout` (Stripe), RLS.

**Mockup dashboard (EspaceApercu) :**
- 100% HTML/Tailwind, aucun screenshot, aucune dépendance ajoutée
- Tokens utilisés : `editorial-olive`, `editorial-beige`, `editorial-cream`, `editorial-noir`, font-serif (Playfair)
- Mobile : sidebar masquée, on garde uniquement la zone principale en stack vertical

**Fichiers modifiés/créés :**
- `src/components/home/v2/EspaceApercu.tsx` (refonte mockup)
- `src/components/home/v2/FreemiumSection.tsx` (contenus + 3ᵉ carte e-shop)
- `src/data/guides.ts` (nouveau)
- `src/pages/GuidesShop.tsx` (nouveau)
- `src/App.tsx` (route `/guides`)
- `src/components/home/PremiumHeader.tsx` (lien E-shop) + `src/components/Footer.tsx`
- `src/pages/Paiement.tsx` (header + prix 29€)

## Question avant exécution

1. **Boutons "Acheter" e-shop** : modal "Bientôt — me prévenir par email" (recommandé), OU brancher tout de suite Stripe via edge function (ajoute ~1 batch supplémentaire avec migration table + bucket + webhook) ?
2. **Prix unitaire des guides** : tous à 4€, ou échelle 4€/6€/9€ selon densité ?
