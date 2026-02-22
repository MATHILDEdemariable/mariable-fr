

# Plan : Corriger le sitemap.xml pour Google

## Probleme

Google Search Console essaie d'acceder a `https://mariable.fr/sitemap.xml` et recoit une erreur 404.

**Cause** : Le sitemap actuel est une page React (`/sitemap`) qui genere du XML visuellement, mais le navigateur sert du HTML (avec React, JavaScript, etc.). Google attend un fichier XML pur avec `Content-Type: application/xml`.

## Solution

Creer une **edge function Supabase** `generate-sitemap` qui :
- Interroge la base de donnees (prestataires + blog posts)
- Genere le XML du sitemap avec toutes les URLs statiques et dynamiques
- Retourne le contenu avec `Content-Type: application/xml`

Puis mettre a jour `robots.txt` pour pointer vers l'URL de l'edge function.

## Modifications

### 1. Creer l'edge function `generate-sitemap`

**Fichier** : `supabase/functions/generate-sitemap/index.ts`

- Reprendre exactement la meme logique que `Sitemap.tsx` (pages statiques + prestataires + blog posts)
- Utiliser le client Supabase cote serveur pour requeter `prestataires_rows` et `blog_posts`
- Retourner le XML avec les headers `Content-Type: application/xml; charset=utf-8`
- Gerer les erreurs avec un sitemap de fallback (pages statiques uniquement)

### 2. Mettre a jour `robots.txt`

**Fichier** : `public/robots.txt`

Changer la ligne :
```
Sitemap: https://www.mariable.fr/sitemap.xml
```
en :
```
Sitemap: https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap
```

### 3. Conserver la page React `/sitemap`

La page React `Sitemap.tsx` reste en place pour les visiteurs humains qui consultent `/sitemap`. Aucune modification necessaire.

---

## Details techniques

### Edge function `generate-sitemap`

```text
Requete GET
  -> Query Supabase: prestataires_rows (slug, updated_at, visible=true)
  -> Query Supabase: blog_posts (slug, updated_at, status=published)
  -> Generer XML avec 52 pages statiques + pages dynamiques
  -> Response: Content-Type: application/xml
```

### Ce que Google verra

Au lieu d'une page HTML React, Google recevra un vrai fichier XML bien forme :
```text
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.mariable.fr/</loc>
    <lastmod>2026-02-16</lastmod>
    ...
  </url>
  ...
</urlset>
```

### Instructions pour Google Search Console

Apres publication, vous devrez soumettre la nouvelle URL du sitemap dans Google Search Console :
- Section "Sitemaps" > Ajouter : l'URL de l'edge function
- Ou re-soumettre `https://www.mariable.fr/sitemap.xml` si vous preferez ajouter un rewrite dans vercel.json (option alternative)

| Fichier | Action |
|---|---|
| `supabase/functions/generate-sitemap/index.ts` | Creer - edge function qui genere le XML |
| `public/robots.txt` | Mettre a jour l'URL du sitemap |

