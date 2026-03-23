

# Modifier /guidepersonnalise : header premium + label footer

## Modifications

### 1. `src/pages/NewsletterEmbed.tsx`
- Remplacer `import Header` par `import PremiumHeader` (meme header que la page d'accueil)
- Utiliser `<PremiumHeader />` au lieu de `<Header />`
- Ajouter `page-content` padding-top pour compenser le header transparent

### 2. `src/components/Footer.tsx` (ligne 49)
- Changer le label "Newsletter" en "Personnaliser mon guide"

