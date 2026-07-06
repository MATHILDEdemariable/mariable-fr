
# Map prestataires + Mise en avant Instagram

Objectif : enrichir la découverte des pros sans transformer Mariable en plateforme de réservation. Deux ajouts qui servent le modèle **Club Mariable** (adhésion pro payante = plus de visibilité).

---

## 1. Map interactive des prestataires (Leaflet + OSM, gratuit)

**Où** : nouvel onglet "Carte" sur `/dashboard/professionnels` (à côté de la liste), + version publique sur `/professionnels`.

**Données** : `prestataires_rows` a déjà `latitude` / `longitude` — 166 des 264 pros visibles sont géolocalisés. Les 98 restants seront traités séparément (script de géocodage à partir de `ville` — hors scope de ce plan).

**Fonctionnement** :
- Carte France centrée, clustering des pins (nombreux pros à Paris/Provence).
- Filtres réutilisés (catégorie, région, recherche) → la carte se met à jour en direct via le même `useOptimizedVendors`.
- Pin cliqué → popup avec photo, nom, ville, catégorie, bouton "Voir la fiche" (→ `/prestataire/:slug`).
- Adhérents Club Mariable = pin doré/plus gros (mise en avant visuelle liée au business model).

**Stack** : `leaflet` + `react-leaflet` + `leaflet.markercluster`. Aucune clé API.

---

## 2. Mise en avant Instagram (éditorial curaté)

**Concept** : toi (admin) sélectionnes des posts Instagram inspirants → ils s'affichent en grille cliquable sur le blog + sur la page pros. Clic sur l'image → ouvre le post Instagram dans un nouvel onglet. Positionnement média/prescripteur, pas de scraping.

### Nouvelle table `instagram_highlights`
| Champ | Type |
|---|---|
| `id` | uuid |
| `instagram_url` | text (le lien du post) |
| `image_url` | text (miniature uploadée manuellement dans bucket `visuels`) |
| `caption` | text nullable |
| `prestataire_id` | uuid nullable → FK `prestataires_rows` |
| `context` | text (`blog`, `professionnels`, `both`) |
| `display_order` | int |
| `active` | boolean |
| `created_at`, `updated_at` | timestamps |

RLS : lecture publique (anon+authenticated), écriture réservée `is_admin()`. Grants standards.

### Back-office admin
Nouvel onglet dans `/admin/prestataires` : "Sélection Instagram" — CRUD simple : coller URL Insta, uploader miniature, choisir contexte + ordre, lier optionnellement à un pro existant.

### Affichage front
- **Blog** (`/conseilsmariage`) : nouvelle section "Inspirations Instagram" en bas de l'index → grille 5×2 masonry. Titre : "Sélection Mariable du moment".
- **Pros** (`/professionnels`) : section "Coups de cœur Instagram" au-dessus de la liste. Si le highlight est lié à un pro Club Mariable → mini-badge "Découvrir ce prestataire" qui renvoie vers sa fiche.

Grille inspirée du visuel que tu as partagé : images carrées, hover léger, icône Instagram en overlay.

---

## Pourquoi ça sert le business

1. **Map** = argument de vente pour l'adhésion pro (pin premium visible = valeur tangible).
2. **Instagram curaté** = pas de bypass possible (tu ne fais pas de mise en relation transactionnelle), tu deviens prescripteur média, ce qui **justifie l'adhésion** (être choisi éditorialement) et **crée du trafic vers les pros** sans passer par un formulaire de devis.
3. **Base qualitative pour matching IA plus tard** : chaque highlight lié à un pro enrichit progressivement la data (style visuel, ambiance). C'est l'embryon d'un matching par vibe sans avoir à tout tagger manuellement dès le départ.

---

## Hors scope (à traiter séparément si tu valides)

- Géocodage automatique des 98 pros sans coordonnées (script one-shot via Google Places API — clé déjà en secret).
- Enrichissement IA de la database (scrape site pro + Insta → tags auto). Complexe, à cadrer dans un plan dédié après validation du modèle Club Mariable.
- Audit RLS (que tu as choisi de traiter hors de ce plan — tu peux lancer le scan quand tu veux, je resterai dispo).

---

## Détails techniques

- Package : `bun add leaflet react-leaflet leaflet.markercluster @types/leaflet`
- Import CSS Leaflet dans `src/main.tsx`
- Nouveau composant : `src/components/vendors/VendorsMap.tsx`
- Nouveau composant : `src/components/instagram/InstagramHighlightsGrid.tsx`
- Nouvelle page admin : `src/components/admin/InstagramHighlightsAdmin.tsx` (onglet dans `AdminPrestataires`)
- Migration Supabase : table `instagram_highlights` + RLS + grants + trigger `updated_at`
- Hook : `useInstagramHighlights({ context })` avec React Query, staleTime 5 min.
