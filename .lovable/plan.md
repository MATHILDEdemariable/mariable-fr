# Plan — 4 chantiers

## 1. Menu sticky bas (mobile PWA)
Nouveau composant `src/components/layout/MobileBottomNav.tsx` :
- 4 items : **Dashboard** (`/dashboard`), **Jour-J** (`/dashboard/mon-jour-m` ou route équivalente à confirmer via `dashboardFeatures.ts`), **Prestataires** (`/professionnels`), **Guides** (`/guides`).
- Fixed bottom, `md:hidden`, safe-area (`pb-[env(safe-area-inset-bottom)]`), fond blanc + border-top olive.
- Icônes lucide (LayoutDashboard, Heart, Search, BookOpen), label court, état actif via `useLocation`.
- Injecté dans `App.tsx` (au niveau global, sous les routes) pour qu'il apparaisse partout sur mobile connecté. Ajout d'un `pb-16 md:pb-0` sur les layouts scrollables si nécessaire.

## 2. Page `/guides` mobile-friendly
Dans `src/pages/GuidesShop.tsx` :
- Grid → `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (au lieu de 1 col sur mobile).
- Cartes compactes : icône + titre 2 lignes (`line-clamp-2`) + prix 4,90 € + bouton "Aperçu" pleine largeur, padding réduit (`p-3`).
- Header page : titre plus petit sur mobile, filtres thèmes en scroll horizontal (`overflow-x-auto flex-nowrap`).
- Modal aperçu/checkout : `max-h-[90dvh] overflow-y-auto`, boutons sticky bas.

## 3. Email d'envoi de guide
Dans `supabase/functions/send-ebook-email/index.ts` :
- Remplacer `from: "Mariable <contact@mariable.fr>"` → `from: "Mariable <mathilde@mariable.fr>"`.
- Remplacer le mail de contact affiché en pied (`contact@mariable.fr`) → `mathilde@mariable.fr`.
- Redéployer la fonction.

## 4. Refonte du quiz mariage (dashboard)

### Objectif
Déterminer le **profil d'organisatrice** de l'utilisatrice → 4 profils :
- **Militaire** — planifie tout, contrôle, deadlines
- **Déléguée** — préfère confier à un pro / wedding planner
- **Détente** — zen, spontanée, peu structurée
- **Débutante** — perdue, besoin d'être guidée pas à pas

### Approche technique
- **Ne plus utiliser la table `quiz_scoring` avec score numérique unique** (c'est ce qui casse la personnalisation aujourd'hui).
- Nouvelle logique : chaque réponse mappe sur **un profil** (A/B/C/D). Le profil majoritaire gagne. Égalité → priorité Militaire > Déléguée > Détente > Débutante.
- Refonte via **migration SQL** :
  - Vider `quiz_questions` et re-seed avec 10 questions, chaque option taggée `profile: 'militaire' | 'deleguee' | 'detente' | 'debutante'`.
  - Ajouter colonne `option_profiles jsonb` à `quiz_questions` (tableau aligné avec `options`).
  - Vider `quiz_scoring` et re-seed avec 4 lignes (une par profil) contenant `status`, `categories`, `objectives` personnalisés.
- Refonte `src/hooks/useWeddingQuiz.ts` : agrégation par comptage de profil au lieu de somme de scores.
- Adaptation `QuizResults.tsx` : afficher le profil + description + 3-5 objectifs personnalisés + CTA vers les outils correspondants (ex. Militaire → planning, Déléguée → prestataires wedding planner, Débutante → guide débutant).

### Les 10 questions (draft à valider en build)

1. **Combien de temps avant le mariage as-tu commencé à organiser ?**
   - +18 mois (Militaire) / 12-18 mois (Déléguée) / 6-12 mois (Détente) / <6 mois ou pas commencé (Débutante)

2. **Comment gères-tu ta to-do liste mariage ?**
   - Notion/Excel ultra détaillé (M) / Je paie qqn pour la gérer (Dé) / Dans ma tête (Dt) / Quelle to-do ? (Db)

3. **Ton budget est-il défini ?**
   - Chiffré au poste près (M) / Un pro s'en occupe (Dé) / Une fourchette large (Dt) / Aucune idée (Db)

4. **Combien de prestataires as-tu déjà contactés ?**
   - +10 (M) / 0, je délègue (Dé) / 2-3 coup de cœur (Dt) / 0, je sais pas par où commencer (Db)

5. **Quand tu penses au Jour-J tu ressens :**
   - Excitation de tout maîtriser (M) / Sérénité, c'est géré (Dé) / Hâte, on verra bien (Dt) / Angoisse, trop de choses (Db)

6. **Tu préfères :**
   - Tout décider toi-même (M) / Qu'un pro décide pour toi (Dé) / Décider au dernier moment (Dt) / Qu'on te propose des options simples (Db)

7. **Sur les prestataires, tu :**
   - Demandes 5 devis et compares (M) / Prends la reco du WP (Dé) / Fais confiance au feeling (Dt) / Tu ne sais pas quoi demander (Db)

8. **Combien d'heures/semaine consacres-tu à ton mariage ?**
   - +10h (M) / <2h, un pro gère (Dé) / 2-5h quand j'ai envie (Dt) / Je sais pas, ça déborde (Db)

9. **Le rétro-planning :**
   - J'en ai un affiché au mur (M) / Le WP l'a fait (Dé) / Bof, ça se fera (Dt) / C'est quoi (Db)

10. **Ton plus grand besoin actuel :**
    - Un outil de coordination puissant (M) / Trouver le bon wedding planner (Dé) / Des idées inspirantes (Dt) / Une checklist claire pour démarrer (Db)

### Résultats (exemples d'objectifs par profil)

- **Militaire** → "Utilise le planning J-J détaillé, le suivi budget par poste, le seating plan et les exports PDF."
- **Déléguée** → "Découvre nos wedding planners partenaires, réserve un rendez-vous, délègue la coordination Jour-M."
- **Détente** → "Explore les moodboards, la sélection coup de cœur de prestataires, et le guide cérémonie laïque."
- **Débutante** → "Commence par le Guide Débutant, la checklist mariage, et la définition budget."

## Détails techniques
- Migration SQL : `alter table quiz_questions add column if not exists option_profiles jsonb;` + truncate + insert.
- Grants déjà en place (tables existantes), pas de nouvelles tables.
- Aucune modification de la structure `user_quiz_results` (les champs `status`, `categories`, `objectives` sont réutilisés — `score` sera stocké = 0 ou nombre de réponses profil majoritaire).
