

# Plan : Corriger l'acces au sitemap et a BingSiteAuth

## Probleme 1 : Google Search Console

Google refuse l'URL `https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap` car elle n'appartient pas au domaine `mariable.fr`. Google n'accepte que des URLs du meme domaine que la propriete.

**Solution** : Ajouter un rewrite dans `vercel.json` pour que `https://www.mariable.fr/sitemap.xml` soit redirige (proxy) vers l'edge function Supabase. Ainsi, Google verra une URL sur votre domaine.

## Probleme 2 : Bing Webmaster Tools

Le fichier `BingSiteAuth.xml` contient bien la bonne cle (`C47911E8F77BCBFBBCD7CE63971AE5EE`), mais il est peut-etre servi avec un Content-Type incorrect. Apres publication des modifications ci-dessous, re-tentez la verification sur Bing.

## Modifications

### 1. Mettre a jour `vercel.json`

Ajouter un rewrite **avant** le catch-all existant pour proxifier `/sitemap.xml` vers l'edge function :

```text
Avant :
  /(.*) -> /

Apres :
  /sitemap.xml -> https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap
  /(.*) -> /
```

### 2. Mettre a jour `public/robots.txt`

Changer la ligne Sitemap pour utiliser le domaine mariable.fr :

```text
Sitemap: https://www.mariable.fr/sitemap.xml
```

Au lieu de l'URL Supabase actuelle.

### 3. Instructions apres publication

Dans Google Search Console :
- Aller dans "Sitemaps"
- Soumettre : `https://www.mariable.fr/sitemap.xml`

Pour Bing :
- Re-tenter la verification avec le fichier XML (deja en place)

---

## Resume technique

| Fichier | Action |
|---|---|
| `vercel.json` | Ajouter rewrite `/sitemap.xml` vers l'edge function (avant le catch-all) |
| `public/robots.txt` | Mettre l'URL du sitemap sur `mariable.fr/sitemap.xml` |

