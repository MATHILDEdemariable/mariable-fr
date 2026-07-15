## Diagnostic

Le quiz `/planning-personnalise` monte `WeddingQuiz` (v2), qui appelle `generateQuizResult` de `src/components/wedding-assistant/v2/types.ts`. Cette fonction **additionne** les scores des 10 réponses (total entre 10 et 40) puis cherche un niveau où `score_min ≤ total ≤ score_max`.

Or en base `quiz_scoring` a `score_min = score_max ∈ {1, 2, 3, 4}` (chaque code = un profil). Aucun total entre 10 et 40 ne matche → la fonction tombe systématiquement dans le **fallback hardcodé** qui renvoie :
- `averageScore ≤ 2` → "Début de planification"
- `≤ 4` → "Planification en cours"
- sinon → "Finalisation"

C'est exactement ce que tu vois. Les vrais profils (Militaire / Déléguée / Détente / Débutante) sont bien en base mais ne sont jamais atteints.

Le calcul correct existe déjà dans `src/hooks/useWeddingQuiz.ts` (compte des occurrences du code, profil majoritaire l'emporte, égalité tranchée en faveur du code le plus petit).

## Correction (frontend only, aucun changement DB)

### 1. `src/components/wedding-assistant/v2/types.ts` — Réécrire `generateQuizResult`

Remplacer la logique "somme + fallback moyenne" par la logique "profil majoritaire" :

- Compter les occurrences de chaque code (1, 2, 3, 4) dans `answers`.
- Élire le code avec le plus d'occurrences, égalité → code le plus petit (Militaire > Déléguée > Détente > Débutante).
- Charger `quiz_scoring` depuis Supabase, trouver la ligne où `winningCode` ∈ [`score_min`, `score_max`].
- Retourner `{ score: winningCode, status, level: status, objectives, categories }`.
- Supprimer le fallback hardcodé "Début de planification" / "Planification en cours" / "Finalisation" — le remplacer par un fallback sûr sur "Débutante" si la table est injoignable.

### 2. `src/pages/PlanningResultatsPersonnalises.tsx` — Nettoyer les anciens résultats

La ligne existante dans `user_quiz_results` de ton compte contient encore l'ancien statut ("Début de planification"). Deux options :

- **A. Auto-nettoyage** : au chargement, si `status` ∈ `['Début de planification', 'Planification en cours', 'Finalisation']`, ignorer la ligne DB et rediriger vers `/planning-personnalise?retake=1`.
- **B. Rien** : laisser l'utilisateur cliquer "Refaire le quiz" qui purge déjà DB + localStorage.

→ Je pars sur **A** pour que tu voies immédiatement le bon profil au prochain chargement, sans devoir recliquer.

### 3. Aucune modification de :
- `useWeddingQuiz.ts` (calcul déjà correct, non utilisé par la v2)
- `quiz_questions` / `quiz_scoring` (données OK)
- Le composant `WeddingQuiz.tsx` lui-même (le rendu et la sauvegarde sont OK, seule la fonction de calcul est cassée)

## Récap du calcul final (validé)

| Réponses sélectionnées | Code compté | Profil final |
|---|---|---|
| Majorité de "1" | Militaire | Organisation stratégique, contrôle, budget détaillé |
| Majorité de "2" | Déléguée | Wedding planner, coordination pro, sérénité |
| Majorité de "3" | Détente | Inspiration, coup de cœur, personnalisation |
| Majorité de "4" | Débutante | Démarrage, checklist, guides |
| Égalité | Code le plus petit gagne | Militaire > Déléguée > Détente > Débutante |

## Vérification après implémentation

1. Aller sur `/planning-resultats-personnalises` → doit rediriger vers le quiz (car ancien statut détecté).
2. Refaire le quiz avec 10 réponses "1" → doit afficher **Militaire**.
3. 10 réponses "3" → **Détente**.
4. 5×"2" + 5×"3" → **Déléguée** (égalité tranchée par code le plus petit).
