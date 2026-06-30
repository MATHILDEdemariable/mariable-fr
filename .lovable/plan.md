# Suppressions demandées

## 1. Section "Jeunes Mariés" (suppression complète)

### Pages publiques à supprimer
- `src/pages/JeunesMaries.tsx` (liste publique)
- `src/pages/JeuneMariesDetail.tsx`
- `src/pages/JeuneMariesInscription.tsx`
- `src/pages/JeuneMariesConfirmation.tsx`
- `src/components/jeunes-maries/` (dossier entier : Card, Filters, ListItem)
- `src/hooks/useJeunesMaries.ts`
- `src/types/jeunes-maries.ts`

### Admin à supprimer
- `src/pages/admin/AdminJeunesMaries.tsx`
- `src/components/admin/JeuneMariesFormViewer.tsx`
- Entrée "Jeunes Mariés" dans `src/components/admin/AdminLayout.tsx`
- Route admin dans `src/pages/admin/AdminDashboard.tsx`

### Routing & liens
- Retirer les 4 routes `/jeunes-maries*` + route admin dans `src/App.tsx` (+ imports lazy)
- Retirer les liens dans `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/ui/breadcrumbs.tsx`, `src/components/SEO.tsx`, `src/components/SEOTestimonial.tsx`
- Retirer les entrées dans `src/pages/Sitemap.tsx`, `src/pages/SitemapHTML.tsx`, `src/pages/NotFound.tsx`, `src/components/admin/maintenance/AppArchitectureView.tsx`, `src/data/fakeTestimonials.ts`
- Retirer la génération dans `supabase/functions/generate-sitemap/index.ts` et `scripts/generate-sitemap.ts`

### Base de données
- Migration Supabase : `DROP TABLE public.jeunes_maries CASCADE;` (+ tables liées si existantes, + policies, + storage bucket éventuel)

## 2. Analyse IA des documents (suppression complète)

### Frontend
- `src/components/documents/DocumentUploader.tsx` : retirer l'appel `supabase.functions.invoke('analyze-document')` et l'état `analyzing`, garder l'upload simple
- `src/components/documents/DocumentCard.tsx` : retirer le bloc `ai_summary` (lignes 99-107) et les champs du type
- `src/pages/dashboard/DocumentsPage.tsx` : retirer l'affichage du résumé IA (ligne 182) et tout bouton "Analyser"

### Backend
- Supprimer `supabase/functions/analyze-document/` (dossier entier)
- Retirer l'entrée dans `supabase/config.toml` si présente
- Migration : `ALTER TABLE public.wedding_documents DROP COLUMN ai_summary, DROP COLUMN ai_key_points, DROP COLUMN is_analyzed;`

## Vérifications après build
- Build TS passe (aucune ref orpheline aux composants supprimés)
- `/dashboard/documents` : upload OK sans bouton/affichage IA
- `/jeunes-maries` → 404 propre
- Header/Footer ne contiennent plus le lien
- Sitemap régénéré sans URLs jeunes-mariés

## Notes
- Action irréversible côté DB (données jeunes_maries et colonnes IA perdues). La migration sera soumise pour approbation avant exécution.
- Les articles de blog et témoignages SEO génériques restent inchangés ; seules les références directes à la section sont retirées.
