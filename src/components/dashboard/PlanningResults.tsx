
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Calendar, Download, ArrowRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface QuizResult {
  score: number;
  status: string;
  level: string;
  objectives: string[];
  categories: string[];
}

interface GeneratedTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'haute' | 'moyenne' | 'basse';
  completed: boolean;
  position: number;
}

const PlanningResults: React.FC = () => {
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPlanningData();
  }, []);

  const loadPlanningData = async () => {
    try {
      // Check localStorage first for recent quiz result
      const localResult = localStorage.getItem('quizResult');
      if (localResult) {
        setQuizResult(JSON.parse(localResult));
      }

      // Load from database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Load quiz result
        const { data: quizResults } = await supabase
          .from('user_quiz_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (quizResults && quizResults.length > 0) {
          const result = quizResults[0];
          setQuizResult({
            score: result.score,
            status: result.status,
            level: result.level,
            objectives: Array.isArray(result.objectives) ? result.objectives as string[] : [],
            categories: Array.isArray(result.categories) ? result.categories as string[] : []
          });
        }

        // Load generated tasks
        const { data: tasks } = await supabase
          .from('generated_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('position', { ascending: true });

        if (tasks) {
          const mappedTasks: GeneratedTask[] = tasks.map(task => ({
            id: task.id,
            title: task.label, // Map label to title
            description: task.description || '',
            category: task.category,
            priority: task.priority as 'haute' | 'moyenne' | 'basse',
            completed: task.completed,
            position: task.position
          }));
          setGeneratedTasks(mappedTasks);
        }
      }
    } catch (error) {
      console.error('Error loading planning data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos données de planning",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const task = generatedTasks.find(t => t.id === taskId);
      if (!task) return;

      const newCompletedState = !task.completed;
      
      // Update locally first
      setGeneratedTasks(prev => 
        prev.map(t => 
          t.id === taskId ? { ...t, completed: newCompletedState } : t
        )
      );

      // Update in database
      const { error } = await supabase
        .from('generated_tasks')
        .update({ completed: newCompletedState })
        .eq('id', taskId);

      if (error) throw error;

    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche",
        variant: "destructive"
      });
      // Revert local change
      loadPlanningData();
    }
  };

  const getProgressPercentage = () => {
    if (generatedTasks.length === 0) return 0;
    const completed = generatedTasks.filter(t => t.completed).length;
    return Math.round((completed / generatedTasks.length) * 100);
  };

  const exportPlanning = () => {
    // Create CSV content
    let csvContent = "Tâche,Description,Catégorie,Priorité,Statut\n";
    generatedTasks.forEach(task => {
      const status = task.completed ? "Terminée" : "En cours";
      csvContent += `"${task.title}","${task.description}","${task.category}","${task.priority}","${status}"\n`;
    });
    
    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `planning-mariage-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: "Votre planning a été exporté au format CSV"
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive mx-auto"></div>
          <p className="mt-4">Chargement de votre planning...</p>
        </CardContent>
      </Card>
    );
  }

  if (!quizResult && generatedTasks.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun planning généré</h3>
          <p className="text-muted-foreground mb-4">
            Complétez d'abord le questionnaire dans l'onglet "Tâches" pour générer votre planning personnalisé.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {quizResult && (
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Votre niveau de préparation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-wedding-olive">{quizResult.score}/10</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{quizResult.level}</div>
                <div className="text-sm text-muted-foreground">Niveau</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-medium">{quizResult.status}</div>
                <div className="text-sm text-muted-foreground">Statut</div>
              </div>
            </div>

            {quizResult.objectives.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Objectifs recommandés</h4>
                <ul className="space-y-2">
                  {quizResult.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {generatedTasks.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Vos tâches personnalisées</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={getProgressPercentage()} className="flex-1" />
                <span className="text-sm font-medium">{getProgressPercentage()}%</span>
              </div>
            </div>
            <Button onClick={exportPlanning} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {generatedTasks.map((task) => (
                <div key={task.id} className="border-l-2 border-wedding-olive/30 pl-4 ml-2">
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-1 h-5 w-5 rounded border-2 flex items-center justify-center ${
                        task.completed
                          ? 'bg-wedding-olive border-wedding-olive text-white'
                          : 'border-gray-300 hover:border-wedding-olive'
                      }`}
                    >
                      {task.completed && <CheckCircle className="h-3 w-3" />}
                    </button>
                    <div className="flex-1">
                      <h4 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </h4>
                      <p className={`text-sm mt-1 ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                        {task.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          task.priority === 'haute' ? 'bg-red-100 text-red-800' :
                          task.priority === 'moyenne' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-xs text-muted-foreground">{task.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanningResults;
