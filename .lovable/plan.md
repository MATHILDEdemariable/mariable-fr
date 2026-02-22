

# Plan : Corriger le sitemap pour Google

## Probleme

Le fichier `vercel.json` contient un rewrite pour `/sitemap.xml`, mais ce rewrite ne fonctionne pas car le site est heberge sur **Lovable**, pas sur Vercel. Google recoit donc la page HTML React au lieu du XML.

## Solution

Puisque le rewrite Vercel ne peut pas fonctionner sur l'hebergement Lovable, la solution la plus simple est :

1. **Mettre a jour `robots.txt`** pour pointer directement vers l'edge function Supabase
2. **Nettoyer `vercel.json`** en retirant le rewrite sitemap inutile

Google decouvre automatiquement les sitemaps declares dans `robots.txt`, meme s'ils sont sur un autre domaine. Pas besoin de soumettre manuellement dans Search Console.

## Modifications

### 1. Mettre a jour `public/robots.txt`

Changer la ligne Sitemap :
```
Sitemap: https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap
```

### 2. Nettoyer `vercel.json`

Retirer le rewrite `/sitemap.xml` qui ne fonctionne pas :
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

## Apres publication

- Google decouvrira automatiquement le sitemap via `robots.txt`
- Vous pouvez aussi tester en ouvrant directement ce lien dans votre navigateur :
  `https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap`
- Dans Google Search Console, si vous souhaitez forcer la decouverte, vous pouvez aller dans "Inspection de l'URL" et inspecter votre page d'accueil (`https://www.mariable.fr/`) -- Google lira le `robots.txt` et trouvera le sitemap

| Fichier | Action |
|---|---|
| `public/robots.txt` | Changer l'URL du sitemap vers l'edge function Supabase |
| `vercel.json` | Retirer le rewrite `/sitemap.xml` inutile |

