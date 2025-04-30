
import React, { useState } from 'react';
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

// Combined sample tasks from dashboard and planning sections
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Définir la date du mariage',
    description: 'Choisir une date définitive pour la cérémonie et la réception',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'preparation',
    completed: true,
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
    completed: true,
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
  {
    id: '6',
    title: 'Calibrer votre budget',
    description: 'Évaluez vos moyens et priorisez les postes les plus importants selon vos envies',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'preparation',
    completed: false,
  },
  {
    id: '7',
    title: 'Réserver les prestataires clés',
    description: 'Lieu, traiteur, photographe en priorité. Puis DJ, déco, animation, etc.',
    dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    priority: 'high',
    category: 'vendors',
    completed: false,
  },
  {
    id: '8',
    title: 'Gérer les démarches officielles',
    description: 'Mairie, cérémonies religieuses ou laïques, contrats, assurances, etc.',
    dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'logistics',
    completed: false,
  },
  {
    id: '9',
    title: 'Anticiper la coordination du jour J',
    description: 'Prévoyez la logistique (transport, hébergements) et les temps forts',
    dueDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    category: 'logistics',
    completed: false,
  },
];

const priorityColorMap = {
  high: 'bg-wedding-cream text-wedding-olive',
  medium: 'bg-wedding-cream/70 text-wedding-olive/90',
  low: 'bg-wedding-cream/50 text-wedding-olive/80',
};

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [showCompleted, setShowCompleted] = useState<boolean>(true);
  
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };
  
  // Calculate progress percentage
  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  
  // Get tasks sorted by priority and due date
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then sort by due date if both have dates
    if (a.dueDate && b.dueDate) {
      return a.dueDate.getTime() - b.dueDate.getTime();
    }
    
    // Tasks with due dates come before tasks without
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    
    return 0;
  });
  
  // Filter tasks based on showCompleted setting
  const filteredTasks = showCompleted 
    ? sortedTasks 
    : sortedTasks.filter(task => !task.completed);
  
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
    <Card className="bg-white border-wedding-olive/20">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Tâches à accomplir</CardTitle>
        <CardDescription>Gérez votre liste de tâches pour votre mariage</CardDescription>
        <ProgressBar percentage={progress} className="mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <div className="text-sm flex items-center">
            <span className="mr-2">Afficher les tâches complétées</span>
            <Checkbox 
              id="show-completed"
              checked={showCompleted} 
              onCheckedChange={() => setShowCompleted(!showCompleted)}
            />
          </div>
        </div>
      
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              {showCompleted 
                ? "Aucune tâche pour le moment" 
                : "Toutes vos tâches sont complétées !"}
            </p>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-start space-x-2 pb-4 border-b last:border-0 ${
                  task.completed ? 'opacity-70' : ''
                }`}
              >
                <Checkbox 
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={() => toggleTaskCompletion(task.id)}
                />
                
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between">
                    <label
                      htmlFor={`task-${task.id}`}
                      className={`text-base font-medium leading-none cursor-pointer ${
                        task.completed ? 'line-through text-muted-foreground' : ''
                      }`}
                    >
                      {task.title}
                    </label>
                    <Badge className={priorityColorMap[task.priority]}>
                      {task.priority === 'high' && 'Priorité haute'}
                      {task.priority === 'medium' && 'Priorité moyenne'}
                      {task.priority === 'low' && 'Priorité basse'}
                    </Badge>
                  </div>
                  
                  <p className={`text-sm ${
                    task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                  }`}>
                    {task.description}
                  </p>
                  
                  {task.dueDate && (
                    <p className={`text-xs ${
                      task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'
                    }`}>
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
