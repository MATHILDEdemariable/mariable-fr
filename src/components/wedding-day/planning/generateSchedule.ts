
import { addMinutes, parse } from "date-fns";
import type { WeddingDaySchedule, WeddingEvent } from "../types";
import { getCeremonyStart, getCeremonyDuration } from "./dateHelpers";

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
