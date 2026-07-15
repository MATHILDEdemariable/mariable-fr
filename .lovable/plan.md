## 1. Refaire le quiz personnalisé

**Problème :** Sur `/planning-personnalise`, si un résultat existe (localStorage ou BDD), on redirige automatiquement vers `/planning-resultats-personnalises` sans possibilité de revenir au quiz. La page résultats n'a aucun bouton "refaire".

**Fix :**
- **`src/pages/PlanningResultatsPersonnalises.tsx`** : ajouter un bouton "Refaire le quiz" (variant outline, wedding-olive) qui :
  - supprime `localStorage.quizResult`
  - supprime la ligne `user_quiz_results` de l'utilisateur connecté (ou passe un flag)
  - navigue vers `/planning-personnalise?retake=1`
- **`src/pages/PlanningPersonnalise.tsx`** : dans `checkExistingQuizResults`, si `searchParams.get('retake') === '1'`, on saute la redirection auto et on nettoie le localStorage. Le quiz s'affiche à nouveau.

Note sur le "mauvais header" : la page résultats utilise `<Header />` (marketing) car c'est une route publique partagée. On la laisse — le bouton "Refaire" + "Accéder à mon tableau de bord" suffisent au parcours. Pas de refactor du layout.

## 2. Sticky menu mobile visible uniquement si connecté

**Problème :** `MobileBottomNav` est monté globalement dans `App.tsx` et se cache uniquement par pattern d'URL. Quand on clique "E-books" depuis le menu hamburger de la landing (route non listée dans `HIDDEN_PATTERNS`), le sticky s'affiche alors qu'on n'est pas connecté.

**Fix :**
- **`src/components/layout/MobileBottomNav.tsx`** : importer `useAuth` et ajouter en tout début de composant :
  ```ts
  const { isAuthenticated, loading } = useAuth();
  if (loading || !isAuthenticated) return null;
  ```
- Conserver `HIDDEN_PATTERNS` pour masquer aussi sur les routes admin/embed/etc même connecté.

Résultat : le sticky bas n'apparaît **jamais** en anonyme, quelle que soit la route. Seul le hamburger en haut à droite reste sur les pages publiques.

## 3. Bandeau "Installer l'application" sur la landing

**Fix :**
- **`src/pages/Index.tsx`** : ajouter un CTA / bandeau discret (mobile-first, sage green sur beige, `rounded-none`) au-dessus ou juste sous le hero, avec :
  - texte "Installer l'application sans téléchargement"
  - bouton `<Link to="/installer-app">` "Découvrir"
  - icône `Smartphone` (lucide)
- Visible sur mobile ET desktop mais compact. Pas de logique de détection PWA — c'est un simple CTA vers `/installer-app`.

## Fichiers modifiés

- `src/pages/PlanningResultatsPersonnalises.tsx` — bouton "Refaire le quiz"
- `src/pages/PlanningPersonnalise.tsx` — support `?retake=1`
- `src/components/layout/MobileBottomNav.tsx` — gate `useAuth`
- `src/pages/Index.tsx` — bandeau CTA installer-app

Aucun changement backend, aucun refactor.