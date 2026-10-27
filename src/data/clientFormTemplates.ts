// Modèles de formulaires clients pour wedding planners (découverte/devis, cadrage Jour J).
// Les questions restent entièrement modifiables par le pro une fois le formulaire créé.

export type ClientFormQuestionType = 'short' | 'long' | 'date' | 'time' | 'number' | 'choice' | 'multi';

export interface ClientFormQuestion {
  id: string;
  section: string;
  label: string;
  type: ClientFormQuestionType;
  options?: string[];
  required?: boolean;
}

export type ClientFormType = 'discovery' | 'jour_j' | 'custom';

type Bilingual = { fr: string; en: string };
interface TemplateQuestion {
  section: Bilingual;
  label: Bilingual;
  type: ClientFormQuestionType;
  options?: Bilingual[];
  required?: boolean;
}

export const QUESTION_TYPE_LABELS: Record<ClientFormQuestionType, Bilingual> = {
  short: { fr: 'Réponse courte', en: 'Short answer' },
  long: { fr: 'Paragraphe', en: 'Paragraph' },
  date: { fr: 'Date', en: 'Date' },
  time: { fr: 'Horaire', en: 'Time' },
  number: { fr: 'Nombre', en: 'Number' },
  choice: { fr: 'Choix unique', en: 'Single choice' },
  multi: { fr: 'Choix multiples', en: 'Multiple choice' },
};

const s = (fr: string, en: string): Bilingual => ({ fr, en });

const DISCOVERY_QUESTIONS: TemplateQuestion[] = [
  { section: s('Date & lieu', 'Date & venue'), label: s('Date envisagée', 'Planned date'), type: 'date' },
  { section: s('Date & lieu', 'Date & venue'), label: s('Flexibilité sur la date', 'Date flexibility'), type: 'choice', options: [s('Date fixée', 'Fixed date'), s('Saison choisie', 'Season chosen'), s('Totalement flexible', 'Fully flexible')] },
  { section: s('Date & lieu', 'Date & venue'), label: s('Région ou lieu envisagé', 'Region or venue in mind'), type: 'short' },
  { section: s('Date & lieu', 'Date & venue'), label: s('Votre lieu est-il déjà réservé ?', 'Is your venue already booked?'), type: 'choice', options: [s('Oui', 'Yes'), s('Non', 'No'), s('En cours', 'In progress')] },
  { section: s('Envergure', 'Scale'), label: s('Nombre d’invités estimé', 'Estimated number of guests'), type: 'number', required: true },
  { section: s('Envergure', 'Scale'), label: s('Budget global envisagé', 'Overall budget'), type: 'choice', options: [s('Moins de 15 000 €', 'Under €15,000'), s('15 000 – 30 000 €', '€15,000 – 30,000'), s('30 000 – 50 000 €', '€30,000 – 50,000'), s('50 000 – 80 000 €', '€50,000 – 80,000'), s('Plus de 80 000 €', 'Over €80,000')] },
  { section: s('Envergure', 'Scale'), label: s('Durée des festivités', 'Length of the celebrations'), type: 'choice', options: [s('1 jour', '1 day'), s('2 jours', '2 days'), s('3 jours ou plus', '3 days or more')] },
  { section: s('Votre vision', 'Your vision'), label: s('Décrivez l’ambiance rêvée en quelques mots', 'Describe your dream atmosphere in a few words'), type: 'long' },
  { section: s('Votre vision', 'Your vision'), label: s('Vos 3 priorités', 'Your top 3 priorities'), type: 'multi', options: [s('Lieu', 'Venue'), s('Gastronomie', 'Food & drinks'), s('Photo / vidéo', 'Photo / video'), s('Musique & fête', 'Music & party'), s('Décoration & fleurs', 'Decor & flowers'), s('Tenues', 'Outfits'), s('Expérience invités', 'Guest experience')] },
  { section: s('Votre vision', 'Your vision'), label: s('Type de cérémonie', 'Type of ceremony'), type: 'multi', options: [s('Civile', 'Civil'), s('Religieuse', 'Religious'), s('Laïque', 'Symbolic')] },
  { section: s('Votre vision', 'Your vision'), label: s('Contraintes ou points d’attention', 'Constraints or points of attention'), type: 'long' },
  { section: s('Accompagnement', 'Support'), label: s('Formule souhaitée', 'Desired service'), type: 'choice', options: [s('Organisation complète', 'Full planning'), s('Organisation partielle', 'Partial planning'), s('Coordination Jour J', 'Wedding-day coordination'), s('Je ne sais pas encore', 'Not sure yet')], required: true },
  { section: s('Accompagnement', 'Support'), label: s('Prestataires déjà réservés', 'Vendors already booked'), type: 'long' },
  { section: s('Accompagnement', 'Support'), label: s('Téléphone', 'Phone'), type: 'short' },
  { section: s('Accompagnement', 'Support'), label: s('Comment nous avez-vous connus ?', 'How did you hear about us?'), type: 'short' },
];

const JOUR_J_QUESTIONS: TemplateQuestion[] = [
  { section: s('Informations clés', 'Key information'), label: s('Date du mariage', 'Wedding date'), type: 'date', required: true },
  { section: s('Informations clés', 'Key information'), label: s('Lieu de réception et adresse', 'Reception venue and address'), type: 'short' },
  { section: s('Informations clés', 'Key information'), label: s('Lieu de cérémonie (si différent)', 'Ceremony venue (if different)'), type: 'short' },
  { section: s('Horaires', 'Timings'), label: s('Début des préparatifs', 'Getting ready starts'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Mairie', 'City hall'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Cérémonie', 'Ceremony'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Début du cocktail', 'Cocktail starts'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Début du dîner', 'Dinner starts'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Ouverture du bal', 'First dance'), type: 'time' },
  { section: s('Horaires', 'Timings'), label: s('Fin de soirée', 'End of the party'), type: 'time' },
  { section: s('Temps forts', 'Highlights'), label: s('Séance photo de couple : moment préféré', 'Couple photo session: preferred moment'), type: 'choice', options: [s('Avant la cérémonie (first look)', 'Before the ceremony (first look)'), s('Pendant le cocktail', 'During the cocktail'), s('Au coucher du soleil', 'At sunset')] },
  { section: s('Temps forts', 'Highlights'), label: s('Discours prévus (qui, à quel moment)', 'Planned speeches (who, when)'), type: 'long' },
  { section: s('Temps forts', 'Highlights'), label: s('Animations ou surprises prévues', 'Planned entertainment or surprises'), type: 'long' },
  { section: s('Temps forts', 'Highlights'), label: s('Brunch le lendemain ?', 'Brunch the next day?'), type: 'choice', options: [s('Oui', 'Yes'), s('Non', 'No'), s('À décider', 'To be decided')] },
  { section: s('Logistique', 'Logistics'), label: s('Règles du lieu (heure de fin, bruit, bougies…)', 'Venue rules (end time, noise, candles…)'), type: 'long' },
  { section: s('Logistique', 'Logistics'), label: s('Personnes clés à prévenir le jour J', 'Key people to contact on the day'), type: 'long' },
  { section: s('Logistique', 'Logistics'), label: s('Autres remarques', 'Other comments'), type: 'long' },
];

export const CLIENT_FORM_TEMPLATES: Record<Exclude<ClientFormType, 'custom'>, { title: Bilingual; intro: Bilingual; questions: TemplateQuestion[] }> = {
  discovery: {
    title: s('Faisons connaissance', 'Let’s get to know you'),
    intro: s(
      'Quelques questions pour comprendre votre projet et vous préparer une proposition sur mesure. Comptez 5 minutes.',
      'A few questions to understand your project and prepare a tailored proposal. It takes about 5 minutes.'
    ),
    questions: DISCOVERY_QUESTIONS,
  },
  jour_j: {
    title: s('Votre journée idéale', 'Your ideal day'),
    intro: s(
      'Aidez-nous à construire le déroulé de votre jour J : horaires, temps forts et contraintes du lieu.',
      'Help us build your wedding-day schedule: timings, highlights and venue constraints.'
    ),
    questions: JOUR_J_QUESTIONS,
  },
};

const createQuestionId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `q-${Date.now()}-${Math.random().toString(36).slice(2)}`);

export const buildTemplateQuestions = (formType: ClientFormType, isEnglish: boolean): ClientFormQuestion[] => {
  if (formType === 'custom') return [];
  const pick = (value: Bilingual) => (isEnglish ? value.en : value.fr);
  return CLIENT_FORM_TEMPLATES[formType].questions.map((question) => ({
    id: createQuestionId(),
    section: pick(question.section),
    label: pick(question.label),
    type: question.type,
    options: question.options?.map(pick),
    required: question.required ?? false,
  }));
};

export const createEmptyQuestion = (section: string): ClientFormQuestion => ({
  id: createQuestionId(),
  section,
  label: '',
  type: 'short',
  required: false,
});

/** Texte lisible d'une réponse (tableaux de choix multiples joints par des virgules). */
export const formatClientFormAnswer = (value: unknown): string => {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  if (value === null || value === undefined) return '';
  return String(value).trim();
};
