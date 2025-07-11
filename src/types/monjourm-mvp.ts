
// Types simplifiés pour Mon Jour-M MVP
export interface WeddingCoordination {
  id: string;
  title: string;
  description?: string;
  wedding_date?: string;
  wedding_location?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  duration: number;
  category: string;
  priority: "low" | "medium" | "high";
  assigned_role?: string; // Changement : assigné à un rôle au lieu d'une personne
  position: number;
  is_ai_generated?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string; // Un des rôles prédéfinis
  email?: string;
  phone?: string;
  notes?: string;
}

// Rôles prédéfinis pour simplifier l'assignation
export const PREDEFINED_ROLES = [
  'Mariés',
  'Témoin(s)',
  'Famille proche',
  'Wedding Planner',
  'Photographe',
  'Vidéaste',
  'DJ/Musiciens',
  'Traiteur',
  'Fleuriste',
  'Coiffeur/Maquilleur',
  'Célébrant',
  'Responsable lieu',
  'Sécurité',
  'Transport',
  'Autre'
];

// Catégories simplifiées
export const TASK_CATEGORIES = [
  'Arrivée',
  'Préparation',
  'Cérémonie',
  'Cocktail',
  'Réception',
  'Animation',
  'Photos/Vidéos',
  'Logistique',
  'Autre'
];

// Fonctions utilitaires
export const normalizeTimeString = (timeString: string): string => {
  if (!timeString) return "09:00";
  
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return timeString;
    }
  }
  
  return "09:00";
};

export const addMinutesToTime = (timeString: string, minutes: number): string => {
  if (!timeString || !minutes) return timeString;
  
  try {
    const [hour, minute] = timeString.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + minutes;
    const newHour = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    
    return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
  } catch (error) {
    return timeString;
  }
};
