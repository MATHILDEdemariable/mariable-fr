
import { addMinutes, parse } from "date-fns";
import type { WeddingDaySchedule, WeddingEvent } from "../types";
import { getCeremonyStart, getCeremonyDuration } from "./dateHelpers";
import { PlanningEvent, PlanningFormValues } from "../types/planningTypes";

interface GenerateScheduleProps {
  ceremonyTime: string;
  travelDuration: number;
  ceremonyType: "religieuse" | "laique";
  hasCouplePhotoSession: boolean;
  hasPhotoSession: boolean;
  hasCoupleEntrance: boolean;
  hasOtherAnimations: boolean;
  hasWeddingCake: boolean;
  hasFirstDance: boolean;
}

export const generateSchedule = ({
  ceremonyTime,
  travelDuration,
  ceremonyType,
  hasCouplePhotoSession,
  hasPhotoSession,
  hasCoupleEntrance,
  hasOtherAnimations,
  hasWeddingCake,
  hasFirstDance,
}: GenerateScheduleProps): WeddingDaySchedule => {
  const baseDate = new Date();
  const startTime = parse(ceremonyTime, "HH:mm", baseDate);
  const ceremonyDuration = getCeremonyDuration(ceremonyType);

  let idx = 0;
  const events: WeddingEvent[] = [];

  // Heure de cérémonie officielle
  events.push({
    label: "Heure cérémonie officielle",
    time: startTime,
    isHighlight: true,
    duration: 0,
    type: "ceremony_time",
    id: idx++,
  });

  // Temps de marge minimal
  events.push({
    label: "Temps de marge",
    time: startTime,
    duration: 5,
    isMargin: true,
    type: "marge",
    id: idx++,
  });

  // Cérémonie
  const ceremonyStart = addMinutes(startTime, 5);
  events.push({
    label: ceremonyType === 'religieuse' ? 'Cérémonie religieuse' : 'Cérémonie laïque',
    time: ceremonyStart,
    duration: ceremonyDuration,
    isHighlight: true,
    type: 'ceremony',
    id: idx++
  });

  // Heure de fin de cérémonie
  const ceremonyEnd = addMinutes(ceremonyStart, ceremonyDuration);

  // Trajet vers le lieu de réception
  const travelStart = ceremonyEnd;
  events.push({
    label: 'Trajet vers le lieu de réception',
    time: travelStart,
    duration: travelDuration,
    type: 'travel',
    id: idx++
  });

  // Arrivée sur le lieu de réception
  const venueArrival = addMinutes(travelStart, travelDuration);

  // Séance photo couple (si sélectionnée)
  if (hasCouplePhotoSession) {
    events.push({
      label: "Séance photo couple",
      time: venueArrival,
      duration: 15,
      isHighlight: true,
      type: 'couple_photos',
      id: idx++,
    });
  }

  // Début du cocktail
  const cocktailStart = hasCouplePhotoSession ? addMinutes(venueArrival, 15) : venueArrival;
  events.push({
    label: 'Cocktail',
    time: cocktailStart,
    duration: 90,
    note: hasPhotoSession ? 'Inclut la séance photo de groupe (30 min)' : undefined,
    type: 'cocktail',
    id: idx++
  });

  let currentTime = addMinutes(cocktailStart, 90);

  // Entrée des mariés (si sélectionnée)
  if (hasCoupleEntrance) {
    events.push({
      label: 'Entrée des mariés',
      time: currentTime,
      duration: 5,
      isHighlight: true,
      type: 'entrance',
      id: idx++
    });
    currentTime = addMinutes(currentTime, 5);
  }

  // Dîner
  const dinnerNote = hasOtherAnimations 
    ? 'Inclut les animations et discours (30 min)' 
    : undefined;

  events.push({
    label: "Dîner",
    time: currentTime,
    duration: 180,
    note: dinnerNote,
    type: "dinner",
    id: idx++,
  });

  currentTime = addMinutes(currentTime, 180);

  // Pièce montée (optionnel)
  if (hasWeddingCake) {
    events.push({
      label: "Service de la pièce montée",
      time: currentTime,
      duration: 10,
      isHighlight: true,
      type: "cake",
      id: idx++,
    });
    currentTime = addMinutes(currentTime, 10);
  }

  // Danse des mariés (optionnel)
  if (hasFirstDance) {
    events.push({
      label: "Danse des mariés",
      time: currentTime,
      duration: 10,
      isHighlight: true,
      type: "firstdance",
      id: idx++,
    });
    currentTime = addMinutes(currentTime, 10);
  }

  events.push({
    label: 'Soirée dansante',
    time: currentTime,
    duration: 240,
    note: 'Durée estimative : 2h à 4h',
    type: 'dancing_party',
    id: idx++,
  });

  return { 
    events,
    userChoices: {
      hasCouplePhotoSession,
      hasPhotoSession,
      hasCoupleEntrance,
      hasOtherAnimations,
      hasWeddingCake,
      hasFirstDance,
      hasDancingParty: true
    }
  };
};

// New function to generate PlanningEvent[] from form answers
export const generatePlanningEvents = (answers: Record<string, any>): PlanningEvent[] => {
  const events: PlanningEvent[] = [];
  let eventId = 0;
  
  // Parse ceremony time or default to 14:30
  const ceremonyTime = answers.horaire_ceremonie_principale || "14:30";
  const baseDate = new Date();
  const startTime = parse(ceremonyTime, "HH:mm", baseDate);
  
  // Get ceremony type and duration
  const ceremonyType = answers.type_ceremonie_principale || "laique";
  const ceremonyDuration = ceremonyType === "religieuse" ? 90 : 60;
  
  // Add ceremony
  events.push({
    id: `event-${eventId++}`,
    title: `Cérémonie ${ceremonyType}`,
    time: ceremonyTime,
    duration: ceremonyDuration,
    category: "cérémonie",
    isHighlight: true
  });
  
  // Calculate next time slot
  let currentTime = addMinutes(startTime, ceremonyDuration);
  
  // Add travel if different venues
  if (answers.lieux_differents === "oui") {
    const travelDuration = parseInt(answers.temps_de_trajet) || 30;
    events.push({
      id: `event-${eventId++}`,
      title: "Trajet vers le lieu de réception",
      time: currentTime.toTimeString().slice(0, 5),
      duration: travelDuration,
      category: "logistique"
    });
    currentTime = addMinutes(currentTime, travelDuration);
  }
  
  // Add cocktail
  const cocktailDuration = answers.format_cocktail === "long" ? 120 : 90;
  events.push({
    id: `event-${eventId++}`,
    title: "Cocktail",
    time: currentTime.toTimeString().slice(0, 5),
    duration: cocktailDuration,
    category: "cocktail"
  });
  currentTime = addMinutes(currentTime, cocktailDuration);
  
  // Add photos during cocktail if selected
  if (answers.moment_photos === "pendant_cocktail") {
    events.push({
      id: `event-${eventId++}`,
      title: "Séance photo de groupe",
      time: addMinutes(currentTime, -30).toTimeString().slice(0, 5),
      duration: 30,
      category: "photos",
      isHighlight: true
    });
  }
  
  // Add dinner
  const dinnerDuration = parseInt(answers.duree_repas) || 180;
  events.push({
    id: `event-${eventId++}`,
    title: "Repas",
    time: currentTime.toTimeString().slice(0, 5),
    duration: dinnerDuration,
    category: "repas"
  });
  currentTime = addMinutes(currentTime, dinnerDuration);
  
  // Add evening activities if selected
  if (answers.soiree && answers.soiree !== "pas_de_soiree") {
    let soireeDuration = 240; // Default 4 hours
    if (answers.soiree === "jusqu_a_2h") soireeDuration = 120;
    else if (answers.soiree === "jusqu_a_4h") soireeDuration = 240;
    else if (answers.soiree === "plus_de_4h") soireeDuration = 300;
    
    events.push({
      id: `event-${eventId++}`,
      title: "Soirée dansante",
      time: currentTime.toTimeString().slice(0, 5),
      duration: soireeDuration,
      category: "soiree"
    });
  }
  
  // Add special moments if selected
  if (answers.temps_forts && Array.isArray(answers.temps_forts)) {
    answers.temps_forts.forEach((moment: string) => {
      switch (moment) {
        case "entree_maries":
          events.push({
            id: `event-${eventId++}`,
            title: "Entrée des mariés",
            time: addMinutes(currentTime, -dinnerDuration).toTimeString().slice(0, 5),
            duration: 10,
            category: "soiree",
            isHighlight: true
          });
          break;
        case "decoupe_dessert":
          events.push({
            id: `event-${eventId++}`,
            title: "Découpe du gâteau",
            time: addMinutes(currentTime, -30).toTimeString().slice(0, 5),
            duration: 15,
            category: "soiree",
            isHighlight: true
          });
          break;
        case "discours":
          events.push({
            id: `event-${eventId++}`,
            title: "Discours",
            time: addMinutes(currentTime, -120).toTimeString().slice(0, 5),
            duration: 20,
            category: "repas",
            isHighlight: true
          });
          break;
      }
    });
  }
  
  return events.sort((a, b) => {
    const timeA = parse(a.time, "HH:mm", baseDate);
    const timeB = parse(b.time, "HH:mm", baseDate);
    return timeA.getTime() - timeB.getTime();
  });
};
