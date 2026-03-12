

# Renommer la route /newsletter en /guidepersonnalise

## Modifications

### 1. `src/App.tsx`
- Changer `path="/newsletter"` en `path="/guidepersonnalise"`

### 2. `src/components/Footer.tsx`
- Mettre a jour le lien Newsletter : `to="/newsletter"` → `to="/guidepersonnalise"`

### 3. `src/pages/NewsletterEmbed.tsx`
- Mettre a jour le title de l'iframe pour refleter le nouveau nom ("Guide Personnalise Mariable")

Le Header est deja le meme composant `Header` que la page d'accueil — aucun changement necessaire de ce cote.

