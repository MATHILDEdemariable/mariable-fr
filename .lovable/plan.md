## /professionnelsmariable — `src/pages/ProfessionnelsMariable.tsx`

**Hero (l. 57-58)** : remplacer le H1 par :
- « Sélection de professionnels »
- *en italique sage* : « et outils simples & personnalisables »

(Le sous-titre l. 66 reste inchangé.)

## /partenariat — `src/pages/Partenariat.tsx`

**1. Hero (l. 132-135)** — préciser la cible :
> « Lieux de réception et traiteurs : nous créons votre image, votre présence digitale et vos outils en ligne pour attirer les couples qui vous ressemblent. »

(Adapter aussi badge/meta description pour mentionner « lieux de réception & traiteurs ».)

**2. Tableau `expertises` (l. 28-65)** — ajustements :

- **Création de contenu** — ajouter en dernier point : *« Mise en avant Mariable incluse »*.
- **Community management** — description : *« Gestion complète de votre Instagram et de vos campagnes Meta Ads pour une présence régulière et performante. »*  
  Points : ajouter *« Gestion des publicités Meta Ads (Facebook & Instagram) »*, conserver les autres, et ajouter *« Mise en avant Mariable incluse »* en dernier.
- **Mise en avant Mariable** — inchangée (reste accessible en formule autonome).

**3. Nouvelle 4ᵉ carte expertise** : *« Développement digital »*
- Icône : `Globe` (lucide).
- Description : « Sites web, guides digitaux et outils en ligne sur-mesure pour valoriser votre offre et fluidifier la relation client. »
- Points :
  - Création de site web vitrine ou réservation
  - Guides digitaux (welcome guide, brochures interactives)
  - Outils en ligne sur-mesure (formulaires, espaces clients)
  - Autres projets de développement web sur demande
- Tarif : « Sur devis »

→ Passer la grille de `md:grid-cols-3` à `md:grid-cols-2 lg:grid-cols-4` (l. 175). Mettre à jour le H2 « Nos 3 expertises » → **« Nos expertises »**.

**4. FAQ (l. 67-88)** — remplacer par une version GEO/SEO friendly, formulée en questions naturelles que pros tapent dans Google / posent à ChatGPT, avec réponses riches en mots-clés (« lieu de réception », « traiteur mariage », « community manager mariage », « Meta Ads mariage », « site web mariage », « visibilité prestataire mariage », tarifs indicatifs « sur devis », zone géographique France). 

Nouvelles questions proposées (8) :
1. Quels professionnels du mariage accompagnez-vous ?
2. Combien coûte une agence de communication spécialisée mariage ?
3. Comment gagner en visibilité quand on est un lieu de réception ou un traiteur mariage ?
4. Pourquoi confier ses publicités Meta Ads à une agence spécialisée mariage ?
5. Pouvez-vous créer le site web de mon domaine de mariage ?
6. Qu'est-ce qu'un guide digital pour un lieu de réception ou un traiteur ?
7. La mise en avant Mariable est-elle incluse dans vos prestations ?
8. Travaillez-vous partout en France ?

Réponses : 2-4 phrases, ton éditorial, mots-clés naturels, pas de bourrage.

**5. JSON-LD (l. 90-103)** — enrichir :
- `description` : ajouter « sites web, guides digitaux et campagnes Meta Ads » et préciser « pour lieux de réception et traiteurs mariage en France ».
- Ajouter un second bloc `FAQPage` JSON-LD basé sur la nouvelle FAQ (boost GEO).

## Hors scope
- Pas de changement de routes, d'auth, ni d'autres pages.
- Pas de refonte design : on conserve éditorial sage/beige/noir et `rounded-none`.
