
# Correction du formatage des articles de blog (H1/H2/H3 visibles)

## Probleme identifie

Le plugin `@tailwindcss/typography` est installe dans les dependances (`package.json`) mais **n'est pas enregistre** dans `tailwind.config.ts`. La ligne plugins ne contient que `tailwindcss-animate`. En consequence, les classes `prose prose-lg` appliquees au contenu des articles n'ont aucun effet, et les balises `<h2>`, `<h3>`, `<strong>`, `<ul>` etc. s'affichent comme du texte brut.

Le contenu HTML dans la base de donnees est correct (les `<h2>`, `<h3>` sont bien presents). C'est uniquement un probleme de styles CSS.

## Solution

**Fichier unique a modifier : `tailwind.config.ts`**

Ajouter le plugin `@tailwindcss/typography` dans le tableau plugins (ligne 172) :

```text
Avant :  plugins: [require("tailwindcss-animate")]
Apres  : plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")]
```

Cela activera automatiquement les styles `prose` deja utilises dans `BlogArticle.tsx` (ligne 156), rendant les titres H2/H3, listes, liens et paragraphes correctement formates et visuellement distincts.

## Resultat attendu

- **H2** : grands titres de section bien visibles (ex: "1. A 18 mois avant : Rever et decider")
- **H3** : sous-titres distinctifs (ex: "Essentiels (fais-les vraiment)")
- **Listes** : puces visibles avec indentation
- **Gras** : texte en strong bien mis en valeur
- **Liens** : couleur et soulignement

Aucune autre modification necessaire. Les 7 articles existants beneficieront immediatement du correctif.
