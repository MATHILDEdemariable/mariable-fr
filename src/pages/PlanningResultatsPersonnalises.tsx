
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { CheckCircle, ClipboardList, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';
import { UserQuizResult } from '@/components/wedding-assistant/v2/types';

interface Task {
  id: string;
  label: string;
  description: string | null;
  priority: string;
  category: string;
  completed: boolean;
}

const PlanningResultatsPersonnalises: React.FC = () => {
  const [quizResult, setQuizResult] = useState<UserQuizResult | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    checkAuthAndLoadData();
  }, []);
  
  const checkAuthAndLoadData = async () => {
    setIsLoading(true);
    try {
      // Check if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      const isAuth = !!session;
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        // Get latest quiz result for the user using RPC to avoid type issues
        const { data: quizData, error: quizError } = await supabase
          .rpc('get_latest_user_quiz_result', {
            p_user_id: session.user.id
          });
        
        if (quizError || !quizData) {
          console.error("Error fetching quiz results:", quizError);
          // If no results yet, redirect to quiz
          navigate('/planning-personnalise');
          return;
        }
        
        setQuizResult(quizData);
        
        // Get generated tasks for the user
        const { data: tasksData, error: tasksError } = await supabase
          .from('todos_planification')
          .select('*')
          .eq('user_id', session.user.id)
          .order('position', { ascending: true });
        
        if (tasksError) throw tasksError;
        
        if (tasksData) {
          setTasks(tasksData);
        }
      } else {
        // If not authenticated, redirect to the quiz
        navigate('/planning-personnalise');
      }
    } catch (error) {
      console.error('Error loading planning results:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos résultats de planification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Votre planning personnalisé | Mariable</title>
        <meta name="description" content="Votre planning de mariage personnalisé basé sur votre niveau de préparation - Mariable" />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8 mb-16">
        <h1 className="text-3xl font-serif text-center mb-8">Votre Planning Personnalisé</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
          </div>
        ) : (
          <>
            {quizResult ? (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Votre niveau de préparation: {quizResult.status}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Votre score</h3>
                        <div className="bg-wedding-cream/50 p-4 rounded-md">
                          <div className="text-3xl font-bold text-wedding-olive">{quizResult.score}/10</div>
                          <p className="text-sm text-muted-foreground mt-1">Niveau: {quizResult.level}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-3">Priorités</h3>
                        <div className="flex flex-wrap gap-2">
                          {quizResult.categories && quizResult.categories.length > 0 ? (
                            quizResult.categories.map((category, index) => (
                              <div key={index} className="bg-wedding-light/50 px-3 py-1 rounded-full text-sm">
                                {category}
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">Aucune catégorie définie</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif flex items-center">
                      <ClipboardList className="mr-2" /> Vos tâches personnalisées
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {tasks.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group tasks by category */}
                        {Object.entries(
                          tasks.reduce((acc: {[key: string]: Task[]}, task) => {
                            const category = task.category || "Autres";
                            if (!acc[category]) acc[category] = [];
                            acc[category].push(task);
                            return acc;
                          }, {})
                        ).map(([category, categoryTasks]) => (
                          <div key={category} className="space-y-3">
                            <h3 className="font-medium text-lg">{category}</h3>
                            <div className="space-y-2">
                              {categoryTasks.map((task) => (
                                <div key={task.id} className="flex items-start p-3 border rounded-md bg-wedding-light/20">
                                  <div className="flex-shrink-0 mr-3 mt-0.5">
                                    {task.completed ? (
                                      <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <div className={`h-5 w-5 rounded-full border-2 ${
                                        task.priority === 'haute' ? 'border-red-500' : 
                                        task.priority === 'moyenne' ? 'border-amber-500' : 
                                        'border-blue-500'
                                      }`} />
                                    )}
                                  </div>
                                  <div>
                                    <div className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                      {task.label}
                                    </div>
                                    {task.description && (
                                      <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                                        {task.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground">Aucune tâche n'a encore été générée.</p>
                        <Button 
                          className="mt-4 bg-wedding-olive hover:bg-wedding-olive/80"
                          onClick={() => navigate('/planning-personnalise')}
                        >
                          Refaire le quiz
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <div className="flex flex-col items-center mt-8 space-y-4">
                  <p className="text-center text-muted-foreground">
                    Gérez vos tâches et accédez à tous nos outils de planification dans votre espace personnel.
                  </p>
                  <Button 
                    asChild 
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    <Link to="/dashboard/tasks">
                      Accéder à mon tableau de bord <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="mb-4">Vous n'avez pas encore de planning personnalisé.</p>
                <Button 
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                  onClick={() => navigate('/planning-personnalise')}
                >
                  Créer mon planning
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default PlanningResultatsPersonnalises;
