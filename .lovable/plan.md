## Modifications

### 1. Dashboard (`src/components/dashboard/DashboardSidebar.tsx`)
- Supprimer l'entrée **Club Mariable** (bouton + import `ClubMariableModal` + state + modal rendu).
- Supprimer le bouton **Support WhatsApp** (`<WhatsAppButton />` + import). Conserver uniquement le bouton "Un problème ?".

### 2. Modal "Un problème ?" (`src/components/support/ProblemModal.tsx`)
- Ajouter en haut du formulaire (sous le titre) un petit texte indiquant l'email de contact direct visible :  
  *« Vous pouvez aussi nous écrire directement à `mathilde@mariable.fr` »*
- Le système d'envoi instantané vers mathilde@mariable.fr fonctionne déjà via l'edge function `send-problem-report` (vérifié : appel `resend.emails.send` vers `mathilde@mariable.fr` dès la soumission). Aucun changement backend nécessaire.

### 3. Page /prix (`src/pages/Prix.tsx` + `src/i18n/locales/fr/pricing.json` + EN)
Sur la carte **Premium** (mobile + desktop) :
- Remplacer le badge "Recommandé" (`plans.premium.badge`) par : **« Valeur totale : 59€ »** affichée barrée (`<span className="line-through">`), sur le même emplacement (badge au-dessus de la carte).
- Mettre à jour le texte d'une feature pour refléter :  
  *« Accès complet au guide en ligne Mariable. Une fois, pour toujours. Mises à jour incluses pendant toute la durée de ton projet. Accès immédiat · Aucune installation — disponible sur navigateur (ordinateur, tablette, mobile). »*  
  → modifier la clé `plans.premium.feature2` + `feature2Detail` dans les fichiers i18n FR et EN.
- Ajouter sous la liste de features de la carte Premium une **petite note** :  
  *« vs un wedding planner à partir de 2000€ — 10× moins cher, 10× plus de contrôle »*  
  (nouvelle clé i18n `plans.premium.vsWeddingPlanner`).

### Hors scope
- Pas de refonte de la sidebar ni de la page Prix.
- Pas de modification de l'edge function (déjà fonctionnelle).
- Pas de suppression du fichier `WhatsAppButton.tsx` ni de `ClubMariableModal.tsx` (composants conservés au cas où utilisés ailleurs ; seules les références dans la sidebar sont retirées).
