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
}

// Un seul Price Stripe partagé pour les 7 ebooks à 4€.
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
    slug: 'catalogue-prix-mariage-2026',
    title: 'Catalogue Prix Mariage 2026 en France',
    description:
      "Les fourchettes de prix réelles par poste (lieu, traiteur, photographe, DJ, fleuriste…) pour anticiper votre budget mariage 2026.",
    price: 4,
    theme: 'budget',
  },
  {
    slug: 'guide-ceremonie-laique',
    title: 'Guide Ultime — Organiser la Cérémonie Laïque',
    description:
      "Le déroulé complet d'une cérémonie laïque qui vous ressemble : rôles, rituels, textes et timing.",
    price: 4,
    theme: 'ceremonie',
  },
  {
    slug: 'guide-debutants-mariage',
    title: 'Guide Ultime — Débutants Mariage',
    description:
      "Le guide de démarrage pour organiser votre mariage à partir de zéro : étapes, priorités et pièges à éviter.",
    price: 4,
    theme: 'organisation',
  },
  {
    slug: 'guide-discours-mariage',
    title: 'Do & Don\'t du Discours de Mariage',
    description:
      "Les bonnes pratiques et les erreurs à éviter pour un discours de mariage réussi, avec structure et exemples.",
    price: 4,
    theme: 'temoins',
  },
  {
    slug: 'checklist-temoins',
    title: 'Checklist pour les Témoins',
    description:
      "La checklist complète des missions du témoin, avant, pendant et après le mariage.",
    price: 4,
    theme: 'temoins',
  },
  {
    slug: 'checklist-questions-prestataires',
    title: 'Sélection des prestataires — Checklist questions',
    description:
      "Les bonnes questions à poser à chaque prestataire (lieu, traiteur, photographe, DJ…) avant de signer.",
    price: 4,
    theme: 'prestataires',
  },
  {
    slug: 'checklist-mariee',
    title: 'Checklist pour la Mariée',
    description:
      "La checklist essentielle des préparatifs de la mariée : tenue, beauté, accessoires, jour J.",
    price: 4,
    theme: 'mariee',
  },
];
