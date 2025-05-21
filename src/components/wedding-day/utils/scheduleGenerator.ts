
import { addMinutes, parse, format, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { QuizFormValues, ScheduleEvent, WeddingSchedule } from '../types/scheduleTypes';

// Base wedding date - we'll use today as a base and just care about the time
const baseDate = new Date();

// Helper to parse time strings like "14:30" into Date objects
const parseTimeString = (timeString: string): Date => {
  // If time is not provided, return a default time (noon)
  if (!timeString) {
    return setHours(setMinutes(new Date(), 0), 12);
  }
  
  try {
    // Parse time string into hours and minutes
    const [hours, minutes] = timeString.split(':').map(Number);
    return setHours(setMinutes(new Date(), minutes || 0), hours || 12);
  } catch (error) {
    console.error('Error parsing time:', error);
    return setHours(setMinutes(new Date(), 0), 12);
  }
};

// Create a schedule event
const createEvent = (
  id: string,
  title: string,
  startTime: Date,
  durationMinutes: number,
  type: string,
  isHighlight: boolean = false,
  notes?: string
): ScheduleEvent => {
  return {
    id,
    title,
    startTime,
    endTime: addMinutes(startTime, durationMinutes),
    duration: durationMinutes,
    type,
    isHighlight,
    notes
  };
};

// Extract option duration from option value
const getOptionDuration = (formData: QuizFormValues, fieldPath: string, defaultDuration: number = 0): number => {
  // If the field doesn't exist in form data, return default
  if (!formData[fieldPath]) return defaultDuration;
  
  // Extract data from JSON based on field path
  const dataPath = fieldPath.split('.');
  let currentData: any = {
    inputs_mariage: {
      type_ceremonie_principale: {
        options: [
          { valeur: "religieuse", duree: 90 },
          { valeur: "laïque", duree: 60 }
        ]
      },
      format_cocktail: {
        options: [
          { valeur: "court", duree: 60 },
          { valeur: "long", duree: 120 }
        ]
      },
      duree_repas: {
        options: [
          { valeur: "rapide", duree: 90 },
          { valeur: "normal", duree: 120 },
          { valeur: "long", duree: 150 }
        ]
      },
      soiree: {
        options: [
          { valeur: "pas_de_soiree", duree: 0 },
          { valeur: "jusqu_a_2h", duree: 120 },
          { valeur: "jusqu_a_4h", duree: 240 },
          { valeur: "plus_de_4h", duree: 300 }
        ]
      },
      temps_forts: {
        options: [
          { valeur: "photos_groupe", duree: 20 },
          { valeur: "entree_maries", duree: 10 },
          { valeur: "discours", duree: 5 },
          { valeur: "decoupe_dessert", duree: 15 },
          { valeur: "animation_supplementaire", duree: 20 }
        ]
      }
    }
  };
  
  const lastKey = dataPath[dataPath.length - 1];
  const parentPath = dataPath.slice(0, -1).join('.');
  
  // Find the selected option
  const selectedValue = formData[fieldPath];
  
  // Special case for temps_forts which is a multi-select
  if (fieldPath === 'temps_forts') {
    const selectedOptions = selectedValue as string[];
    if (!Array.isArray(selectedOptions)) return defaultDuration;
    
    // Sum the durations of all selected options
    let totalDuration = 0;
    selectedOptions.forEach(option => {
      const optionObj = currentData.inputs_mariage.temps_forts.options.find(
        (o: any) => o.valeur === option
      );
      if (optionObj) {
        totalDuration += optionObj.duree || 0;
      }
    });
    return totalDuration;
  }
  
  // Find the option with matching value
  const fieldData = currentData.inputs_mariage[fieldPath];
  if (!fieldData || !fieldData.options) return defaultDuration;
  
  const selectedOption = fieldData.options.find(
    (option: any) => typeof option === 'object' && option.valeur === selectedValue
  );
  
  return selectedOption?.duree || defaultDuration;
};

// Get included activities from form data
const getIncludedActivities = (formData: QuizFormValues): string[] => {
  const activities: string[] = [];
  
  // Check first look
  if (formData.first_look === 'oui') {
    activities.push('first_look');
  }
  
  // Check photos timing
  if (formData.moment_photos) {
    activities.push(`photos_${formData.moment_photos}`);
  }
  
  // Check temps_forts (multi-select)
  const selectedFeatures = formData.temps_forts as string[] || [];
  if (selectedFeatures.length > 0) {
    activities.push(...selectedFeatures);
  }
  
  return activities;
};

export const generateScheduleFromQuiz = (formData: QuizFormValues): WeddingSchedule => {
  const events: ScheduleEvent[] = [];
  let eventId = 0;
  
  // Get main ceremony details
  const ceremonyType = formData.type_ceremonie_principale as string || 'laïque';
  const ceremonyDuration = getOptionDuration(
    formData, 
    'type_ceremonie_principale', 
    ceremonyType === 'religieuse' ? 90 : 60
  );
  
  // Get main ceremony time
  const ceremonyTime = parseTimeString(formData.horaire_ceremonie_principale as string);
  
  // Add preparatifs if available
  const preparationStart = addMinutes(ceremonyTime, -180); // Start 3h before ceremony
  
  // Add main ceremony event
  events.push(
    createEvent(
      String(eventId++),
      `Cérémonie ${ceremonyType}`,
      ceremonyTime,
      ceremonyDuration,
      'ceremony',
      true
    )
  );
  
  // Add civil ceremony if on same day
  if (formData.ceremonie_civile_le_meme_jour === 'oui') {
    const civilCeremonyTime = parseTimeString(formData.horaire_ceremonie_civile as string);
    events.push(
      createEvent(
        String(eventId++),
        'Cérémonie civile',
        civilCeremonyTime,
        30, // Default duration for civil ceremony
        'civil_ceremony',
        true
      )
    );
  }
  
  // Check if venues are different
  const hasMultipleLocations = formData.lieux_differents === 'oui';
  
  // Add travel time if needed
  if (hasMultipleLocations) {
    const travelDuration = Number(formData.temps_de_trajet) || 30;
    const ceremonyEnd = addMinutes(ceremonyTime, ceremonyDuration);
    
    events.push(
      createEvent(
        String(eventId++),
        'Trajet vers le lieu de réception',
        ceremonyEnd,
        travelDuration,
        'travel',
        false
      )
    );
    
    // Start cocktail after travel
    const cocktailStart = addMinutes(ceremonyEnd, travelDuration);
    const cocktailDuration = getOptionDuration(formData, 'format_cocktail', 60);
    
    events.push(
      createEvent(
        String(eventId++),
        'Cocktail',
        cocktailStart,
        cocktailDuration,
        'cocktail',
        false
      )
    );
  } else {
    // Start cocktail right after ceremony
    const cocktailStart = addMinutes(ceremonyTime, ceremonyDuration);
    const cocktailDuration = getOptionDuration(formData, 'format_cocktail', 60);
    
    events.push(
      createEvent(
        String(eventId++),
        'Cocktail',
        cocktailStart,
        cocktailDuration,
        'cocktail',
        false
      )
    );
  }
  
  // Get the last event to continue building the schedule
  const lastEvent = events[events.length - 1];
  let currentTime = lastEvent.endTime;
  
  // Add dinner
  const dinnerDuration = getOptionDuration(formData, 'duree_repas', 120);
  const dinnerType = formData.type_repas as string;
  
  events.push(
    createEvent(
      String(eventId++),
      dinnerType === 'assis' ? 'Dîner assis' : 'Cocktail dînatoire',
      currentTime,
      dinnerDuration,
      'dinner',
      false
    )
  );
  
  currentTime = addMinutes(currentTime, dinnerDuration);
  
  // Add key moments from temps_forts
  const selectedMoments = formData.temps_forts as string[] || [];
  
  if (selectedMoments.includes('entree_maries')) {
    // Add before dinner
    const dinnerEvent = events.find(e => e.type === 'dinner');
    if (dinnerEvent) {
      events.push(
        createEvent(
          String(eventId++),
          'Entrée des mariés',
          dinnerEvent.startTime,
          10,
          'couple_entrance',
          true
        )
      );
      // Adjust dinner start time
      dinnerEvent.startTime = addMinutes(dinnerEvent.startTime, 10);
    }
  }
  
  if (selectedMoments.includes('decoupe_dessert')) {
    events.push(
      createEvent(
        String(eventId++),
        'Découpe du gâteau/dessert',
        currentTime,
        15,
        'cake_cutting',
        true
      )
    );
    currentTime = addMinutes(currentTime, 15);
  }
  
  // Add party if selected
  const partyOption = formData.soiree as string;
  if (partyOption && partyOption !== 'pas_de_soiree') {
    const partyDuration = getOptionDuration(formData, 'soiree', 0);
    
    if (partyDuration > 0) {
      events.push(
        createEvent(
          String(eventId++),
          'Soirée dansante',
          currentTime,
          partyDuration,
          'party',
          false
        )
      );
    }
  }
  
  // Sort events by start time
  events.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  
  return {
    events,
    metadata: {
      weddingDate: new Date(),
      ceremonyType,
      hasMultipleLocations,
      includedActivities: getIncludedActivities(formData)
    }
  };
};
