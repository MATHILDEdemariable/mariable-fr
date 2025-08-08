import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, ArrowRight, Circle, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Task {
  id: string;
  label: string;
  completed: boolean;
  priority?: string;
  category: string;
}

const ChecklistWidget: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Charger les tâches récentes
  useEffect(() => {
    const loadRecentTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('generated_tasks')
          .select('*')
          .eq('user_id', user.id)
          .order('priority', { ascending: false })
          .order('position', { ascending: true })
          .limit(5);

        if (error) {
          console.error('Error loading tasks:', error);
          return;
        }

        setTasks(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentTasks();
  }, []);

  // Marquer une tâche comme complétée
  const toggleTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from('generated_tasks')
        .update({ completed: !task.completed })
        .eq('id', taskId);

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la tâche",
          variant: "destructive"
        });
        return;
      }

      setTasks(prev => 
        prev.map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        )
      );

      toast({
        title: task.completed ? "Tâche réactivée" : "Tâche complétée",
        description: `"${task.label}" ${task.completed ? 'réactivée' : 'marquée comme complétée'}`,
      });
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-wedding-cream/20 to-wedding-beige/5 border-wedding-beige/20">
        <CardHeader>
          <CardTitle className="text-lg font-serif flex items-center gap-2 text-black">
            <CheckSquare className="h-5 w-5" />
            Check-list Mariage
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-black" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-wedding-cream/20 to-wedding-beige/5 border-wedding-beige/20">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2 text-black">
          <CheckSquare className="h-5 w-5" />
          Check-list Mariage
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tasks.length > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {completedTasks} sur {tasks.length} tâches terminées
              </p>
              <span className="text-sm font-medium text-black">
                {completionPercentage}%
              </span>
            </div>
            
            <div className="space-y-2">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="text-black hover:text-black/80 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </button>
                  <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                    {task.label}
                  </span>
                  {task.priority === 'high' && !task.completed && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-600 mb-3">
              Aucune tâche trouvée. Commencez par créer votre check-list personnalisée !
            </p>
          </div>
        )}
        
        <Button 
          onClick={() => navigate('/dashboard/tasks')}
          variant="outline"
          className="w-full border-wedding-beige text-black hover:bg-wedding-beige hover:text-black"
        >
          {tasks.length > 0 ? 'Voir toutes les tâches' : 'Créer ma check-list'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default ChecklistWidget;