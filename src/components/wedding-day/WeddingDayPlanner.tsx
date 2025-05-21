
import React, { useState } from 'react';
import { WeddingDayForm } from './WeddingDayForm';
import { WeddingDayTimeline } from './WeddingDayTimeline';
import { Card } from '@/components/ui/card';
import type { WeddingDaySchedule, UserChoices } from './types';
import { generateSchedule } from "./utils";
import { WeddingSchedule } from './types/scheduleTypes';

export const WeddingDayPlanner = () => {
  const [schedule, setSchedule] = useState<WeddingSchedule | null>(null);

  const handleFormSubmit = (formData: {
    ceremonyTime: string;
    travelDuration: number;
    ceremonyType: 'religieuse' | 'laique';
    hasCouplePhotoSession: boolean;
    hasPhotoSession: boolean;
    hasCoupleEntrance: boolean;
    hasOtherAnimations: boolean;
    hasWeddingCake: boolean;
    hasFirstDance: boolean;
  }) => {
    const userChoices: UserChoices = {
      hasCouplePhotoSession: formData.hasCouplePhotoSession,
      hasPhotoSession: formData.hasPhotoSession,
      hasCoupleEntrance: formData.hasCoupleEntrance,
      hasOtherAnimations: formData.hasOtherAnimations,
      hasWeddingCake: formData.hasWeddingCake,
      hasFirstDance: formData.hasFirstDance,
    };
    
    // Create a compatible schedule format
    const oldSchedule: WeddingDaySchedule = generateSchedule(formData);
    
    // Convert to the new schedule format
    const newSchedule: WeddingSchedule = {
      events: oldSchedule.events.map(event => ({
        id: String(event.id),
        title: event.label,
        startTime: event.time,
        endTime: new Date(event.time.getTime() + (event.duration || 0) * 60000),
        duration: event.duration || 0,
        type: event.type || 'default',
        isHighlight: event.isHighlight || false,
        notes: event.note
      })),
      metadata: {
        weddingDate: new Date(),
        ceremonyType: formData.ceremonyType,
        hasMultipleLocations: formData.travelDuration > 0,
        includedActivities: []
      }
    };
    
    setSchedule(newSchedule);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-serif mb-4">Configurez votre planning</h2>
        <WeddingDayForm onSubmit={handleFormSubmit} />
      </Card>

      {schedule && (
        <Card className="p-6">
          <h2 className="text-2xl font-serif mb-4">Votre planning détaillé</h2>
          <WeddingDayTimeline schedule={schedule} />
        </Card>
      )}
    </div>
  );
};
