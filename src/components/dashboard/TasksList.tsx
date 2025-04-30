
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

// Sample tasks
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Définir la date du mariage',
    description: 'Choisir une date définitive pour la cérémonie et la réception',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    priority: 'high',
    category: 'preparation',
    completed: true,
  },
  {
    id: '2',
    title: 'Réserver le lieu de réception',
    description: 'Contacter et visiter différents lieux potentiels pour la réception',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    priority: 'high',
    category: 'vendors',
    completed: false,
  },
  {
    id: '3',
    title: 'Choisir le traiteur',
    description: 'Organiser des dégustations avec différents traiteurs',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 month from now
    priority: 'high',
    category: 'vendors',
    completed: false,
  },
  {
    id: '4',
    title: 'Planifier la liste d\'invités',
    description: 'Finaliser la liste des personnes à inviter',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    priority: 'medium',
    category: 'preparation',
    completed: true,
  },
  {
    id: '5',
    title: 'Commander les faire-part',
    description: 'Concevoir et commander les faire-part de mariage',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    priority: 'medium',
    category: 'personal',
    completed: false,
  },
];

const priorityColorMap = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800',
};

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  
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
  
  // Get upcoming tasks (incomplete tasks ordered by due date)
  const upcomingTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.getTime() - b.dueDate.getTime();
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              Toutes vos tâches sont complétées !
            </p>
          ) : (
            upcomingTasks.slice(0, 5).map((task) => (
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
                      className="text-base font-medium leading-none cursor-pointer"
                    >
                      {task.title}
                    </label>
                    <Badge className={priorityColorMap[task.priority]}>
                      {task.priority === 'high' && 'Priorité haute'}
                      {task.priority === 'medium' && 'Priorité moyenne'}
                      {task.priority === 'low' && 'Priorité basse'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{task.description}</p>
                  
                  {task.dueDate && (
                    <p className="text-xs text-muted-foreground">
                      Échéance : {formatDueDate(task.dueDate)}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
          
          {upcomingTasks.length > 5 && (
            <p className="text-center text-sm text-muted-foreground pt-2">
              + {upcomingTasks.length - 5} autres tâches à accomplir
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksList;
