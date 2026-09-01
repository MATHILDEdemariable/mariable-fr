# /budget-mariage — ajustements hero, sections et envoi de devis

## 1. Hero
- Nouveau H1 : « Le mariage dont vous rêvez, au budget que vous choisissez. »
- Nouveau sous-titre : « Passez de l'inspiration à la réalité : estimez votre budget, décryptez vos devis et découvrez des prestataires adaptés à votre projet. »
- Les 3 boutons passent en style transparent (bordure blanche, fond translucide, hover blanc/noir) comme la home, et deviennent strictement identiques en taille : même hauteur, même largeur en grille 3 colonnes, texte centré sur une ligne.

## 2. Sections
- Suppression des surtitres « Parcours 1 / 2 / 3 » (remplacés par un libellé court : « Estimation », « Analyse de devis », « Sélection »).

## 3. Section prestataires
- Un seul CTA : « Voir la sélection ».
- Il mène vers /professionnelsmariable si l'utilisateur est connecté, sinon vers /register-gratuit avec redirection automatique vers /professionnelsmariable après création du compte.

## 4. Devis reçu par email avec pièce jointe
- La fonction `notify-devis-analyse` télécharge le fichier depuis le bucket privé et l'envoie en pièce jointe réelle (base64) à mathilde@mariable.fr, en plus du lien signé de secours.
- Limite de taille respectée (Resend ~10 Mo) : au-delà, seul le lien signé est envoyé.

## Détails techniques
- `src/pages/BudgetMariage.tsx` : textes hero, classes boutons (`grid grid-cols-1 sm:grid-cols-3`, `bg-white/10 border-white/70 text-white backdrop-blur`), suppression des `<p>` « Parcours N », CTA prestataires unique conditionné à la session (`useAuth`/`supabase.auth.getSession`).
- `src/pages/auth/Register.tsx` : prise en charge du paramètre `redirect=professionnelsmariable`.
- `supabase/functions/notify-devis-analyse/index.ts` : fetch de l'objet via service role, conversion base64, champ `attachments` de Resend.
