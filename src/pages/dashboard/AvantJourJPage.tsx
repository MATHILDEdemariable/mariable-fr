import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Lightbulb, Plus, Check, Loader2, Sparkles, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { AvantJourJShareButton } from '@/components/avant-jour-j/AvantJourJShareButton';
import { exportAvantJourJToPDF } from '@/services/avantJourJExportService';
import PremiumGate from '@/components/premium/PremiumGate';
import { useUserProfile } from '@/hooks/useUserProfile';

interface Task {
  id: string;
  label: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category?: string;
  icon?: string;
}

interface ChecklistData {
  id: string;
  title: string;
  original_text: string;
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
}

interface DatabaseChecklist {
  id: string;
  title: string;
  original_text: string;
  tasks: any;
  completed_tasks: any;
  created_at: string;
}

const AvantJourJPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const { isPremium } = useUserProfile();
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskLabel, setNewTaskLabel] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const loadUserAndChecklist = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          await loadExistingChecklist(user.id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserAndChecklist();
  }, []);

  const loadExistingChecklist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('planning_avant_jour_j')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const dbChecklist = data[0] as DatabaseChecklist;
        const checklist: ChecklistData = {
          ...dbChecklist,
          tasks: Array.isArray(dbChecklist.tasks) ? dbChecklist.tasks as Task[] : [],
          completed_tasks: Array.isArray(dbChecklist.completed_tasks) ? dbChecklist.completed_tasks as string[] : []
        };
        setChecklist(checklist);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la checklist:', error);
    }
  };

  const generateChecklist = async () => {
    if (!user || !inputText.trim()) {
      toast.error('Veuillez saisir du texte pour générer votre checklist');
      return;
    }

    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-checklist-ai', {
        body: { text: inputText, userId: user.id }
      });

      if (error) throw error;

      if (data?.checklist) {
        setChecklist(data.checklist);
        setInputText('');
        toast.success('Checklist générée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération de la checklist');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!checklist || !user) return;

    const isCompleted = checklist.completed_tasks.includes(taskId);
    const newCompletedTasks = isCompleted
      ? checklist.completed_tasks.filter(id => id !== taskId)
      : [...checklist.completed_tasks, taskId];

    const updatedChecklist = {
      ...checklist,
      completed_tasks: newCompletedTasks
    };

    setChecklist(updatedChecklist);

    try {
      const { error } = await supabase
        .from('planning_avant_jour_j')
        .update({ completed_tasks: newCompletedTasks })
        .eq('id', checklist.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const addManualTask = async () => {
    if (!checklist || !newTaskLabel.trim() || !user) return;

    const newTask: Task = {
      id: `manual-${Date.now()}`,
      label: newTaskLabel,
      priority: 'medium',
      completed: false
    };

    const updatedTasks = [...checklist.tasks, newTask];
    const updatedChecklist = {
      ...checklist,
      tasks: updatedTasks
    };

    setChecklist(updatedChecklist);
    setNewTaskLabel('');
    setShowAddTask(false);

    try {
      const { error } = await supabase
        .from('planning_avant_jour_j')
        .update({ tasks: updatedTasks as any })
        .eq('id', checklist.id);

      if (error) throw error;
      toast.success('Tâche ajoutée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de la tâche');
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category?.toUpperCase()) {
      case 'RÉCEPTION': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'TENUE': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'DÉCORATION': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'TRAITEUR': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'MUSIQUE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'PHOTOS/VIDÉOS': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      case 'TRANSPORT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'ADMINISTRATIF': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'INVITÉS': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getProgressPercentage = () => {
    if (!checklist || checklist.tasks.length === 0) return 0;
    return Math.round((checklist.completed_tasks.length / checklist.tasks.length) * 100);
  };

  const handleExportPDF = async () => {
    if (!checklist) return;

    setIsExporting(true);
    try {
      const success = await exportAvantJourJToPDF({
        title: checklist.title,
        tasks: checklist.tasks,
        completedTasks: checklist.completed_tasks,
        created_at: checklist.created_at
      });

      if (success) {
        toast.success('PDF téléchargé avec succès');
      } else {
        throw new Error('Échec de l\'export');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Impossible d\'exporter le PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const resetChecklist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('planning_avant_jour_j')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setChecklist(null);
      setInputText('');
      toast.success('Checklist supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Impossible de supprimer la checklist');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Avant le jour-J - Checklist IA | Mariable</title>
        <meta name="description" content="Générez votre checklist personnalisée pour préparer votre mariage grâce à l'intelligence artificielle." />
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Lightbulb className="h-6 w-6 text-wedding-olive" />
            Avant le jour-J
          </h1>
          <p className="text-gray-600">
            Générez votre checklist personnalisée grâce à l'IA pour ne rien oublier avant votre mariage
          </p>
        </div>

        {!checklist ? (
          <PremiumGate 
            feature="génération de checklist avant le jour-J"
            description="Générez votre checklist personnalisée avant le jour-J avec l'IA"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-wedding-olive" />
                  Générer ma checklist avec l'IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Décrivez votre mariage et vos préoccupations
                  </label>
                  <Textarea
                    placeholder="Ex: Mon mariage aura lieu en juin dans un château avec 120 invités. J'ai peur d'oublier des détails importants comme les alliances, les fleurs, la musique. Je veux aussi penser à la météo et aux préparatifs de la veille..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={6}
                    className="w-full"
                  />
                </div>
                <Button 
                  onClick={generateChecklist}
                  disabled={isGenerating || !inputText.trim()}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer ma checklist
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </PremiumGate>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>To do list personnalisée</CardTitle>
                  <Badge variant="outline">
                    {getProgressPercentage()}% complété
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-wedding-olive h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                
                {/* Actions en haut */}
                <div className="flex gap-2 flex-wrap">
                  {isPremium && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Générer une nouvelle liste
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Attention, cela va supprimer votre liste actuelle. Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={resetChecklist}>
                            Confirmer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleExportPDF}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Export...' : 'Exporter PDF'}
                  </Button>
                  
                  <AvantJourJShareButton checklistId={checklist.id} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {checklist.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={checklist.completed_tasks.includes(task.id)}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          {task.icon && <span className="text-lg">{task.icon}</span>}
                          <span className={checklist.completed_tasks.includes(task.id) ? 'line-through text-gray-500' : ''}>
                            {task.label}
                          </span>
                          {task.category && (
                            <Badge className={getCategoryColor(task.category)}>
                              {task.category}
                            </Badge>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600">{task.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {showAddTask ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nouvelle tâche..."
                      value={newTaskLabel}
                      onChange={(e) => setNewTaskLabel(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addManualTask()}
                    />
                    <Button onClick={addManualTask} disabled={!newTaskLabel.trim()}>
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddTask(false)}>
                      Annuler
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddTask(true)}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une tâche manuellement
                  </Button>
                )}

              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default AvantJourJPage;