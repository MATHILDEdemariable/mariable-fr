
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePlanning } from '../context/PlanningContext';
import EnhancedDragDropTimeline from './EnhancedDragDropTimeline';
import { PlanningEvent } from '../types/planningTypes';
import { convertFormValuesToFormData, type PlanningFormValues } from './FormDataConverter';

const PlanningResults: React.FC = () => {
  const { planning, setPlanning, generatePlanning, formData } = usePlanning();
  const [localExportLoading, setLocalExportLoading] = useState(false);

  const handleRegeneratePlanning = () => {
    if (formData) {
      const newPlanning = generatePlanning(formData);
      setPlanning(newPlanning);
    }
  };

  const handleEventsUpdate = (updatedEvents: PlanningEvent[]) => {
    setPlanning(updatedEvents);
  };

  if (!planning || planning.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">
            Aucun planning généré. Veuillez d'abord remplir le formulaire.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Votre Planning Jour J</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRegeneratePlanning}
                disabled={localExportLoading}
              >
                Régénérer
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedDragDropTimeline 
            events={planning}
            onEventsUpdate={handleEventsUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanningResults;
