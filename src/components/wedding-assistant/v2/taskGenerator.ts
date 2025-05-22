
import { PlanningResult } from './types';
import { v4 as uuidv4 } from 'uuid';

// Types for tasks to create in Supabase
interface Task {
  id: string;
  label: string;
  description: string | null;
  priority: 'haute' | 'moyenne' | 'basse';
  category: string;
  position: number;
  completed: boolean;
  due_date?: string | null;
}

// Define tasks for each preparation level
const beginnerTasks: Omit<Task, 'id' | 'user_id'>[] = [
  {
    label: "Définir un budget approximatif",
    description: "Discuter avec votre partenaire et les personnes qui pourraient contribuer financièrement",
    priority: "haute",
    category: "Budget",
    position: 1,
    completed: false,
  },
  {
    label: "Créer une liste d'invités préliminaire",
    description: "Estimer le nombre d'invités pour avoir une idée de la taille du lieu nécessaire",
    priority: "haute",
    category: "Invités",
    position: 2,
    completed: false,
  },
  {
    label: "Rechercher des lieux de réception potentiels",
    description: "Faire une liste de lieux qui correspondent à votre budget et au nombre d'invités estimé",
    priority: "haute",
    category: "Réception",
    position: 3,
    completed: false,
  },
  {
    label: "Établir une timeline pour la planification",
    description: "Définir les grandes étapes et échéances pour votre organisation",
    priority: "haute", 
    category: "Organisation Générale",
    position: 4,
    completed: false,
  },
  {
    label: "Réfléchir au style de votre mariage",
    description: "Créer un moodboard ou un dossier d'inspiration",
    priority: "moyenne",
    category: "Organisation Générale",
    position: 5,
    completed: false,
  }
];

const intermediateTasks: Omit<Task, 'id' | 'user_id'>[] = [
  {
    label: "Finaliser votre budget détaillé",
    description: "Répartir le budget par poste de dépense",
    priority: "haute",
    category: "Budget",
    position: 1,
    completed: false,
  },
  {
    label: "Confirmer le lieu de réception",
    description: "Signer le contrat et verser l'acompte",
    priority: "haute",
    category: "Réception",
    position: 2,
    completed: false,
  },
  {
    label: "Sélectionner vos prestataires principaux",
    description: "Traiteur, photographe, DJ/orchestre",
    priority: "haute",
    category: "Prestataires",
    position: 3,
    completed: false,
  },
  {
    label: "Planifier la cérémonie",
    description: "Confirmer le lieu, l'officiant et l'horaire",
    priority: "moyenne",
    category: "Cérémonie",
    position: 4,
    completed: false,
  },
  {
    label: "Commander vos faire-part",
    description: "Finaliser le design et le texte",
    priority: "moyenne",
    category: "Invités",
    position: 5,
    completed: false,
  },
  {
    label: "Choisir les tenues des mariés",
    description: "Prendre rendez-vous pour les essayages",
    priority: "moyenne",
    category: "Mariés",
    position: 6,
    completed: false,
  }
];

const advancedTasks: Omit<Task, 'id' | 'user_id'>[] = [
  {
    label: "Finaliser tous les détails avec vos prestataires",
    description: "Confirmer les horaires, menus, et autres détails spécifiques",
    priority: "haute",
    category: "Prestataires",
    position: 1,
    completed: false,
  },
  {
    label: "Créer un planning détaillé du jour J",
    description: "Minute par minute, de la préparation jusqu'à la fin de la soirée",
    priority: "haute",
    category: "Organisation Générale",
    position: 2,
    completed: false,
  },
  {
    label: "Organiser une répétition de la cérémonie",
    description: "Avec les témoins et personnes importantes",
    priority: "moyenne",
    category: "Cérémonie",
    position: 3,
    completed: false,
  },
  {
    label: "Finaliser le plan de table",
    description: "En fonction des confirmations de présence",
    priority: "moyenne",
    category: "Invités",
    position: 4,
    completed: false,
  },
  {
    label: "Derniers essayages des tenues",
    description: "Avec tous les accessoires",
    priority: "moyenne",
    category: "Mariés",
    position: 5,
    completed: false,
  }
];

// Function to generate tasks based on quiz score
export function generateTasksFromQuizResult(result: PlanningResult): Task[] {
  let tasks: Omit<Task, 'id' | 'user_id'>[] = [];
  
  // Determine which tasks to add based on status
  if (result.status.includes("Débutant") || result.score <= 3) {
    tasks = [...beginnerTasks];
  } else if (result.status.includes("Intermédiaire") || (result.score > 3 && result.score <= 7)) {
    tasks = [...intermediateTasks];
  } else {
    tasks = [...advancedTasks];
  }
  
  // Add specific tasks based on recommended categories
  result.categories.forEach(category => {
    // Add specific tasks for each category if needed
    if (category === "Organisation générale" && !tasks.some(t => t.category === "Organisation Générale")) {
      tasks.push({
        label: "Créer un calendrier de planification",
        description: "Définir les échéances pour chaque étape importante",
        priority: "haute",
        category: "Organisation Générale",
        position: tasks.length + 1,
        completed: false,
      });
    }
  });
  
  // Add a unique ID to each task
  return tasks.map(task => ({
    ...task,
    id: uuidv4(),
  }));
}
