
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
  const ceremonyDuration = isCeremonyReligious ? 90 : 60;

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
      label: isCeremonyReligious ? 'Cérémonie religieuse' : 'Cérémonie laïque',
      time: addMinutes(startTime, 10),
      duration: ceremonyDuration,
      isHighlight: true,
    },
  ];

  let currentTime = addMinutes(startTime, 10 + ceremonyDuration);

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

  events.push(
    {
      label: 'Départ des mariés',
      time: currentTime,
      duration: 0,
    },
    {
      label: 'Départ des invités',
      time: addMinutes(currentTime, 10),
      duration: 0,
    },
    {
      label: 'Trajet vers le lieu de festivités',
      time: addMinutes(currentTime, 10),
      duration: travelDuration,
    }
  );

  currentTime = addMinutes(currentTime, 10 + travelDuration);

  events.push(
    {
      label: 'Début du cocktail',
      time: currentTime,
      isHighlight: true,
      duration: 120,
    },
    {
      label: 'Photos des mariés',
      time: addMinutes(currentTime, 15),
      duration: 45,
    }
  );

  currentTime = addMinutes(currentTime, 120);
  events.push({
    label: 'Début du dîner',
    time: currentTime,
    isHighlight: true,
    duration: 180,
  });

  currentTime = addMinutes(currentTime, 180);
  events.push({
    label: 'Ouverture du bal',
    time: currentTime,
    isHighlight: true,
    duration: 30,
  });

  return { events };
};
