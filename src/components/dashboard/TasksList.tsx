
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProgressBar from './ProgressBar';

interface Task {
  id: string;
  label: string;
  description: string | null;
  due_date?: Date;
  priority: 'haute' | 'moyenne' | 'basse';
  category: string | null;
  completed: boolean;
  position: number;
}

// Mapping pour les couleurs de priorité
const priorityColorMap = {
  haute: 'bg-red-100 text-red-800',
  moyenne: 'bg-amber-100 text-amber-800',
  basse: 'bg-blue-100 text-blue-800',
};

// Mapping pour le texte de priorité en français
const priorityTextMap = {
  haute: 'Priorité haute',
  moyenne: 'Priorité moyenne',
  basse: 'Priorité basse',
};

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();
  
  useEffect(() => {
    fetchTasks();
    
    // S'abonner aux mises à jour en temps réel
    const channel = supabase
      .channel('todos_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos_planification',
        },
        () => {
          // Rafraîchir les tâches lors d'une modification
          fetchTasks();
        }
      )
      .subscribe();
      
    // Nettoyage à la désactivation du composant
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      
      // Vérifier si l'utilisateur est connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Récupérer les tâches de l'utilisateur depuis Supabase
        const { data: tasksData, error } = await supabase
          .from('todos_planification')
          .select('*')
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        // Formater les dates
        const formattedTasks = tasksData.map((task: any) => ({
          ...task,
          due_date: task.due_date ? new Date(task.due_date) : undefined,
        }));
        
        setTasks(formattedTasks);
      } else {
        // Si l'utilisateur n'est pas connecté, utiliser les données de démonstration
        setTasks([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos tâches",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleTaskCompletion = async (taskId: string) => {
    try {
      // Trouver la tâche à mettre à jour
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (!taskToUpdate) return;
      
      // Mettre à jour l'état local d'abord pour une UI réactive
      const updatedTasks = tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      );
      
      setTasks(updatedTasks);
      
      // Mettre à jour dans Supabase
      const { error } = await supabase
        .from('todos_planification')
        .update({ completed: !taskToUpdate.completed })
        .eq('id', taskId);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche",
        variant: "destructive",
      });
      
      // Revenir à l'état initial en cas d'erreur
      fetchTasks();
    }
  };
  
  // Calculer le pourcentage de progression
  const progress = tasks.length > 0 
    ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
    : 0;
  
  // Filtrer les tâches en fonction des onglets et de l'option "Afficher les tâches complétées"
  const filterTasks = () => {
    return tasks
      .filter(task => {
        // Filtre pour les tâches complétées/non complétées
        if (!showCompleted && task.completed) return false;
        
        // Filtre par catégorie (onglets)
        if (activeTab !== "all" && task.category !== activeTab) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Trier d'abord par complété
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        
        // Ensuite par position (ordre défini dans la page planification)
        return a.position - b.position;
      });
  };
  
  const filteredTasks = filterTasks();
  
  // Extraire les catégories uniques pour les onglets
  const uniqueCategories = Array.from(new Set(tasks.map(task => task.category)))
    .filter(Boolean) as string[];
  
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
        <div className="flex justify-between items-center mt-2">
          {uniqueCategories.length > 0 && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-auto-fit gap-2">
                <TabsTrigger value="all">Toutes</TabsTrigger>
                {uniqueCategories.map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          <div className="flex items-center space-x-2 ml-4">
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
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTasks.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {tasks.length === 0 
                  ? "Aucune tâche disponible. Créez des tâches dans la section Planification." 
                  : "Toutes vos tâches sont complétées !"}
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
                        {task.label}
                      </label>
                      <Badge className={priorityColorMap[task.priority]}>
                        {priorityTextMap[task.priority]}
                      </Badge>
                    </div>
                    
                    <p className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      {task.description || ''}
                    </p>
                    
                    {task.due_date && (
                      <p className={`text-xs ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        Échéance : {formatDueDate(task.due_date)}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksList;
