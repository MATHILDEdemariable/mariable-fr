# Plan — Améliorations /versionjuin26

## 1. Hero — Bouton "Découvrir Mariable"
**Fichier :** `src/components/home/v2/HeroV2.tsx`
- Remplacer `href="#planner-included"` par un scroll vers la section **"Ton espace Mariable"** (id `espace-apercu`).
- Ajouter `id="espace-apercu"` sur `<section>` dans `EspaceApercu.tsx`.

## 2. Section témoignages — Refonte complète
**Fichier :** `src/components/home/PremiumTestimonialsSection.tsx` (utilisé via `VersionJuin26.tsx`)
- Nouveau titre : **"Ils ont organisé leur mariage avec Mariable"**
- 3 témoignages (remplacer les actuels) :
  - **Sophie & Marc** — Mariage en Provence — "Les outils de planification sont incroyables ! Le budget tracker et la checklist nous ont permis de tout organiser sans stress."
  - **Julie & Thomas** — Mariage à Paris — "On a trouvé notre lieu sur le guide et l'appli du jour-J change la donne. On a pu tout anticiper sans rien oublier et partager les infos à nos témoins. Chacun pouvait gérer facilement sur son smartphone, hyper pratique, on recommande !"
  - **Emma & Lucas** — Mariage en Bretagne — "Le service WhatsApp est super pratique ! On a eu des réponses rapides et des conseils personnalisés pour notre mariage."

## 3. EspaceApercu — Ajout sous-section "Carnet d'adresses"
**Fichier :** `src/components/home/v2/EspaceApercu.tsx`
- En dessous du mockup dashboard actuel, ajouter une **nouvelle sous-section** :
  - Layout 2 colonnes : **screenshot de la page "Explorer le guide"** à droite (image fournie), texte à gauche.
  - Titre : **"Un carnet d'adresses haut de gamme"**
  - Texte : "Sélection de lieux et de professionnels vérifiés pour votre mariage."
  - L'image sera uploadée via lovable-assets depuis l'attachement.
- **Note multi-device** ajoutée sous toute la section (small italic, centrée) :
  > "Plateforme web — accessible depuis mobile et tablette via le navigateur. Possibilité d'ajouter un raccourci sur l'écran d'accueil de votre mobile via un tuto dédié."

## 4. FAQ — Neutre (non genré)
**Fichier :** `src/components/home/v2/FAQSection.tsx`
- Remplacer **"On veut que tu sois sereine, pas coincée."** par **"On veut que tu sois serein·e, pas coincé·e."** (ou formulation neutre équivalente).
- Vérifier toute la FAQ pour autres formulations 100% féminines et rendre neutre.

## 5. Section "Ce qui est inclus" — Carnet d'adresses
**Fichier :** `src/components/home/v2/IncludedSection.tsx`
- Pour la carte/ligne **Carnet d'adresses**, remplacer la description par :
  > **"Explorez notre sélection de lieux d'exception et de professionnels vérifiés pour votre mariage."**

## 6. Toggle FR/EN — Page entière
- Vérifier que `PremiumHeader` contient déjà `LanguageToggle` (selon mémoire i18n phase 1 = home + header/footer).
- **Décision :** étendre i18n à toute la page `/versionjuin26` :
  - Créer `src/i18n/locales/fr/versionjuin26.json` + `en/versionjuin26.json`
  - Toutes les chaînes des composants `v2/*` (`HeroV2`, `ReassuranceBar`, `PainPointsSection`, `EspaceApercu`, `IncludedSection`, `FreemiumSection`, `DifferentiatorSection`, `PricingHighlight`, `FAQSection`, `FinalCTASection`) passent par `useTranslation('versionjuin26')`.
  - Le `LanguageToggle` existant dans le header déclenchera la traduction de toute la page.
- ⚠️ Gros volume de strings — à confirmer si OK pour faire en un batch ou étaler.

## Fichiers touchés
- `HeroV2.tsx`, `EspaceApercu.tsx`, `PremiumTestimonialsSection.tsx`, `FAQSection.tsx`, `IncludedSection.tsx`
- 10 composants v2 (i18n)
- 2 fichiers locales `versionjuin26.json` (FR/EN)
- 1 asset image (screenshot carnet d'adresses)

## Question avant exécution
**i18n complet de la page** = ~150 strings à traduire en EN. Tu veux :
- **A)** Tout en un seul batch (long mais complet)
- **B)** Phase 1 = sections critiques (Hero, Freemium, FAQ, FinalCTA) puis le reste plus tard
- **C)** Skip i18n pour l'instant — on garde juste le toggle visible mais sans traduire les nouvelles sections
