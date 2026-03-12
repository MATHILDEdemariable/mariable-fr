

# Intégration page embedded Mule + lien footer

## Modifications

### 1. Créer `src/pages/MuleEmbed.tsx`
Page simple avec Header, iframe en pleine largeur pointant vers `https://2mscw76h.mule.page/`, et ChatbotButton. Même pattern que `GuideMariableFrame.tsx`.

### 2. Ajouter la route dans `src/App.tsx`
- Import lazy du composant
- Route `/newsletter` (ou autre slug à confirmer)

### 3. Ajouter le lien dans `src/components/Footer.tsx`
- Ajouter un `<li>` dans la section "Découvrir" pointant vers la nouvelle route (ex: "Newsletter")

---

**Question** : quel nom/label donner à cette page dans le footer ? (ex: "Newsletter", "Inscription", autre ?)

