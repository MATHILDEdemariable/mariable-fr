## Modifications page `/partenariat`

### 1. Repositionnement éditorial (lieux & traiteurs → pros de l'événementiel + agence marketing digital)

Mise à jour des textes dans `src/pages/Partenariat.tsx` :

- **Chip hero** : « Agence de communication · Lieux de réception & traiteurs » → « Agence marketing digital · Professionnels de l'événementiel »
- **H1** : « L'agence de communication des professionnels du mariage » → « L'agence marketing digital des professionnels de l'événementiel »
- **Sous-titre hero** : reformulé sur la croissance organique et payante sur les réseaux sociaux et l'acquisition clients pour lieux de réception, traiteurs, photographes, fleuristes, wedding planners, DJ et autres pros de l'événementiel.
- **Titres / descriptions des 3 services** : on garde la structure (Stratégie & contenu / Community management / Développement digital) mais on enrichit le vocabulaire avec « croissance organique », « acquisition payante (Meta Ads / TikTok Ads) », « stratégie d'acquisition clients », « tunnel de conversion ».
- **FAQ** : remplacer systématiquement « lieux de réception et traiteurs mariage » par « professionnels de l'événementiel » (en gardant 1–2 exemples : lieux, traiteurs, photographes, fleuristes, wedding planners). Recentrer 1–2 questions sur croissance organique vs paid et stratégie d'acquisition.
- **Meta title / description / JSON-LD Service** : repositionner sur « Agence marketing digital · Professionnels de l'événementiel ».

### 2. Cartes de service : suppression du bouton « Demander un devis »

Dans chaque carte service :
- Garder le bloc « Tarif · Sur devis » (déjà présent).
- **Supprimer** le bouton `Demander un devis` (mailto).
- **Ajouter** un bouton `Contact` qui ouvre la modal décrite ci-dessous.

### 3. Modal Contact (nouveau composant)

Création de `src/components/partenariat/ContactProModal.tsx` basé sur le `Dialog` shadcn déjà utilisé dans le projet.

Layout 2 colonnes (stack en mobile) :

- **Colonne gauche** — formulaire de contact court inspiré de `/contact` (`src/pages/contact/NousContacter.tsx`) : nom, email, structure (optionnel), message → envoi vers la même table Supabase `contact_requests` que la page contact existante (réutilisation du même handler / service pour rester DRY).
- **Colonne droite** — carte « contact direct » :
  - Photo de Mathilde (upload utilisateur copié dans `src/assets/mathilde-portrait.jpg`)
  - Email : `mathilde@mariable.fr` (cliquable mailto)
  - Téléphone / WhatsApp : `+33 7 60 10 81 89` avec deux liens : `tel:` et `https://wa.me/33760108189`
  - Icônes lucide (`Mail`, `Phone`, logo WhatsApp via icône `MessageCircle`)

État d'ouverture géré dans `Partenariat.tsx` (`useState`) ; le même modal est partagé par les 3 boutons de carte et le CTA final de la section « Parlons de votre projet » (qui remplacera le gros bouton mailto actuel).

### 4. Section finale « Parlons de votre projet »

Remplacer le bouton mailto par un bouton `Contact` qui ouvre la même modal.

### Fichiers touchés

```text
src/pages/Partenariat.tsx              (textes + boutons + state modal)
src/components/partenariat/ContactProModal.tsx  (nouveau)
src/assets/mathilde-portrait.jpg       (copie de l'upload utilisateur)
```

Aucun changement business / DB : on réutilise la logique d'envoi existante de `/contact`.
