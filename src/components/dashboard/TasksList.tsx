
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import ProgressBar from './ProgressBar';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: 'high' | 'medium' | 'low';
  category: 'preparation' | 'vendors' | 'logistics' | 'personal';
  completed: boolean;
}

// Liste des tâches combinant les tâches existantes et celles de la planification
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Définir la date du mariage',
    description: 'Choisir une date définitive pour la cérémonie et la réception',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'preparation',
    completed: false,
  },
  {
    id: '2',
    title: 'Réserver le lieu de réception',
    description: 'Contacter et visiter différents lieux potentiels pour la réception',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'vendors',
    completed: false,
  },
  {
    id: '3',
    title: 'Choisir le traiteur',
    description: 'Organiser des dégustations avec différents traiteurs',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'vendors',
    completed: false,
  },
  {
    id: '4',
    title: 'Planifier la liste d\'invités',
    description: 'Finaliser la liste des personnes à inviter',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'preparation',
    completed: false,
  },
  {
    id: '5',
    title: 'Commander les faire-part',
    description: 'Concevoir et commander les faire-part de mariage',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'personal',
    completed: false,
  },
  // Tâches de la page planification
  {
    id: '6',
    title: "Poser les bases",
    description: "Définir la vision de votre mariage : style, ambiance, type de cérémonie",
    priority: "high",
    category: "preparation",
    completed: false,
  },
  {
    id: '7',
    title: "Estimer le nombre d'invités",
    description: "Même approximatif, cela guidera vos choix logistiques et budgétaires",
    priority: "high",
    category: "preparation",
    completed: false,
  },
  {
    id: '8',
    title: "Calibrer votre budget",
    description: "Évaluer vos moyens et prioriser les postes les plus importants selon vos envies",
    priority: "high",
    category: "preparation",
    completed: false,
  },
  {
    id: '9',
    title: "Choisir une période ou une date cible",
    description: "Cela conditionne les disponibilités des lieux et prestataires",
    priority: "high",
    category: "preparation",
    completed: false,
  },
  {
    id: '10',
    title: "Réserver les prestataires clés",
    description: "Lieu, traiteur, photographe en priorité. Puis DJ, déco, animation, etc",
    priority: "high",
    category: "vendors",
    completed: false,
  }
];

const priorityColorMap = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800',
};

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  
  useEffect(() => {
    // Récupération des tâches depuis le localStorage s'il y en a
    const savedTasks = localStorage.getItem('weddingTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
      setTasks(parsedTasks);
    } else {
      setTasks(initialTasks);
    }
  }, []);
  
  const toggleTaskCompletion = (taskId: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed } 
        : task
    );
    
    setTasks(updatedTasks);
    
    // Sauvegarde dans localStorage
    localStorage.setItem('weddingTasks', JSON.stringify(updatedTasks));
  };
  
  // Calculate progress percentage
  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  
  // Filtrer les tâches à afficher
  const filteredTasks = tasks
    .filter(task => showCompleted ? true : !task.completed)
    .sort((a, b) => {
      // Trier d'abord par complété
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Ensuite par date d'échéance si disponible
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      
      // Enfin par priorité
      const priorityMap = { high: 0, medium: 1, low: 2 };
      return priorityMap[a.priority] - priorityMap[b.priority];
    });
  
  const formatDueDate = (dueDate?: Date) => {
    if (!dueDate) return 'Non défini';
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Demain';
    } else {
      return dueDate.toLocaleDateString();
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Tâches à accomplir</CardTitle>
        <CardDescription>Gérez votre liste de tâches pour votre mariage</CardDescription>
        <ProgressBar percentage={progress} className="mt-2" />
        <div className="flex justify-end mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="show-completed" 
              checked={showCompleted}
              onCheckedChange={() => setShowCompleted(!showCompleted)}
            />
            <label
              htmlFor="show-completed"
              className="text-sm cursor-pointer"
            >
              Afficher les tâches complétées
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Toutes vos tâches sont complétées !
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div key={task.id} className="flex items-start space-x-2 pb-4 border-b last:border-0">
                <Checkbox 
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-base font-medium leading-none cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                    <Badge className={priorityColorMap[task.priority]}>
                      {task.priority === 'high' && 'Priorité haute'}
                      {task.priority === 'medium' && 'Priorité moyenne'}
                      {task.priority === 'low' && 'Priorité basse'}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                    {task.description}
                  </p>
                  
                  {task.dueDate && (
                    <p className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      Échéance : {formatDueDate(task.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksList;
