
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Filter } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ProgressBar from './ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';

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

interface QuizScore {
  email: string;
  quiz_score: number;
  quiz_status: string;
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
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['haute', 'moyenne', 'basse']);
  const { toast } = useToast();
  
  // Fetch user's quiz score to adjust task prioritization
  const { data: quizData } = useQuery({
    queryKey: ['userQuizScore'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user?.email) return null;
      
      const { data } = await supabase
        .from('quiz_email_captures')
        .select('email, quiz_score, quiz_status')
        .eq('email', userData.user.email)
        .single();
        
      return data as QuizScore;
    }
  });
  
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
          .eq('user_id', user.id)
          .order('position', { ascending: true });
          
        if (error) throw error;
        
        // Formater les dates
        const formattedTasks = tasksData.map((task: any) => ({
          ...task,
          due_date: task.due_date ? new Date(task.due_date) : undefined,
        }));
        
        // Trier les tâches en fonction du score du quiz si disponible
        let sortedTasks = formattedTasks;
        if (quizData?.quiz_score !== undefined) {
          // Ajustement des priorités ou de l'ordre en fonction du score du quiz
          // Plus le score est élevé, plus l'utilisateur a besoin d'aide structurée
          sortedTasks = sortTasksByQuizScore(formattedTasks, quizData.quiz_score, quizData.quiz_status);
        }
        
        setTasks(sortedTasks);
      } else {
        // Si l'utilisateur n'est pas connecté
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
  
  // Fonction pour ajuster les tâches en fonction du score du quiz
  const sortTasksByQuizScore = (tasks: Task[], score: number, status: string) => {
    // Exemple simple: si score élevé (besoin d'aide), mettre en avant les tâches administratives
    // Si score faible (indépendant), mettre en avant les tâches créatives
    
    // Définir des coefficients de boost pour chaque catégorie en fonction du score
    const categoryBoosts: Record<string, number> = {};
    
    if (score > 80) {
      // Utilisateur ayant besoin de beaucoup d'aide -> mettre l'accent sur la structure
      categoryBoosts['Administration'] = 2;
      categoryBoosts['Budget'] = 2;
      categoryBoosts['Planning'] = 1.5;
    } else if (score > 50) {
      // Utilisateur intermédiaire -> équilibre
      categoryBoosts['Décoration'] = 1.3;
      categoryBoosts['Planning'] = 1.3;
    } else {
      // Utilisateur indépendant -> mettre l'accent sur les aspects créatifs
      categoryBoosts['Décoration'] = 1.5;
      categoryBoosts['Animation'] = 1.5;
      categoryBoosts['Personnalisation'] = 2;
    }
    
    // Appliquer un boost virtuel à la position des tâches pour le tri
    return [...tasks].sort((a, b) => {
      // D'abord trier par complété
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      
      // Ensuite appliquer les boosts de catégorie
      const boostA = categoryBoosts[a.category || ''] || 1;
      const boostB = categoryBoosts[b.category || ''] || 1;
      
      // Position ajustée par le boost
      const adjustedPositionA = a.position / boostA;
      const adjustedPositionB = b.position / boostB;
      
      return adjustedPositionA - adjustedPositionB;
    });
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
  
  const togglePriority = (priority: string) => {
    if (selectedPriorities.includes(priority)) {
      setSelectedPriorities(selectedPriorities.filter(p => p !== priority));
    } else {
      setSelectedPriorities([...selectedPriorities, priority]);
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
        
        // Filtre par priorité
        if (!selectedPriorities.includes(task.priority)) return false;
        
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

  // Grouper les tâches par catégorie pour un affichage plus structuré
  const groupTasksByCategory = () => {
    const groupedTasks: Record<string, Task[]> = {};
    
    filteredTasks.forEach(task => {
      const category = task.category || 'Sans catégorie';
      if (!groupedTasks[category]) {
        groupedTasks[category] = [];
      }
      groupedTasks[category].push(task);
    });
    
    return groupedTasks;
  };
  
  const groupedTasks = groupTasksByCategory();
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Tâches à accomplir</CardTitle>
        <CardDescription>Gérez votre liste de tâches pour votre mariage</CardDescription>
        <ProgressBar percentage={progress} className="mt-2 h-2" />
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
          {uniqueCategories.length > 0 && (
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab} 
              className="w-full sm:max-w-[70%]"
            >
              <TabsList className="grid grid-cols-2 sm:flex sm:flex-wrap sm:gap-1">
                <TabsTrigger value="all" className="text-xs sm:text-sm">Toutes</TabsTrigger>
                {uniqueCategories.slice(0, 4).map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-xs sm:text-sm"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </TabsTrigger>
                ))}
                {uniqueCategories.length > 4 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                        Plus <Filter className="h-3 w-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {uniqueCategories.slice(4).map(category => (
                        <DropdownMenuCheckboxItem
                          key={category}
                          checked={activeTab === category}
                          onCheckedChange={() => setActiveTab(category)}
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TabsList>
            </Tabs>
          )}
          
          {/* Filtres et options */}
          <div className="flex items-center gap-2 sm:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  Priorité <Filter className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {['haute', 'moyenne', 'basse'].map(priority => (
                  <DropdownMenuCheckboxItem
                    key={priority}
                    checked={selectedPriorities.includes(priority)}
                    onCheckedChange={() => togglePriority(priority)}
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${priorityColorMap[priority as keyof typeof priorityColorMap].split(' ')[0]}`}></span>
                    {priorityTextMap[priority as keyof typeof priorityTextMap]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-completed" 
                checked={showCompleted}
                onCheckedChange={() => setShowCompleted(!showCompleted)}
                className="h-3 w-3 sm:h-4 sm:w-4"
              />
              <label
                htmlFor="show-completed"
                className="text-xs sm:text-sm cursor-pointer"
              >
                Complétées
              </label>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
          </div>
        ) : (
          <div className="space-y-6">
            {Object.keys(groupedTasks).length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">
                {tasks.length === 0 
                  ? "Aucune tâche disponible. Complétez le quiz de planification pour obtenir votre plan personnalisé." 
                  : "Toutes vos tâches sont complétées !"}
              </p>
            ) : (
              Object.entries(groupedTasks).map(([category, categoryTasks]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider border-b pb-1">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {categoryTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-start space-x-3 p-3 rounded-lg border ${
                          task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-gray-300'
                        } transition-all`}
                      >
                        <Checkbox 
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1"
                        />
                        
                        <div className="space-y-1 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`text-base font-medium leading-none cursor-pointer ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.label}
                            </label>
                            <Badge className={`${priorityColorMap[task.priority]} self-start whitespace-nowrap text-xs`}>
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
                    ))}
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
