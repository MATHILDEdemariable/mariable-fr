# Parcours pro (dashboard + /pro), image homepage et plan d'optimisation home couples + pros

## 1. Dashboard — « Passer Pro Premium » en modale

Pour un compte pro connecté, le bouton doré « Passer Pro Premium — 149 €/an » n'ouvre plus la page `/partenariat` : il ouvre une modale (fond ivoire `#F8F5EF`, coins carrés) qui reprend l'essentiel de la section « Mariable Pro — ce que comprend vos frais d'adhésion » :

- Titre + prix 149 €/an (soit 12,40 €/mois)
- Liste des avantages (référencement, Instagram, story, article, LinkedIn, tarifs, actualités, accès Pro organisateur OU 3 accès Premium à offrir)
- CTA « Rejoindre Mariable Pro » (ouvre le formulaire de candidature de `/partenariat` dans un nouvel onglet, pour ne pas perdre le dashboard) + lien « Voir les conditions d'admission »
- Bouton fermer

Même comportement sur la version mobile du dashboard. Les particuliers gardent le lien vers `/paiement` (inchangé).

## 2. Bouton « Mes mariages » — vert foncé

Le bouton « Mes mariages » (à côté d'Accueil, desktop et mobile) passe en fond vert foncé (`wedding-olive`) avec texte blanc, pour se distinguer nettement des autres boutons blancs et du vert sauge.

## 3. Page /pro — modifier les mariages

Sur chaque carte mariage de « Mes mariages » :

- Un bouton « Modifier » (icône crayon) ouvre une petite fenêtre avec : prénoms des mariés (titre du mariage, ex. « Camille & Antoine »), date du mariage, lieu, nombre d'invités.
- Enregistrement direct dans l'espace mariage ; la carte et le sélecteur « Mariage en cours » du dashboard se mettent à jour immédiatement.
- La date est toujours affichée sur la carte : si elle n'est pas encore renseignée, on affiche « Date à définir » cliquable pour l'ajouter.
- Le mariage par défaut (créé automatiquement, « Mon mariage ») est modifiable de la même façon.

## 4. Image « Votre mariage, votre organisation » qui ne s'affiche plus

Cause vérifiée : le fichier `dashboard-mockup.png` n'existe plus dans le stockage (le serveur répond « objet introuvable »), donc le cadre reste vide.

Correction : générer une nouvelle capture de l'espace Mariable (ou réutiliser une capture que vous fournissez), l'héberger dans les ressources du site et la brancher à la place de l'ancien lien. Un visuel de secours est prévu pour ne plus jamais afficher un cadre vide.

Si vous préférez fournir votre propre capture d'écran du dashboard, envoyez-la et elle sera utilisée telle quelle.

## 5. Proposition — home page qui parle aux couples ET aux pros

Principe : garder la home actuelle (hero, sélection, espace, prix, guides, blog, témoignages, FAQ) et ajouter un « double regard » ciblé sans dupliquer la page.

1. **Hero** : sous-titre à deux voix, ex. « Les plus beaux lieux et prestataires & l'appli qui vous accompagne jusqu'au jour-J — pour les couples comme pour les professionnels ». Deux CTA côte à côte : « Je me marie » (ancre sélection) / « Je suis un professionnel » (ancre section pro).
2. **Section « Votre mariage, votre organisation »** : ajout d'un petit commutateur « Couples | Professionnels » au-dessus de la grille. Côté pros, les 6 fonctionnalités sont reformulées (rétroplanning par mariage, budget par client, RSVP délégué, plan de table partagé, **coordination Jour-J avec équipe et déroulé partagé**, multi-mariages) et le visuel devient la capture de la page « Mes mariages ».
3. **Nouvelle bande « Vous êtes wedding planner, lieu ou prestataire ? »** (vert sauge, juste après la section espace) : 3 arguments courts — gérer plusieurs mariages au même endroit, une appli Jour-J à partager avec les mariés et l'équipe, visibilité dans la sélection Mariable — et CTA « Découvrir Mariable Pro » vers `/partenariat`.
4. **Section prix** : ajout d'une 3e mention discrète sous les deux cartes : « Professionnel ? Mariable Pro — 149 €/an, accès organisateur illimité » avec lien.
5. **FAQ** : 2 questions ajoutées (« Je suis wedding planner, puis-je gérer plusieurs mariages ? », « Puis-je partager le déroulé du Jour-J avec les mariés et mon équipe ? »).
6. **Textes FR/EN** ajoutés dans les fichiers de traduction existants pour que le toggle reste complet.

Le CTA final et le reste de la page ne changent pas.

## Détails techniques

- `DashboardLayout.tsx` : remplacer le `<Link to="/partenariat">` (desktop + mobile) par un `Dialog` shadcn `ProPremiumModal` (nouveau composant `src/components/pro/ProPremiumModal.tsx`) alimenté par les clés existantes de `partenariat.json` (`mariablePro.*`). Bouton « Mes mariages » : `bg-wedding-olive hover:bg-wedding-olive/90 text-white`.
- `WeddingContext.tsx` : ajouter `updateWedding(id, { title, wedding_date, wedding_location, guest_count })` (update Supabase + mise à jour du state local). La policy RLS « Owners manage their weddings » (FOR ALL, owner_id = auth.uid()) couvre déjà l'UPDATE, aucune migration nécessaire.
- `MesMariages.tsx` : `Dialog` d'édition réutilisant le formulaire de création, bouton crayon par carte, affichage « Date à définir ».
- `EspaceFusionSection.tsx` : nouvelle image via `lovable-assets` (`src/assets/dashboard-mockup.png.asset.json`), suppression du `onError` qui cache l'image, fallback en `bg-editorial-beige`.
- Home pros : `EspaceFusionSection.tsx` (toggle local `audience`), nouveau `ProBandEditorial.tsx`, ajouts dans `PricingEditorial.tsx`, `FAQSection.tsx`, `refonteJuillet.json` FR/EN.
