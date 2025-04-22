
import { addMinutes, parse } from 'date-fns';
import type { WeddingDaySchedule, KeyEvents } from './types';

interface GenerateScheduleProps extends KeyEvents {
  ceremonyTime: string;
  travelDuration: number;
  isCeremonyReligious: boolean;
}

export const generateSchedule = ({
  ceremonyTime,
  travelDuration,
  isCeremonyReligious,
  hasPhotoSession,
  hasCoupleEntrance,
  hasSpeeches,
  hasWeddingCake,
  hasFirstDance,
}: GenerateScheduleProps): WeddingDaySchedule => {
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
      label: 'Temps de marge',
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

  if (hasPhotoSession) {
    events.push(
      {
        label: 'Temps de marge',
        time: currentTime,
        duration: 10,
      },
      {
        label: 'Séance photos',
        time: addMinutes(currentTime, 10),
        duration: 45,
        isHighlight: true,
      }
    );
    currentTime = addMinutes(currentTime, 55);
  }

  events.push({
    label: 'Trajet vers le lieu de festivités',
    time: currentTime,
    duration: travelDuration,
  });

  currentTime = addMinutes(currentTime, travelDuration);

  events.push({
    label: 'Début du cocktail',
    time: currentTime,
    isHighlight: true,
    duration: 120,
  });

  if (hasCoupleEntrance) {
    events.push({
      label: 'Entrée des mariés',
      time: addMinutes(currentTime, 30),
      duration: 15,
      isHighlight: true,
    });
  }

  currentTime = addMinutes(currentTime, 120);
  events.push({
    label: 'Début du dîner',
    time: currentTime,
    isHighlight: true,
    duration: 180,
  });

  if (hasSpeeches) {
    events.push({
      label: 'Animations & discours',
      time: addMinutes(currentTime, 60),
      duration: 45,
      isHighlight: true,
    });
  }

  if (hasWeddingCake) {
    events.push({
      label: 'Service de la pièce montée',
      time: addMinutes(currentTime, 150),
      duration: 30,
      isHighlight: true,
    });
  }

  currentTime = addMinutes(currentTime, 180);

  if (hasFirstDance) {
    events.push({
      label: 'Temps de marge',
      time: currentTime,
      duration: 15,
    },
    {
      label: 'Ouverture du bal',
      time: addMinutes(currentTime, 15),
      duration: 30,
      isHighlight: true,
    });
  }

  return { events };
};
