

## Plan de modifications

---

## 1. Page /prix : Simplification du tableau de fonctionnalites

La logique actuelle liste individuellement chaque fonctionnalite avec gratuit/premium. L'utilisateur veut une approche inverse plus simple : **tout est inclus gratuitement sauf 4 limitations**.

**Fichier : `src/pages/Prix.tsx`**

Remplacer le tableau de 18 features par une structure en 2 blocs :

**Bloc Gratuit (0 euros)** :
- "Toutes les fonctionnalites incluses" (checklist, budget, RSVP, prestataires, plan de table, coordination jour-J, etc.)
- Avec 3 limitations clairement listees :
  - Export PDF des modules : non inclus
  - Guides mariage PDF : non inclus
  - Utilisation IA : 1 generation par outil
  - Gestion budget : 3 lignes par categorie

**Bloc Premium (29 euros, achat unique)** :
- "Tout le Gratuit + sans aucune limitation" :
  - Exports PDF/CSV illimites
  - Guides mariage PDF inclus
  - Utilisation IA illimitee
  - Gestion budget illimitee (lignes par categorie)
  - Stockage documents illimite
  - Support prioritaire

Le tableau desktop gardera le format 3 colonnes (label + Gratuit + Premium) mais avec beaucoup moins de lignes (6-8 au lieu de 18). Les cards mobile seront egalement simplifiees.

La FAQ et le CTA final restent inchanges.

**Fichier : `src/components/dashboard/PricingContent.tsx`**

Meme simplification pour le composant utilise dans le dashboard.

---

## 2. Header : Navigation par sections + restructuration des boutons

**Fichier : `src/components/home/PremiumHeader.tsx`**

Inspire de l'image de reference (French Wedding Style), le header sera reorganise en 2 niveaux :

**Niveau 1 (barre superieure)** : Logo centre + 2 boutons a droite
- A droite : "Connexion / Creer un compte" (lien vers /login ou /register) et "Je suis un professionnel" (lien vers /partenariat)
- Si authentifie : "Mon compte" (dropdown existant) remplace "Connexion"

**Niveau 2 (barre de navigation)** : Liens vers les sections/pages du site
- "Prestataires" (vers /professionnelsmariable)
- "Outils" (vers /outils-planning-mariage ou ancre vers la section outils)
- "Conseils" (vers /conseilsmariage)
- "Temoignages" (ancre #temoignages ou scroll)
- "Prix" (vers /prix)
- Style : fond `bg-editorial-beige`, texte `text-editorial-noir`, tracking wide, uppercase, font-sans

**Suppressions** :
- Lien "Contact" supprime du header (desktop et mobile)

**Mobile** : Le menu hamburger contiendra les memes liens de navigation + les 2 boutons.

---

## Resume technique

| Fichier | Modification |
|---------|-------------|
| `src/pages/Prix.tsx` | Simplifier features : tout gratuit sauf 4 limitations, 29 euros premium |
| `src/components/dashboard/PricingContent.tsx` | Meme simplification |
| `src/components/home/PremiumHeader.tsx` | 2 niveaux (logo+boutons / nav sections), supprimer Contact |

