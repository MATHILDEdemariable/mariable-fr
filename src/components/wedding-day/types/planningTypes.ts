
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

// Helper function to get duration from options
const getDurationFromOptions = (question: PlanningQuestion, selectedValue: string): number => {
  if (!question.options || !Array.isArray(question.options)) {
    return question.duree_minutes || 0;
  }
  
  const option = question.options.find((opt: any) => 
    typeof opt === 'object' && opt.valeur === selectedValue
  );
  
  return (option as any)?.duree_minutes || question.duree_minutes || 0;
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

// Enhanced function to generate a planning based on the form responses with dual ceremony logic
export const generatePlanning = (
  questions: PlanningQuestion[],
  responses: PlanningFormValues
): PlanningEvent[] => {
  const events: PlanningEvent[] = [];
  let eventId = 0;
  
  // Check if dual ceremony
  const isDualCeremony = responses.double_ceremonie === 'oui';
  
  // Get ceremony times
  const ceremony1Time = responses.heure_ceremonie_1 ? parseTimeToDate(responses.heure_ceremonie_1) : new Date();
  const ceremony2Time = isDualCeremony && responses.heure_ceremonie_2 ? 
    parseTimeToDate(responses.heure_ceremonie_2) : null;
  
  // Determine timeline order based on ceremony times
  const isSecondCeremonyLater = ceremony2Time ? ceremony2Time > ceremony1Time : false;
  let currentTime = new Date(ceremony1Time);
  
  // Start with initial preparations (3 hours before first ceremony)
  currentTime = addMinutesToDate(ceremony1Time, -180);
  
  // 1. Initial Preparations
  const preparationQuestions = questions.filter(q => q.categorie === 'préparatifs_final');
  
  preparationQuestions.forEach(question => {
    if (responses[question.option_name] === 'oui' || question.type === 'fixe') {
      const duration = getDurationFromOptions(question, responses[question.option_name]) || question.duree_minutes;
      
      events.push({
        id: `prep-${eventId++}`,
        title: question.label,
        category: 'préparatifs',
        startTime: new Date(currentTime),
        endTime: addMinutesToDate(currentTime, duration),
        duration,
        type: 'preparation',
        isHighlight: question.option_name === 'habillage'
      });
      
      currentTime = addMinutesToDate(currentTime, duration);
    }
  });
  
  // 2. Travel to first ceremony
  if (responses.trajet_vers_ceremonie_1) {
    const travelDuration = Number(responses.trajet_vers_ceremonie_1);
    const travelStart = addMinutesToDate(ceremony1Time, -travelDuration);
    
    events.push({
      id: `travel-1-${eventId++}`,
      title: 'Trajet vers la première cérémonie',
      category: 'logistique',
      startTime: travelStart,
      endTime: ceremony1Time,
      duration: travelDuration,
      type: 'travel'
    });
  }
  
  // 3. First Ceremony
  const ceremony1TypeQuestion = questions.find(q => q.option_name === 'type_ceremonie_1');
  const ceremony1Duration = ceremony1TypeQuestion ? 
    getDurationFromOptions(ceremony1TypeQuestion, responses.type_ceremonie_1) : 60;
  
  events.push({
    id: `ceremony-1-${eventId++}`,
    title: `Première cérémonie (${responses.type_ceremonie_1 || 'cérémonie'})`,
    category: 'cérémonie',
    startTime: ceremony1Time,
    endTime: addMinutesToDate(ceremony1Time, ceremony1Duration),
    duration: ceremony1Duration,
    type: 'ceremony',
    isHighlight: true
  });
  
  currentTime = addMinutesToDate(ceremony1Time, ceremony1Duration);
  
  if (isDualCeremony && ceremony2Time) {
    // 4. Travel between ceremonies
    if (responses.trajet_ceremonie_1_2) {
      const travelDuration = Number(responses.trajet_ceremonie_1_2);
      
      events.push({
        id: `travel-between-${eventId++}`,
        title: 'Trajet entre les cérémonies',
        category: 'logistique',
        startTime: new Date(currentTime),
        endTime: addMinutesToDate(currentTime, travelDuration),
        duration: travelDuration,
        type: 'travel'
      });
      
      currentTime = addMinutesToDate(currentTime, travelDuration);
    }
    
    // 5. Pause between ceremonies (if selected)
    if (responses.pause_entre_ceremonies === 'oui' && responses.duree_pause) {
      const pauseDuration = Number(responses.duree_pause);
      
      events.push({
        id: `pause-${eventId++}`,
        title: 'Pause entre les cérémonies',
        category: 'logistique',
        startTime: new Date(currentTime),
        endTime: addMinutesToDate(currentTime, pauseDuration),
        duration: pauseDuration,
        type: 'break'
      });
      
      currentTime = addMinutesToDate(currentTime, pauseDuration);
    }
    
    // 6. Second preparations (if selected)
    if (responses.preparation_avant_ceremonie_2 === 'oui') {
      const prep2Questions = questions.filter(q => q.categorie === 'préparatifs_2');
      
      prep2Questions.forEach(question => {
        if (responses[question.option_name] === 'oui' && question.duree_minutes > 0) {
          const duration = question.duree_minutes;
          
          events.push({
            id: `prep2-${eventId++}`,
            title: question.label,
            category: 'préparatifs',
            startTime: new Date(currentTime),
            endTime: addMinutesToDate(currentTime, duration),
            duration,
            type: 'preparation',
            isHighlight: true
          });
          
          currentTime = addMinutesToDate(currentTime, duration);
        }
      });
    }
    
    // Adjust current time to match second ceremony time
    currentTime = ceremony2Time;
    
    // 7. Second Ceremony
    const ceremony2TypeQuestion = questions.find(q => q.option_name === 'type_ceremonie_2');
    const ceremony2Duration = ceremony2TypeQuestion ? 
      getDurationFromOptions(ceremony2TypeQuestion, responses.type_ceremonie_2) : 60;
    
    events.push({
      id: `ceremony-2-${eventId++}`,
      title: `Deuxième cérémonie (${responses.type_ceremonie_2 || 'cérémonie'})`,
      category: 'cérémonie',
      startTime: ceremony2Time,
      endTime: addMinutesToDate(ceremony2Time, ceremony2Duration),
      duration: ceremony2Duration,
      type: 'ceremony',
      isHighlight: true
    });
    
    currentTime = addMinutesToDate(ceremony2Time, ceremony2Duration);
  }
  
  // 8. Travel to reception
  if (responses.trajet_vers_reception) {
    const travelDuration = Number(responses.trajet_vers_reception);
    
    events.push({
      id: `travel-reception-${eventId++}`,
      title: 'Trajet vers le lieu de réception',
      category: 'logistique',
      startTime: new Date(currentTime),
      endTime: addMinutesToDate(currentTime, travelDuration),
      duration: travelDuration,
      type: 'travel'
    });
    
    currentTime = addMinutesToDate(currentTime, travelDuration);
  }
  
  // 9. Rest of the day (cocktail, dinner, party)
  // Add cocktail
  if (responses.cocktail) {
    const cocktailQuestion = questions.find(q => q.option_name === 'cocktail');
    const cocktailDuration = cocktailQuestion ? 
      getDurationFromOptions(cocktailQuestion, responses.cocktail) : 60;
    
    events.push({
      id: `cocktail-${eventId++}`,
      title: 'Cocktail',
      category: 'cocktail',
      startTime: new Date(currentTime),
      endTime: addMinutesToDate(currentTime, cocktailDuration),
      duration: cocktailDuration,
      type: 'cocktail',
      isHighlight: true
    });
    
    currentTime = addMinutesToDate(currentTime, cocktailDuration);
  }
  
  // Add dinner
  if (responses.duree_repas) {
    const dinnerQuestion = questions.find(q => q.option_name === 'duree_repas');
    const dinnerDuration = dinnerQuestion ? 
      getDurationFromOptions(dinnerQuestion, responses.duree_repas) : 120;
    
    events.push({
      id: `dinner-${eventId++}`,
      title: 'Dîner',
      category: 'repas',
      startTime: new Date(currentTime),
      endTime: addMinutesToDate(currentTime, dinnerDuration),
      duration: dinnerDuration,
      type: 'dinner',
      isHighlight: true
    });
    
    currentTime = addMinutesToDate(currentTime, dinnerDuration);
  }
  
  // Add party
  if (responses.soiree && responses.soiree !== 'pas_de_soiree') {
    const partyQuestion = questions.find(q => q.option_name === 'soiree');
    const partyDuration = partyQuestion ? 
      getDurationFromOptions(partyQuestion, responses.soiree) : 240;
    
    events.push({
      id: `party-${eventId++}`,
      title: 'Soirée dansante',
      category: 'soiree',
      startTime: new Date(currentTime),
      endTime: addMinutesToDate(currentTime, partyDuration),
      duration: partyDuration,
      type: 'party'
    });
  }
  
  // Sort all events by start time for proper display
  return events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
};
