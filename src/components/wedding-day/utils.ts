
import { addMinutes, parse } from 'date-fns';
import type { WeddingDaySchedule } from './types';

interface GenerateScheduleProps {
  ceremonyTime: string;
  travelDuration: number;
  ceremonyType: 'religieuse' | 'laique';
  hasPhotoSession: boolean;
  hasCoupleEntrance: boolean;
  hasOtherAnimations: boolean;
  hasSpeeches: boolean;
  hasWeddingCake: boolean;
  hasFirstDance: boolean;
}

/**
 * Génère le planning du jour J en respectant les marges, durées et ordres demandés.
 * Les temps de marge sont ajoutés avant chaque changement, et la séance photo est calée pendant le cocktail.
 */
export const generateSchedule = ({
  ceremonyTime,
  travelDuration,
  ceremonyType,
  hasPhotoSession,
  hasCoupleEntrance,
  hasOtherAnimations,
  hasSpeeches,
  hasWeddingCake,
  hasFirstDance,
}: GenerateScheduleProps): WeddingDaySchedule => {
  const baseDate = new Date();
  const startTime = parse(ceremonyTime, 'HH:mm', baseDate);
  const ceremonyDuration = ceremonyType === 'religieuse' ? 90 : 60;

  let idx = 0;

  // Heure Cérémonie officielle
  const events = [{
    label: "Heure cérémonie officielle",
    time: startTime,
    isHighlight: true,
    duration: 0,
    type: "ceremony_time",
    id: idx++,
  }];

  // Temps de marge (avant cérémonie)
  events.push({
    label: 'Temps de marge',
    time: startTime,
    duration: 10,
    isMargin: true,
    type: 'marge',
    id: idx++,
  });

  // Début Cérémonie (laïque/religieuse)
  const ceremonyStart = addMinutes(startTime, 10);
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

  // Temps de marge après cérémonie
  events.push({
    label: 'Temps de marge',
    time: ceremonyEnd,
    duration: 10,
    isMargin: true,
    type: 'marge',
    id: idx++
  });

  // Séance photos (pendant le cocktail : commence 10 min après la cérémonie, dure 30min)
  const photoSessionStart = addMinutes(ceremonyEnd, 10);
  if (hasPhotoSession) {
    events.push({
      label: "Séance photos",
      time: photoSessionStart,
      duration: 30,
      isHighlight: true,
      type: 'photos',
      id: idx++,
    });
    // Marge potentielle après séance photo
    events.push({
      label: "Temps de marge",
      time: addMinutes(photoSessionStart, 30),
      duration: 10,
      isMargin: true,
      type: 'marge',
      id: idx++,
    });
  }

  // Trajet vers le lieu de réception (après la séance photo OU la cérémonie)
  const travelStart = hasPhotoSession ? addMinutes(photoSessionStart, 40) : addMinutes(ceremonyEnd, 10);
  events.push({
    label: 'Trajet vers le lieu de réception',
    time: travelStart,
    duration: travelDuration,
    type: 'travel',
    id: idx++
  });

  // Temps de marge à l'arrivée
  const afterTravelTime = addMinutes(travelStart, travelDuration);
  events.push({
    label: 'Temps de marge',
    time: afterTravelTime,
    duration: 10,
    isMargin: true,
    type: 'marge',
    id: idx++
  });

  // Début du cocktail (après marge)
  const cocktailStart = addMinutes(afterTravelTime, 10);
  events.push({
    label: 'Début du cocktail',
    time: cocktailStart,
    isHighlight: true,
    duration: 90,
    type: 'cocktail',
    id: idx++
  });

  let currentTime = cocktailStart;
  let timePassed = 0;

  // Entrée des mariés (optionnel)
  if (hasCoupleEntrance) {
    // Marge avant l'entrée possible
    events.push({
      label: 'Temps de marge',
      time: addMinutes(currentTime, 90),
      duration: 10,
      isMargin: true,
      type: 'marge',
      id: idx++
    });

    // Entrée des mariés
    const entranceTime = addMinutes(currentTime, 100);
    events.push({
      label: 'Entrée des mariés',
      time: entranceTime,
      duration: 15,
      isHighlight: true,
      type: 'entrance',
      id: idx++
    });

    // Le début du dîner se fera juste après l'entrée des mariés
    currentTime = addMinutes(entranceTime, 15);
  } else {
    currentTime = addMinutes(currentTime, 90);
    // Marge après cocktail
    events.push({
      label: 'Temps de marge',
      time: currentTime,
      duration: 10,
      isMargin: true,
      type: 'marge',
      id: idx++
    });
    currentTime = addMinutes(currentTime, 10);
  }

  // Début dîner (2-3h)
  events.push({
    label: "Début du dîner",
    time: currentTime,
    isHighlight: true,
    duration: 180,
    note: "selon le menu et nombre d'invité = demander au traiteur (2-3h estimé)",
    type: "dinner",
    id: idx++,
  });

  let dinnerTime = addMinutes(currentTime, 180);

  // Animations autres pendant dîner (optionnel)
  if (hasOtherAnimations) {
    events.push({
      label: "Animations & autres (discours, intervention surprise…)",
      time: addMinutes(currentTime, 60),
      duration: 45,
      isHighlight: true,
      type: "animation",
      id: idx++,
    });
  }

  // Pièce montée (optionnel)
  if (hasWeddingCake) {
    events.push({
      label: "Service de la pièce montée",
      time: addMinutes(currentTime, 150),
      duration: 30,
      isHighlight: true,
      type: "cake",
      id: idx++,
    });
  }

  // Discours des proches (optionnel)
  if (hasSpeeches) {
    events.push({
      label: "Discours des proches",
      time: addMinutes(currentTime, 80),
      duration: 20,
      isHighlight: true,
      type: "speech",
      id: idx++,
    });
  }

  // Marge après dîner
  events.push({
    label: 'Temps de marge',
    time: dinnerTime,
    duration: 10,
    isMargin: true,
    type: 'marge',
    id: idx++
  });

  // Danse des mariés (optionnel)
  if (hasFirstDance) {
    const firstDanceTime = addMinutes(dinnerTime, 10);
    events.push({
      label: 'Danse des mariés (ouverture du bal)',
      time: firstDanceTime,
      duration: 30,
      isHighlight: true,
      type: 'firstdance',
      id: idx++,
    });
    // Possible animations/soirée ensuite...
  }

  return { events };
};
