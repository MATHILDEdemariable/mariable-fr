# Plan — Bascule homepage + refonte parcours inscription

## 1. Routing — VersionJuin26 en page d'accueil

**Fichier :** `src/App.tsx`

- Remplacer `<Route path="/" element={<Mariable />} />` par `<Route path="/" element={<VersionJuin26 />} />`
- Garder `/versionjuin26` pointant vers la même page (alias temporaire) OU rediriger vers `/`
- Conserver `Mariable` accessible via une route alternative (ex. `/mariable-v1`) au cas où, ou la supprimer du router selon préférence

**Ajustements VersionJuin26 :**
- Retirer le `<meta name="robots" content="noindex,nofollow" />` du `Helmet` (page accueil = indexable)
- Mettre à jour `<title>` et `<meta description>` pour SEO accueil (réutiliser ceux de `Mariable` / `Index`)
- Ajouter les JSON-LD `WebSite` + `SiteNavigationElement` actuellement dans `Index.tsx`/`Mariable.tsx`
- Vérifier canonical = `/`

**Question :** garder `/versionjuin26` comme alias, ou rediriger 301 vers `/` ? (recommandation : redirect côté React via `<Navigate to="/" replace />`)

## 2. /paiement devient la nouvelle page d'inscription Premium

**Fichier :** `src/pages/Paiement.tsx` + `src/App.tsx`

- `/paiement` reste pour les liens existants mais devient la **page register principale** (premium 29€)
- Renommer la route principale `/register` → pointer vers `Paiement` (nouvelle inscription premium)
- L'ancienne page `Register` (inscription gratuite Supabase) déplacée vers `/register-gratuit` (ou `/inscription-gratuite`)
- Sur `/paiement` (= nouveau `/register`), ajouter sous le formulaire/CTA paiement un **bouton secondaire** :
  > « Je veux utiliser la version gratuite d'abord »  
  → Link vers `/register-gratuit`
- Style bouton : `variant="outline"` ou lien texte discret sous le CTA principal pour ne pas concurrencer la conversion premium

**Routes finales :**
```
/               → VersionJuin26 (nouvelle home)
/register       → Paiement (inscription premium 29€)
/register-gratuit → ancien Register (inscription gratuite)
/paiement       → Paiement (alias conservé pour compat)
/versionjuin26  → redirect vers /
/mariable-v1    → Mariable (ancienne home, optionnel)
```

## 3. Liens internes à mettre à jour

Audit rapide des CTA pointant vers `/register` partout dans `src/components/home/v2/*` + header/footer :
- HeroV2, FreemiumSection, FinalCTASection, PricingHighlight, PremiumHeader, Footer
- Vérifier que les boutons « Commencer gratuitement » pointent bien vers `/register-gratuit` et les « Passer Premium / S'inscrire » vers `/register` (= Paiement)
- Sinon différencier proprement les 2 CTA

## Questions avant exécution

1. **Ancienne homepage `Mariable`** : la garder accessible sur `/mariable-v1` (archive) ou la supprimer du router ?
2. **CTA gratuit vs premium dans /versionjuin26** : actuellement la plupart des CTA pointent vers `/register`. Après bascule, tu veux que :
   - **A)** Tous les CTA principaux pointent vers `/register` (= Paiement premium), avec le bouton "version gratuite" comme échappatoire sur la page paiement uniquement
   - **B)** Différencier dans les sections : CTA "Commencer gratuitement" → `/register-gratuit`, CTA "Passer Premium" → `/register` (Paiement)
3. **`/paiement` → redirection** : on garde l'URL `/paiement` active comme alias de `/register`, ou on redirige `/paiement` vers `/register` ?

## Fichiers touchés
- `src/App.tsx` (routes)
- `src/pages/Paiement.tsx` (ajout bouton "version gratuite")
- `src/pages/VersionJuin26.tsx` (SEO meta accueil)
- Composants v2 et header/footer pour vérification des liens CTA
