## Objectif

1. **`/guides`** (marketplace public) : 7 ebooks à **4 €** via **1 seul Price Stripe partagé**, livraison email + page token `/mes-guides/[token]`.
2. **`/dashboard/guides`** (Premium) : mêmes 7 PDFs, téléchargement direct gratuit pour les Premium.

## Éléments fournis

- **Price ID Stripe partagé** : `price_1Tqv7UKHghqBzkgj4mOMVYty` (produit `prod_UqcMXTc9H2lUFH`, 4 €)
- **7 PDFs identifiés** dans les uploads → à placer dans un bucket privé `ebooks/{slug}.pdf`

| PDF source | slug | thème |
|---|---|---|
| `..._Catalogue_Prix_Mariage_2026_en_France.pdf` | `catalogue-prix-mariage-2026` | `budget` |
| `..._Organiser_la_Crmonie_Laque.pdf` | `guide-ceremonie-laique` | `ceremonie` |
| `..._Dbutants_Mariage.pdf` | `guide-debutants-mariage` | `organisation` |
| `..._Do_Dont_du_Discours_de_Mariage.pdf` | `guide-discours-mariage` | `temoins` |
| `..._Checklist_pour_les_Tmoins.pdf` | `checklist-temoins` | `temoins` |
| `..._Slection_des_prestataires_Checklist_questions_poser.pdf` | `checklist-questions-prestataires` | `prestataires` |
| `..._Checklist_pour_la_Marie.pdf` | `checklist-mariee` | `mariee` |

## Architecture

### Storage
- Nouveau bucket **privé `ebooks`** (via `supabase--storage_create_bucket`)
- Copie des 7 PDFs → `ebooks/{slug}.pdf`
- **Source unique** partagée entre marketplace et dashboard Premium

### Table `ebook_purchases`
```sql
CREATE TABLE public.ebook_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  access_token text NOT NULL UNIQUE,
  guide_slug text NOT NULL,
  stripe_session_id text UNIQUE,
  amount_paid integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
```
+ GRANTs `service_role` uniquement, RLS strict, 2 RPCs SECURITY DEFINER :
- `get_purchases_by_token(token)` → liste des guides pour la page `/mes-guides/:token`
- `get_token_by_session(session_id)` → utilisée par `/mes-guides/pending`

### Edge functions
- **`create-ebook-checkout`** : `{ guideSlug, email }` → session Stripe avec `price_1Tqv7UKHghqBzkgj4mOMVYty` + `metadata: { type: 'ebook', guide_slug }` + `custom_text.submit.message` = titre du guide
- **`stripe-webhook`** (étendue) : sur `checkout.session.completed` avec `metadata.type === 'ebook'` → génère `access_token` (crypto), insert `ebook_purchases`, appelle `send-ebook-email`
- **`send-ebook-email`** : Resend, lien `https://www.mariable.fr/mes-guides/{token}`
- **`get-ebook-download-url`** : deux modes
  - **Public** (`{ token, slug }`) : vérifie via RPC → URL signée Storage 1 h
  - **Auth** (`{ slug }` + JWT) : vérifie `profiles.subscription_type = 'premium'` → URL signée 1 h

### Frontend
- **`/guides`** : bouton « Acheter 4 € » → modal email → `create-ebook-checkout` → redirect Stripe
- **`/mes-guides/pending?session_id=…`** : polling 2-3 s, puis redirect `/mes-guides/{token}` (page « Merci pour votre achat »)
- **`/mes-guides/:token`** : liste des guides achetés + « Télécharger » (URL fraîche) + « Renvoyer email »
- **`/dashboard/guides`** : refonte pour consommer `GUIDES` de `src/data/guides.ts` (source unique), bouton « Télécharger » appelle `get-ebook-download-url` mode auth. Comportement Free (lock + `PremiumModal`) conservé.

## Fichiers

**Nouveaux**
- `supabase/functions/create-ebook-checkout/index.ts`
- `supabase/functions/send-ebook-email/index.ts`
- `supabase/functions/get-ebook-download-url/index.ts`
- `src/pages/MesGuides.tsx`
- `src/pages/MesGuidesPending.tsx`
- Migration SQL (table + RPCs + RLS + GRANTs)

**Modifiés**
- `src/data/guides.ts` : ajout thème `budget`, remplacement par les 7 nouveaux guides (tous 4 €) + champ `stripePriceId` partagé
- `src/pages/GuidesShop.tsx` : modal achat réelle, filtre `budget`
- `src/pages/dashboard/GuidesPage.tsx` : consomme `GUIDES` + télécharge via `get-ebook-download-url`
- `supabase/functions/stripe-webhook/index.ts` : handler ebook
- `src/App.tsx` : routes `/mes-guides/*`
- `src/i18n/locales/{fr,en}/weddingDay.json` : 7 nouvelles entrées `guides.items.*`

## Ordre d'exécution (mode build)

1. Créer bucket `ebooks` + copier les 7 PDFs
2. Migration SQL (table + RPCs)
3. 3 edge functions + extension `stripe-webhook`
4. Refonte `/guides` + `/dashboard/guides` + pages `/mes-guides/*`
5. Test : achat Stripe test → email → page token → download, + login Premium → download depuis dashboard

## Hors scope

- Bundle « tous les guides » (Premium 29 € joue déjà ce rôle)
- Compte utilisateur obligatoire pour acheter (invité par email uniquement)
- Pages produit SEO dédiées `/guides/[slug]`
- Factures PDF custom (reçus Stripe suffisent)
