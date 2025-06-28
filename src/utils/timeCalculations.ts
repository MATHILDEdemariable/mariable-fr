
export const normalizeTimeString = (time: string): string => {
  if (!time) return "09:00";
  // Ensure format HH:MM
  const parts = time.split(':');
  const hours = parts[0]?.padStart(2, '0') || '09';
  const minutes = parts[1]?.padStart(2, '0') || '00';
  return `${hours}:${minutes}`;
};

export const addMinutesToTime = (time: string, minutes: number): string => {
  if (!time) return "09:00";
  
  const [hours, mins] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  
  return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
};

export const calculateEndTime = (startTime: string, duration: number): string => {
  return addMinutesToTime(startTime, duration);
};

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Fonction pour recalculer automatiquement une timeline
export const recalculateTaskTimeline = (tasks: any[]): any[] => {
  if (tasks.length === 0) return [];
  
  // Commencer à 9h ou à l'heure de la première tâche si elle existe
  let currentTime = tasks[0]?.start_time || "09:00";
  
  return tasks.map((task, index) => {
    const updatedTask = { ...task };
    
    // Pour la première tâche, garder son heure de début
    if (index === 0) {
      updatedTask.start_time = currentTime;
    } else {
      // Pour les autres, utiliser l'heure courante calculée
      updatedTask.start_time = currentTime;
    }
    
    // Calculer l'heure de fin
    const endTime = calculateEndTime(updatedTask.start_time, task.duration);
    
    // Ajouter un buffer intelligent selon le type de tâche
    const buffer = getBufferTime(task);
    currentTime = addMinutesToTime(endTime, buffer);
    
    return updatedTask;
  });
};

// Buffer intelligent selon le type de tâche
const getBufferTime = (task: any): number => {
  const category = task.category?.toLowerCase() || '';
  
  if (category.includes('cérémonie')) return 15;
  if (category.includes('photos')) return 10;
  if (category.includes('cocktail')) return 5;
  if (category.includes('repas')) return 10;
  if (category.includes('logistique')) return 0;
  
  return 5; // Buffer par défaut
};
