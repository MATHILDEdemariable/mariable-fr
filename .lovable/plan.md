
# Plan : Sitemap statique + Nettoyage des doublons + Fix meta description

## Ce qui va etre fait

### 1. Creer `public/sitemap.xml` (fichier statique)

Un fichier XML statique contenant les 52 pages statiques du site. Ce fichier sera directement accessible a `https://www.mariable.fr/sitemap.xml` et soumissible dans Google Search Console.

Les pages dynamiques (prestataires, blog) ne seront pas dans ce fichier statique -- elles restent dans l'edge function pour la decouverte automatique via robots.txt.

### 2. Mettre a jour `public/robots.txt`

Declarer les deux sitemaps :
```
Sitemap: https://www.mariable.fr/sitemap.xml
Sitemap: https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/generate-sitemap
```

Le premier est soumissible dans Google Search Console. Le second permet a Google de decouvrir automatiquement les pages dynamiques.

### 3. Supprimer la meta description en dur de `index.html`

Retirer la ligne 8 de `index.html` :
```
<meta name="description" content="Mariable : la plateforme française..." />
```

Chaque page definit deja sa propre description via le composant SEO/Helmet. Cela corrige l'erreur Bing "plusieurs balises description".

### 4. Conserver l'edge function `generate-sitemap`

L'edge function n'est **pas supprimee** car elle reste utile : elle genere dynamiquement les URLs des prestataires et articles de blog depuis la base de donnees. Le sitemap statique ne couvre que les pages fixes. Les deux sont complementaires, pas en doublon.

### 5. Nettoyer `vercel.json`

Le fichier reste tel quel (le rewrite sitemap a deja ete retire precedemment).

## Apres publication

1. Soumettre `https://www.mariable.fr/sitemap.xml` dans Google Search Console
2. Les erreurs Bing de meta description dupliquee seront corrigees

| Fichier | Action |
|---|---|
| `public/sitemap.xml` | Creer -- sitemap XML statique avec les 52 pages fixes |
| `public/robots.txt` | Ajouter `https://www.mariable.fr/sitemap.xml` en plus de l'edge function |
| `index.html` | Supprimer la meta description en dur (ligne 8) |
| `supabase/functions/generate-sitemap/` | Conserver -- couvre les pages dynamiques |
