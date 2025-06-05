import { SupabaseClient } from '@supabase/supabase-js';

export type PlanningCategory = 
  | 'préparatifs_final' 
  | 'préparatifs_final_1' 
  | 'préparatifs_final_2'
  | 'logistique' 
  | 'logistique_trajet_depart' 
  | 'logistique_trajet_retour'
  | 'logistique_trajet_1' 
  | 'logistique_trajet_2' 
  | 'logistique_trajet_3' 
  | 'logistique_trajet_4'
  | 'cérémonie' 
  | 'cérémonie_1' 
  | 'cérémonie_2'
  | 'photos' 
  | 'cocktail' 
  | 'repas' 
  | 'soiree'
  | 'personnalisé';

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
  label_affichage_front?: string;
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

// New type for the generated planning table
export type GeneratedPlanningRecord = {
  id: string;
  user_id: string;
  form_responses: Record<string, any>;
  planning_blocks: SerializablePlanningEvent[];
  created_at: string;
  updated_at: string;
};

// Enhanced function to get duration from question or option
const getDurationFromQuestionOrOption = (
  questionOptionName: string,
  selectedValue: string | string[],
  questions: PlanningQuestion[]
): number => {
  // Find the specific question
  const question = questions.find(q => q.option_name === questionOptionName);
  if (!question) {
    return getDefaultDuration(questionOptionName);
  }

  // If question has fixed duration, use it
  if (question.duree_minutes > 0) {
    return question.duree_minutes;
  }

  // If question has options with durations, find matching option
  if (question.options && Array.isArray(question.options) && question.options.length > 0) {
    const firstOption = question.options[0];
    if (typeof firstOption === 'object' && 'duree_minutes' in firstOption) {
      // Options with duration structure
      const matchingOption = (question.options as { valeur: string; duree_minutes: number }[])
        .find(opt => opt.valeur === selectedValue);
      if (matchingOption) {
        return matchingOption.duree_minutes;
      }
    }
  }

  // Extract duration from option text if present
  if (typeof selectedValue === 'string') {
    const durationMatch = selectedValue.match(/\((\d+)\s*minutes?\)/);
    if (durationMatch) {
      return parseInt(durationMatch[1]);
    }
  }

  return getDefaultDuration(questionOptionName);
};

// Default durations based on category/type - with improved durations
const getDefaultDuration = (optionName: string): number => {
  if (optionName.includes('coiffure')) return 60;
  if (optionName.includes('maquillage')) return 45; // Temps suggéré pour maquillage
  if (optionName.includes('habillage')) return 30; // Temps suggéré pour habillage
  if (optionName.includes('photos')) return 30;
  if (optionName.includes('cocktail')) return 90;
  if (optionName.includes('repas')) return 180;
  if (optionName.includes('soiree')) return 240;
  if (optionName.includes('ceremonie')) return 60;
  if (optionName.includes('trajet')) return 15;
  if (optionName.includes('pause')) return 30;
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

// Get appropriate buffer time between events based on category
const getBufferTime = (category: string): number => {
  switch (category) {
    case 'préparatifs_final': return 5;
    case 'cérémonie': return 15;
    case 'logistique': return 0; // No buffer for travel/logistics
    case 'photos': return 10;
    case 'cocktail': return 5;
    case 'repas': return 10;
    case 'soiree': return 5;
    case 'personnalisé': return 5;
    default: return 5; // Default buffer
  }
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
    console.log(`Checking visibility for ${question.option_name}:`, {
      conditions,
      formValues,
      questionLabel: question.label
    });
    
    // Handle different condition formats
    if (typeof conditions === 'object') {
      for (const [field, expectedValue] of Object.entries(conditions)) {
        const currentValue = formValues[field];
        console.log(`  Condition: ${field} should be ${expectedValue}, current value: ${currentValue}`);
        
        if (Array.isArray(expectedValue)) {
          // Multiple possible values
          if (!expectedValue.includes(currentValue)) {
            console.log(`  ❌ Failed: ${currentValue} not in [${expectedValue.join(', ')}]`);
            return false;
          }
        } else {
          // Single expected value
          // Special handling for "non" conditions when the field is undefined
          if (expectedValue === 'non' && (currentValue === undefined || currentValue === null || currentValue === '')) {
            console.log(`  ✅ Passed: ${field} is empty/undefined, treating as "non"`);
            continue;
          }
          
          if (currentValue !== expectedValue) {
            console.log(`  ❌ Failed: ${currentValue} !== ${expectedValue}`);
            return false;
          }
        }
        console.log(`  ✅ Passed: ${field} condition met`);
      }
    }
    
    console.log(`✅ All conditions passed for ${question.option_name}`);
    return true;
  } catch (error) {
    console.warn('Error evaluating question visibility:', error);
    return true;
  }
};

// Enhanced function to generate a comprehensive planning based on all form responses
export const generatePlanning = (
  questions: PlanningQuestion[],
  formData: PlanningFormValues
): PlanningEvent[] => {
  const events: PlanningEvent[] = [];
  
  // Determine ceremony configuration
  const isDualCeremony = formData.double_ceremonie === 'oui';
  
  // Set base time from ceremony (prioritize first ceremony if dual)
  const ceremonyTime = isDualCeremony 
    ? (formData.heure_ceremonie_1 || formData.heure_ceremonie_principale)
    : formData.heure_ceremonie_principale;
    
  let currentTime = ceremonyTime ? parseTimeToDate(ceremonyTime) : new Date();
  
  // Start planning 3 hours before ceremony for preparation
  let preparationStartTime = addMinutesToDate(currentTime, -180);
  let planningCurrentTime = preparationStartTime;

  // Process categories in logical order (excluding ceremonies - handle separately)
  const categoryOrder = [
    'préparatifs_final',
    'photos',
    'cocktail',
    'repas',
    'soiree'
  ];

  // 1. HANDLE PRÉPARATIFS with suggested durations
  const preparationQuestions = questions
    .filter(q => q.categorie === 'préparatifs_final')
    .sort((a, b) => a.ordre_affichage - b.ordre_affichage);

  preparationQuestions.forEach(question => {
    const value = formData[question.option_name];
    if (!value || (typeof value === 'boolean' && !value)) return;
    
    const event = createEventFromQuestion(question, value, planningCurrentTime, questions);
    if (event) {
      events.push(event);
      const bufferTime = getBufferTime('préparatifs_final');
      planningCurrentTime = addMinutesToDate(event.endTime, bufferTime);
    }
  });

  // 2. HANDLE LOGISTICS/TRAJETS based on ceremony type
  if (isDualCeremony) {
    // Pour deux cérémonies: 4 trajets possibles
    const trajectoryFields = [
      'trajet_1_depart_ceremonie_1',
      'trajet_2_ceremonie_1_arrivee_1', 
      'trajet_3_depart_ceremonie_2',
      'trajet_4_ceremonie_2_arrivee_2'
    ];
    
    trajectoryFields.forEach(fieldName => {
      const duration = formData[fieldName];
      if (duration && typeof duration === 'number' && duration > 0) {
        const question = questions.find(q => q.option_name === fieldName);
        if (question) {
          const trajectoryEvent = createTrajectoryEvent(question, duration, planningCurrentTime);
          if (trajectoryEvent) {
            events.push(trajectoryEvent);
            planningCurrentTime = trajectoryEvent.endTime;
          }
        }
      }
    });
  } else {
    // Pour une seule cérémonie: 2 trajets
    const trajectoryFields = [
      'trajet_depart_ceremonie',
      'trajet_ceremonie_reception'
    ];
    
    trajectoryFields.forEach(fieldName => {
      const duration = formData[fieldName];
      if (duration && typeof duration === 'number' && duration > 0) {
        const question = questions.find(q => q.option_name === fieldName);
        if (question) {
          const trajectoryEvent = createTrajectoryEvent(question, duration, planningCurrentTime);
          if (trajectoryEvent) {
            events.push(trajectoryEvent);
            planningCurrentTime = trajectoryEvent.endTime;
          }
        }
      }
    });
  }

  // 3. HANDLE CEREMONIES separately to avoid duplication
  if (isDualCeremony) {
    // Dual ceremony logic
    if (formData.heure_ceremonie_1 && formData.type_ceremonie_1) {
      const ceremony1Start = parseTimeToDate(formData.heure_ceremonie_1);
      const ceremony1Duration = getCeremonyDuration(formData.type_ceremonie_1);
      
      events.push({
        id: `ceremony1-${Date.now()}`,
        title: `1ère cérémonie (${formData.type_ceremonie_1})`,
        category: 'cérémonie',
        startTime: ceremony1Start,
        endTime: addMinutesToDate(ceremony1Start, ceremony1Duration),
        duration: ceremony1Duration,
        type: 'ceremony',
        isHighlight: true
      });
    }
    
    if (formData.heure_ceremonie_2 && formData.type_ceremonie_2) {
      const ceremony2Start = parseTimeToDate(formData.heure_ceremonie_2);
      const ceremony2Duration = getCeremonyDuration(formData.type_ceremonie_2);
      
      events.push({
        id: `ceremony2-${Date.now()}`,
        title: `2ème cérémonie (${formData.type_ceremonie_2})`,
        category: 'cérémonie',
        startTime: ceremony2Start,
        endTime: addMinutesToDate(ceremony2Start, ceremony2Duration),
        duration: ceremony2Duration,
        type: 'ceremony',
        isHighlight: true
      });
    }
  } else {
    // Single ceremony logic
    if (formData.heure_ceremonie_principale && formData.type_ceremonie_principale) {
      const ceremonyStart = parseTimeToDate(formData.heure_ceremonie_principale);
      const ceremonyDuration = getCeremonyDuration(formData.type_ceremonie_principale);
      
      events.push({
        id: `ceremony-main-${Date.now()}`,
        title: `Cérémonie ${formData.type_ceremonie_principale}`,
        category: 'cérémonie',
        startTime: ceremonyStart,
        endTime: addMinutesToDate(ceremonyStart, ceremonyDuration),
        duration: ceremonyDuration,
        type: 'ceremony',
        isHighlight: true
      });
    }
  }

  // 4. HANDLE OTHER CATEGORIES (photos, cocktail, repas, soiree)
  categoryOrder.forEach(category => {
    const categoryQuestions = questions
      .filter(q => q.categorie === category)
      .sort((a, b) => a.ordre_affichage - b.ordre_affichage);
    
    categoryQuestions.forEach(question => {
      const value = formData[question.option_name];
      if (!value || (Array.isArray(value) && value.length === 0)) return;
      
      // Skip boolean false values but include true values and numeric values
      if (typeof value === 'boolean' && !value) return;
      if (value === 'Non' || value === 'non') return;
      if (typeof value === 'number' && value <= 0) return;
      
      const event = createEventFromQuestion(question, value, planningCurrentTime, questions);
      if (event) {
        events.push(event);
        const bufferTime = getBufferTime(category);
        planningCurrentTime = addMinutesToDate(event.endTime, bufferTime);
      }
    });
  });

  // Sort events by start time and recalculate timeline with proper spacing
  const sortedEvents = events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  return recalculateTimeline(sortedEvents);
};

// Enhanced helper function to create event from question
const createEventFromQuestion = (
  question: PlanningQuestion,
  value: any,
  startTime: Date,
  questions: PlanningQuestion[]
): PlanningEvent | null => {
  // Skip ceremony time and type questions - handled separately
  if (question.option_name.includes('ceremonie') && 
      (question.option_name.includes('heure_') || question.option_name.includes('type_'))) {
    return null;
  }
  
  // Skip trajectory questions - handled separately
  if (question.option_name.includes('trajet')) {
    return null;
  }
  
  // Skip boolean false values but include true values and numeric values
  if (typeof value === 'boolean' && !value) return null;
  if (value === 'Non' || value === 'non') return null;
  if (typeof value === 'number' && value <= 0) return null;
  
  // Use label_affichage_front if available, otherwise fall back to label
  let title = question.label_affichage_front || question.label;
  let category = question.categorie;
  
  // Get duration from the question or value - with enhanced defaults for preparations
  const duration = getDurationFromQuestionOrOption(question.option_name, value, questions);
  
  // For pause mariés
  if (question.option_name.includes('pause') && typeof value === 'string') {
    title = `Pause mariés (${value})`;
  }
  // Enhance title with selected options for non-trajectory blocks
  else if (Array.isArray(value)) {
    title += ` (${value.join(', ')})`;
  } else if (typeof value === 'string' && value !== 'Oui' && value !== 'oui') {
    title += ` (${value})`;
  }
  
  // Determine if this is a highlight event
  const isHighlight = ['ceremonie', 'cocktail', 'repas', 'soiree'].includes(category) ||
                     question.option_name.includes('ceremonie');
  
  return {
    id: `${question.option_name}-${Date.now()}-${Math.random()}`,
    title,
    category,
    startTime: new Date(startTime),
    endTime: addMinutesToDate(startTime, duration),
    duration,
    type: getEventType(question.option_name, category),
    isHighlight,
    notes: getEventNotes(question, value)
  };
};

// Helper to create trajectory events with proper timing
const createTrajectoryEvent = (
  question: PlanningQuestion,
  duration: number,
  startTime: Date
): PlanningEvent => {
  return {
    id: `${question.option_name}-${Date.now()}-${Math.random()}`,
    title: question.label_affichage_front || question.label,
    category: 'logistique',
    startTime: new Date(startTime),
    endTime: addMinutesToDate(startTime, duration),
    duration,
    type: 'travel',
    isHighlight: false,
    notes: `Durée: ${duration} minutes`
  };
};

// Helper to determine event type for proper icon display
const getEventType = (optionName: string, category: string): string => {
  if (optionName.includes('trajet')) return 'travel';
  if (optionName.includes('pause')) return 'break';
  if (optionName.includes('coiffure') || optionName.includes('maquillage') || optionName.includes('habillage')) return 'preparation';
  if (optionName.includes('ceremonie')) return 'ceremony';
  if (optionName.includes('photos')) return 'photos';
  if (optionName.includes('cocktail')) return 'cocktail';
  if (optionName.includes('repas')) return 'repas';
  if (optionName.includes('soiree')) return 'soiree';
  return category;
};

// Helper to add contextual notes to events
const getEventNotes = (question: PlanningQuestion, value: any): string | undefined => {
  if (typeof value === 'number' && question.option_name.includes('trajet')) {
    return `Durée estimée: ${value} minutes`;
  }
  if (Array.isArray(value) && value.length > 0) {
    return `Inclut: ${value.join(', ')}`;
  }
  // Add suggested duration notes for preparations
  if (question.option_name.includes('maquillage')) {
    return 'Durée suggérée: 45 minutes';
  }
  if (question.option_name.includes('habillage')) {
    return 'Durée suggérée: 30 minutes';
  }
  return undefined;
};

// Recalculate timeline to ensure proper sequence with intelligent spacing
const recalculateTimeline = (events: PlanningEvent[]): PlanningEvent[] => {
  if (events.length === 0) return [];
  
  // Find ceremony time as anchor point
  const ceremonyEvent = events.find(e => e.type === 'ceremony');
  let currentTime = ceremonyEvent?.startTime || events[0]?.startTime || new Date();
  
  // Sort events into logical groups
  const preparationEvents = events.filter(e => e.category === 'préparatifs_final');
  const ceremonyEvents = events.filter(e => e.category === 'cérémonie');
  const logisticsEvents = events.filter(e => e.category === 'logistique');
  const photoEvents = events.filter(e => e.category === 'photos');
  const cocktailEvents = events.filter(e => e.category === 'cocktail');
  const mealEvents = events.filter(e => e.category === 'repas');
  const eveningEvents = events.filter(e => e.category === 'soiree');
  
  // Start with preparations 3 hours before ceremony
  if (ceremonyEvent && preparationEvents.length > 0) {
    currentTime = addMinutesToDate(ceremonyEvent.startTime, -180);
  }
  
  const orderedEvents = [
    ...preparationEvents, 
    ...logisticsEvents,
    ...ceremonyEvents, 
    ...photoEvents,
    ...cocktailEvents,
    ...mealEvents,
    ...eveningEvents
  ];
  
  return orderedEvents.map((event, index) => {
    const updatedEvent = { ...event };
    
    // Keep ceremony events at their specified times
    if (event.category === 'cérémonie' && event.startTime) {
      currentTime = event.endTime;
      return updatedEvent;
    }
    
    if (index === 0) {
      updatedEvent.startTime = currentTime;
    } else {
      updatedEvent.startTime = new Date(currentTime);
    }
    
    updatedEvent.endTime = addMinutesToDate(updatedEvent.startTime, event.duration);
    
    // Calculate next start time with appropriate buffer
    const bufferTime = getBufferTime(event.category);
    currentTime = addMinutesToDate(updatedEvent.endTime, bufferTime);
    
    return updatedEvent;
  });
};

// Helper functions
const createEvent = (type: string, title: string, startTime: Date, duration: number, category: string, isHighlight = false): PlanningEvent => ({
  id: `${type}-${Date.now()}-${Math.random()}`,
  title,
  category,
  startTime: new Date(startTime),
  endTime: new Date(startTime.getTime() + duration * 60000),
  duration,
  type,
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

// Save planning to new generated_planning table
export const saveGeneratedPlanning = async (
  supabase: SupabaseClient,
  userId: string,
  formResponses: PlanningFormValues,
  planningBlocks: PlanningEvent[]
): Promise<void> => {
  const serializedBlocks = planningBlocks.map(block => ({
    ...block,
    startTime: block.startTime.toISOString(),
    endTime: block.endTime.toISOString()
  }));

  try {
    // Check if record exists
    const { data: existingData, error: selectError } = await supabase
      .from('generated_planning')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('generated_planning')
        .update({
          form_responses: formResponses,
          planning_blocks: serializedBlocks
        })
        .eq('user_id', userId);

      if (error) throw error;
    } else {
      // Insert new record
      const { error } = await supabase
        .from('generated_planning')
        .insert({
          user_id: userId,
          form_responses: formResponses,
          planning_blocks: serializedBlocks
        });

      if (error) throw error;
    }
  } catch (error: any) {
    console.error('Error saving generated planning:', error);
    // Silent error handling - don't throw to avoid blocking UI
  }
};

// Load planning from generated_planning table
export const loadGeneratedPlanning = async (
  supabase: SupabaseClient,
  userId: string
): Promise<{ formData: PlanningFormValues | null; events: PlanningEvent[] }> => {
  try {
    const { data, error } = await supabase
      .from('generated_planning')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      const events = (data.planning_blocks as SerializablePlanningEvent[]).map(block => ({
        ...block,
        startTime: new Date(block.startTime),
        endTime: new Date(block.endTime)
      }));

      return {
        formData: data.form_responses as PlanningFormValues,
        events
      };
    }

    return { formData: null, events: [] };
  } catch (error) {
    console.error('Error loading generated planning:', error);
    return { formData: null, events: [] };
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

  try {
    // First try to update existing record
    const { data: existingData, error: selectError } = await supabase
      .from('planning_reponses_utilisateur')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      throw selectError;
    }

    if (existingData) {
      // Update existing record
      const { data, error } = await supabase
        .from('planning_reponses_utilisateur')
        .update({
          email: email,
          reponses: responses || {},
          planning_genere: serializedPlanning || []
        })
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    } else {
      // Insert new record
      const { data, error } = await supabase
        .from('planning_reponses_utilisateur')
        .insert({
          user_id: userId,
          email: email,
          reponses: responses || {},
          planning_genere: serializedPlanning || []
        });

      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error('Error saving planning responses:', error);
    throw new Error(`Erreur lors de la sauvegarde: ${error.message}`);
  }
};

export type PlanningType = 
  | 'ceremony' 
  | 'preparation' 
  | 'travel' 
  | 'couple_photos' 
  | 'cocktail' 
  | 'dinner' 
  | 'party' 
  | 'custom';
