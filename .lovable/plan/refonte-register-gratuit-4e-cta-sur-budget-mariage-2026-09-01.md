# Refonte /register-gratuit + 4e CTA sur /budget-mariage

## 1. /budget-mariage — bouton "Planifier le jour-J"

Ajout d'un 4e bouton dans la grille CTA du hero, même style que les 3 existants (bordure blanche, majuscules, `rounded-none`). Il renvoie vers `/register-gratuit`.

La grille passe de 3 à 4 colonnes sur desktop (`sm:grid-cols-2 lg:grid-cols-4`) pour rester lisible en mobile et tablette.

## 2. /register-gratuit — layout 2 colonnes façon /paiement

Même structure visuelle que la page Premium : fond ivoire `#F8F5EF`, deux cartes côte à côte (`lg:grid-cols-2`), une seule colonne empilée en mobile (descriptif au-dessus du formulaire).

### Colonne gauche — descriptif (nouveau)
Titre : **Tout pour organiser le jour-J**
Sous-titre : *Votre mariage, votre organisation.* + « grâce à l'appli accessible depuis téléphone, tablette ou ordinateur. Sans téléchargement. »

Liste des fonctionnalités (icône + titre + description) :
- Rétroplanning intelligent
- Budget réel
- Liste invités & RSVP digital
- Plan de table interactif
- Coordination Jour J
- Calculateur de boissons
- Album photo invités (QR code)

Bloc **Inclus** : le Carnet d'adresses Mariable — lieux d'exception et pros vérifiés.

Bloc **Limites du gratuit** (encadré discret) : génération IA, stockage et exports PDF plafonnés, pas de guide PDF ni d'album partagé — avec lien « Passer Premium — 29€ (barré 59€) » vers `/paiement`.

### Colonne droite — formulaire
Le formulaire d'inscription actuel est repris **tel quel** : mêmes champs, même logique `supabase.auth.signUp`, gestion du `?redirect=`, capture du lead budget, tracking analytics, alerte de confirmation d'email, lien « déjà un compte ». Aucune partie Stripe/paiement.

## Détails techniques
- Fichiers modifiés : `src/pages/BudgetMariage.tsx` (hero CTA) et `src/pages/auth/Register.tsx` (layout uniquement).
- Aucun changement de logique métier ni de schéma : uniquement présentation.
- Les textes du descriptif sont ajoutés dans les locales `fr`/`en` du namespace `auth` pour rester compatibles avec le toggle de langue.
- Couleurs via tokens existants (`wedding-olive`, `editorial-noir`, fond `#F8F5EF`), pas de valeurs codées en dur nouvelles.
