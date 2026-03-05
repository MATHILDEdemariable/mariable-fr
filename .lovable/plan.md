

# Mise a jour du Pixel Meta

Le Pixel Meta est deja installe avec l'ID `1590394108780503`. Il faut le remplacer par le nouveau : `1976814949641388`.

## Fichiers a modifier

### 1. `index.html`
- Ligne ~80 : remplacer `fbq('init', '1590394108780503')` par `fbq('init', '1976814949641388')`
- Ligne ~45 : remplacer l'URL noscript `id=1590394108780503` par `id=1976814949641388`

### 2. `src/utils/analytics.ts`
- Aucun changement necessaire (le fichier utilise `window.fbq` sans reference a l'ID)

Deux lignes a modifier, aucun nouveau fichier.

