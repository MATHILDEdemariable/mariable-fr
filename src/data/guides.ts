export type GuideTheme =
  | 'budget'
  | 'ceremonie'
  | 'organisation'
  | 'prestataires'
  | 'mariee'
  | 'temoins';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  price: number; // en EUR
  pages?: number;
  theme: GuideTheme;
  summary: string[];
}

// Un seul Price Stripe partagé pour tous les ebooks.
export const SHARED_EBOOK_PRICE_ID = 'price_1Tqv7UKHghqBzkgj4mOMVYty';

export const GUIDE_THEMES: { value: GuideTheme; label: string }[] = [
  { value: 'budget', label: 'Budget' },
  { value: 'ceremonie', label: 'Cérémonie' },
  { value: 'organisation', label: 'Organisation' },
  { value: 'prestataires', label: 'Prestataires' },
  { value: 'mariee', label: 'Mariée' },
  { value: 'temoins', label: 'Témoins' },
];

export const GUIDES: Guide[] = [
  {
    slug: 'guide-jour-j',
    title: 'Guide Ultime Jour-J',
    description:
      "Tout ce qu'il faut orchestrer de M-1 au Jour J pour un mariage fluide et sans stress.",
    price: 4.9,
    theme: 'organisation',
    summary: [
      "Timeline complète du Jour-J, de M-1 à J-J",
      "Sécuriser les prestataires et confirmer les derniers détails",
      "Préparer ses valises et orchestrer la mise en place",
      "Déroulé-type heure par heure",
      "Check-lists cochables + conseils pour préserver son énergie",
    ],
  },
  {
    slug: 'guide-debutants-mariage',
    title: 'Guide Ultime — Débutants Mariage',
    description:
      "Le guide de démarrage pour organiser votre mariage à partir de zéro : étapes, priorités et pièges à éviter.",
    price: 4.9,
    theme: 'organisation',
    summary: [
      "Point de départ pour démarrer l'organisation",
      "Définir sa vision et son budget",
      "Choisir la date et le lieu",
      "Constituer son équipe de prestataires",
      "Gérer la communication de couple et la charge mentale",
      "Démarches administratives (civil + religieux)",
    ],
  },
  {
    slug: 'checklist-mariee',
    title: 'Checklist pour la Mariée',
    description:
      "La checklist essentielle des préparatifs de la mariée : tenue, beauté, accessoires, jour J.",
    price: 4.9,
    theme: 'mariee',
    summary: [
      "Robe et accessoires — timing des essayages",
      "Beauté et bien-être",
      "Kit d'urgence",
      "Coordination et bagages",
      "Cases à cocher prêtes à l'emploi",
    ],
  },
  {
    slug: 'checklist-temoins',
    title: 'Checklist pour les Témoins',
    description:
      "La checklist complète des missions du témoin, avant, pendant et après le mariage.",
    price: 4.9,
    theme: 'temoins',
    summary: [
      "Informations légales à fournir",
      "EVJF/EVG et discours à préparer",
      "Tenue à harmoniser",
      "Rôle de soutien le Jour J (kits d'urgence, gestion des imprévus)",
    ],
  },
  {
    slug: 'checklist-questions-prestataires',
    title: 'Sélection des prestataires — Checklist questions',
    description:
      "Les bonnes questions à poser à chaque prestataire (lieu, traiteur, photographe, DJ…) avant de signer.",
    price: 4.9,
    theme: 'prestataires',
    summary: [
      "Méthodologie de sélection en 6 étapes",
      "Questions essentielles à poser par catégorie (traiteur, photo/vidéo, DJ)",
      "Tips pour comparer des devis sans se faire piéger par les coûts cachés",
    ],
  },
  {
    slug: 'guide-discours-mariage',
    title: "Do & Don't du Discours de Mariage",
    description:
      "Les bonnes pratiques et les erreurs à éviter pour un discours de mariage réussi, avec structure et exemples.",
    price: 4.9,
    theme: 'temoins',
    summary: [
      "Cadrage avant l'écriture",
      "Structure en 4 temps",
      "Sujets à manier avec précaution",
      "Bons réflexes le jour de la prise de parole",
      "Check-list express",
    ],
  },
  {
    slug: 'guide-ceremonie-laique',
    title: 'Guide Ultime — Organiser la Cérémonie Laïque',
    description:
      "Le déroulé complet d'une cérémonie laïque qui vous ressemble : rôles, rituels, textes et timing.",
    price: 4.9,
    theme: 'ceremonie',
    summary: [
      "Pourquoi officiant est un vrai métier (et quand faire appel à un pro)",
      "Durée type (20-40 min)",
      "Déroulé étape par étape",
      "Musique moment par moment",
      "Traditions d'entrée/sortie et rituels symboliques populaires",
    ],
  },
  {
    slug: 'catalogue-prix-mariage-2026',
    title: 'Catalogue Prix Mariage 2026 en France',
    description:
      "Les fourchettes de prix réelles par poste (lieu, traiteur, photographe, DJ, fleuriste…) pour anticiper votre budget mariage 2026.",
    price: 4.9,
    theme: 'budget',
    summary: [
      "Fourchettes de prix poste par poste (12 catégories)",
      "Répartition indicative du budget global",
      "Simulation chiffrée complète (100 invités)",
    ],
  },
];
