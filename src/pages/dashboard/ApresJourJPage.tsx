import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Trash2, Plus, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePremiumAction } from "@/hooks/usePremiumAction";
import PremiumModal from "@/components/premium/PremiumModal";
import AfterWeddingAdvice from '@/components/apres-jour-j/AfterWeddingAdvice';
import { SuggestionsModal } from '@/components/apres-jour-j/SuggestionsModal';
import { ApresJourJShareButton } from '@/components/apres-jour-j/ApresJourJShareButton';
import ApresJourJManuelle from '@/components/dashboard/ApresJourJManuelle';
import { exportApresJourJToPDF } from '@/services/apresJourJExportService';

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
  icon?: string;
  category?: string;
}

interface DatabaseChecklist {
  id: string;
  title: string;
  original_text: string;
  tasks: Task[] | any;
  completed_tasks: string[] | any;
  created_at: string;
  icon?: string;
  category?: string;
}

const ApresJourJPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('manuelle');
  const printRef = useRef<HTMLDivElement>(null);
  const { executeAction: handlePremiumAction, showPremiumModal, closePremiumModal } = usePremiumAction({
    feature: "Checklist après le jour-J",
    description: "Générez votre checklist personnalisée après le mariage"
  });
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
        const checklist = data[0] as DatabaseChecklist;
        setChecklistData({
          id: checklist.id,
          title: checklist.title,
          original_text: checklist.original_text,
          tasks: Array.isArray(checklist.tasks) ? checklist.tasks as Task[] : [],
          completed_tasks: (Array.isArray(checklist.completed_tasks) ? checklist.completed_tasks : []) as string[],
          created_at: checklist.created_at,
          icon: checklist.icon,
          category: checklist.category
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
        user_id: user.id,
        icon: data.icon,
        category: data.category
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
        tasks: (Array.isArray(insertedData.tasks) ? insertedData.tasks : []) as Task[],
        completed_tasks: (Array.isArray(insertedData.completed_tasks) ? insertedData.completed_tasks : []) as string[],
        created_at: insertedData.created_at,
        icon: insertedData.icon,
        category: insertedData.category
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
    if (!newTaskTitle.trim() || !checklistData || !user) return;

    const newTask: Task = {
      id: `manual-${Date.now()}`,
      label: newTaskTitle.trim(),
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

      setNewTaskTitle('');
      
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
      'NETTOYAGE': 'bg-blue-100 text-blue-800',
      'RÉCUPÉRATION': 'bg-green-100 text-green-800',
      'RETOURS': 'bg-orange-100 text-orange-800',
      'DISTRIBUTION': 'bg-pink-100 text-pink-800',
      'COMMUNICATION': 'bg-purple-100 text-purple-800',
      'PAIEMENTS': 'bg-yellow-100 text-yellow-800',
      'AUTRE': 'bg-gray-100 text-gray-800'
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
      await exportApresJourJToPDF(checklistData);
      toast({
        title: "Export réussi !",
        description: "Votre checklist a été exportée en PDF.",
      });
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

  return (
    <>
      <Helmet>
        <title>Après le jour-J | Mariable</title>
        <meta name="description" content="Gérez vos tâches post-mariage avec notre checklist intelligente" />
      </Helmet>
      
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Après le jour-J</h1>
          <p className="text-muted-foreground">
            Gérez vos tâches post-mariage et profitez de conseils personnalisés
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="manuelle">Version manuelle</TabsTrigger>
            <TabsTrigger value="ia">Version IA</TabsTrigger>
            <TabsTrigger value="conseils">Conseils</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manuelle" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ApresJourJManuelle />
              </div>
              <div className="lg:col-span-1">
                <AfterWeddingAdvice />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ia" className="space-y-6">
            {isLoading ? (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-lg">Chargement...</div>
                </CardContent>
              </Card>
            ) : checklistData ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {checklistData.icon && <span>{checklistData.icon}</span>}
                        {checklistData.title}
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={resetChecklist}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Nouvelle liste
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleExportPDF}
                          disabled={isExporting}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          {isExporting ? 'Export...' : 'PDF'}
                        </Button>
                        <ApresJourJShareButton checklistId={checklistData.id} />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-muted-foreground">Progression</h3>
                        <span className="text-sm text-muted-foreground">
                          {checklistData.completed_tasks.length} / {checklistData.tasks.length} tâches
                        </span>
                      </div>
                      <Progress value={getProgressPercentage()} className="h-2" />
                      
                      <div className="space-y-2" ref={printRef}>
                        {checklistData.tasks.map((task: Task) => (
                          <div
                            key={task.id}
                            className={`flex items-start gap-3 p-3 border rounded-lg ${
                              checklistData.completed_tasks.includes(task.id)
                                ? 'bg-muted/50 border-muted'
                                : 'bg-card border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1">
                              <input
                                type="checkbox"
                                checked={checklistData.completed_tasks.includes(task.id)}
                                onChange={() => toggleTaskCompletion(task.id)}
                                className="w-4 h-4 text-primary border-2 border-muted-foreground rounded focus:ring-primary focus:ring-2"
                              />
                              <div className="flex-1">
                                <div className={`font-medium ${
                                  checklistData.completed_tasks.includes(task.id) ? 'line-through text-muted-foreground' : 'text-foreground'
                                }`}>
                                  {task.label}
                                </div>
                                {task.description && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {task.description}
                                  </div>
                                )}
                              </div>
                              {task.category && (
                                <Badge 
                                  variant="outline" 
                                  className={getCategoryColor(task.category)}
                                >
                                  {task.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t pt-4">
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Ajouter une tâche personnalisée..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addManualTask()}
                            className="flex-1"
                          />
                          <Button onClick={addManualTask} disabled={!newTaskTitle.trim()}>
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => setShowSuggestions(true)}
                          variant="outline"
                          className="flex-1"
                        >
                          Voir les suggestions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <AfterWeddingAdvice />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Générer votre checklist après le mariage</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Décrivez votre mariage et vos besoins pour générer une checklist personnalisée des tâches à accomplir après votre jour-J.
                      </p>
                      
                      <Textarea
                        placeholder="Décrivez votre mariage : nombre d'invités, style, particularités, tâches spécifiques que vous devez gérer après le mariage..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="min-h-[120px]"
                      />
                      
                      <Button 
                        onClick={() => handlePremiumAction(generateChecklist)} 
                        disabled={isGenerating || inputText.trim().length < 20}
                        className="w-full"
                      >
                        {isGenerating ? 'Génération en cours...' : 'Générer ma checklist'}
                      </Button>

                      {inputText.trim().length < 20 && inputText.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Veuillez fournir plus de détails (minimum 20 caractères)
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-1">
                  <AfterWeddingAdvice />
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="conseils" className="space-y-6">
            <AfterWeddingAdvice />
          </TabsContent>
        </Tabs>

        <SuggestionsModal 
          isOpen={showSuggestions}
          onClose={() => setShowSuggestions(false)}
          onAddTasks={addSuggestedTasks}
        />

        <PremiumModal
          isOpen={showPremiumModal}
          onClose={closePremiumModal}
          feature="Checklist après le jour-J"
        />
      </div>
    </>
  );
};

export default ApresJourJPage;