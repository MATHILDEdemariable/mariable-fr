import React, { createContext, useState, useContext, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  PlanningEvent,
  PlanningCategory,
  PlanningType,
  SerializablePlanningEvent,
  saveGeneratedPlanning
} from '../types/planningTypes';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  [key: string]: string | number | undefined;
  heure_ceremonie?: string;
  type_ceremonie?: string;
  double_ceremonie?: string;
  heure_ceremonie_1?: string;
  type_ceremonie_1?: string;
  heure_ceremonie_2?: string;
  type_ceremonie_2?: string;
  preparatifs_coiffure?: string;
  preparatifs_maquillage?: string;
  preparatifs_habillage?: string;
  trajet_depart_ceremonie?: string | number;
  trajet_retour_ceremonie?: string | number;
  photos_groupe?: string;
  cocktail?: string;
  repas?: string;
  soiree?: string;
}

interface PlanningQuestion {
  option_name: string;
  label: string;
  categorie: PlanningCategory;
  duree_minutes: number;
}

interface PlanningContextProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  planning: PlanningEvent[];
  setPlanning: (planning: PlanningEvent[]) => void;
  generatePlanning: (formData: FormData) => PlanningEvent[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User | null | undefined;
  savePlanningToDatabase: (planning: PlanningEvent[]) => Promise<void>;
}

const PlanningContext = createContext<PlanningContextProps | undefined>(undefined);

const planningQuestions: PlanningQuestion[] = [
  {
    option_name: 'heure_ceremonie',
    label: 'Heure de la cérémonie',
    categorie: 'cérémonie',
    duree_minutes: 60
  },
  {
    option_name: 'type_ceremonie',
    label: 'Type de cérémonie',
    categorie: 'cérémonie',
    duree_minutes: 0
  },
  {
    option_name: 'preparatifs_coiffure',
    label: 'Préparatifs - Coiffure',
    categorie: 'préparatifs_final',
    duree_minutes: 60
  },
  {
    option_name: 'preparatifs_maquillage',
    label: 'Préparatifs - Maquillage',
    categorie: 'préparatifs_final',
    duree_minutes: 45
  },
  {
    option_name: 'preparatifs_habillage',
    label: 'Préparatifs - Habillage',
    categorie: 'préparatifs_final',
    duree_minutes: 30
  },
  {
    option_name: 'trajet_depart_ceremonie',
    label: 'Trajet vers la cérémonie',
    categorie: 'logistique',
    duree_minutes: 30
  },
  {
    option_name: 'trajet_retour_ceremonie',
    label: 'Trajet du lieu de cérémonie au lieu de réception',
    categorie: 'logistique',
    duree_minutes: 30
  },
  {
    option_name: 'photos_groupe',
    label: 'Photos de groupe',
    categorie: 'photos',
    duree_minutes: 30
  },
  {
    option_name: 'cocktail',
    label: 'Cocktail',
    categorie: 'cocktail',
    duree_minutes: 90
  },
  {
    option_name: 'repas',
    label: 'Repas',
    categorie: 'repas',
    duree_minutes: 120
  },
  {
    option_name: 'soiree',
    label: 'Soirée',
    categorie: 'soiree',
    duree_minutes: 240
  },
  {
    option_name: 'double_ceremonie',
    label: 'Avez-vous 2 cérémonies ?',
    categorie: 'ceremonie',
    duree_minutes: 0
  },
  {
    option_name: 'heure_ceremonie_1',
    label: 'Heure de la cérémonie 1',
    categorie: 'cérémonie',
    duree_minutes: 60
  },
  {
    option_name: 'type_ceremonie_1',
    label: 'Type de cérémonie 1',
    categorie: 'cérémonie',
    duree_minutes: 0
  },
  {
    option_name: 'heure_ceremonie_2',
    label: 'Heure de la cérémonie 2',
    categorie: 'cérémonie',
    duree_minutes: 60
  },
  {
    option_name: 'type_ceremonie_2',
    label: 'Type de cérémonie 2',
    categorie: 'cérémonie',
    duree_minutes: 0
  },
  {
    option_name: 'preparatifs_coiffure_1',
    label: 'Préparatifs 1 - Coiffure',
    categorie: 'préparatifs_final',
    duree_minutes: 60
  },
  {
    option_name: 'preparatifs_maquillage_1',
    label: 'Préparatifs 1 - Maquillage',
    categorie: 'préparatifs_final',
    duree_minutes: 45
  },
  {
    option_name: 'preparatifs_habillage_1',
    label: 'Préparatifs 1 - Habillage',
    categorie: 'préparatifs_final',
    duree_minutes: 30
  },
  {
    option_name: 'preparatifs_coiffure_2',
    label: 'Préparatifs 2 - Coiffure',
    categorie: 'préparatifs_final',
    duree_minutes: 60
  },
  {
    option_name: 'preparatifs_maquillage_2',
    label: 'Préparatifs 2 - Maquillage',
    categorie: 'préparatifs_final',
    duree_minutes: 45
  },
  {
    option_name: 'preparatifs_habillage_2',
    label: 'Préparatifs 2 - Habillage',
    categorie: 'préparatifs_final',
    duree_minutes: 30
  },
   {
    option_name: 'trajet_1_depart_ceremonie_1',
    label: 'Trajet 1 - Départ vers la cérémonie 1',
    categorie: 'logistique',
    duree_minutes: 30
  },
  {
    option_name: 'trajet_2_ceremonie_1_arrivee_1',
    label: 'Trajet 2 - De la cérémonie 1 à l\'arrivée 1',
    categorie: 'logistique',
    duree_minutes: 30
  },
  {
    option_name: 'trajet_3_arrivee_1_depart_2',
    label: 'Trajet 3 - De l\'arrivée 1 au départ 2',
    categorie: 'logistique',
    duree_minutes: 30
  },
  {
    option_name: 'trajet_4_depart_ceremonie_2',
    label: 'Trajet 4 - Départ vers la cérémonie 2',
    categorie: 'logistique',
    duree_minutes: 30
  },
];

const getEventType = (category: PlanningCategory): PlanningType => {
  switch (category) {
    case 'cérémonie':
      return 'ceremony';
    case 'préparatifs_final':
      return 'preparation';
    case 'photos':
      return 'couple_photos';
    case 'cocktail':
      return 'cocktail';
    case 'repas':
      return 'dinner';
    case 'soiree':
      return 'party';
    case 'logistique':
      return 'travel';
    default:
      return 'custom';
  }
};

const isHighlightEvent = (category: PlanningCategory): boolean => {
  return category === 'cérémonie';
};

export const PlanningProvider: React.FC<{ children: React.ReactNode; user?: User | null }> = ({ children, user }) => {
  const [formData, setFormData] = useState<FormData>({});
  const [planning, setPlanning] = useState<PlanningEvent[]>([]);
  const [activeTab, setActiveTab] = useState<string>("form");
  const { toast } = useToast();

  useEffect(() => {
    const storedFormData = localStorage.getItem('planningFormData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('planningFormData', JSON.stringify(formData));
    const generatedPlanning = generatePlanning(formData);
    setPlanning(generatedPlanning);
  }, [formData]);

  const generatePlanning = (formData: FormData): PlanningEvent[] => {
    console.log('Generating planning with formData:', formData);
    
    const events: PlanningEvent[] = [];
    let currentTime = new Date();
    
    // Détecter si double cérémonie
    const isDualCeremony = formData.double_ceremonie === 'oui';
    console.log('Is dual ceremony:', isDualCeremony);
    
    // Définir l'ordre des catégories selon le nombre de cérémonies
    let categoryOrder: string[];
    
    if (isDualCeremony) {
      categoryOrder = [
        'préparatifs_final_1',
        'logistique_trajet_1',
        'cérémonie_1',
        'logistique_trajet_2',
        'logistique_trajet_3',
        'préparatifs_final_2',
        'logistique_trajet_4',
        'cérémonie_2',
        'photos',
        'cocktail',
        'repas',
        'soiree'
      ];
    } else {
      categoryOrder = [
        'préparatifs_final',
        'logistique_trajet_depart',
        'cérémonie',
        'logistique_trajet_retour',
        'photos',
        'cocktail',
        'repas',
        'soiree'
      ];
    }
    
    // Set start time based on first ceremony
    const firstCeremonyTime = isDualCeremony ? formData.heure_ceremonie_1 : formData.heure_ceremonie;
    if (firstCeremonyTime) {
      const [hours, minutes] = firstCeremonyTime.split(':').map(Number);
      currentTime = new Date();
      currentTime.setHours(hours, minutes, 0, 0);
      // Start 3 hours before ceremony for preparations
      currentTime = addMinutes(currentTime, -180);
    }

    // Create events based on form data
    Object.entries(formData).forEach(([key, value]) => {
      if (value && (typeof value === 'string' || typeof value === 'number') && value !== 'non') {
        const question = planningQuestions.find(q => q.option_name === key);
        if (question) {
          const event: PlanningEvent = {
            id: uuidv4(),
            title: question.label,
            category: question.categorie as PlanningCategory,
            startTime: new Date(currentTime),
            endTime: addMinutes(currentTime, question.duree_minutes),
            duration: question.duree_minutes,
            type: getEventType(question.categorie),
            isHighlight: isHighlightEvent(question.categorie),
            notes: typeof value === 'string' && value !== 'oui' ? value : undefined
          };

          // Assigner les bonnes catégories selon le contexte
          if (isDualCeremony) {
            // Logique pour double cérémonie
            if (key === 'preparatifs_coiffure_1' || key === 'preparatifs_maquillage_1' || key === 'preparatifs_habillage_1') {
              event.category = 'préparatifs_final_1';
            } else if (key === 'preparatifs_coiffure_2' || key === 'preparatifs_maquillage_2' || key === 'preparatifs_habillage_2') {
              event.category = 'préparatifs_final_2';
            } else if (key === 'trajet_1_depart_ceremonie_1') {
              event.category = 'logistique_trajet_1';
            } else if (key === 'trajet_2_ceremonie_1_arrivee_1') {
              event.category = 'logistique_trajet_2';
            } else if (key === 'trajet_3_arrivee_1_depart_2') {
              event.category = 'logistique_trajet_3';
            } else if (key === 'trajet_4_depart_ceremonie_2') {
              event.category = 'logistique_trajet_4';
            } else if (key === 'heure_ceremonie_1' || key === 'type_ceremonie_1') {
              event.category = 'cérémonie_1';
            } else if (key === 'heure_ceremonie_2' || key === 'type_ceremonie_2') {
              event.category = 'cérémonie_2';
            }
          } else {
            // Logique pour cérémonie unique
            if (key === 'preparatifs_coiffure' || key === 'preparatifs_maquillage' || key === 'preparatifs_habillage') {
              event.category = 'préparatifs_final';
            } else if (key === 'trajet_depart_ceremonie') {
              event.category = 'logistique_trajet_depart';
            } else if (key === 'trajet_retour_ceremonie') {
              event.category = 'logistique_trajet_retour';
            } else if (key === 'heure_ceremonie' || key === 'type_ceremonie') {
              event.category = 'cérémonie';
            }
          }

          events.push(event);
        }
      }
    });

    // Sort events by category order
    events.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category);
      const bIndex = categoryOrder.indexOf(b.category);
      return aIndex - bIndex;
    });

    // Recalculate times based on sorted order
    events.forEach((event, index) => {
      if (index === 0) {
        // Keep the start time for first event
        event.startTime = currentTime;
      } else {
        // Start after previous event with 5 minute buffer
        const previousEvent = events[index - 1];
        event.startTime = addMinutes(previousEvent.endTime, 5);
      }
      event.endTime = addMinutes(event.startTime, event.duration);
    });

    console.log('Generated events:', events);
    return events;
  };

  const savePlanningToDatabase = async (planning: PlanningEvent[]) => {
    if (!user) {
      toast({
        title: "Vous devez être connecté",
        description: "Veuillez vous connecter pour sauvegarder votre planning.",
      });
      return;
    }

    try {
      await saveGeneratedPlanning(
        supabase,
        user.id,
        formData,
        planning
      );

      toast({
        title: "Planning sauvegardé",
        description: "Votre planning a été sauvegardé avec succès.",
      });
    } catch (error) {
      console.error("Error saving planning:", error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Une erreur s'est produite lors de la sauvegarde de votre planning.",
        variant: "destructive",
      });
    }
  };

  const contextValue: PlanningContextProps = {
    formData,
    setFormData,
    planning,
    setPlanning,
    generatePlanning,
    activeTab,
    setActiveTab,
    user,
    savePlanningToDatabase,
  };

  return (
    <PlanningContext.Provider value={contextValue}>
      {children}
    </PlanningContext.Provider>
  );
};

export const usePlanning = () => {
  const context = useContext(PlanningContext);
  if (!context) {
    throw new Error("usePlanning must be used within a PlanningProvider");
  }
  return context;
};
