
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { PlanningFormValues, PlanningEvent, SerializablePlanningEvent } from '../types/planningTypes';

type PlanningContextType = {
  formData: PlanningFormValues | null;
  setFormData: React.Dispatch<React.SetStateAction<PlanningFormValues | null>>;
  events: PlanningEvent[];
  setEvents: React.Dispatch<React.SetStateAction<PlanningEvent[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  exportLoading: boolean;
  setExportLoading: React.Dispatch<React.SetStateAction<boolean>>;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  user: User | null | undefined;
};

const PlanningContext = createContext<PlanningContextType | undefined>(undefined);

export const PlanningProvider: React.FC<{ children: ReactNode, user?: User | null }> = ({ 
  children, 
  user 
}) => {
  const [formData, setFormData] = useState<PlanningFormValues | null>(null);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("form");

  return (
    <PlanningContext.Provider
      value={{
        formData,
        setFormData,
        events,
        setEvents,
        loading,
        setLoading,
        exportLoading,
        setExportLoading,
        activeTab,
        setActiveTab,
        user: user || null
      }}
    >
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = (): PlanningContextType => {
  const context = useContext(PlanningContext);
  if (context === undefined) {
    throw new Error('usePlanning must be used within a PlanningProvider');
  }
  return context;
};
