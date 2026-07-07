export type GuideTheme =
  | 'ceremonie'
  | 'organisation'
  | 'jour-j'
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

export const GUIDE_THEMES: { value: GuideTheme; label: string }[] = [
  { value: 'ceremonie', label: 'Cérémonie' },
  { value: 'organisation', label: 'Organisation' },
  { value: 'jour-j', label: 'Jour-J' },
  { value: 'prestataires', label: 'Prestataires' },
  { value: 'mariee', label: 'Mariée' },
  { value: 'temoins', label: 'Témoins' },
];

export const GUIDES: Guide[] = [
  {
    slug: 'checklist-mariage-civil-mairie',
    title: 'Checklist mariage Civil — Mairie',
    description: "Toutes les démarches administratives à connaître pour un mariage civil sans stress.",
    price: 4,
    pages: 8,
    theme: 'ceremonie',
  },
  {
    slug: 'checklist-ceremonie-laique-catholique',
    title: 'Checklist cérémonie (Laïque ou Catholique)',
    description: "Le déroulé étape par étape pour préparer une cérémonie qui vous ressemble.",
    price: 6,
    pages: 14,
    theme: 'ceremonie',
  },
  {
    slug: 'guide-temoins',
    title: 'Guide témoins',
    description: "Le rôle, les missions et les attentions à offrir aux témoins du jour J.",
    price: 6,
    pages: 12,
    theme: 'temoins',
  },
  {
    slug: 'guide-planning-jour-j',
    title: 'Guide planning Jour-J',
    description: "Le rétroplanning heure par heure pensé par un wedding planner pro.",
    price: 9,
    pages: 20,
    theme: 'jour-j',
  },
  {
    slug: 'checklist-photo-jour-j',
    title: 'Checklist photo du Jour-J',
    description: "La liste des photos à ne surtout pas oublier — à transmettre à votre photographe.",
    price: 4,
    pages: 6,
    theme: 'jour-j',
  },
  {
    slug: 'guide-mariee',
    title: 'Guide mariée',
    description: "Tous les conseils essentiels pour vivre sereinement le jour J côté mariée.",
    price: 6,
    pages: 16,
    theme: 'mariee',
  },
  {
    slug: 'guide-organisation-complete-debutants',
    title: 'Guide Organisation complète (débutants)',
    description: "Le guide complet pour démarrer l'organisation de votre mariage de zéro.",
    price: 9,
    pages: 28,
    theme: 'organisation',
  },
  {
    slug: 'guide-prestataires-mariage',
    title: 'Guide prestataires de mariage',
    description: "Comment choisir, briefer et coordonner chaque prestataire du mariage.",
    price: 9,
    pages: 24,
    theme: 'prestataires',
  },
];
