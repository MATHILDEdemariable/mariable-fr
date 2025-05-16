
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the types for our brief data
export type WeddingBrief = {
  id: string;
  couple: {
    name1: string;
    name2: string;
    email: string;
  };
  preferences: {
    style: string;
    theme: string[];
    colors: string[];
    season: string;
  };
  budget: {
    total: number;
    breakdown?: Record<string, number>;
  };
  timeline: {
    weddingDate: string | null;
    engagementLength: string;
  };
  additionalInfo: string;
  createdAt: Date;
  generatedPlan?: WeddingPlan;
};

export type WeddingPlan = {
  id: string;
  briefId: string;
  title: string;
  summary: string;
  recommendations: {
    category: string;
    suggestions: Array<{
      name: string;
      description: string;
      estimated_cost: number;
    }>;
  }[];
  timeline: {
    date: string;
    milestone: string;
    tasks: string[];
  }[];
  budget_allocation: Record<string, number>;
  createdAt: Date;
};

type BriefContextType = {
  briefs: WeddingBrief[];
  currentBrief: WeddingBrief | null;
  setCurrentBrief: (brief: WeddingBrief | null) => void;
  addBrief: (brief: WeddingBrief) => void;
  updateBrief: (id: string, updatedBrief: Partial<WeddingBrief>) => void;
  deleteBrief: (id: string) => void;
  generatePlan: (briefId: string) => Promise<void>;
};

const defaultBriefContext: BriefContextType = {
  briefs: [],
  currentBrief: null,
  setCurrentBrief: () => {},
  addBrief: () => {},
  updateBrief: () => {},
  deleteBrief: () => {},
  generatePlan: async () => {},
};

const BriefContext = createContext<BriefContextType>(defaultBriefContext);

export const useBriefContext = () => useContext(BriefContext);

export const BriefContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [briefs, setBriefs] = useState<WeddingBrief[]>([]);
  const [currentBrief, setCurrentBrief] = useState<WeddingBrief | null>(null);

  const addBrief = (brief: WeddingBrief) => {
    setBriefs(prevBriefs => [...prevBriefs, brief]);
  };

  const updateBrief = (id: string, updatedBrief: Partial<WeddingBrief>) => {
    setBriefs(prevBriefs =>
      prevBriefs.map(brief =>
        brief.id === id ? { ...brief, ...updatedBrief } : brief
      )
    );
  };

  const deleteBrief = (id: string) => {
    setBriefs(prevBriefs => prevBriefs.filter(brief => brief.id !== id));
  };

  // This is a mock function that would normally call an API or use AI model
  const generatePlan = async (briefId: string) => {
    const brief = briefs.find(b => b.id === briefId);
    if (!brief) return;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Create a mock generated plan based on the brief
    const mockPlan: WeddingPlan = {
      id: `plan-${Date.now()}`,
      briefId,
      title: `Plan de mariage pour ${brief.couple.name1} & ${brief.couple.name2}`,
      summary: `Un mariage ${brief.preferences.style} avec une thématique ${brief.preferences.theme.join(', ')} 
                durant la période ${brief.preferences.season} avec un budget de ${brief.budget.total}€.`,
      recommendations: [
        {
          category: 'Lieu',
          suggestions: [
            {
              name: 'Domaine des Roses',
              description: 'Lieu champêtre idéal pour un mariage en extérieur',
              estimated_cost: brief.budget.total * 0.4,
            },
            {
              name: 'Château Élégance',
              description: 'Cadre prestigieux avec hébergement sur place',
              estimated_cost: brief.budget.total * 0.5,
            },
          ],
        },
        {
          category: 'Traiteur',
          suggestions: [
            {
              name: 'Saveurs Exquises',
              description: 'Cuisine gastronomique française',
              estimated_cost: brief.budget.total * 0.25,
            },
            {
              name: 'Le Festin',
              description: 'Buffets variés et cuisine du monde',
              estimated_cost: brief.budget.total * 0.2,
            },
          ],
        },
      ],
      timeline: [
        {
          date: '12 mois avant',
          milestone: 'Planification initiale',
          tasks: ['Établir le budget', 'Choisir le lieu', 'Réserver les prestataires clés'],
        },
        {
          date: '6 mois avant',
          milestone: 'Préparatifs intermédiaires',
          tasks: ['Envoyer les faire-part', 'Choisir les tenues', 'Planifier la décoration'],
        },
        {
          date: '1 mois avant',
          milestone: 'Finalisation',
          tasks: ['Confirmer avec tous les prestataires', 'Faire un plan de table', 'Planifier la répétition'],
        },
      ],
      budget_allocation: {
        'Lieu': Math.round(brief.budget.total * 0.4),
        'Traiteur': Math.round(brief.budget.total * 0.25),
        'Décoration': Math.round(brief.budget.total * 0.1),
        'Tenues': Math.round(brief.budget.total * 0.15),
        'Divers': Math.round(brief.budget.total * 0.1),
      },
      createdAt: new Date(),
    };

    // Update the brief with the generated plan
    updateBrief(briefId, { generatedPlan: mockPlan });
  };

  const value = {
    briefs,
    currentBrief,
    setCurrentBrief,
    addBrief,
    updateBrief,
    deleteBrief,
    generatePlan,
  };

  return <BriefContext.Provider value={value}>{children}</BriefContext.Provider>;
};
