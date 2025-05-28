import { SupabaseClient } from '@supabase/supabase-js';

export interface PlanningFormValues {
  // Ceremony fields
  double_ceremonie?: string;
  heure_ceremonie_principale?: string;
  type_ceremonie_principale?: string;
  heure_ceremonie_1?: string;
  type_ceremonie_1?: string;
  heure_ceremonie_2?: string;
  type_ceremonie_2?: string;
  
  // Enhanced logistics fields
  pause_maries?: string;
  // Single ceremony travel fields
  trajet_depart_ceremonie?: number;
  trajet_ceremonie_reception?: number;
  // Dual ceremony travel fields  
  trajet_1_depart_ceremonie_1?: number;
  trajet_2_ceremonie_1_arrivee_1?: number;
  trajet_3_depart_ceremonie_2?: number;
  trajet_4_ceremonie_2_arrivee_2?: number;
  
  // Preparatifs fields
  preparatifs_coiffure?: string;
  preparatifs_maquillage?: string;
  preparatifs_habillage?: string;
  preparatifs_2_coiffure?: boolean;
  preparatifs_2_maquillage?: boolean;
  preparatifs_2_habillage?: boolean;
  
  // Photos fields
  photos_couple?: string;
  photos_groupe?: string[];
  
  // Cocktail fields
  cocktail_duree?: string;
  cocktail_animations?: string[];
  
  // Repas fields
  repas_type?: string;
  repas_duree?: string;
  repas_animations?: string[];
  
  // Soirée fields - now included in step 7
  soiree_type?: string;
  soiree_duree?: string;
  soiree_animations?: string[];
  
  // Other dynamic fields
  [key: string]: any;
}

export type PlanningQuestion = {
  id: string;
  categorie: string;
  label: string;
  type: 'choix' | 'number' | 'time' | 'multi-choix' | 'texte' | 'fixe';
  option_name: string;
  duree_minutes: number;
  ordre_affichage: number;
  visible_si: Record<string, string | string[]> | null;
  options: string[] | { valeur: string; duree_minutes: number }[] | null;
  created_at?: string;
  updated_at?: string;
};

export type PlanningUserResponse = {
  id?: string;
  user_id: string;
  email?: string;
  reponses: Record<string, any>;
  planning_genere?: PlanningEvent[] | null;
  date_creation?: string;
};

export type PlanningEvent = {
  id: string;
  title: string;
  category: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  type: string;
  isHighlight?: boolean;
  notes?: string;
  location?: string;
};

// This type is needed for JSON serialization
export type SerializablePlanningEvent = Omit<PlanningEvent, 'startTime' | 'endTime'> & {
  startTime: string;
  endTime: string;
};

export type PlanningSection = {
  name: string;
  title: string;
  questions: PlanningQuestion[];
};

export type PlanningData = {
  sections: PlanningSection[];
  allQuestions: PlanningQuestion[];
};

// Helper function to get duration from options
const getDurationFromOption = (option: string, questions: PlanningQuestion[]): number => {
  // Try to extract duration from the option text
  const durationMatch = option.match(/\((\d+)\s*minutes?\)/);
  if (durationMatch) {
    return parseInt(durationMatch[1]);
  }
  
  // Default durations based on type
  if (option.includes('coiffure')) return 60;
  if (option.includes('maquillage')) return 45;
  if (option.includes('habillage')) return 30;
  if (option.includes('photo')) return 30;
  
  return 30; // Default
};

// Helper function to parse time string to Date
const parseTimeToDate = (timeString: string): Date => {
  if (!timeString) return new Date();
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Helper function to add minutes to a date
const addMinutesToDate = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

export const fetchPlanningQuestions = async (
  supabase: SupabaseClient
): Promise<PlanningData> => {
  const { data, error } = await supabase
    .from('planning_questions')
    .select('*')
    .order('ordre_affichage');
    
  if (error) {
    console.error("Error fetching planning questions:", error);
    throw new Error(`Error fetching planning questions: ${error.message}`);
  }
  
  const sections: Record<string, PlanningSection> = {};
  
  // Group questions by category
  data.forEach((question: any) => {
    if (!sections[question.categorie]) {
      sections[question.categorie] = {
        name: question.categorie,
        title: question.categorie.charAt(0).toUpperCase() + question.categorie.slice(1),
        questions: []
      };
    }
    
    sections[question.categorie].questions.push(question);
  });
  
  return {
    sections: Object.values(sections),
    allQuestions: data as PlanningQuestion[]
  };
};

// Helper function to check if a question should be visible based on previous answers
export const isQuestionVisible = (
  question: PlanningQuestion,
  formValues: PlanningFormValues
): boolean => {
  if (!question.visible_si) return true;
  
  try {
    const conditions = question.visible_si as any;
    
    // Handle different condition formats
    if (typeof conditions === 'object') {
      for (const [field, expectedValue] of Object.entries(conditions)) {
        const currentValue = formValues[field];
        if (currentValue !== expectedValue) {
          return false;
        }
      }
    }
    
    return true;
  } catch (error) {
    console.warn('Error evaluating question visibility:', error);
    return true;
  }
};

// Enhanced function to generate a planning based on the form responses with dual ceremony logic
export const generatePlanning = (
  questions: PlanningQuestion[],
  formData: PlanningFormValues
): PlanningEvent[] => {
  const events: PlanningEvent[] = [];
  let currentTime = new Date();
  
  // Set base time from ceremony
  const ceremonyTime = formData.heure_ceremonie_principale || formData.heure_ceremonie_1;
  if (ceremonyTime) {
    const [hours, minutes] = ceremonyTime.split(':').map(Number);
    currentTime = new Date();
    currentTime.setHours(hours, minutes, 0, 0);
    
    // Start planning 3 hours before ceremony for preparation
    currentTime.setHours(currentTime.getHours() - 3);
  }

  const isDualCeremony = formData.double_ceremonie === 'oui';
  
  // Generate preparation events
  if (formData.preparatifs_coiffure) {
    const duration = getDurationFromOption(formData.preparatifs_coiffure, questions);
    events.push(createEvent('preparation', 'Coiffure', currentTime, duration));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }
  
  if (formData.preparatifs_maquillage) {
    const duration = getDurationFromOption(formData.preparatifs_maquillage, questions);
    events.push(createEvent('preparation', 'Maquillage', currentTime, duration));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }
  
  if (formData.preparatifs_habillage) {
    const duration = getDurationFromOption(formData.preparatifs_habillage, questions);
    events.push(createEvent('preparation', 'Habillage', currentTime, duration));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  // Add travel to ceremony if specified
  if (formData.trajet_depart_ceremonie && formData.trajet_depart_ceremonie > 0) {
    events.push(createEvent('travel', 'Trajet vers la cérémonie', currentTime, formData.trajet_depart_ceremonie));
    currentTime = new Date(currentTime.getTime() + formData.trajet_depart_ceremonie * 60000);
  }

  // Generate ceremony events
  if (isDualCeremony) {
    // First ceremony
    if (formData.heure_ceremonie_1) {
      const [hours, minutes] = formData.heure_ceremonie_1.split(':').map(Number);
      const ceremonyStart = new Date();
      ceremonyStart.setHours(hours, minutes, 0, 0);
      
      const ceremonyDuration = getCeremonyDuration(formData.type_ceremonie_1 || 'civile');
      events.push(createEvent('ceremony', `1ère cérémonie (${formData.type_ceremonie_1})`, ceremonyStart, ceremonyDuration, true));
      
      currentTime = new Date(ceremonyStart.getTime() + ceremonyDuration * 60000);
    }
    
    // Travel between ceremonies
    if (formData.trajet_2_ceremonie_1_arrivee_1 && formData.trajet_2_ceremonie_1_arrivee_1 > 0) {
      events.push(createEvent('travel', 'Trajet après 1ère cérémonie', currentTime, formData.trajet_2_ceremonie_1_arrivee_1));
      currentTime = new Date(currentTime.getTime() + formData.trajet_2_ceremonie_1_arrivee_1 * 60000);
    }
    
    // Second ceremony preparation if needed
    if (formData.preparatifs_2_coiffure) {
      events.push(createEvent('preparation', 'Retouche coiffure', currentTime, 30));
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    
    if (formData.preparatifs_2_maquillage) {
      events.push(createEvent('preparation', 'Retouche maquillage', currentTime, 30));
      currentTime = new Date(currentTime.getTime() + 30 * 60000);
    }
    
    if (formData.preparatifs_2_habillage) {
      events.push(createEvent('preparation', 'Changement de tenue', currentTime, 45));
      currentTime = new Date(currentTime.getTime() + 45 * 60000);
    }
    
    // Travel to second ceremony
    if (formData.trajet_3_depart_ceremonie_2 && formData.trajet_3_depart_ceremonie_2 > 0) {
      events.push(createEvent('travel', 'Trajet vers 2ème cérémonie', currentTime, formData.trajet_3_depart_ceremonie_2));
      currentTime = new Date(currentTime.getTime() + formData.trajet_3_depart_ceremonie_2 * 60000);
    }
    
    // Second ceremony
    if (formData.heure_ceremonie_2) {
      const [hours, minutes] = formData.heure_ceremonie_2.split(':').map(Number);
      const ceremonyStart = new Date();
      ceremonyStart.setHours(hours, minutes, 0, 0);
      
      const ceremonyDuration = getCeremonyDuration(formData.type_ceremonie_2 || 'civile');
      events.push(createEvent('ceremony', `2ème cérémonie (${formData.type_ceremonie_2})`, ceremonyStart, ceremonyDuration, true));
      
      currentTime = new Date(ceremonyStart.getTime() + ceremonyDuration * 60000);
    }
    
    // Travel after second ceremony
    if (formData.trajet_4_ceremonie_2_arrivee_2 && formData.trajet_4_ceremonie_2_arrivee_2 > 0) {
      events.push(createEvent('travel', 'Trajet vers réception', currentTime, formData.trajet_4_ceremonie_2_arrivee_2));
      currentTime = new Date(currentTime.getTime() + formData.trajet_4_ceremonie_2_arrivee_2 * 60000);
    }
    
  } else {
    // Single ceremony
    if (formData.heure_ceremonie_principale) {
      const [hours, minutes] = formData.heure_ceremonie_principale.split(':').map(Number);
      const ceremonyStart = new Date();
      ceremonyStart.setHours(hours, minutes, 0, 0);
      
      const ceremonyDuration = getCeremonyDuration(formData.type_ceremonie_principale || 'civile');
      events.push(createEvent('ceremony', `Cérémonie (${formData.type_ceremonie_principale})`, ceremonyStart, ceremonyDuration, true));
      
      currentTime = new Date(ceremonyStart.getTime() + ceremonyDuration * 60000);
    }
    
    // Travel to reception if different location
    if (formData.trajet_ceremonie_reception && formData.trajet_ceremonie_reception > 0) {
      events.push(createEvent('travel', 'Trajet vers la réception', currentTime, formData.trajet_ceremonie_reception));
      currentTime = new Date(currentTime.getTime() + formData.trajet_ceremonie_reception * 60000);
    }
  }

  // Add photos
  if (formData.photos_couple) {
    const duration = getDurationFromOption(formData.photos_couple, questions);
    events.push(createEvent('photos', 'Photos de couple', currentTime, duration));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  // Add cocktail
  if (formData.cocktail_duree) {
    const duration = getDurationFromOption(formData.cocktail_duree, questions);
    events.push(createEvent('cocktail', 'Cocktail', currentTime, duration, true));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  // Add dinner
  if (formData.repas_duree) {
    const duration = getDurationFromOption(formData.repas_duree, questions);
    events.push(createEvent('repas', 'Repas', currentTime, duration, true));
    currentTime = new Date(currentTime.getTime() + duration * 60000);
  }

  // Add evening party if soirée questions are answered
  if (formData.soiree_duree) {
    const duration = getDurationFromOption(formData.soiree_duree, questions);
    events.push(createEvent('soiree', 'Soirée dansante', currentTime, duration, true));
  }

  return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};

// Helper functions
const createEvent = (category: string, title: string, startTime: Date, duration: number, isHighlight = false): PlanningEvent => ({
  id: `${category}-${Date.now()}-${Math.random()}`,
  title,
  category,
  startTime: new Date(startTime),
  endTime: new Date(startTime.getTime() + duration * 60000),
  duration,
  type: category,
  isHighlight
});

const getCeremonyDuration = (type: string): number => {
  switch (type) {
    case 'civile': return 30;
    case 'religieuse': return 90;
    case 'laique': return 60;
    default: return 60;
  }
};

export const savePlanningResponses = async (
  supabase: SupabaseClient,
  userId: string,
  email?: string,
  responses?: PlanningFormValues,
  generatedPlanning?: PlanningEvent[]
) => {
  const serializedPlanning = generatedPlanning?.map(event => ({
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString()
  }));

  const { data, error } = await supabase
    .from('planning_reponses_utilisateur')
    .upsert(
      {
        user_id: userId,
        email: email,
        reponses: responses || {},
        planning_genere: serializedPlanning || []
      },
      {
        onConflict: 'user_id'
      }
    );

  if (error) {
    throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
  }

  return data;
};
