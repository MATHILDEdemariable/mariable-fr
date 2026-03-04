

# Charger les articles dans le blog avec formatage HTML correct

## Situation actuelle

- **6 articles existent deja** dans la base (slugs: checklist-mariage-retroplanning, budget-mariage-2026, inviter-famille-mariage, mariage-civil-uniquement, choisir-photographe-mariage, organiser-mariage-sans-wedding-planner) → ils seront **mis a jour** avec le contenu des fichiers uploades
- **3 articles sont nouveaux** (mariage-petit-budget, mariage-20-personnes, organisation-jour-j-mariage) → ils seront **inseres**

## Format HTML applique (identique a l'article checklist existant)

Le contenu markdown sera converti en HTML semantique :
- `##` → `<h2>` (titres de sections principaux)
- `###` → `<h3>` (sous-titres)
- `**texte**` → `<strong>texte</strong>`
- Listes `-` → `<ul><li>...</li></ul>`
- Paragraphes → `<p>...</p>`
- Pas de `<h1>` dans le contenu (le H1 est dans le champ `h1_title`)

## Operations

1. **UPDATE 6 articles existants** : remplacer le champ `content` par le HTML converti, mettre a jour `meta_description`, `h1_title`, `meta_title` et `h2_titles` depuis les fichiers
2. **INSERT 3 nouveaux articles** : creer les entrees avec `status: draft`, `order_index: 8/9/10`, memes champs SEO remplis, `category` appropriee

## Champs remplis pour chaque article

| Champ | Source |
|-------|--------|
| `content` | Markdown converti en HTML |
| `h1_title` | Titre `#` du fichier |
| `meta_description` | Champ Meta Description du fichier |
| `meta_title` | Derive du titre (55-60 car.) |
| `h2_titles` | JSON array des titres `##` |
| `slug` | Slug indique dans le fichier |
| `category` | Organisation / Budget / Prestataires selon le sujet |

Aucune modification de code. Uniquement des operations de donnees via l'outil d'insertion Supabase.

