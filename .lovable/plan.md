## 1. Page `/conseilsmariage` — filtres FR / International

Remplacer le filtre par catégorie (Administratif, Conseils, Guides pratiques…) par un filtre binaire basé sur la langue de l'article :

- **Tous** (par défaut)
- **Français** → `language = 'fr'` (ou null pour les anciens articles)
- **International (English guides)** → `language = 'en'`

Implémentation dans `src/pages/Blog.tsx` :
- Remplacer le `<Select>` actuel par un groupe de 3 boutons / Tabs (style éditorial, cohérent avec la charte sage green / rounded-none).
- `state` : `'all' | 'fr' | 'en'`.
- Filtre : `posts.filter(p => filter === 'all' || (p.language ?? 'fr') === filter)`.
- Afficher un petit badge "EN" sur les cards des articles internationaux (au lieu du badge catégorie actuel) pour clarifier.

## 2. Traduire la page `/conseilsmariage` (core) FR/EN

Ajouter un namespace `blog` (fr + en) à `src/i18n/locales/{fr,en}/blog.json` avec les clés du core de la page :
- `hero.backHome`, `hero.title`, `hero.subtitle`
- `filter.all`, `filter.fr`, `filter.en`
- `card.readArticle`, `card.minutes`
- `empty.noneInCategory`, `empty.noPosts`
- `newsletter.title`, `newsletter.subtitle`, `newsletter.cta`
- `loading`, `error`

Brancher `useTranslation('blog')` dans `Blog.tsx` et enregistrer le namespace dans `src/i18n/index.ts`. Le contenu des articles (titre/contenu) reste dans la langue de l'article — seul le chrome est traduit.

Note : la page d'un article (`BlogPost.tsx`) gère déjà `lang="en"` via Helmet — pas de changement nécessaire ici.

## 3. Traduire `/register` et `/login` (sign-in) FR/EN

Ajouter namespace `auth` (fr + en) couvrant :
- Login : titre, sous-titre, labels email/password, "mot de passe oublié", bouton connexion, lien vers register, messages d'erreur génériques.
- Register : titre, labels (nom, email, password, confirm), CGU, bouton inscription, lien vers login, message de confirmation email.
- Composants partagés du flow auth si réutilisés (ex. callback / email confirmation : hors scope sauf si trivial).

Brancher `useTranslation('auth')` dans `src/pages/auth/Register.tsx` et `src/pages/auth/Login.tsx`. Pas de changement de logique métier (Supabase auth inchangé).

## 4. Indexation Google Search Console

Je peux automatiser via le connecteur Google Search Console déjà disponible :

1. Lister les articles publiés (`blog_posts` where `status='published'`) → construire toutes les URLs `https://mariable.fr/conseilsmariage/{slug}`.
2. Vérifier que `mariable.fr` est bien une propriété GSC vérifiée.
3. Confirmer que le sitemap (`generate-sitemap` edge function) liste bien tous les articles (déjà OK selon le contexte précédent).
4. (Re)soumettre le sitemap via l'API GSC pour forcer un recrawl.

⚠️ L'API GSC **ne permet pas** de forcer l'indexation URL par URL (l'ancien endpoint `urlNotifications` est réservé aux JobPosting / BroadcastEvent). Le seul levier officiel est :
- soumission/resoumission du sitemap (que je peux faire),
- ou clic manuel "Demander l'indexation" dans GSC URL Inspection (à faire par toi, 10 URLs/jour max).

Je te livrerai donc :
- la confirmation que les ~33 URLs sont dans le sitemap,
- la resoumission du sitemap auto,
- la liste des URLs des 5 articles EN à soumettre manuellement en priorité dans GSC URL Inspection (action manuelle, 5 min).

## Détails techniques

- Aucune migration DB (la colonne `blog_posts.language` existe déjà).
- Aucun changement RLS, aucun nouveau secret.
- Fichiers touchés :
  - `src/pages/Blog.tsx` (filtres + i18n)
  - `src/pages/auth/Login.tsx`, `src/pages/auth/Register.tsx` (i18n)
  - `src/i18n/index.ts` (+ resources `blog`, `auth`)
  - `src/i18n/locales/fr/blog.json`, `src/i18n/locales/en/blog.json`
  - `src/i18n/locales/fr/auth.json`, `src/i18n/locales/en/auth.json`
- Respect des règles projet : pas de refacto autre, Playfair / rounded-none / Sage Green conservés, semantic headings inchangés.

## Hors scope (à confirmer si tu les veux ensuite)

- Traduction des emails transactionnels d'auth Supabase (templates).
- Traduction de `ResetPassword.tsx` / `EmailConfirmation.tsx` / `Callback.tsx`.
- Détection auto de la langue à l'arrivée sur `/conseilsmariage/:slug` EN pour basculer l'UI globale.

Confirme-moi et je passe en build.