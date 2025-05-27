
import { PlanningResult, GeneratedTask } from './types';
import { v4 as uuidv4 } from 'uuid';

// Définir les tâches pour chaque niveau de préparation
const beginnerTasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [
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

const intermediateTasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [
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

const advancedTasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [
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

// Fonction pour générer des tâches additionnelles basées sur les objectifs
const generateTasksFromObjectives = (objectives: string[]): Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] => {
  const objectiveTasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [];
  let position = 1;
  
  objectives.forEach(objective => {
    // Convertir l'objectif en tâche
    const taskFromObjective: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'> = {
      label: objective,
      description: `Objectif généré à partir de votre quiz: ${objective}`,
      priority: "haute",
      category: "Objectifs Quiz",
      position: position++,
      completed: false,
    };
    
    objectiveTasks.push(taskFromObjective);
  });
  
  return objectiveTasks;
};

// Fonction pour générer des tâches en fonction des catégories
const generateTasksFromCategories = (categories: string[]): Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] => {
  const categoryTasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [];
  let position = 1;
  
  // Mapping des catégories vers des tâches spécifiques
  const categoryTaskMapping: Record<string, Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[]> = {
    "Budget": [
      {
        label: "Établir votre budget global",
        description: "Déterminez combien vous pouvez dépenser au total pour votre mariage",
        priority: "haute",
        category: "Budget",
        position: position++,
        completed: false,
      },
      {
        label: "Créer une ventilation du budget par poste",
        description: "Répartissez votre budget entre les différentes catégories de dépenses",
        priority: "haute",
        category: "Budget",
        position: position++,
        completed: false,
      }
    ],
    "Organisation générale": [
      {
        label: "Créer un calendrier de planification",
        description: "Établissez un calendrier avec toutes les étapes importantes jusqu'au jour J",
        priority: "haute",
        category: "Organisation Générale",
        position: position++,
        completed: false,
      },
      {
        label: "Définir le style et le thème de votre mariage",
        description: "Choisissez les couleurs, l'ambiance et le style qui reflètent votre personnalité",
        priority: "moyenne",
        category: "Organisation Générale",
        position: position++,
        completed: false,
      }
    ],
    "Invités": [
      {
        label: "Finaliser la liste des invités",
        description: "Confirmez le nombre final d'invités et leurs coordonnées",
        priority: "haute",
        category: "Invités",
        position: position++,
        completed: false,
      },
      {
        label: "Préparer et envoyer les faire-part",
        description: "Concevez, commandez et envoyez vos invitations",
        priority: "moyenne",
        category: "Invités",
        position: position++,
        completed: false,
      }
    ],
    "Réception": [
      {
        label: "Réserver le lieu de réception",
        description: "Visitez et réservez le lieu qui correspond à vos attentes et à votre budget",
        priority: "haute",
        category: "Réception",
        position: position++,
        completed: false,
      },
      {
        label: "Choisir le menu et le service de traiteur",
        description: "Organisez des dégustations et sélectionnez votre traiteur",
        priority: "haute",
        category: "Réception",
        position: position++,
        completed: false,
      }
    ],
    "Cérémonie": [
      {
        label: "Organiser la cérémonie",
        description: "Réservez le lieu et l'officiant pour votre cérémonie",
        priority: "haute",
        category: "Cérémonie",
        position: position++,
        completed: false,
      },
      {
        label: "Planifier le déroulement de la cérémonie",
        description: "Définissez le programme, les lectures, la musique et les moments clés",
        priority: "moyenne",
        category: "Cérémonie",
        position: position++,
        completed: false,
      }
    ]
  };
  
  // Pour chaque catégorie identifiée, ajouter les tâches correspondantes
  categories.forEach(category => {
    const normalizedCategory = category.trim().toLowerCase();
    
    // Trouver la clé qui correspond le mieux dans notre mapping
    const matchingKey = Object.keys(categoryTaskMapping).find(key => 
      key.toLowerCase().includes(normalizedCategory) || normalizedCategory.includes(key.toLowerCase())
    );
    
    if (matchingKey) {
      // Ajouter les tâches correspondantes avec position incrémentée
      categoryTaskMapping[matchingKey].forEach(task => {
        categoryTasks.push({
          ...task,
          position: position++
        });
      });
    }
  });
  
  return categoryTasks;
};

// Main function to generate tasks - this was missing the export!
export function generateTasks(answers: Record<string, any>, result: PlanningResult): GeneratedTask[] {
  let tasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [];
  
  // Déterminer les tâches de base en fonction du statut/score
  if (result.status.includes("Débutant") || result.score <= 3) {
    tasks = [...beginnerTasks];
  } else if (result.status.includes("Intermédiaire") || (result.score > 3 && result.score <= 7)) {
    tasks = [...intermediateTasks];
  } else {
    tasks = [...advancedTasks];
  }
  
  // Ajouter des tâches spécifiques basées sur les objectifs
  const objectiveTasks = generateTasksFromObjectives(result.objectives);
  tasks = [...tasks, ...objectiveTasks];
  
  // Ajouter des tâches spécifiques basées sur les catégories
  const categoryTasks = generateTasksFromCategories(result.categories);
  tasks = [...tasks, ...categoryTasks];
  
  // Mettre à jour les positions pour éviter les doublons
  tasks = tasks.map((task, index) => ({
    ...task,
    position: index + 1
  }));
  
  // Ajouter un ID unique à chaque tâche
  return tasks.map(task => ({
    ...task,
    id: uuidv4(),
  }));
}

// Fonction pour générer des tâches en fonction du score du quiz
export function generateTasksFromQuizResult(result: PlanningResult): GeneratedTask[] {
  let tasks: Omit<GeneratedTask, 'id' | 'user_id' | 'quiz_result_id'>[] = [];
  
  // Déterminer les tâches de base en fonction du statut/score
  if (result.status.includes("Débutant") || result.score <= 3) {
    tasks = [...beginnerTasks];
  } else if (result.status.includes("Intermédiaire") || (result.score > 3 && result.score <= 7)) {
    tasks = [...intermediateTasks];
  } else {
    tasks = [...advancedTasks];
  }
  
  // Ajouter des tâches spécifiques basées sur les objectifs
  const objectiveTasks = generateTasksFromObjectives(result.objectives);
  tasks = [...tasks, ...objectiveTasks];
  
  // Ajouter des tâches spécifiques basées sur les catégories
  const categoryTasks = generateTasksFromCategories(result.categories);
  tasks = [...tasks, ...categoryTasks];
  
  // Mettre à jour les positions pour éviter les doublons
  tasks = tasks.map((task, index) => ({
    ...task,
    position: index + 1
  }));
  
  // Ajouter un ID unique à chaque tâche
  return tasks.map(task => ({
    ...task,
    id: uuidv4(),
  }));
}
