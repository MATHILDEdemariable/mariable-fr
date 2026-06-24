## Objectif
1. Supprimer la section bonus « 🎠 Carrousel Instagram » de l'article « Mariage en canicule ».
2. Vérifier/soumettre le sitemap à jour sur Google Search Console.

## Étapes

### 1. Nettoyer le contenu de l'article
Exécuter un `UPDATE public.blog_posts` qui remplace le champ `content` par la version sans la section carrousel (suppression du `<hr />`, du `<h2>🎠 Bonus…</h2>` et de la liste `<ol>` des 9 slides). Le reste du contenu (intro + 6 sections + CTA) reste inchangé.

`WHERE slug = 'mariage-canicule-guide-complet-survivre-profiter-30-degres'`

### 2. Vérifier le sitemap sur Google Search Console
Via le connecteur Google Search Console déjà lié :
- Lister les sites vérifiés (`GET /webmasters/v3/sites`) pour confirmer `https://mariable.fr/` est bien enregistré.
- Vérifier les sitemaps soumis (`GET /webmasters/v3/sites/https%3A%2F%2Fmariable.fr%2F/sitemaps`) et leur date `lastSubmitted` / `lastDownloaded`.
- Soumettre/re-soumettre le sitemap principal si nécessaire (`PUT .../sitemaps/<url-encoded-sitemap-url>`).
- Inspecter rapidement l'URL du nouvel article (`POST /v1/urlInspection/index:inspect`) pour vérifier qu'il est connu de Google ; sinon, indiquer la marche à suivre (« Demander une indexation » dans GSC).

### 3. Restitution
Rendre au format markdown :
- ✅ confirmation de la modification de l'article
- 📊 état du sitemap (date dernière lecture par Google, nombre d'URL découvertes)
- 🔍 état d'indexation du nouvel article + instructions si action manuelle requise (bouton « Demander une indexation » dans l'interface GSC)

## Notes techniques
- Aucune modification de code applicatif ni de schéma.
- Le sitemap est régénéré côté Mariable via edge function — pas de fichier `public/sitemap.xml` à éditer (cf. mémoire `sitemap-delivery-strategy`).
- Toutes les opérations Google passent par le gateway connecteur (`connector-gateway.lovable.dev/google_search_console/...`).
