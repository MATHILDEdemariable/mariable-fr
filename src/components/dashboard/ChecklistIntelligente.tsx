import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Lightbulb, Plus, Check, Loader2, Sparkles, Download, RotateCcw, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { AvantJourJShareButton } from '@/components/avant-jour-j/AvantJourJShareButton';
import { exportAvantJourJToPDF } from '@/services/avantJourJExportService';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { useAiUsageLimit } from '@/hooks/useAiUsageLimit';
import PremiumModal from '@/components/premium/PremiumModal';


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

const ChecklistIntelligente: React.FC = () => {
  const { t, i18n } = useTranslation('weddingDay');
  const [user, setUser] = useState<User | null>(null);
  const { executeAction, showPremiumModal, closePremiumModal, feature, description, isPremium } = usePremiumAction({
    feature: t('checklistAI.cardTitle'),
    description: t('checklistAI.subtitle')
  });
  const { canUseFeature, hasUsedFeature, recordUsage } = useAiUsageLimit();

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
      toast.error(t('checklistAI.errorEmpty'));
      return;
    }

    if (!canUseFeature('checklist')) {
      executeAction(() => {});
      return;
    }

    setIsGenerating(true);

    try {
      const language = i18n.language?.startsWith('en') ? 'en' : 'fr';
      const { data, error } = await supabase.functions.invoke('generate-checklist-ai', {
        body: { text: inputText, userId: user.id, language }
      });

      if (error) throw error;

      if (data?.checklist) {
        setChecklist(data.checklist);
        setInputText('');
        if (!isPremium) {
          await recordUsage('checklist');
        }
        toast.success(t('checklistAI.successCreated'));
      }
    } catch (error: any) {
      console.error('❌ Error generating checklist:', error);
      const errorMessage = error?.message || '';
      let userMessage = t('checklistAI.genericError');
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        userMessage = t('checklistAI.rateLimit');
      } else if (errorMessage.includes('Crédits') || errorMessage.includes('épuisés') || errorMessage.includes('402')) {
        userMessage = t('checklistAI.noCredits');
      } else if (errorMessage.includes('parse') || errorMessage.includes('Invalid')) {
        userMessage = t('checklistAI.parseError');
      }
      toast.error(`${userMessage}\n\n${t('checklistAI.errorPersist')}`);
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
      toast.error(t('checklistAI.saveError'));
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
      toast.success(t('checklistAI.addTaskSuccess'));
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error(t('checklistAI.addTaskFailed'));
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
        toast.success(t('checklistAI.exportSuccess'));
      } else {
        throw new Error('Échec de l\'export');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error(t('checklistAI.exportError'));
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
      toast.success(t('checklistAI.deleteSuccess'));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(t('checklistAI.deleteError'));
    }
  };

  const startNewChecklist = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('planning_avant_jour_j')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setChecklist(null);
      setInputText('');
      toast.success(t('checklistAI.newReady'));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error(t('checklistAI.deleteError'));
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
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-foreground flex items-center justify-center gap-2">
          <Lightbulb className="h-5 w-5 text-wedding-olive" />
          {t('checklistAI.title')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t('checklistAI.subtitle')}
        </p>
      </div>

      {!checklist ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-wedding-olive" />
              {t('checklistAI.cardTitle')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                {t('checklistAI.describeLabel')}
              </label>
              <Textarea
                placeholder={t('checklistAI.placeholder')}
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
                  {t('checklistAI.generating')}
                </>
              ) : (
                <>
                  {!canUseFeature('checklist') && <Lock className="h-4 w-4 mr-2" />}
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('checklistAI.generateBtn')}
                  {!canUseFeature('checklist') && <span className="ml-1 text-xs">{t('checklistAI.premiumSuffix')}</span>}
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle>{t('checklistAI.personalizedList')}</CardTitle>
                <Badge variant="outline">
                  {t('checklistAI.percentComplete', { p: getProgressPercentage() })}
                </Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-4">
                <div 
                  className="bg-wedding-olive h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      {t('checklistAI.newListBtn')}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('checklistAI.newListAlertTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('checklistAI.newListAlertDesc')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t('checklistAI.cancel')}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => executeAction(startNewChecklist)}
                        className="bg-wedding-olive hover:bg-wedding-olive/90"
                      >
                        {t('checklistAI.confirmReset')}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportPDF}
                  disabled={isExporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? t('checklistAI.exporting') : t('checklistAI.exportPdf')}
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
                        <span className={checklist.completed_tasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}>
                          {task.label}
                        </span>
                        {task.category && (
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category}
                          </Badge>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {showAddTask ? (
                <div className="flex gap-2">
                  <Input
                    placeholder={t('checklistAI.newTaskPlaceholder')}
                    value={newTaskLabel}
                    onChange={(e) => setNewTaskLabel(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addManualTask()}
                  />
                  <Button onClick={addManualTask} disabled={!newTaskLabel.trim()}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddTask(false)}>
                    {t('checklistAI.cancel')}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddTask(true)}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('checklistAI.addManualBtn')}
                </Button>
              )}


            </CardContent>
          </Card>
        </div>
      )}
      
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
    </div>
  );
};

export default ChecklistIntelligente;