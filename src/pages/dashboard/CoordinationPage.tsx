
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { WeddingDayScheduleGenerator } from '@/components/wedding-day/WeddingDayScheduleGenerator';
import SavedParametersManager from '@/components/wedding-day/SavedParametersManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CoordinationPage = () => {
  const [currentParameters, setCurrentParameters] = useState({});

  // Handler to update current parameters when form values change
  const handleParametersChange = (parameters: any) => {
    setCurrentParameters(parameters);
  };

  // Handler to load saved parameters
  const handleLoadParameters = (parameters: any) => {
    setCurrentParameters(parameters);
  };

  return (
    <>
      <Helmet>
        <title>Planning Jour J | Mariable</title>
        <meta name="description" content="Générateur de planning personnalisé pour votre jour J" />
      </Helmet>
      
      <div className="space-y-6 max-w-5xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Mes plannings sauvegardés</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SavedParametersManager 
              currentParameters={currentParameters} 
              onLoadParameters={handleLoadParameters} 
            />
          </CardContent>
        </Card>
        
        <WeddingDayScheduleGenerator 
          initialParameters={currentParameters}
          onParametersChange={handleParametersChange}
        />
      </div>
    </>
  );
};

export default CoordinationPage;
