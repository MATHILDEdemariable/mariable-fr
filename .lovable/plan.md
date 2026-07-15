## Problème

La page `/planning-resultats-personnalises` est **statique** :
- Elle affiche toujours "Félicitations pour votre mariage à venir !" + le même bloc "Continuez votre organisation", quel que soit le résultat.
- Elle ne lit **jamais** `localStorage.quizResult` ni la table `user_quiz_results` → l'utilisateur ne voit pas son profil (Militaire / Déléguée / Détente / Débutante), ni ses catégories, ni ses objectifs.
- Elle utilise `<Header />` (marketing) + `<Footer />` alors que l'utilisateur vient du dashboard → mauvais header.

## Fix

### 1. Afficher le vrai résultat du quiz

Dans `src/pages/PlanningResultatsPersonnalises.tsx` :

- Au montage : charger le résultat depuis `localStorage.getItem('quizResult')`. Si absent et user connecté → lire la dernière ligne de `user_quiz_results` (colonnes `status`, `level`, `categories`, `objectives`, `score`).
- Si aucun résultat trouvé → rediriger vers `/planning-personnalise`.
- Afficher dans la card principale :
  - Titre "Votre profil : **{status}**" (ex. "Détente")
  - Sous-titre "Félicitations pour votre mariage à venir !"
  - Badges des `categories` (chips sage green)
  - Bloc "Vos objectifs prioritaires" avec la liste `objectives`
- Garder les deux boutons existants : "Accéder à mon tableau de bord" + "Refaire le quiz".
- Garder la section "Continuez votre organisation" (elle est utile).

### 2. Corriger le header

Remplacer `<Header />` + `<Footer />` par `<DashboardLayout>` autour du contenu quand l'utilisateur est **authentifié** (via `useAuth`). Fallback marketing (`<Header />/<Footer />`) uniquement si non connecté (parcours quiz anonyme depuis la landing).

## Fichier modifié

- `src/pages/PlanningResultatsPersonnalises.tsx` — chargement du résultat + affichage profil/objectifs + wrapping conditionnel `DashboardLayout`.

Aucun changement de route, aucun changement backend, aucun refactor du quiz lui-même.