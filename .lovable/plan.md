## Phase A + B — Backfill meta_descriptions FR puis 5 articles SEO/GEO EN

### Phase A — Backfill meta_descriptions (23 articles FR)

**Constat** : 23 articles publiés ont `meta_description IS NULL` → Google génère un snippet pauvre, CTR amputé.

**Approche** : script local one-shot via skill `ai-gateway` (Lovable AI Gateway, modèle `google/gemini-3-flash-preview`).

Étapes :
1. Pour chaque article sans meta, extraire les 600 premiers caractères de `content` (HTML strip).
2. Prompt unique → output JSON `{ slug, meta_description }` (140-155 caractères, format actif, intègre 1 mot-clé du titre, finit sans ellipse).
3. Boucle 23 appels (delay 1s) → fichier `/tmp/meta-backfill.json`.
4. Relecture rapide manuelle dans le chat (résumé tableau) → si OK, `supabase--insert` en batch UPDATE.

Pas de migration. Pas de touchage du `content`. Pas de touche au front (le rendu Helmet lit déjà `meta_description`).

### Phase B — 5 articles EN destination wedding France

#### B.1 — Schéma : ajouter `language` à `blog_posts`

Migration unique :
```sql
ALTER TABLE public.blog_posts ADD COLUMN language text NOT NULL DEFAULT 'fr';
CREATE INDEX idx_blog_posts_language ON public.blog_posts(language) WHERE status='published';
```
Backfill implicite : tous les articles existants restent `fr`. Les 5 nouveaux insérés en `en`.

#### B.2 — Front : exposition bilingue

Hook lecteur :
- `src/pages/Blog.tsx` (liste) : filtrer par `language` selon `i18n.language` (fr par défaut). Toggle FR/EN existant déclenche le refetch.
- `src/pages/BlogArticle.tsx` (détail) : pas de changement de route — slugs uniques côté EN, lecture transparente. Ajouter `<html lang={article.language}>` via Helmet et `<link rel="alternate" hreflang>` si la traduction FR existe (futur).

Pas de route `/en/blog/…` : on garde `/blog/{slug}` et on s'appuie sur la langue de l'article (cohérent avec la décision routing). Sitemap continue d'inclure les 5 nouvelles URLs sans préfixe.

#### B.3 — Génération des 5 articles via Lovable AI Gateway

Script `/tmp/generate-en-articles.py` (skill ai-gateway), un appel par article avec :

- System prompt = règles du prompt blog SEO Mariable (mem://features/blog-seo-generation-prompt) traduit EN
- Structured output schema : `{ title, meta_title, meta_description, h1_title, slug, h2_titles[], content (HTML), tags[] }`
- Modèle : `google/gemini-3-flash-preview` (suffisant et économique pour rédaction longue)

Articles à produire :

| # | Slug EN | Keyword primaire | Angle |
|---|---|---|---|
| 1 | `how-to-plan-a-wedding-in-france` | destination wedding france | Pilier : timeline + équipe + budget + venue finder Mariable |
| 2 | `best-wedding-venues-france-foreigners` | wedding venues france | Châteaux + Provence + Loire + lien direct vers `/professionnelsmariable` |
| 3 | `getting-married-in-france-as-a-foreigner` | wedding in france foreigner | Légal civil + symbolique + 28 jours obligatoires |
| 4 | `wedding-planner-vs-mariable-app` | do i need a wedding planner france | Comparatif 5000€ planner vs 29€ Mariable Premium |
| 5 | `where-to-get-married-in-france-region-guide` | where to get married in france | Comparatif régions, maille vers les 13 pages `/mariage-*` |

Structure imposée à chaque article :
- 1500-2200 mots
- H1 unique, H2 en format question-réponse (≥6)
- 3-5 liens internes (`/professionnelsmariable`, `/mon-jour-m`, pages régionales)
- Encart "Mariable's hand-picked vendor book" (CTA carnet d'adresses)
- Mention Instagram `@mariable.fr` avec lien dans la conclusion
- 1 FAQ (5 Q/R) en fin d'article → injectée comme `FAQPage` JSON-LD côté `BlogArticle.tsx` (le composant lit déjà `h2_titles`/structure)
- `tags`: `['destination-wedding', 'france', 'international', 'english']`
- `category`: `'international-guides'`

#### B.4 — Insertion en base

Une fois les 5 articles validés (drafts inspectables dans `/tmp/`), insertion via `supabase--insert` :
- `status = 'published'`
- `language = 'en'`
- `published_at = now()`
- `featured = true` (les 5)

#### B.5 — Sitemap + indexation

- Vérifier que `supabase/functions/generate-sitemap/index.ts` inclut bien `blog_posts` toutes langues confondues. Si filtre `language='fr'`, retirer.
- Après publication : pinger Google via GSC sitemap submit (URL `https://www.mariable.fr/sitemap.xml` déjà soumise → re-submit pour forcer re-crawl).

### Phase C (différée — déjà actée memory) — Renforcement marque

Hors scope de ce plan, à proposer ensuite :
- CTA persistante "Browse the address book" dans le layout `BlogArticle.tsx`
- Lien Instagram dans le footer EN

### Fichiers modifiés
- **Migration** : 1 (ajout colonne `language`)
- **Script génération** : `/tmp/generate-en-articles.py` (jetable)
- **Script meta-backfill** : `/tmp/backfill-meta.py` (jetable)
- **Front** : `src/pages/Blog.tsx` (filtre language)
- **Détail blog** : `src/pages/BlogArticle.tsx` (hreflang + lang attr + FAQPage JSON-LD si non présent)
- **Sitemap** : `supabase/functions/generate-sitemap/index.ts` (vérif filtre)

### Validation
- Tableau récap des 23 meta dans le chat avant insert
- Pour les 5 articles EN : title + meta + premier H2 affichés dans le chat avant insert (pas tout le corps)
- Post-publication : test manuel `https://www.mariable.fr/blog/how-to-plan-a-wedding-in-france` → vérif Helmet, JSON-LD, langue
