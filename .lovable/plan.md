# Plan : Clarifier l'offre Mariable Pro — référencement vs accès plateforme

## Objectif
Sur `/partenariat`, dans la section « Mariable Pro — ce que comprend vos frais d'adhésion », séparer clairement les avantages de **référencement/visibilité** des avantages liés à **l'accès à la plateforme Mariable**, et expliciter les fonctionnalités incluses dans cet accès.

## Modification prévue

### 1. Restructurer la liste des inclusions
Dans `src/i18n/locales/fr/partenariat.json`, clé `pro.included` :
- Transformer l'actuelle liste simple en **deux groupes** :
  - **Référencement & visibilité** (points 1-7 actuels)
  - **Accès à la plateforme Mariable** (ancien point 8, découpé en 2 sous-points)
- Le nouvel intitulé pour l'accès plateforme :
  - « Accès Pro organisateur pour gérer les mariages de vos clients »
  - « OU 3 accès Mariable Premium à offrir à vos mariés via un code promo unique 🎁 »
- Ajouter sous l'accès plateforme une **sous-liste explicite** des fonctionnalités :
  - Gestion du budget mariage
  - Planning jour J collaboratif
  - Plan de table
  - Et les autres fonctionnalités de l'app (checklist, fournisseurs, album photo invités, etc.)

### 2. Adapter le rendu visuel (`src/pages/Partenariat.tsx`)
- Remplacer le simple mapping `proIncluded.map(...)` par un affichage groupé :
  - Titre de groupe optionnel pour distinguer les deux blocs
  - Sous-liste indentée ou avec un style secondaire pour les fonctionnalités détaillées
- Conserver le style existant (beige clair, bordure vert sauge, check vert).

### 3. Mettre à jour la FAQ correspondante
- Question : « Que comprend exactement l'offre Mariable Pro à 149 €/an ? »
- Réécrire la réponse pour refléter la séparation référencement / accès plateforme + fonctionnalités.

### 4. Validation
- Vérifier le rendu sur `/partenariat`
- Vérifier que le texte est bien en français et cohérent avec le ton éditorial Mariable.
