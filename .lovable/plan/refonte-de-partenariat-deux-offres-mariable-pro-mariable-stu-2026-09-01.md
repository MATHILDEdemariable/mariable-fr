# Refonte de /partenariat : deux offres — Mariable Pro & Mariable Studio

La page devient une page à deux offres, avec **Mariable Pro (référencement, 149 €/an)** en premier plan et **Mariable Studio (agence marketing digital, sur devis)** en second plan.

## Nouvelle structure de la page

```text
1. HERO — deux encadrés côte à côte
   Tagline : « Votre style. Vos tarifs. Des clients qui vous correspondent. »
   Sous-titre : rejoignez une sélection de professionnels choisis pour
   leur univers et leur savoir-faire.

   ┌──── MARIABLE PRO ────────────┐  ┌──── MARIABLE STUDIO ─────────┐
   │ Référencement & visibilité   │  │ Agence marketing digital     │
   │ 🎁 200€/an  →  149 €/an      │  │ Sur devis                    │
   │ (12,40 €/mois)               │  │ Réseaux, Ads, sites web      │
   │ [ Rejoindre Mariable Pro ]   │  │ [ Découvrir Studio ]         │
   └──────────────────────────────┘  └──────────────────────────────┘

2. LE MESSAGE CENTRAL (bande vert sauge)
   « La transparence qui vous fait gagner du temps. »
   4 bénéfices : demandes mieux qualifiées · couples alignés ·
   moins de temps perdu hors budget · audience ciblée.

3. MARIABLE PRO — ce que comprend l'offre (5 blocs ✓)
   Profil dédié · Référencement plateforme · Mise en avant éditoriale ·
   Visibilité éditoriale & SEO · Accès au réseau Mariable Pro.
   Encadré prix 149 €/an + CTA candidature.

4. MARIABLE PRO — conditions d'admission (2 conditions)
   a) Catégories éligibles (lieu, traiteur, photo/vidéo, planner/
      coordinateur, créateur robe/costume/accessoires)
   b) Tarifs renseignés en détail — exemple de grille photographe,
      envoi de plaquette par mail analysée par Mariable,
      mention « la plaquette reste privée, les prix sont publics »
      et « le sur-mesure reste possible ».

5. MARIABLE STUDIO (second plan, fond beige)
   Les 3 services actuels inchangés (contenu / community & ads /
   développement digital), tarifs sur devis, CTA contact.
   Bandeau « mise en avant Mariable incluse » conservé.

6. FAQ (existante, complétée par 3 questions Mariable Pro)

7. CONTACT (bloc existant conservé)
```

## Contenus

- **Tagline hero** et argumentaire Mariable Pro repris mot pour mot de la demande.
- **Prix** : 200 €/an barré, 149 €/an mis en avant, mention « soit 12,40 €/mois » et badge « Offre de rentrée ».
- **Exemple de grille tarifaire** photographe affiché sous forme de mini-tableau pour illustrer le niveau de détail attendu.
- **Nouvelles FAQ** : Que comprend Mariable Pro ? · Pourquoi faut-il publier ses tarifs ? · Quelle différence entre Mariable Pro et Mariable Studio ?

## Parcours de conversion

- CTA « Rejoindre Mariable Pro » et « Contact » ouvrent le modal `ContactProModal` existant, avec un sujet pré-rempli différent (`Mariable Pro — 149€/an` vs le nom du service Studio) pour distinguer les leads côté back-office.
- Ancres internes : le bouton Studio du hero scrolle vers la section Studio, le bouton Pro vers la section Pro.

## Détails techniques

- Fichiers modifiés : `src/pages/Partenariat.tsx`, `src/i18n/locales/fr/partenariat.json`, `src/i18n/locales/en/partenariat.json` (tous les nouveaux textes passent par i18n, FR + EN, comme aujourd'hui).
- Aucun changement de backend : réutilisation de `ContactProModal` et de la fonction `notify-partenariat-contact` déjà en place.
- DA conservée : `editorial-noir`, `premium-sage`, beige clair, typographie serif, `rounded-none`, animations framer-motion existantes.
- SEO : titre et meta description mis à jour pour couvrir les deux offres ; ajout d'un JSON-LD `Offer` (149 €/an) à côté des schémas `Service` et `FAQPage` existants ; H1 unique, H2 par section.
- Responsive mobile-first : les deux encadrés du hero passent en pile verticale, Pro en premier.
