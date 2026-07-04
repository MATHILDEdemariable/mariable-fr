# Plan — 3 actions

## 1. Migrer "Content Creator Mariage" vers un article de blog

**Objectif :** L'article ne doit plus vivre sur `/content-creator-mariage` (page custom avec packs) mais dans la zone blog (`/conseilsmariage/[slug]`), au même format que les autres articles (via table `blog_posts`).

**Actions :**
- Créer une entrée dans `blog_posts` via migration Supabase (INSERT) avec :
  - `slug` : `best-wedding-content-creator-france`
  - `language` : `fr` (+ variante EN dans une seconde entrée `best-french-wedding-content-creator` pour le toggle FR/EN natif du blog)
  - `title` / `h1_title` : "Best wedding content creator for a French wedding" (FR : "Content creator mariage : le meilleur choix pour un mariage en France")
  - `meta_title` / `meta_description` optimisés autour du mot-clé **"best wedding content creator for france wedding"** / **"french wedding content creator"**
  - `background_image_url` : uploader l'image 1 (jeune femme Paris `mariable.fr`) via Lovable Assets ou bucket `blog-images`, puis coller l'URL
  - `content` (HTML) : version éditoriale reprenant le corps de `ContentCreatorMariage.tsx`, **SANS** les sections "Nos packs Content Creator" ni "Comment ça se passe", **SANS** aucun tarif Mariable.
    - CTA final : bouton "Créer votre compte Mariable" → `/register`
    - Embed / lien vers le post Instagram : `https://instagram.com/p/DYZU7FHDgeF/?img_index=1` (bloc citation + lien "Voir le carousel sur Instagram")
  - `status` : `published`, `published_at` : now()
- Supprimer la route `/content-creator-mariage` dans `src/App.tsx` (import + `<Route>`) et supprimer `src/pages/ContentCreatorMariage.tsx` + les 2 fichiers i18n `contentCreator.json` + la ligne d'enregistrement du namespace dans `src/i18n/index.ts`.
- Ajouter une redirection 301 propre : nouvelle petite route `/content-creator-mariage` → `<Navigate to="/conseilsmariage/best-wedding-content-creator-france" replace />` pour ne pas perdre le SEO existant.

## 2. Refonte SEO du contenu de l'article

Intégré directement dans le HTML du `blog_posts.content` (point 1) :
- **Mot-clé principal** : "best wedding content creator for france wedding" (H1, meta, intro, alt image)
- **Mot-clé secondaire** : "french wedding content creator" (H2, ancres, closing)
- **Structure H2/H3** :
  - H2 : What is a wedding content creator?
  - H2 : Why book a French wedding content creator?
  - H2 : What they capture (stories, reels, aftermovie)
  - H2 : Content creator vs photographer
  - H2 : Real example — see it on Instagram (embed / lien)
  - H2 : FAQ
  - CTA final : créer un compte Mariable
- Alt de l'image hero : "Best wedding content creator for a French wedding — Paris"
- **Supprimé** : "Nos packs Content Creator Mariable" + "Comment ça se passe, concrètement ?" + tout prix (490/890/1490 €).

## 3. Alerte sécurité Supabase (issue GitHub)

**Diagnostic :**
- `.env` est déjà dans `.gitignore` de ce sandbox — donc le fichier local n'est plus tracké côté Lovable.
- L'issue mentionne `SUPABASE_URL` + `anon key` exposés. **Ces deux valeurs sont publiques par design** : elles sont déjà présentes en dur dans `src/integrations/supabase/client.ts` (ligne visible dans le bundle JS du site) et Supabase les envoie au navigateur. **Ce n'est PAS une vulnérabilité en soi** tant que la RLS est active.
- La vraie question : `.env` a-t-il historiquement contenu la **service_role_key** ? Si oui, elle est compromise et doit être tournée immédiatement.

**Recommandation (à faire côté user, pas côté code) :**
1. Vérifier dans le dashboard Supabase → Settings → API si la `service_role_key` a été utilisée en dehors des edge functions. Si un `.env` public a pu la contenir → **rotation immédiate** de la service_role key (bouton "Reset" dans le dashboard). L'anon key peut aussi être rotée par précaution.
2. Auditer les policies RLS : lancer un scan de sécurité sur le projet Lovable (je peux le déclencher).
3. Répondre à l'issue GitHub en expliquant que l'anon key est publique par design + confirmer que RLS protège les données.
4. Aucun changement code nécessaire côté Lovable — `.gitignore` est déjà correct et le client Supabase utilise correctement l'anon key.

**Ce que je ferai côté code :** rien de destructif. Je peux uniquement **lancer un scan de sécurité Supabase** (`security--run_security_scan`) pour vérifier l'état des RLS et te livrer un rapport actionnable.

---

## Questions avant exécution
- **Image hero** : je récupère l'image 1 uploadée (`Capture_d_écran_2026-07-02_à_09.07.19.png`) et la publie via Lovable Assets pour l'utiliser comme `background_image_url`. OK ?
- **Redirection** : je garde `/content-creator-mariage` en 301 vers le nouvel article blog (recommandé pour SEO). OK ?
- **Version EN** : je crée les 2 versions (FR + EN) dans `blog_posts` avec le toggle langue natif du blog, ou seulement une version bilingue ?
