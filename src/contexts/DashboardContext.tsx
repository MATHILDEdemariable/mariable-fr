
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboardContext must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [activeItem, setActiveItem] = useState('Résumé du projet');

  return (
    <DashboardContext.Provider value={{ activeItem, setActiveItem }}>
      {children}
    </DashboardContext.Provider>
  );
};
