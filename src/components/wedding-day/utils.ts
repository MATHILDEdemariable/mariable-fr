
import { addMinutes, parse } from 'date-fns';
import type { WeddingDaySchedule } from './types';

export const generateSchedule = ({
  ceremonyTime,
  travelDuration,
  isCeremonyReligious,
}: {
  ceremonyTime: string;
  travelDuration: number;
  isCeremonyReligious: boolean;
}): WeddingDaySchedule => {
  const baseDate = new Date();
  const startTime = parse(ceremonyTime, 'HH:mm', baseDate);
  const ceremonyDuration = isCeremonyReligious ? 120 : 60;

  const events = [
    {
      label: 'Heure cérémonie officielle',
      time: startTime,
      isHighlight: true,
    },
    {
      label: 'Retard anticipé',
      time: startTime,
      duration: 10,
    },
    {
      label: 'Début cérémonie estimé',
      time: addMinutes(startTime, 10),
    },
    {
      label: 'Durée cérémonie',
      time: addMinutes(startTime, 10),
      duration: ceremonyDuration,
    },
  ];

  let currentTime = addMinutes(startTime, 10 + ceremonyDuration);

  // Ajout des événements suivants...
  events.push(
    {
      label: 'Temps de sortie',
      time: currentTime,
      duration: 10,
    },
    {
      label: 'Photos sur le parvis',
      time: addMinutes(currentTime, 10),
      duration: 30,
    }
  );

  currentTime = addMinutes(currentTime, 40);

  // Départ et trajet
  events.push(
    {
      label: 'Départ des mariés',
      time: currentTime,
    },
    {
      label: 'Départ des invités',
      time: addMinutes(currentTime, 10),
    },
    {
      label: 'Temps de trajet',
      time: addMinutes(currentTime, 10),
      duration: travelDuration,
    }
  );

  currentTime = addMinutes(currentTime, 10 + travelDuration);

  // Cocktail et photos
  events.push(
    {
      label: 'Début du cocktail',
      time: currentTime,
      isHighlight: true,
    },
    {
      label: 'Photos des mariés',
      time: addMinutes(currentTime, 15),
      duration: 45,
    }
  );

  // Continuer avec le reste des événements...
  // Dîner
  currentTime = addMinutes(currentTime, 120);
  events.push({
    label: 'Début du dîner',
    time: currentTime,
    isHighlight: true,
  });

  // Soirée
  currentTime = addMinutes(currentTime, 180);
  events.push({
    label: 'Ouverture du bal',
    time: currentTime,
    isHighlight: true,
  });

  return { events };
};
