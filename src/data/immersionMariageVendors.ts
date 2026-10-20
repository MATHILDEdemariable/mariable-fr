// Données mockup (sans base) du carnet d'adresses Immersion Mariage 2026.
export type ImmersionCategory = 'Lieux' | 'Photo & Vidéo' | 'Traiteur & Bar' | 'Musique & Danse' | 'Organisation' | 'Déco & Création';

export interface ImmersionVendor {
  slug: string;
  name: string;
  speciality: string;
  category: ImmersionCategory;
  location: string;
  image: string;
  experience: string;
}

const IMG = 'https://immersion-mariage.fr/wp-content/uploads/2026/05/';

export const IMMERSION_CATEGORIES: ImmersionCategory[] = ['Lieux', 'Photo & Vidéo', 'Traiteur & Bar', 'Musique & Danse', 'Organisation', 'Déco & Création'];

export const IMMERSION_VENDORS: ImmersionVendor[] = [
  { slug: 'ceremonie-story', name: 'Cérémonie Story', speciality: 'Wedding planner & cérémonie laïque', category: 'Organisation', location: 'Strasbourg', image: `${IMG}ImmersionMariageParis-104-300x200.jpg`, experience: 'Vous a fait vivre une cérémonie laïque sur mesure.' },
  { slug: 'dylan-kenway-music', name: 'Dylan Kenway Music', speciality: 'DJ mariage', category: 'Musique & Danse', location: 'Alsace', image: `${IMG}20250405Immersionjour1NORTHSEBASTIEN0033-300x200.jpg`, experience: "A fait danser la soirée de l'événement." },
  { slug: 'traiteur-m', name: 'Traiteur M', speciality: 'Traiteur', category: 'Traiteur & Bar', location: 'Alsace', image: `${IMG}traiteur-m-1-238x300.png`, experience: 'Vous a fait déguster son cocktail et ses bouchées.' },
  { slug: 'ms-photographies', name: 'MS Photographies', speciality: 'Photographe', category: 'Photo & Vidéo', location: 'Alsace', image: `${IMG}MS-Photographies-Mariage-300x237.jpg`, experience: 'A capturé les moments forts de la journée.' },
  { slug: 'maureen-carre', name: 'Maureen Carré', speciality: 'Photographe', category: 'Photo & Vidéo', location: 'Alsace', image: `${IMG}Maureen-Carre-Photo-1-300x237.jpg`, experience: 'Portraits naturels réalisés sur place.' },
  { slug: 'maison-prisma', name: 'Maison Prisma', speciality: 'Décoration & scénographie', category: 'Déco & Création', location: 'Alsace', image: `${IMG}Maison-Prisma-300x237.jpg`, experience: 'A imaginé la scénographie des espaces.' },
  { slug: 'ldc-dance', name: 'LDC Dance', speciality: 'Ouverture de bal', category: 'Musique & Danse', location: 'Alsace', image: `${IMG}LDC-Dance-300x237.jpg`, experience: "Vous a initiés à l'ouverture de bal." },
  { slug: 'la-faiseuse-de-reves', name: 'La Faiseuse de Rêves', speciality: 'Décoration', category: 'Déco & Création', location: 'Alsace', image: `${IMG}La-faiseuse-de-reve-300x237.jpg`, experience: 'A habillé les tables de l’événement.' },
  { slug: 'l-ady-oui-events', name: 'L.ADY Oui Events', speciality: 'Wedding planner', category: 'Organisation', location: 'Alsace', image: '', experience: 'A coordonné une partie du déroulé.' },
  { slug: 'jessica-drouin', name: 'Jessica Drouin', speciality: 'Officiante de cérémonie', category: 'Organisation', location: 'Alsace', image: '', experience: 'A partagé ses conseils de cérémonie.' },
  { slug: 'helin-event', name: 'Helin Event', speciality: 'Décoration événementielle', category: 'Déco & Création', location: 'Alsace', image: '', experience: 'Décor et mises en scène de l’événement.' },
  { slug: 'guyssou', name: 'Guyssou', speciality: 'Animation', category: 'Musique & Danse', location: 'Alsace', image: '', experience: "A animé les temps forts de l'événement." },
  { slug: 'gk-sugarart', name: 'Gabriela K Sugar Art', speciality: 'Wedding cake', category: 'Traiteur & Bar', location: 'Alsace', image: '', experience: 'Vous a fait goûter ses créations sucrées.' },
  { slug: 'en-avant-la-musique', name: 'En Avant la Musique', speciality: 'Musiciens live', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Musique live pendant la cérémonie.' },
  { slug: 'delphine-petit-postma', name: 'Delphine Petit-Postma', speciality: 'Wedding planner', category: 'Organisation', location: 'Alsace', image: '', experience: 'A répondu à vos questions d’organisation.' },
  { slug: 'deborah-elodie-villemus', name: 'Déborah & Élodie Villemus', speciality: 'Coordination', category: 'Organisation', location: 'Alsace', image: '', experience: 'Coordination et accueil des visiteurs.' },
  { slug: 'baroof', name: "Bar'OOF", speciality: 'Bar à cocktails', category: 'Traiteur & Bar', location: 'Alsace', image: '', experience: 'Vous a servi ses cocktails signature.' },
  { slug: 'atelier-des-sens', name: 'Atelier des Sens', speciality: 'Fleuriste', category: 'Déco & Création', location: 'Alsace', image: '', experience: 'Compositions florales de l’événement.' },
  { slug: 'mariable', name: 'Mariable', speciality: 'App de coordination du jour J', category: 'Organisation', location: 'France', image: '', experience: 'Vous a présenté le déroulé partagé du jour J.' },
  { slug: 'les-pas-de-danse', name: 'Les Pas de Danse', speciality: 'Professeur de danse', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Cours d’ouverture de bal en direct.' },
  { slug: 'kywwie-films', name: 'Kywwie Films', speciality: 'Vidéaste', category: 'Photo & Vidéo', location: 'Alsace', image: '', experience: 'A filmé l’événement.' },
  { slug: 'aujourdhui-cest', name: "Aujourd'hui c'est…", speciality: 'Papeterie', category: 'Déco & Création', location: 'Alsace', image: '', experience: 'Faire-part et papeterie exposés.' },
  { slug: 'cindy-witter', name: 'Cindy Witter Photography', speciality: 'Photographe', category: 'Photo & Vidéo', location: 'Alsace', image: '', experience: 'Séances photo sur place.' },
  { slug: 'louise-nomad-bar', name: 'Louise Nomad Bar', speciality: 'Bar mobile', category: 'Traiteur & Bar', location: 'Alsace', image: '', experience: 'Bar itinérant pendant le cocktail.' },
  { slug: 'chateau-de-pourtales', name: 'Château de Pourtalès', speciality: 'Lieu de réception', category: 'Lieux', location: 'Strasbourg', image: '', experience: 'Lieu d’exception à visiter.' },
  { slug: 'villa-hetres-pourpres', name: 'La Villa des Hêtres Pourpres', speciality: 'Lieu de réception', category: 'Lieux', location: 'Vosges', image: '', experience: 'Un lieu au cœur des Vosges.' },
  { slug: 'villa-quai-sturm', name: 'Villa Quai Sturm', speciality: 'Salle de mariage', category: 'Lieux', location: 'Strasbourg', image: '', experience: 'Salle de réception à Strasbourg.' },
  { slug: 'clauday-evenements', name: 'Clauday Évènements', speciality: 'Photobooth & décoration', category: 'Déco & Création', location: 'Alsace', image: '', experience: 'Photobooth installé pendant l’événement.' },
];
