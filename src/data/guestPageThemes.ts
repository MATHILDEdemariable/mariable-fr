/**
 * Personnalisation de la « feuille des mariés » (page RSVP publique).
 * Palettes et polices prédéfinies : les mariés choisissent, la mise en page reste soignée.
 */

export interface GuestPagePalette {
  key: string;
  labelFr: string;
  labelEn: string;
  background: string;
  surface: string;
  accent: string;
  text: string;
}

export const GUEST_PAGE_PALETTES: GuestPagePalette[] = [
  { key: 'sauge', labelFr: 'Sauge & crème', labelEn: 'Sage & cream', background: '#F8F5EF', surface: '#FFFFFF', accent: '#63745A', text: '#1F2A1C' },
  { key: 'rose-clair', labelFr: 'Rose clair', labelEn: 'Blush pink', background: '#FBEFF1', surface: '#FFFFFF', accent: '#C27C8E', text: '#3D2A30' },
  { key: 'bordeaux', labelFr: 'Bordeaux', labelEn: 'Burgundy', background: '#F7F0EA', surface: '#FFFDFB', accent: '#5A1827', text: '#2B0F16' },
  { key: 'orange-rose', labelFr: 'Orange & rose vif', labelEn: 'Orange & hot pink', background: '#FFF4EC', surface: '#FFFFFF', accent: '#E8456B', text: '#3A1A12' },
  { key: 'bleu-ciel', labelFr: 'Bleu ciel', labelEn: 'Sky blue', background: '#EEF5FB', surface: '#FFFFFF', accent: '#4A86B8', text: '#14283A' },
  { key: 'terracotta', labelFr: 'Terracotta & sable', labelEn: 'Terracotta & sand', background: '#F6EDE3', surface: '#FFFBF6', accent: '#B5603F', text: '#36211A' },
  { key: 'bleu-nuit', labelFr: 'Bleu nuit & écru', labelEn: 'Midnight & ecru', background: '#F4F1EA', surface: '#FFFFFF', accent: '#1E2B4A', text: '#141B2D' },
  { key: 'noir-blanc', labelFr: 'Noir & blanc', labelEn: 'Black & white', background: '#FFFFFF', surface: '#FAFAFA', accent: '#111111', text: '#111111' },
];

export interface GuestPageFont {
  key: string;
  label: string;
  heading: string;
  body: string;
}

export const GUEST_PAGE_FONTS: GuestPageFont[] = [
  { key: 'editorial', label: 'Playfair Display', heading: "'Playfair Display', serif", body: "'Inter', system-ui, sans-serif" },
  { key: 'romantique', label: 'Cormorant Garamond', heading: "'Cormorant Garamond', serif", body: "'Karla', system-ui, sans-serif" },
  { key: 'moderne', label: 'Plus Jakarta Sans', heading: "'Plus Jakarta Sans', sans-serif", body: "'Plus Jakarta Sans', sans-serif" },
];

export const GUEST_PAGE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Karla:wght@400;500&family=Plus+Jakarta+Sans:wght@400;600&family=Playfair+Display:wght@500;600&display=swap';

export type GuestPageInfoKey = 'dressCode' | 'accommodation' | 'transport' | 'registry';

export const GUEST_PAGE_INFO_FIELDS: Array<{ key: GuestPageInfoKey; emoji: string; labelFr: string; labelEn: string; placeholderFr: string }> = [
  { key: 'dressCode', emoji: '👗', labelFr: 'Dress code', labelEn: 'Dress code', placeholderFr: 'Tenue de cocktail, une touche de couleur bienvenue…' },
  { key: 'accommodation', emoji: '🏡', labelFr: 'Hébergements', labelEn: 'Accommodation', placeholderFr: 'Hôtel du Parc (5 min) – 04 00 00 00 00, gîtes à proximité…' },
  { key: 'transport', emoji: '🚐', labelFr: 'Accès & transports', labelEn: 'Getting there', placeholderFr: 'Parking sur place, navette depuis la gare à 15h…' },
  { key: 'registry', emoji: '🎁', labelFr: 'Cagnotte / liste de mariage', labelEn: 'Gift registry', placeholderFr: 'Votre présence est notre plus beau cadeau. Cagnotte : lien…' },
];

export interface GuestPageCustomization {
  palette?: string;
  font?: string;
  showSchedule?: boolean;
  infos?: Partial<Record<GuestPageInfoKey, { text?: string; visible?: boolean }>>;
  registryUrl?: string;
}

export const resolveGuestPageTheme = (customization?: GuestPageCustomization | null) => ({
  palette: GUEST_PAGE_PALETTES.find((p) => p.key === customization?.palette) ?? GUEST_PAGE_PALETTES[0],
  font: GUEST_PAGE_FONTS.find((f) => f.key === customization?.font) ?? GUEST_PAGE_FONTS[0],
});
