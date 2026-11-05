// Prestataires présents à Immersion Mariage — Château de Pourtalès, novembre 2026.
export type ImmersionCategory = 'Lieux' | 'Photo & Vidéo' | 'Mode & Beauté' | 'Traiteur & Bar' | 'Musique & Danse' | 'Organisation' | 'Déco & Création';

export interface ImmersionVendor {
  slug: string;
  name: string;
  speciality: string;
  category: ImmersionCategory;
  location: string;
  image: string;
  experience: string;
  /** Email du prestataire : reçoit les demandes, Mathilde en copie. */
  email?: string;
  phone?: string;
  instagram?: string;
}

export const IMMERSION_CATEGORIES: ImmersionCategory[] = ['Photo & Vidéo', 'Mode & Beauté', 'Musique & Danse', 'Organisation', 'Déco & Création', 'Traiteur & Bar', 'Lieux'];

export const IMMERSION_VENDORS: ImmersionVendor[] = [
  { slug: 'kywwie-films', name: 'Kywwie Films', speciality: 'Vidéaste', category: 'Photo & Vidéo', location: 'Alsace', image: '', experience: "A filmé les coulisses de l'événement.", email: 'kywwie.graphisme@gmail.com', phone: '06 59 86 12 28', instagram: 'kywwie_films' },
  { slug: 'cindy-witter', name: 'Cindy Witter Photography', speciality: 'Photographe', category: 'Photo & Vidéo', location: 'Alsace', image: '', experience: 'A capturé les moments forts en coulisses.', email: 'cindywitterphotography@gmail.com', phone: '06 78 71 77 00', instagram: 'cindy_photographe_alsace' },
  { slug: 'megane-perrin', name: 'Mégane Perrin', speciality: 'Photographe', category: 'Photo & Vidéo', location: 'Alsace', image: 'https://meganeperrin.fr/wp-content/uploads/2026/10/photographe-mariage-elopement-montagne-1024x683.webp', experience: 'Portraits naturels réalisés sur place.', email: 'contact@meganeperrin.fr', phone: '06 24 91 29 11', instagram: 'megane.perrin' },
  { slug: 'photo-touch', name: 'Photo Touch', speciality: 'Photobooth miroir', category: 'Photo & Vidéo', location: 'Alsace', image: '', experience: 'Photobooth miroir installé pendant la journée.', email: 'phototouch.am@gmail.com', phone: '07 66 06 14 36', instagram: 'photo_touch_miroir' },
  { slug: 'ceremonie-story', name: 'Cérémonie Story', speciality: 'Wedding planner, designer & officiant', category: 'Organisation', location: 'Strasbourg', image: 'https://www.ceremonie-story.fr/wp-content/uploads/elementor/thumbs/WEDDING-PLANNER-STRASBOURG-rq0g6k6iwt1vzdjjnjvtkpu6ma9aygvtx2gc528sxo.jpg', experience: 'Vous a fait vivre une cérémonie laïque sur mesure.', email: 'info@ceremonie-story.fr', phone: '06 08 43 24 74', instagram: 'ceremonie_story' },
  { slug: 'mariable', name: 'Mariable', speciality: "Wedding planner digital & régie Jour J boostée à l'IA", category: 'Organisation', location: 'France entière', image: '', experience: 'La plateforme tout-en-un pour organiser votre mariage, centraliser vos prestataires et piloter le Jour J sans stress.', email: 'mathilde@mariable.fr', instagram: 'mariable.fr' },
  { slug: 'la-faiseuse-de-reves', name: 'La Faiseuse de Rêves', speciality: 'Voyage de noces sur mesure', category: 'Organisation', location: 'Paris', image: 'https://www.lafaiseusedereves.fr/wp-content/uploads/2025/08/La-faiseuse-de-reve-voyage-haut-de-gamme-sur-mesure.jpg', experience: 'Vous a fait rêver à votre voyage de noces.', email: 'natacha@lafaiseusedereves.fr', phone: '06 61 67 33 64', instagram: 'lafaiseusedereves' },
  { slug: 'voeux-et-vinyle', name: 'Vœux et Vinyle', speciality: 'DJ, déco & officiant', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Musique et cérémonie en mode vinyle.', email: 'voeuxvinyle@gmail.com', phone: '06 56 81 49 39', instagram: 'voeux-vinyle' },
  { slug: 'prax-events', name: 'Prax Events', speciality: 'DJ & magicien', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Ambiance musicale et tours de magie.', email: 'contact@prax-events.fr', phone: '07 83 01 87 02', instagram: 'prax_events' },
  { slug: 'aurore-casano', name: 'Aurore Casano', speciality: 'Chanteuse live', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Chant live pendant la cérémonie.', email: 'casano.aurore@gmail.com', phone: '07 88 75 92 00', instagram: 'casanoaurore' },
  { slug: 'ecole-danse-herve-mathis', name: 'École de danse Hervé Mathis', speciality: 'Ouverture de bal', category: 'Musique & Danse', location: 'Alsace', image: '', experience: "Vous a initiés à l'ouverture de bal.", email: 'hervemathis67@gmail.com', phone: '06 62 81 05 64' },
  { slug: 'booth-et-boom', name: 'Booth et Boom', speciality: 'Artificier', category: 'Musique & Danse', location: 'Alsace', image: '', experience: 'Effets pyrotechniques et étincelles.', email: 'booth_boom@yahoo.com', phone: '06 58 85 13 62', instagram: 'booth_boom' },
  { slug: 'justine-franquet', name: 'Justine Franquet', speciality: 'Maquilleuse', category: 'Mode & Beauté', location: 'Alsace', image: '', experience: 'Mises en beauté des modèles.', phone: '07 71 76 50 51', instagram: 'justinefr_makeup' },
  { slug: 'warda-beauty', name: 'Warda Beauty', speciality: 'Maquilleuse & coiffeuse', category: 'Mode & Beauté', location: 'Alsace', image: '', experience: 'Coiffures et maquillages de mariée.', email: 'wardabeauty67@gmail.com', phone: '07 69 89 53 04', instagram: 'wardabeauty67' },
  { slug: 'aux-fils-de-l-histoire', name: "Aux Fils de l'Histoire", speciality: 'Robes de mariée', category: 'Mode & Beauté', location: 'Alsace', image: '', experience: 'Robes présentées lors du défilé.', email: 'auxfilsdelhistoire@gmail.com', phone: '06 84 81 17 07', instagram: 'auxfilsdelhistoire.robemariee' },
  { slug: 'au-royaume-des-robes', name: 'Au Royaume des Robes', speciality: 'Robes de mariée', category: 'Mode & Beauté', location: 'Alsace', image: '', experience: 'Robes présentées lors du défilé.', phone: '06 62 80 08 15', instagram: 'auroyaume.desrobes' },
  { slug: 'emie-saint-germain', name: 'Emie Saint-Germain', speciality: 'Robes & costumes', category: 'Mode & Beauté', location: 'Alsace', image: 'https://cdn.prod.website-files.com/5fae3c7cfb5bf2b24de8ea7e/63fcea699241c62804b5ab37_Robe%20de%20mari%C3%A9e%20Lysie%20(-1.jpg', experience: 'Tenues de mariés présentées sur place.', email: 'info@emie-saint-germain.fr', phone: '09 87 57 23 02', instagram: 'emie_saint_germain' },
  { slug: 'ici-et-tailleur', name: 'Ici et Tailleur', speciality: 'Costumes sur mesure', category: 'Mode & Beauté', location: 'Alsace', image: '', experience: 'Costumes du marié présentés sur place.', email: 'iciettailleur@gmail.com', phone: '06 95 95 59 34', instagram: 'iciettailleur.costumes' },
  { slug: 'une-histoire-une-fleur', name: 'Une Histoire… Une Fleur', speciality: 'Fleuriste', category: 'Déco & Création', location: 'Schiltigheim', image: 'https://fleuriste-schiltigheim.fr/wp/wp-content/uploads/2018/02/mariage-test-500-250.jpg', experience: "Compositions florales de l'événement.", email: 'contact@unehistoireunefleur.fr', phone: '06 23 26 27 70', instagram: 'unehistoireunefleur' },
  { slug: 'clauday-evenements', name: 'Clauday Évènements', speciality: 'Location de matériel', category: 'Déco & Création', location: 'Alsace', image: '', experience: "Mobilier et matériel de l'événement.", email: 'contact@clauday-evenements.fr', phone: '03 89 57 11 23', instagram: 'clauday_evenement' },
  { slug: 'louise-nomad-bar', name: 'Louise Nomad Bar', speciality: 'Bar à cocktails itinérant', category: 'Traiteur & Bar', location: 'Alsace', image: '', experience: 'Vous a servi ses cocktails.', email: 'contact@louisenomadbar.alsace', phone: '07 52 07 90 02', instagram: 'louisenomadbar' },
  { slug: 'chateau-de-pourtales', name: 'Château de Pourtalès', speciality: 'Lieu de réception', category: 'Lieux', location: 'Strasbourg', image: '', experience: "Le lieu d'exception qui vous a accueillis." },
];
