## /professionnelsmariable

**`src/pages/ProfessionnelsMariable.tsx`**
- Sous-titre hero (l. 66-67) → « Lieux de caractère, traiteurs d'exception, photographes au regard juste. Une curation de professionnels. »
- Ajouter un second CTA à côté de « Découvrir la sélection » : `Link` vers `/dashboard` libellé « Découvrir les outils gratuits » (même style underline éditorial).
- Supprimer entièrement le composant `ManifestoStrip` (l. 84-94) et son rendu dans la page (la citation « Nous croyons qu'un mariage se construit avec des artisans choisis… »).

## /partenariat

**`src/pages/Partenariat.tsx`** — simplification majeure :

1. **Hero (l. 240-276)** repositionné comme agence de communication pour pros de l'événementiel :
   - Badge : « Agence de communication · Événementiel mariage »
   - H1 : « L'agence de communication des professionnels du mariage »
   - Sous-titre : « Lieux de réception, traiteurs, photographes : nous créons votre image et votre présence digitale pour attirer les couples qui vous ressemblent. »
   - CTA principal : « Voir nos expertises » (scroll vers piliers) · CTA secondaire : `mailto:mathilde@mariable.fr`
   - Retirer toute mention « Studio », « Mariable Studio ».

2. **Section piliers (l. 328-370)** conservée, retitrée « Nos 3 expertises » + sous-titre neutre sans « studio ».

3. **Section pricing/packs (l. 372-451)** remplacée par un bloc unique « Nos formules » :
   - 3 cartes basées sur les piliers (Création de contenu, Community management, Mise en avant Mariable)
   - Chaque carte affiche **« Sur devis »** au lieu d'un prix
   - CTA unique par carte : `mailto:mathilde@mariable.fr` (« Demander un devis »)
   - Suppression de la mention « Engagement 3 mois minimum ».

4. **Suppressions** :
   - Citation « Les prestataires mariage ne veulent pas être listés… » (l. 317-324).
   - Section « Focus pack Signature » (l. 453-496) — supprimée.
   - Section « Comment on travaille » avec accordéons (l. 498-559) — supprimée.
   - Section formulaire (l. 640-660) + import `ProfessionalRegistrationForm` + helper `scrollToForm` + `accordionContent` + `openAccordion` (si plus utilisé hors FAQ).

5. **Contact** : remplacer la section formulaire par un bloc final simple :
   - H2 « Parlons de votre projet »
   - Texte court
   - Bouton/lien email mis en avant : `mathilde@mariable.fr` (icône `Mail`, `mailto:`)
   - (FAQ conservée si pertinent — sinon allégée pour retirer les références prix/engagement.)

6. **JSON-LD + meta** mis à jour pour retirer les prix et la mention « Studio » :
   - Title : « Agence de communication mariage — Lieux, traiteurs, photographes | Mariable »
   - Description alignée
   - `serviceJsonLd.offers` retiré (ou price → "Sur devis").

## Hors scope
- Aucun changement aux routes, à l'auth, ni aux autres pages.
- FAQ conservée mais épurée des mentions tarifaires si elles apparaissent.
