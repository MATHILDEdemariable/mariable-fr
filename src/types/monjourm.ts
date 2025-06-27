
// Types centralisés pour Mon Jour-M
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
  start_time?: string;
  end_time?: string;
  duration: number;
  category: string;
  priority: "low" | "medium" | "high";
  assigned_to: string[];
  position: number;
  is_ai_generated?: boolean;
  is_manual_time?: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  type: 'person' | 'vendor';
  prestataire_id?: string;
  notes?: string;
}

// Types de formulaires
export interface TaskFormData {
  title: string;
  description: string;
  start_time: string;
  duration: number;
  category: string;
  priority: "low" | "medium" | "high";
  assigned_to: string[];
  is_manual_time: boolean;
}

export interface TeamMemberFormData {
  name: string;
  role: string;
  email: string;
  phone: string;
  type: 'person' | 'vendor';
  notes: string;
}

// Catégories disponibles
export const categories = [
  'Général',
  'Cérémonie',
  'Réception',
  'Photographie',
  'Musique',
  'Décoration',
  'Traiteur',
  'Transport',
  'Hébergement',
  'Animation',
  'Coiffure/Maquillage',
  'Fleurs',
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
  
  if (timeString.includes('T')) {
    try {
      const date = new Date(timeString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('Erreur parsing timestamp:', error);
      return "09:00";
    }
  }
  
  return "09:00";
};

export const addMinutesToTime = (timeString: string, minutes: number): string => {
  if (!timeString || !minutes) return timeString;
  
  try {
    const normalizedTime = normalizeTimeString(timeString);
    const [hour, minute] = normalizedTime.split(':').map(Number);
    
    const totalMinutes = hour * 60 + minute + minutes;
    const newHour = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    
    return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
  } catch (error) {
    console.error('Erreur lors du calcul du temps:', error);
    return timeString;
  }
};

// Nouvelle fonction pour recalculer automatiquement la timeline
export const recalculateTimeline = (tasks: PlanningTask[]): PlanningTask[] => {
  const sortedTasks = [...tasks].sort((a, b) => a.position - b.position);
  
  let currentTime = sortedTasks.length > 0 ? sortedTasks[0].start_time || '09:00' : '09:00';
  
  return sortedTasks.map((task, index) => {
    if (index === 0) {
      // La première tâche garde son heure de début
      currentTime = task.start_time || '09:00';
    } else {
      // Les tâches suivantes commencent à la fin de la précédente
      task.start_time = currentTime;
    }
    
    // Calculer l'heure de fin et préparer pour la suivante
    const endTime = addMinutesToTime(currentTime, task.duration);
    task.end_time = endTime;
    currentTime = endTime;
    
    return task;
  });
};
