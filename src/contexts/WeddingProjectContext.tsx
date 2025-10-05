import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WeddingProject = {
  conversationId?: string;
  weddingData?: {
    budget?: number;
    date?: string;
    guests?: number;
    location?: string;
    style?: string;
  };
  timeline?: Array<{
    task: string;
    dueDate: string;
    priority: string;
    category: string;
  }>;
  budgetBreakdown?: Array<{
    category: string;
    estimatedCost: number;
    description?: string;
  }>;
  vendors?: Array<{
    id?: string;
    nom: string;
    categorie: string;
    region?: string;
    ville?: string;
    fourchette_prix?: string;
    description?: string;
    site_web?: string;
    email?: string;
  }>;
};

type WeddingProjectContextType = {
  project: WeddingProject | null;
  updateProject: (updates: Partial<WeddingProject>) => void;
  resetProject: () => void;
  addVendors: (vendors: any[]) => void;
};

const WeddingProjectContext = createContext<WeddingProjectContextType | undefined>(undefined);

export const WeddingProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<WeddingProject | null>(null);

  const updateProject = (updates: Partial<WeddingProject>) => {
    setProject((prev) => {
      if (!prev) {
        return updates as WeddingProject;
      }
      
      return {
        ...prev,
        ...updates,
        weddingData: updates.weddingData 
          ? { ...prev.weddingData, ...updates.weddingData }
          : prev.weddingData,
        timeline: updates.timeline || prev.timeline,
        budgetBreakdown: updates.budgetBreakdown || prev.budgetBreakdown,
        vendors: updates.vendors || prev.vendors,
      };
    });
  };

  const addVendors = (vendors: any[]) => {
    setProject((prev) => {
      if (!prev) {
        return { vendors };
      }
      
      const existingVendors = prev.vendors || [];
      const newVendors = vendors.filter(
        (newV) => !existingVendors.some((existingV) => existingV.nom === newV.nom)
      );
      
      return {
        ...prev,
        vendors: [...existingVendors, ...newVendors],
      };
    });
  };

  const resetProject = () => {
    setProject(null);
  };

  return (
    <WeddingProjectContext.Provider value={{ project, updateProject, resetProject, addVendors }}>
      {children}
    </WeddingProjectContext.Provider>
  );
};

export const useWeddingProject = (): WeddingProjectContextType => {
  const context = useContext(WeddingProjectContext);
  if (context === undefined) {
    throw new Error('useWeddingProject must be used within a WeddingProjectProvider');
  }
  return context;
};
