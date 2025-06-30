
import React from 'react';
import { PlanningProvider } from '../wedding-day/context/PlanningContext';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';
import MonJourMPlanningContent from './MonJourMPlanningContent';

const MonJourMPlanningMVP: React.FC = () => {
  const { 
    coordination, 
    isLoading: coordinationLoading, 
    isInitializing,
    error: coordinationError 
  } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningMVP: coordination state:', { 
    coordination: coordination?.id, 
    loading: coordinationLoading, 
    initializing: isInitializing,
    error: coordinationError 
  });

  // Guard pour les erreurs de coordination
  if (coordinationError) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Erreur de chargement de la coordination</div>
      </div>
    );
  }

  // Loading state pendant l'initialisation
  if (coordinationLoading || isInitializing || !coordination) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <PlanningProvider user={null}>
      <MonJourMPlanningContent coordinationId={coordination.id} />
    </PlanningProvider>
  );
};

export default MonJourMPlanningMVP;
