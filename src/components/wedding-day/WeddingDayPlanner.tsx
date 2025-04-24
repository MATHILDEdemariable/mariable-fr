
import React, { useState } from 'react';
import { WeddingDayForm } from './WeddingDayForm';
import { WeddingDayTimeline } from './WeddingDayTimeline';
import { Card } from '@/components/ui/card';
import type { WeddingDaySchedule, UserChoices } from './types';
import { generateSchedule } from "./utils";

export const WeddingDayPlanner = () => {
  const [schedule, setSchedule] = useState<WeddingDaySchedule | null>(null);

  const handleFormSubmit = (formData: {
    ceremonyTime: string;
    travelDuration: number;
    ceremonyType: 'religieuse' | 'laique';
    hasPhotoSession: boolean;
    hasCoupleEntrance: boolean;
    hasOtherAnimations: boolean;
    hasSpeeches: boolean;
    hasWeddingCake: boolean;
    hasFirstDance: boolean;
  }) => {
    const userChoices: UserChoices = {
      hasPhotoSession: formData.hasPhotoSession,
      hasCoupleEntrance: formData.hasCoupleEntrance,
      hasOtherAnimations: formData.hasOtherAnimations,
      hasSpeeches: formData.hasSpeeches,
      hasWeddingCake: formData.hasWeddingCake,
      hasFirstDance: formData.hasFirstDance,
    };
    
    const generatedSchedule = generateSchedule(formData);
    // Add user choices to the schedule for filtering events in the timeline
    generatedSchedule.userChoices = userChoices;
    setSchedule(generatedSchedule);
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
