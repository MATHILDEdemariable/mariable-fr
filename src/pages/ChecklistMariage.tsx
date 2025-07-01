
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

// Tâches initiales avec IDs cohérents
const INITIAL_WEDDING_TASKS = [
  { 
    id: 'task-1', 
    label: "Posez les bases", 
    description: "Définissez la vision de votre mariage : style, ambiance, type de cérémonie.", 
    priority: "haute", 
    category: "essentiel",
    position: 1,
    completed: false
  },
  { 
    id: 'task-2', 
    label: "Estimez le nombre d'invités", 
    description: "Même approximatif, cela guidera vos choix logistiques et budgétaires.", 
    priority: "haute", 
    category: "organisation",
    position: 2,
    completed: false
  },
  { 
    id: 'task-3', 
    label: "Calibrez votre budget", 
    description: "Évaluez vos moyens et priorisez les postes les plus importants selon vos envies.", 
    priority: "haute", 
    category: "essentiel",
    position: 3,
    completed: false
  },
  { 
    id: 'task-4', 
    label: "Choisissez une période ou une date cible", 
    description: "Cela conditionne les disponibilités des lieux et prestataires.", 
    priority: "haute", 
    category: "essentiel",
    position: 4,
    completed: false
  },
  { 
    id: 'task-5', 
    label: "Réservez les prestataires clés", 
    description: "Lieu, traiteur, photographe en priorité. Puis DJ, déco, animation, etc.", 
    priority: "haute", 
    category: "essentiel",
    position: 5,
    completed: false
  },
  { 
    id: 'task-6', 
    label: "Gérez les démarches officielles", 
    description: "Mairie, cérémonies religieuses ou laïques, contrats, assurances, etc.", 
    priority: "moyenne", 
    category: "essentiel",
    position: 6,
    completed: false
  },
  { 
    id: 'task-7', 
    label: "Anticipez la coordination du jour J", 
    description: "Prévoyez une coordinatrice (recommandée), les préparatifs beauté, la logistique (transport, hébergements) et les temps forts.", 
    priority: "moyenne", 
    category: "organisation",
    position: 7,
    completed: false
  },
  { 
    id: 'task-8', 
    label: "Préparez vos éléments personnels", 
    description: "Tenues, alliances, accessoires, papeterie, DIY ou détails personnalisés.", 
    priority: "moyenne", 
    category: "personnel",
    position: 8,
    completed: false
  },
  { 
    id: 'task-9', 
    label: "Consolidez votre organisation", 
    description: "Revoyez chaque point avec vos prestataires : timing, livraisons, besoins techniques, derniers ajustements.", 
    priority: "haute", 
    category: "organisation",
    position: 9,
    completed: false
  },
  { 
    id: 'task-10', 
    label: "Vivez pleinement votre journée", 
    description: "Vous avez tout prévu : il ne reste plus qu'à profiter à 100% !", 
    priority: "haute", 
    category: "personnel",
    position: 10,
    completed: false
  }
];

const ChecklistMariage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dataSource, setDataSource] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    console.log('🚀 ChecklistMariage component mounted');
    loadTasksWithDiagnostic();
  }, []);

  // Guard de sécurité finale pour garantir l'affichage
  useEffect(() => {
    if (!isLoading && tasks.length === 0) {
      console.warn('🚨 EMERGENCY GUARD: Tasks array is empty after loading, forcing default tasks');
      setTasks(INITIAL_WEDDING_TASKS);
      setDataSource('emergency-fallback');
    }
  }, [isLoading, tasks.length]);
  
  const loadTasksWithDiagnostic = async () => {
    console.log('🔍 Starting comprehensive task loading diagnostic');
    setIsLoading(true);
    
    try {
      // Étape 1: Vérifier l'authentification
      console.log('👤 Step 1: Checking authentication...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.warn('⚠️ Auth error detected:', authError.message);
        await handleUnauthenticatedUser();
        return;
      }
      
      if (user) {
        console.log('✅ User authenticated with ID:', user.id);
        setIsAuthenticated(true);
        await loadUserTasks(user.id);
      } else {
        console.log('👥 User not authenticated, loading for anonymous user');
        setIsAuthenticated(false);
        await handleUnauthenticatedUser();
      }
      
    } catch (error) {
      console.error('❌ Critical error in loadTasksWithDiagnostic:', error);
      await handleFallbackToDefault('critical-error');
    } finally {
      setIsLoading(false);
      console.log('✅ Task loading process completed');
    }
  };
  
  const loadUserTasks = async (userId: string) => {
    console.log('📋 Step 2: Loading tasks for authenticated user');
    
    try {
      console.log('🔍 Querying todos_planification table...');
      const { data: userTasks, error } = await supabase
        .from('todos_planification')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });
        
      console.log('📊 Database query result:', { 
        data: userTasks, 
        error: error,
        count: userTasks?.length || 0 
      });
        
      if (error) {
        console.error('❌ Database error while loading tasks:', error);
        throw error;
      }
      
      if (userTasks && userTasks.length > 0) {
        console.log('✅ Successfully loaded', userTasks.length, 'tasks from database');
        console.log('📝 First task example:', userTasks[0]);
        setTasks(userTasks);
        setDataSource('database');
        return;
      } else {
        console.log('📥 No tasks found in database, creating initial tasks');
        await createInitialTasks(userId);
      }
      
    } catch (error) {
      console.error('❌ Error in loadUserTasks, falling back:', error);
      await handleFallbackToDefault('database-error');
    }
  };
  
  const createInitialTasks = async (userId: string) => {
    console.log('📥 Step 3: Creating initial tasks for user:', userId);
    
    try {
      const tasksToInsert = INITIAL_WEDDING_TASKS.map((task) => ({
        user_id: userId,
        label: task.label,
        description: task.description,
        priority: task.priority as 'haute' | 'moyenne' | 'basse',
        category: task.category,
        position: task.position,
        completed: task.completed
      }));
      
      console.log('📝 Inserting', tasksToInsert.length, 'initial tasks');
      
      const { data: insertedTasks, error } = await supabase
        .from('todos_planification')
        .insert(tasksToInsert)
        .select();
        
      if (error) {
        console.error('❌ Error inserting initial tasks:', error);
        throw error;
      }
      
      console.log('✅ Successfully created', insertedTasks?.length || 0, 'initial tasks');
      setTasks(insertedTasks || []);
      setDataSource('database-created');
      
    } catch (error) {
      console.error('❌ Error in createInitialTasks, falling back:', error);
      await handleFallbackToDefault('creation-error');
    }
  };
  
  const handleUnauthenticatedUser = async () => {
    console.log('👥 Step 4: Handling unauthenticated user');
    
    try {
      console.log('💾 Attempting to load from localStorage...');
      const savedTaskStatuses = localStorage.getItem('weddingTasksStatus');
      console.log('📊 LocalStorage data:', savedTaskStatuses);
      
      const statuses = savedTaskStatuses ? JSON.parse(savedTaskStatuses) : {};
      
      const tasksWithStatus = INITIAL_WEDDING_TASKS.map(task => ({
        ...task,
        completed: statuses[task.id] || false
      }));
      
      console.log('✅ Successfully loaded', tasksWithStatus.length, 'tasks from localStorage');
      console.log('📝 Tasks with status:', tasksWithStatus);
      setTasks(tasksWithStatus);
      setDataSource('localStorage');
      
    } catch (error) {
      console.error('❌ Error loading from localStorage:', error);
      await handleFallbackToDefault('localStorage-error');
    }
  };
  
  const handleFallbackToDefault = async (reason: string) => {
    console.warn('🔄 Falling back to default tasks, reason:', reason);
    console.log('📝 Loading default tasks:', INITIAL_WEDDING_TASKS);
    
    setTasks(INITIAL_WEDDING_TASKS);
    setDataSource(`default-${reason}`);
    
    toast({
      title: "Mode hors ligne",
      description: "Utilisation des tâches par défaut. Vos modifications ne seront pas sauvegardées.",
    });
  };
  
  const toggleTaskCompletion = async (taskId: number | string) => {
    const taskIdStr = taskId.toString();
    console.log('🔄 Toggling task completion for ID:', taskIdStr);
    
    const taskIndex = tasks.findIndex(t => (t.id || '').toString() === taskIdStr);
    
    if (taskIndex === -1) {
      console.warn('⚠️ Task not found with ID:', taskIdStr);
      return;
    }
    
    const taskToUpdate = tasks[taskIndex];
    const newCompletedState = !taskToUpdate.completed;
    
    console.log('📝 Updating task:', {
      label: taskToUpdate.label,
      from: taskToUpdate.completed,
      to: newCompletedState
    });
    
    // Mise à jour locale immédiate
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = { ...taskToUpdate, completed: newCompletedState };
    setTasks(updatedTasks);
    
    if (isAuthenticated && taskToUpdate.id && typeof taskToUpdate.id !== 'string') {
      try {
        console.log('💾 Saving to database...');
        const { error } = await supabase
          .from('todos_planification')
          .update({ completed: newCompletedState })
          .eq('id', taskToUpdate.id);
          
        if (error) {
          console.error('❌ Database update failed:', error);
          throw error;
        }
        
        console.log('✅ Task updated in database successfully');
      } catch (error) {
        console.error('❌ Database update failed, reverting local state');
        const revertedTasks = [...tasks];
        revertedTasks[taskIndex] = { ...taskToUpdate, completed: taskToUpdate.completed };
        setTasks(revertedTasks);
        
        toast({
          title: "Erreur de synchronisation",
          description: "Impossible de mettre à jour la tâche. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } else {
      try {
        console.log('💾 Saving to localStorage...');
        const savedTaskStatuses = localStorage.getItem('weddingTasksStatus');
        const statuses = savedTaskStatuses ? JSON.parse(savedTaskStatuses) : {};
        
        statuses[taskIdStr] = newCompletedState;
        localStorage.setItem('weddingTasksStatus', JSON.stringify(statuses));
        
        console.log('✅ Task status saved to localStorage');
      } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
      }
    }
  };
  
  const getProgressPercentage = () => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  // Log final state
  console.log('📊 Final render state:', {
    tasksCount: tasks.length,
    isLoading,
    isAuthenticated,
    dataSource,
    progressPercentage: getProgressPercentage()
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Checklist de mariage | Organisez votre mariage étape par étape</title>
        <meta name="description" content="Suivez les 10 étapes clés pour organiser votre mariage sans stress. Checklist complète et personnalisée pour ne rien oublier." />
      </Helmet>

      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/services/planification')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la planification
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif mb-4 text-wedding-olive">
              Checklist de mariage
            </h1>
            <p className="text-lg text-muted-foreground">
              Organisez votre mariage en 10 étapes clés
            </p>
            {dataSource && (
              <p className="text-sm text-muted-foreground mt-2">
                Source des données : {dataSource} | {tasks.length} tâches chargées
              </p>
            )}
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <span>Votre progression</span>
                <div className="ml-auto text-wedding-olive">{getProgressPercentage()}%</div>
              </CardTitle>
              <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                <div 
                  className="h-full bg-wedding-olive rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressPercentage()}%` }} 
                />
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Les 10 étapes clés de l'organisation</CardTitle>
              <CardDescription>
                Cochez les étapes au fur et à mesure de votre avancement
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
                  <p className="ml-4">Chargement des tâches de planification...</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-red-600 font-medium">
                    🚨 Aucune tâche trouvée - Ceci ne devrait pas arriver !
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Merci de signaler ce problème avec les détails de la console.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <div key={task.id || index} className="border-l-2 border-wedding-olive/30 pl-4 ml-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id={`task-${task.id || index}`} 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id || `task-${index}`)}
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <label 
                            htmlFor={`task-${task.id || index}`} 
                            className={`cursor-pointer font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {task.position || (index + 1)}. {task.label}
                          </label>
                          <p className={`mt-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-center mt-8">
            <Button
              variant="wedding"
              size="lg"
              className="gap-2"
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/dashboard');
                } else {
                  navigate('/register');
                }
              }}
            >
              <Calendar size={18} />
              {isAuthenticated ? 'Aller au dashboard' : 'Créer mon compte'}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChecklistMariage;
