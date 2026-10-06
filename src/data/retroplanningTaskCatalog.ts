// Catalogue de tâches classiques du rétroplanning, rangées sur les mêmes périodes
// que l'onglet « Avec l'IA » (monthsBefore = mois avant le mariage).
export interface RetroplanningCatalogTask {
  id: string;
  monthsBefore: number;
  category: string;
  stakeholder: string;
  fr: string;
  en: string;
}

export const RETROPLANNING_CATALOG_PERIODS: { monthsBefore: number; fr: string; en: string }[] = [
  { monthsBefore: 12, fr: '12 à 9 mois avant', en: '12-9 months before' },
  { monthsBefore: 8, fr: '8 à 6 mois avant', en: '8-6 months before' },
  { monthsBefore: 5, fr: '5 à 4 mois avant', en: '5-4 months before' },
  { monthsBefore: 3, fr: '3 mois avant', en: '3 months before' },
  { monthsBefore: 2, fr: '2 mois avant', en: '2 months before' },
  { monthsBefore: 1, fr: '1 mois avant', en: '1 month before' },
  { monthsBefore: 0.5, fr: '2 semaines avant', en: '2 weeks before' },
  { monthsBefore: 0.25, fr: 'Semaine du mariage', en: 'Wedding week' },
];

const task = (id: string, monthsBefore: number, category: string, stakeholder: string, fr: string, en: string): RetroplanningCatalogTask =>
  ({ id, monthsBefore, category, stakeholder, fr, en });

export const RETROPLANNING_TASK_CATALOG: RetroplanningCatalogTask[] = [
  task('budget', 12, 'Organisation', 'couple', 'Définir le budget global', 'Set the overall budget'),
  task('guest-draft', 12, 'Invités', 'couple', 'Établir une première liste d\'invités', 'Draft the guest list'),
  task('venue', 12, 'Réception', 'couple', 'Visiter et réserver le lieu de réception', 'Visit and book the venue'),
  task('planner', 12, 'Organisation', 'couple', 'Choisir le wedding planner', 'Choose the wedding planner'),
  task('caterer', 12, 'Réception', 'planner', 'Sélectionner et réserver le traiteur', 'Select and book the caterer'),
  task('photographer', 12, 'Prestataires', 'planner', 'Réserver photographe et vidéaste', 'Book photographer and videographer'),
  task('save-date', 8, 'Papeterie', 'couple', 'Envoyer les save-the-date', 'Send save-the-dates'),
  task('dj', 8, 'Prestataires', 'planner', 'Réserver DJ ou groupe de musique', 'Book DJ or band'),
  task('dress', 8, 'Tenues', 'bride', 'Choisir la robe de mariée', 'Choose the wedding dress'),
  task('officiant', 8, 'Cérémonie', 'couple', 'Réserver l\'officiant ou la cérémonie religieuse', 'Book the officiant or religious ceremony'),
  task('florist', 8, 'Décoration', 'planner', 'Choisir le fleuriste', 'Choose the florist'),
  task('accommodation', 8, 'Logistique', 'planner', 'Bloquer les hébergements invités', 'Block guest accommodation'),
  task('suit', 5, 'Tenues', 'groom', 'Choisir le costume du marié', 'Choose the groom\'s suit'),
  task('invites', 5, 'Papeterie', 'couple', 'Commander les faire-part', 'Order the invitations'),
  task('tasting', 5, 'Réception', 'couple', 'Dégustation chez le traiteur', 'Caterer tasting'),
  task('rings', 5, 'Tenues', 'couple', 'Choisir les alliances', 'Choose the wedding rings'),
  task('honeymoon', 5, 'Organisation', 'couple', 'Réserver le voyage de noces', 'Book the honeymoon'),
  task('send-invites', 3, 'Papeterie', 'couple', 'Envoyer les faire-part', 'Send the invitations'),
  task('town-hall', 3, 'Cérémonie', 'couple', 'Déposer le dossier à la mairie', 'File the town hall paperwork'),
  task('hair-makeup', 3, 'Tenues', 'bride', 'Essai coiffure et maquillage', 'Hair and makeup trial'),
  task('bachelor', 3, 'Organisation', 'witnesses', 'Organiser EVJF / EVG', 'Organise bachelor/bachelorette parties'),
  task('decor', 3, 'Décoration', 'planner', 'Valider la décoration et la scénographie', 'Approve decor and styling'),
  task('rsvp', 2, 'Invités', 'couple', 'Relancer les réponses des invités', 'Chase guest RSVPs'),
  task('menu', 2, 'Réception', 'planner', 'Valider le menu final', 'Confirm the final menu'),
  task('ceremony-script', 2, 'Cérémonie', 'couple', 'Écrire le déroulé de la cérémonie', 'Write the ceremony script'),
  task('speeches', 2, 'Cérémonie', 'witnesses', 'Préparer les discours', 'Prepare the speeches'),
  task('seating', 1, 'Invités', 'couple', 'Faire le plan de table', 'Create the seating plan'),
  task('final-fitting', 1, 'Tenues', 'bride', 'Dernier essayage de la robe', 'Final dress fitting'),
  task('day-plan', 1, 'Logistique', 'planner', 'Établir le planning du jour J', 'Build the wedding-day schedule'),
  task('vendor-brief', 1, 'Prestataires', 'planner', 'Briefer tous les prestataires', 'Brief all vendors'),
  task('guest-count', 0.5, 'Réception', 'planner', 'Confirmer le nombre d\'invités au traiteur', 'Confirm guest count with caterer'),
  task('balances', 0.5, 'Organisation', 'parents', 'Préparer les soldes des prestataires', 'Prepare vendor final payments'),
  task('venue-brief', 0.5, 'Logistique', 'planner', 'Brief technique avec le lieu', 'Technical brief with the venue'),
  task('kit', 0.25, 'Logistique', 'witnesses', 'Préparer le kit de secours', 'Prepare the emergency kit'),
  task('setup', 0.25, 'Décoration', 'planner', 'Installer la décoration', 'Set up the decor'),
  task('rest', 0.25, 'Organisation', 'couple', 'Se reposer et profiter', 'Rest and enjoy'),
];
