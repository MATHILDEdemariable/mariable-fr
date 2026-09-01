# Refonte de /register-gratuit en page 2 colonnes

Objectif : aligner la page d'inscription gratuite sur la mise en page de `/paiement` — colonne gauche descriptive (les fonctionnalités de l'application), colonne droite le formulaire d'inscription. Aucune brique Stripe/paiement dans le parcours.

## Structure de la page

```text
[ Header ]  [ ← Retour ]

  H1  Créez votre compte gratuit
  Sous-titre : votre application pour organiser le jour-J

  ┌───────────── colonne gauche ─────────────┐  ┌──── colonne droite ────┐
  │ UNE APPLICATION POUR ORGANISER LE JOUR-J │  │  Formulaire            │
  │ Votre mariage, votre organisation.       │  │  (existant, inchangé)  │
  │ Accessible tel/tablette/ordi             │  │  Prénom / Nom          │
  │ Sans téléchargement                      │  │  Email / Téléphone     │
  │                                          │  │  Source / Objectif     │
  │ • Rétroplanning intelligent              │  │  Mot de passe          │
  │ • Budget réel                            │  │  CGV                   │
  │ • Liste invités & RSVP digital           │  │  [ Créer mon compte ]  │
  │ • Plan de table interactif               │  │  Déjà un compte ?      │
  │ • Coordination Jour J                    │  └────────────────────────┘
  │ • Calculateur de boissons                │
  │ • Album photo invités (QR code)          │
  │                                          │
  │ Inclus : le Carnet d'adresses Mariable   │
  │ Limites du gratuit → Premium 29€ (59€)   │
  └──────────────────────────────────────────┘
```

Sur mobile : colonne descriptive au-dessus du formulaire (ou repliée sous le formulaire pour garder le CTA visible — proposition retenue : formulaire en premier sur mobile, descriptif en dessous).

## Contenus (colonne gauche)

Reprise fidèle de la section home « Une application pour organiser le jour-J » :
- **Rétroplanning intelligent** — timeline selon votre date et votre style + to-do liste personnalisable.
- **Budget réel** — calculatrice intelligente et suivi des dépenses prestataire par prestataire.
- **Liste invités & RSVP digital** — lien de formulaire envoyé aux invités, réponses centralisées en ligne.
- **Plan de table interactif** — relié à la liste d'invités, drag & drop, impression en un clic.
- **Coordination Jour J** — déroulé généré par IA, partage avec l'équipe.
- **Calculateur de boissons** — les bonnes quantités, sans gaspillage.
- **Album photo invités** — récupération des photos via QR code.

Bloc « Inclus » : le Carnet d'adresses Mariable — lieux d'exception et pros vérifiés.

Bloc « Limites de la version gratuite » : génération IA, stockage et exports PDF plafonnés, pas de guides PDF ni d'album partagé avec les invités → lien discret « Passer Premium — 29€ (59€ barré) » vers `/paiement`.

## Détails techniques

- Fichier modifié : `src/pages/auth/Register.tsx` uniquement (aucun changement de logique d'inscription, de validation, de tracking ni de gestion du `?redirect=`).
- Passage du conteneur `max-w-md` à une grille `grid lg:grid-cols-2 gap-8 max-w-5xl`, formulaire conservé tel quel dans sa `Card`.
- Colonne gauche construite avec les mêmes composants Card + icônes `lucide-react` que `/paiement` pour une cohérence visuelle.
- Fond de page conservé (`bg-[#efeee9]`) ; accents vert sauge `wedding-olive`.
- Textes ajoutés en dur en français dans un premier temps (la page utilise i18n `auth` pour le formulaire ; la colonne descriptive pourra être ajoutée aux locales dans un second temps si souhaité).
- Aucune référence Stripe, aucun champ paiement.
