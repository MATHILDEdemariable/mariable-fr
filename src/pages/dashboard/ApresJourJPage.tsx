import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Plus, Sparkles, Lightbulb } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportApresJourJToPDF } from "@/services/apresJourJExportService";
import { ApresJourJShareButton } from "@/components/apres-jour-j/ApresJourJShareButton";
import { SuggestionsModal } from "@/components/apres-jour-j/SuggestionsModal";

interface Task {
  id: string;
  label: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
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
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
}

const ApresJourJPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadExistingChecklist(user.id);
      }
      setIsLoading(false);
    };

    getCurrentUser();
  }, []);

  const loadExistingChecklist = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('planning_apres_jour_j')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Erreur lors du chargement de la checklist:', error);
        return;
      }

      if (data && data.length > 0) {
        const checklist = data[0];
        setChecklistData({
          id: checklist.id,
          title: checklist.title,
          original_text: checklist.original_text,
          tasks: (checklist.tasks as unknown as Task[]) || [],
          completed_tasks: (checklist.completed_tasks as unknown as string[]) || [],
          created_at: checklist.created_at
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la checklist:', error);
    }
  };

  const generateChecklist = async () => {
    if (!inputText.trim() || !user) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-checklist-ai', {
        body: { 
          prompt: `Génère une checklist pour APRÈS le jour J du mariage basée sur ces informations: ${inputText}`,
          context: 'apres-jour-j'
        }
      });

      if (error) throw error;

      const newChecklist = {
        title: data.title || 'Ma checklist après le jour-J',
        original_text: inputText,
        tasks: data.tasks || [],
        completed_tasks: [],
        user_id: user.id
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('planning_apres_jour_j')
        .insert([newChecklist])
        .select()
        .single();

      if (insertError) throw insertError;

      setChecklistData({
        id: insertedData.id,
        title: insertedData.title,
        original_text: insertedData.original_text,
        tasks: (insertedData.tasks as unknown as Task[]) || [],
        completed_tasks: (insertedData.completed_tasks as unknown as string[]) || [],
        created_at: insertedData.created_at
      });

      toast({
        title: "Checklist générée !",
        description: "Votre checklist après le jour-J a été créée avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer la checklist. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    if (!checklistData || !user) return;

    const newCompletedTasks = checklistData.completed_tasks.includes(taskId)
      ? checklistData.completed_tasks.filter(id => id !== taskId)
      : [...checklistData.completed_tasks, taskId];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ completed_tasks: newCompletedTasks })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        completed_tasks: newCompletedTasks
      } : null);

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche.",
        variant: "destructive",
      });
    }
  };

  const addManualTask = async () => {
    if (!newTaskInput.trim() || !checklistData || !user) return;

    const newTask: Task = {
      id: `manual-${Date.now()}`,
      label: newTaskInput.trim(),
      description: '',
      priority: 'medium',
      category: 'AUTRE',
      icon: ''
    };

    const updatedTasks = [...checklistData.tasks, newTask];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ tasks: updatedTasks as any })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        tasks: updatedTasks
      } : null);

      setNewTaskInput('');
      
      toast({
        title: "Tâche ajoutée !",
        description: "La nouvelle tâche a été ajoutée à votre checklist.",
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche.",
        variant: "destructive",
      });
    }
  };

  const addSuggestedTasks = async (tasks: Task[]) => {
    if (!checklistData || !user) return;

    const updatedTasks = [...checklistData.tasks, ...tasks];

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .update({ tasks: updatedTasks as any })
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(prev => prev ? {
        ...prev,
        tasks: updatedTasks
      } : null);

      toast({
        title: "Tâches ajoutées !",
        description: `${tasks.length} tâche(s) suggérée(s) ont été ajoutées à votre checklist.`,
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout des tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les tâches suggérées.",
        variant: "destructive",
      });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'NETTOYAGE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'RÉCUPÉRATION': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'RETOURS': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'DISTRIBUTION': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'COMMUNICATION': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'PAIEMENTS': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'AUTRE': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colors[category as keyof typeof colors] || colors['AUTRE'];
  };

  const getProgressPercentage = () => {
    if (!checklistData || checklistData.tasks.length === 0) return 0;
    return Math.round((checklistData.completed_tasks.length / checklistData.tasks.length) * 100);
  };

  const handleExportPDF = async () => {
    if (!checklistData) return;

    setIsExporting(true);
    try {
      const success = await exportApresJourJToPDF({
        title: checklistData.title,
        tasks: checklistData.tasks,
        completed_tasks: checklistData.completed_tasks,
        created_at: checklistData.created_at
      });

      if (success) {
        toast({
          title: "Export réussi !",
          description: "Votre checklist a été exportée en PDF.",
        });
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter la checklist en PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const resetChecklist = async () => {
    if (!checklistData || !user) return;

    try {
      const { error } = await supabase
        .from('planning_apres_jour_j')
        .delete()
        .eq('id', checklistData.id);

      if (error) throw error;

      setChecklistData(null);
      setInputText('');
      
      toast({
        title: "Checklist supprimée",
        description: "Votre checklist a été supprimée avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la checklist.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {!checklistData ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              Checklist après le jour-J
            </CardTitle>
            <p className="text-muted-foreground">
              Générez votre checklist personnalisée pour toutes les tâches à accomplir après votre mariage.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="wedding-details" className="block text-sm font-medium mb-2">
                Décrivez votre situation après le mariage :
              </label>
              <Textarea
                id="wedding-details"
                placeholder="Exemple: Nous avons eu notre mariage au Château de Versailles avec 120 invités. Nous avons loué de la décoration, des tables, des chaises. Nous devons récupérer nos affaires, ranger la salle, retourner la location..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
            <Button 
              onClick={generateChecklist}
              disabled={!inputText.trim() || isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer ma checklist après le jour-J
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">{checklistData.title}</CardTitle>
              <div className="flex gap-2 flex-wrap">
                <Button
                  onClick={() => setShowSuggestions(true)}
                  variant="outline"
                  size="sm"
                >
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Suggestions
                </Button>
                <Button
                  onClick={resetChecklist}
                  variant="outline"
                  size="sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Générer nouvelle liste
                </Button>
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  variant="outline"
                  size="sm"
                >
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export PDF
                </Button>
                <ApresJourJShareButton checklistId={checklistData.id} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progression : {checklistData.completed_tasks.length}/{checklistData.tasks.length} tâches</span>
                <span>{getProgressPercentage()}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              {checklistData.tasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                  <Checkbox
                    id={task.id}
                    checked={checklistData.completed_tasks.includes(task.id)}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <label
                        htmlFor={task.id}
                        className={`text-sm font-medium cursor-pointer ${
                          checklistData.completed_tasks.includes(task.id) 
                            ? 'line-through text-muted-foreground' 
                            : ''
                        }`}
                      >
                        {task.label}
                      </label>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(task.category)}`}>
                        {task.category}
                      </Badge>
                    </div>
                    {task.description && (
                      <p className={`text-sm text-muted-foreground ${
                        checklistData.completed_tasks.includes(task.id) ? 'line-through' : ''
                      }`}>
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une tâche manuellement..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addManualTask()}
                />
                <Button
                  onClick={addManualTask}
                  disabled={!newTaskInput.trim()}
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <SuggestionsModal
        isOpen={showSuggestions}
        onClose={() => setShowSuggestions(false)}
        onAddTasks={addSuggestedTasks}
        existingTasks={checklistData?.tasks || []}
      />
    </div>
  );
};

export default ApresJourJPage;