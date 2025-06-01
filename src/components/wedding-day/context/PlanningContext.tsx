
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { PlanningEvent, PlanningQuestion, generatePlanning as generatePlanningFromTypes } from '../types/planningTypes';
import { convertFormDataToFormValues, type PlanningFormData, type PlanningFormValues } from '../components/FormDataConverter';

interface PlanningContextType {
  user: User | null;
  formData: PlanningFormData | null;
  planning: PlanningEvent[];
  activeTab: string;
  setFormData: (data: PlanningFormData) => void;
  setPlanning: (events: PlanningEvent[]) => void;
  setActiveTab: (tab: string) => void;
  generatePlanning: (data: PlanningFormData) => PlanningEvent[];
}

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};

interface PlanningProviderProps {
  children: ReactNode;
  user: User | null;
}

export const PlanningProvider: React.FC<PlanningProviderProps> = ({ children, user }) => {
  const [formData, setFormData] = useState<PlanningFormData | null>(null);
  const [planning, setPlanning] = useState<PlanningEvent[]>([]);
  const [activeTab, setActiveTab] = useState('form');

  const generatePlanning = (data: PlanningFormData): PlanningEvent[] => {
    // Convert FormData to FormValues for compatibility with generatePlanningFromTypes
    const formValues = convertFormDataToFormValues(data);
    
    // Mock questions array - in real implementation, this would come from the database
    const mockQuestions: PlanningQuestion[] = [
      {
        id: '1',
        option_name: 'double_ceremonie',
        type: 'choix',
        categorie: 'cérémonie',
        label: 'Double cérémonie',
        duree_minutes: 0,
        ordre_affichage: 1,
        visible_si: null,
        options: ['oui', 'non']
      }
    ];
    
    const generatedEvents = generatePlanningFromTypes(mockQuestions, formValues);
    setPlanning(generatedEvents);
    return generatedEvents;
  };

  return (
    <PlanningContext.Provider
      value={{
        user,
        formData,
        planning,
        activeTab,
        setFormData,
        setPlanning,
        setActiveTab,
        generatePlanning
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};
