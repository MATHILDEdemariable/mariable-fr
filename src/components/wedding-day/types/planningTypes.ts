
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

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

export type PlanningFormValues = Record<string, any>;

export type PlanningSection = {
  name: string;
  title: string;
  questions: PlanningQuestion[];
};

export type PlanningData = {
  sections: PlanningSection[];
  allQuestions: PlanningQuestion[];
};

export const fetchPlanningQuestions = async (
  supabase: SupabaseClient<Database>
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

// Modified function to handle date serialization
export const savePlanningResponses = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string | undefined,
  responses: PlanningFormValues,
  generatedPlanning: PlanningEvent[]
): Promise<void> => {
  // Convert Date objects to ISO strings for JSON serialization
  const serializablePlanning: SerializablePlanningEvent[] = generatedPlanning.map(event => ({
    ...event,
    startTime: event.startTime.toISOString(),
    endTime: event.endTime.toISOString()
  }));
  
  const { error } = await supabase
    .from('planning_reponses_utilisateur')
    .insert({
      user_id: userId,
      email,
      reponses: responses,
      planning_genere: serializablePlanning
    });
    
  if (error) {
    console.error("Error saving planning responses:", error);
    throw new Error(`Error saving planning responses: ${error.message}`);
  }
};

// Function to check if a question should be visible based on previous answers
export const isQuestionVisible = (
  question: PlanningQuestion,
  formValues: PlanningFormValues
): boolean => {
  if (!question.visible_si) return true;
  
  return Object.entries(question.visible_si).every(([key, condition]) => {
    const answer = formValues[key];
    
    if (Array.isArray(condition)) {
      return condition.includes(answer);
    }
    
    return answer === condition;
  });
};

// Function to generate a planning based on the form responses
export const generatePlanning = (
  questions: PlanningQuestion[],
  responses: PlanningFormValues
): PlanningEvent[] => {
  const events: PlanningEvent[] = [];
  let mainCeremonyTime: Date | null = null;
  
  // First, find the main ceremony time which acts as our anchor point
  const ceremonyQuestion = questions.find(q => q.option_name === 'heure_ceremonie_1');
  if (ceremonyQuestion && responses.heure_ceremonie_1) {
    const [hours, minutes] = responses.heure_ceremonie_1.split(':').map(Number);
    mainCeremonyTime = new Date();
    mainCeremonyTime.setHours(hours, minutes, 0, 0);
  } else {
    throw new Error("L'heure de la cérémonie est requise pour générer le planning");
  }
  
  // Add the main ceremony
  events.push({
    id: `ceremony-1-${Date.now()}`,
    title: "Cérémonie principale",
    category: "cérémonie",
    startTime: new Date(mainCeremonyTime),
    endTime: new Date(mainCeremonyTime.getTime() + 60 * 60 * 1000), // Default 1 hour for ceremony
    duration: 60,
    type: "ceremony",
    isHighlight: true
  });
  
  // If there's a second ceremony
  if (responses.double_ceremonie === 'oui' && responses.heure_ceremonie_2) {
    const [hours, minutes] = responses.heure_ceremonie_2.split(':').map(Number);
    const secondCeremonyTime = new Date();
    secondCeremonyTime.setHours(hours, minutes, 0, 0);
    
    events.push({
      id: `ceremony-2-${Date.now()}`,
      title: "Deuxième cérémonie",
      category: "cérémonie",
      startTime: new Date(secondCeremonyTime),
      endTime: new Date(secondCeremonyTime.getTime() + 60 * 60 * 1000), // Default 1 hour
      duration: 60,
      type: "ceremony",
      isHighlight: true
    });
    
    // If there's travel between ceremonies
    if (responses.trajet_ceremonie_1_2) {
      const travelDuration = Number(responses.trajet_ceremonie_1_2);
      const earlierCeremony = mainCeremonyTime < secondCeremonyTime ? mainCeremonyTime : secondCeremonyTime;
      const laterCeremony = mainCeremonyTime < secondCeremonyTime ? secondCeremonyTime : mainCeremonyTime;
      
      const travelStartTime = new Date(earlierCeremony.getTime() + 60 * 60 * 1000); // After the first ceremony
      
      events.push({
        id: `travel-${Date.now()}`,
        title: "Trajet entre les cérémonies",
        category: "logistique",
        startTime: new Date(travelStartTime),
        endTime: new Date(travelStartTime.getTime() + travelDuration * 60 * 1000),
        duration: travelDuration,
        type: "travel"
      });
    }
  }
  
  // Sort events by start time
  let sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  const firstEventTime = sortedEvents[0].startTime;
  
  // Add preparation events before the ceremony
  if (responses.coiffure) {
    const hairdressingQuestion = questions.find(q => q.option_name === 'coiffure');
    const hairdressingDuration = hairdressingQuestion?.duree_minutes || 90;
    
    const hairdressingEndTime = new Date(firstEventTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    const hairdressingStartTime = new Date(hairdressingEndTime.getTime() - hairdressingDuration * 60 * 1000);
    
    events.push({
      id: `hairdressing-${Date.now()}`,
      title: `Coiffure (${responses.coiffure})`,
      category: "préparatifs",
      startTime: hairdressingStartTime,
      endTime: hairdressingEndTime,
      duration: hairdressingDuration,
      type: "preparation"
    });
  }
  
  // Add makeup preparation
  const makeupDuration = 60; // Default from the database
  const makeupEndTime = new Date(firstEventTime.getTime() - 90 * 60 * 1000); // 1.5 hours before
  const makeupStartTime = new Date(makeupEndTime.getTime() - makeupDuration * 60 * 1000);
  
  events.push({
    id: `makeup-${Date.now()}`,
    title: "Maquillage",
    category: "préparatifs",
    startTime: makeupStartTime,
    endTime: makeupEndTime,
    duration: makeupDuration,
    type: "preparation"
  });
  
  // Add dressing time
  const dressingDuration = 15; // Default from the database
  const dressingEndTime = new Date(firstEventTime.getTime() - 30 * 60 * 1000); // 30 min before
  const dressingStartTime = new Date(dressingEndTime.getTime() - dressingDuration * 60 * 1000);
  
  events.push({
    id: `dressing-${Date.now()}`,
    title: "Habillage",
    category: "préparatifs",
    startTime: dressingStartTime,
    endTime: dressingEndTime,
    duration: dressingDuration,
    type: "preparation",
    isHighlight: true
  });
  
  // First look if requested
  if (responses.first_look === 'oui') {
    const firstLookDuration = 10; // Default from the database
    const firstLookEndTime = new Date(firstEventTime.getTime() - 15 * 60 * 1000); // 15 min before
    const firstLookStartTime = new Date(firstLookEndTime.getTime() - firstLookDuration * 60 * 1000);
    
    events.push({
      id: `first-look-${Date.now()}`,
      title: "First Look",
      category: "photos",
      startTime: firstLookStartTime,
      endTime: firstLookEndTime,
      duration: firstLookDuration,
      type: "photos",
      isHighlight: true
    });
  }
  
  // Photos before the ceremony if requested
  if (responses.photos_couple_avant === 'oui') {
    const photosDuration = 30; // Default from the database
    const photosEndTime = new Date(firstEventTime.getTime() - 5 * 60 * 1000); // 5 min before
    const photosStartTime = new Date(photosEndTime.getTime() - photosDuration * 60 * 1000);
    
    events.push({
      id: `couple-photos-${Date.now()}`,
      title: "Photos de couple",
      category: "photos",
      startTime: photosStartTime,
      endTime: photosEndTime,
      duration: photosDuration,
      type: "couple_photos"
    });
  }
  
  // Find the last ceremony or event before cocktail
  sortedEvents = [...events].sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  let lastCeremonyOrEvent = sortedEvents
    .filter(event => event.category === 'cérémonie')
    .sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0];
  
  if (!lastCeremonyOrEvent) {
    lastCeremonyOrEvent = sortedEvents.sort((a, b) => b.endTime.getTime() - a.endTime.getTime())[0];
  }
  
  // Add cocktail after the ceremony
  if (responses.cocktail) {
    const cocktailOption = questions.find(q => q.option_name === 'cocktail')?.options;
    let cocktailDuration = 60; // Default duration
    
    if (Array.isArray(cocktailOption)) {
      const selectedOption = cocktailOption.find((opt: any) => 
        opt.valeur === responses.cocktail || opt === responses.cocktail
      );
      
      if (selectedOption && typeof selectedOption === 'object' && 'duree_minutes' in selectedOption) {
        cocktailDuration = selectedOption.duree_minutes;
      }
    }
    
    const cocktailStartTime = new Date(lastCeremonyOrEvent.endTime.getTime() + 15 * 60 * 1000); // 15 min after
    const cocktailEndTime = new Date(cocktailStartTime.getTime() + cocktailDuration * 60 * 1000);
    
    events.push({
      id: `cocktail-${Date.now()}`,
      title: "Cocktail",
      category: "cocktail",
      startTime: cocktailStartTime,
      endTime: cocktailEndTime,
      duration: cocktailDuration,
      type: "cocktail",
      isHighlight: true
    });
  }
  
  // Add dinner after cocktail
  if (responses.duree_repas) {
    const dinnerOption = questions.find(q => q.option_name === 'duree_repas')?.options;
    let dinnerDuration = 120; // Default duration
    
    if (Array.isArray(dinnerOption)) {
      const selectedOption = dinnerOption.find((opt: any) => 
        opt.valeur === responses.duree_repas || opt === responses.duree_repas
      );
      
      if (selectedOption && typeof selectedOption === 'object' && 'duree_minutes' in selectedOption) {
        dinnerDuration = selectedOption.duree_minutes;
      }
    }
    
    // Find the cocktail end time or use the last ceremony
    const cocktailEvent = events.find(e => e.type === 'cocktail');
    const dinnerStartTime = cocktailEvent 
      ? new Date(cocktailEvent.endTime.getTime() + 15 * 60 * 1000)
      : new Date(lastCeremonyOrEvent.endTime.getTime() + 30 * 60 * 1000);
      
    const dinnerEndTime = new Date(dinnerStartTime.getTime() + dinnerDuration * 60 * 1000);
    
    events.push({
      id: `dinner-${Date.now()}`,
      title: "Dîner",
      category: "repas",
      startTime: dinnerStartTime,
      endTime: dinnerEndTime,
      duration: dinnerDuration,
      type: "dinner",
      isHighlight: true
    });
  }
  
  // Add dancing party after dinner
  if (responses.soiree && responses.soiree !== 'pas_de_soiree') {
    const partyOption = questions.find(q => q.option_name === 'soiree')?.options;
    let partyDuration = 240; // Default duration
    
    if (Array.isArray(partyOption)) {
      const selectedOption = partyOption.find((opt: any) => 
        opt.valeur === responses.soiree || opt === responses.soiree
      );
      
      if (selectedOption && typeof selectedOption === 'object' && 'duree_minutes' in selectedOption) {
        partyDuration = selectedOption.duree_minutes;
      }
    }
    
    // Find the dinner end time
    const dinnerEvent = events.find(e => e.type === 'dinner');
    if (!dinnerEvent) return events;
    
    const partyStartTime = new Date(dinnerEvent.endTime.getTime() + 15 * 60 * 1000);
    const partyEndTime = new Date(partyStartTime.getTime() + partyDuration * 60 * 1000);
    
    events.push({
      id: `party-${Date.now()}`,
      title: "Soirée dansante",
      category: "soiree",
      startTime: partyStartTime,
      endTime: partyEndTime,
      duration: partyDuration,
      type: "party"
    });
  }
  
  // Sort all events by start time for proper display
  return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};
