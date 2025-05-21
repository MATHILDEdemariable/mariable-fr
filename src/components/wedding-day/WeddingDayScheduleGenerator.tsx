
import React, { useState, useEffect } from 'react';
import { WeddingDayForm } from './WeddingDayForm';
import { WeddingDayTimeline } from './WeddingDayTimeline';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { generateSchedule } from './utils/scheduleGenerator';

interface WeddingDayScheduleGeneratorProps {
  initialParameters?: any;
  onParametersChange?: (parameters: any) => void;
}

export const WeddingDayScheduleGenerator: React.FC<WeddingDayScheduleGeneratorProps> = ({
  initialParameters,
  onParametersChange
}) => {
  const [formValues, setFormValues] = useState({
    ceremonyType: 'civil',
    ceremonyTime: '14:00',
    cocktailDuration: 2,
    hasDinner: true,
    dinnerTime: '19:00',
    hasCocktail: true,
    hasAfterParty: true,
    hasBrunch: false,
    brunchTime: '11:00',
    hasRehearsal: false,
    rehearsalTime: '18:00',
    rehearsalDinnerTime: '20:00',
    weddingDate: new Date(),
    // Additional form values can be added here
  });

  const [schedule, setSchedule] = useState<any[]>([]);

  // Effect to update schedule when form values change
  useEffect(() => {
    const newSchedule = generateSchedule(formValues);
    setSchedule(newSchedule);
    
    // Notify parent component of parameter changes
    if (onParametersChange) {
      onParametersChange(formValues);
    }
  }, [formValues, onParametersChange]);

  // Effect to handle loading of saved parameters
  useEffect(() => {
    if (initialParameters && Object.keys(initialParameters).length > 0) {
      setFormValues(prevValues => ({
        ...prevValues,
        ...initialParameters,
        // Convert string date back to Date object if needed
        weddingDate: initialParameters.weddingDate instanceof Date 
          ? initialParameters.weddingDate 
          : new Date(initialParameters.weddingDate || new Date())
      }));
    }
  }, [initialParameters]);

  const handleFormChange = (newValues: any) => {
    setFormValues(prevValues => ({ ...prevValues, ...newValues }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Planning Jour J</CardTitle>
        </CardHeader>
        <CardContent>
          <WeddingDayForm values={formValues} onChange={handleFormChange} />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Votre Planning Personnalisé</CardTitle>
        </CardHeader>
        <CardContent>
          <WeddingDayTimeline events={schedule} />
        </CardContent>
      </Card>
    </div>
  );
};
