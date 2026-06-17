import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar as CalendarIcon, Loader2, Save, Download, Sparkles, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, differenceInMonths, differenceInWeeks, differenceInDays } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import { useAiUsageLimit } from '@/hooks/useAiUsageLimit';
import PremiumModal from '@/components/premium/PremiumModal';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import jsPDF from 'jspdf';

interface TimelineItem {
  period: string;
  monthsBefore: number;
  tasks: string[];
  priority: 'high' | 'medium' | 'low';
}

interface Category {
  name: string;
  color: string;
  tasks: string[];
  completed: boolean;
  dueMonthsBefore: number;
}

interface Milestone {
  title: string;
  monthsBefore: number;
  description: string;
}

interface RetroPlanningData {
  timeline: TimelineItem[];
  categories: Category[];
  milestones: Milestone[];
}

// Périodes fixes pour la frise chronologique
const TIMELINE_PERIODS = [
  { label: '12-9 mois', monthsBeforeMin: 9, monthsBeforeMax: 12 },
  { label: '8-6 mois', monthsBeforeMin: 6, monthsBeforeMax: 8 },
  { label: '5-4 mois', monthsBeforeMin: 4, monthsBeforeMax: 5 },
  { label: '3 mois', monthsBeforeMin: 3, monthsBeforeMax: 3 },
  { label: '2 mois', monthsBeforeMin: 2, monthsBeforeMax: 2 },
  { label: '1 mois', monthsBeforeMin: 1, monthsBeforeMax: 1 },
  { label: '2 semaines', monthsBeforeMin: 0.5, monthsBeforeMax: 0.5 },
  { label: 'Semaine J', monthsBeforeMin: 0.25, monthsBeforeMax: 0.25 },
  { label: 'Jour J', monthsBeforeMin: 0, monthsBeforeMax: 0 },
];

const WeddingRetroplanningEmbed = () => {
  const [weddingDate, setWeddingDate] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [retroplanning, setRetroplanning] = useState<RetroPlanningData | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [checkedMilestones, setCheckedMilestones] = useState<Set<string>>(new Set());
  const [loadedRetroplanningId, setLoadedRetroplanningId] = useState<string | null>(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(0);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { executeAction, showPremiumModal, closePremiumModal, isPremium } = usePremiumAction({
    feature: "Rétroplanning Personnalisé",
    description: "Créez votre rétroplanning de mariage intelligent avec l'IA"
  });
  const { canUseFeature, recordUsage } = useAiUsageLimit();

  // Sauvegarde automatique des tâches cochées
  useEffect(() => {
    if (!loadedRetroplanningId || !retroplanning) return;
    
    const saveProgress = async () => {
      setAutoSaveStatus('saving');
      const progressObj: Record<string, boolean> = {};
      checkedTasks.forEach(taskId => progressObj[taskId] = true);
      checkedMilestones.forEach(milestoneId => progressObj[milestoneId] = true);
      
      try {
        const { error } = await supabase
          .from('wedding_retroplanning')
          .update({ 
            progress: progressObj as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', loadedRetroplanningId);
        
        if (error) {
          console.error('❌ Auto-save error:', error);
          setAutoSaveStatus('idle');
        } else {
          console.log('✅ Auto-save success for id:', loadedRetroplanningId);
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus('idle'), 2000);
        }
      } catch (error) {
        console.error('❌ Auto-save error:', error);
        setAutoSaveStatus('idle');
      }
    };
    
    // Debounce de 1 seconde pour éviter trop d'appels
    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
    
  }, [checkedTasks, checkedMilestones, loadedRetroplanningId, retroplanning]);

  // Calculer la période actuelle basée sur la date du mariage
  const getCurrentPeriodStatus = (periodIndex: number) => {
    if (!weddingDate) return 'future';
    
    const now = new Date();
    const monthsUntilWedding = differenceInMonths(weddingDate, now);
    const weeksUntilWedding = differenceInWeeks(weddingDate, now);
    const daysUntilWedding = differenceInDays(weddingDate, now);
    
    const period = TIMELINE_PERIODS[periodIndex];
    
    // Convertir les mois en valeur comparable
    let currentMonths = monthsUntilWedding;
    if (weeksUntilWedding <= 2 && weeksUntilWedding > 1) currentMonths = 0.5;
    if (weeksUntilWedding <= 1 && daysUntilWedding > 0) currentMonths = 0.25;
    if (daysUntilWedding <= 0) currentMonths = 0;
    
    if (currentMonths < period.monthsBeforeMin) return 'past';
    if (currentMonths >= period.monthsBeforeMin && currentMonths <= period.monthsBeforeMax) return 'current';
    return 'future';
  };

  // Mapper les tâches du retroplanning aux périodes fixes
  const getTasksForPeriod = (periodIndex: number) => {
    if (!retroplanning) return [];
    
    const period = TIMELINE_PERIODS[periodIndex];
    const tasks: { task: string; taskId: string; source: string }[] = [];
    
    // Tâches de la timeline
    retroplanning.timeline.forEach((item, idx) => {
      if (item.monthsBefore >= period.monthsBeforeMin && item.monthsBefore <= period.monthsBeforeMax) {
        item.tasks.forEach((task, taskIdx) => {
          tasks.push({
            task,
            taskId: `timeline-${idx}-${taskIdx}`,
            source: item.period
          });
        });
      }
    });
    
    return tasks;
  };

  // Compter les tâches par période pour l'affichage
  const periodTaskCounts = useMemo(() => {
    if (!retroplanning) return TIMELINE_PERIODS.map(() => 0);
    return TIMELINE_PERIODS.map((_, idx) => getTasksForPeriod(idx).length);
  }, [retroplanning]);

  useEffect(() => {
    const loadExistingRetroplanning = async () => {
      const params = new URLSearchParams(window.location.search);
      const retroId = params.get('id');
      
      try {
        let data = null;

        if (retroId) {
          // Charger par ID si présent dans l'URL
          console.log('🔄 Loading retroplanning by id:', retroId);
          const { data: retroData, error } = await supabase
            .from('wedding_retroplanning')
            .select('*')
            .eq('id', retroId)
            .single();

          if (error) throw error;
          data = retroData;
        } else {
          // Sinon, charger le dernier rétroplanning de l'utilisateur
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            console.log('🔄 No user logged in, skipping load');
            return;
          }

          console.log('🔄 Loading latest retroplanning for user:', user.id);
          const { data: retroData, error } = await supabase
            .from('wedding_retroplanning')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error) throw error;
          data = retroData;
        }

        if (data) {
          console.log('✅ Retroplanning loaded:', data.id);
          setLoadedRetroplanningId(data.id);
          setWeddingDate(new Date(data.wedding_date));
          setRetroplanning({
            timeline: data.timeline_data as unknown as TimelineItem[],
            categories: data.categories as unknown as Category[],
            milestones: data.milestones as unknown as Milestone[]
          });
          
          if (data.progress && typeof data.progress === 'object') {
            const tasksSet = new Set<string>();
            const milestonesSet = new Set<string>();
            Object.entries(data.progress as Record<string, boolean>).forEach(([key, value]) => {
              if (value) {
                if (key.startsWith('milestone-')) {
                  milestonesSet.add(key);
                } else {
                  tasksSet.add(key);
                }
              }
            });
            setCheckedTasks(tasksSet);
            setCheckedMilestones(milestonesSet);
          }

          // Mettre à jour l'URL avec l'ID si pas déjà présent
          if (!retroId) {
            navigate(`${window.location.pathname}?id=${data.id}`, { replace: true });
          }

          toast({
            title: "Rétroplanning chargé",
            description: "Votre rétroplanning a été chargé avec succès.",
          });
        }
      } catch (error: any) {
        console.error('❌ Erreur lors du chargement du rétroplanning:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le rétroplanning.",
          variant: "destructive",
        });
      }
    };

    loadExistingRetroplanning();
  }, []);

  const handleGenerate = async () => {
    if (!weddingDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner la date de votre mariage",
        variant: "destructive"
      });
      return;
    }

    // Vérifier si l'utilisateur peut utiliser la fonctionnalité IA
    if (!canUseFeature('retroplanning')) {
      executeAction(() => {});
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-wedding-retroplanning', {
        body: { weddingDate: format(weddingDate, 'yyyy-MM-dd') }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la génération');
      }

      setRetroplanning(data.data);
      
      // Enregistrer l'utilisation pour les utilisateurs non-premium
      if (!isPremium) {
        await recordUsage('retroplanning');
      }
      
      toast({
        title: "✨ Rétroplanning généré",
        description: "Votre rétroplanning personnalisé est prêt"
      });
    } catch (error: any) {
      console.error('Erreur génération:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le rétroplanning",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!weddingDate || !retroplanning) return;

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Créez un compte pour sauvegarder votre rétroplanning');

      const progressObj: Record<string, boolean> = {};
      checkedTasks.forEach(taskId => {
        progressObj[taskId] = true;
      });
      checkedMilestones.forEach(milestoneId => {
        progressObj[milestoneId] = true;
      });

      if (loadedRetroplanningId) {
        console.log('🔄 Updating retroplanning:', loadedRetroplanningId);
        const { error } = await supabase
          .from('wedding_retroplanning')
          .update({
            timeline_data: JSON.parse(JSON.stringify(retroplanning.timeline)),
            categories: JSON.parse(JSON.stringify(retroplanning.categories)),
            milestones: JSON.parse(JSON.stringify(retroplanning.milestones)),
            progress: progressObj as any,
            updated_at: new Date().toISOString(),
          })
          .eq('id', loadedRetroplanningId);

        if (error) throw error;
        console.log('✅ Retroplanning updated');
      } else {
        console.log('🔄 Inserting new retroplanning');
        const { data: insertedData, error } = await supabase
          .from('wedding_retroplanning')
          .insert([{
            user_id: user.id,
            title: `Mariage du ${format(weddingDate, 'd MMMM yyyy', { locale: fr })}`,
            wedding_date: format(weddingDate, 'yyyy-MM-dd'),
            timeline_data: JSON.parse(JSON.stringify(retroplanning.timeline)),
            categories: JSON.parse(JSON.stringify(retroplanning.categories)),
            milestones: JSON.parse(JSON.stringify(retroplanning.milestones)),
            progress: progressObj as any,
          }])
          .select('id')
          .single();

        if (error) throw error;
        
        // Stocker l'ID et mettre à jour l'URL
        if (insertedData) {
          console.log('✅ Retroplanning inserted with id:', insertedData.id);
          setLoadedRetroplanningId(insertedData.id);
          navigate(`${window.location.pathname}?id=${insertedData.id}`, { replace: true });
        }
      }

      toast({
        title: "✅ Rétroplanning sauvegardé",
        description: "Vos modifications seront maintenant sauvegardées automatiquement"
      });
    } catch (error: any) {
      console.error('Erreur sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const toggleMilestone = (milestoneId: string) => {
    setCheckedMilestones(prev => {
      const newSet = new Set(prev);
      if (newSet.has(milestoneId)) {
        newSet.delete(milestoneId);
      } else {
        newSet.add(milestoneId);
      }
      return newSet;
    });
  };

  const getTotalTasksCount = () => {
    if (!retroplanning) return 0;
    return retroplanning.timeline.reduce((acc, item) => acc + item.tasks.length, 0);
  };

  const getProgress = () => {
    const total = getTotalTasksCount();
    if (total === 0) return 0;
    return Math.round((checkedTasks.size / total) * 100);
  };

  const handleDownloadChecklist = () => {
    if (!retroplanning || !weddingDate) return;

    const doc = new jsPDF();
    
    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(107, 114, 99); // wedding-olive
    doc.text('Checklist Étapes Clés - Mariage', 20, 25);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Date du mariage : ${format(weddingDate, 'd MMMM yyyy', { locale: fr })}`, 20, 35);
    
    doc.setLineWidth(0.5);
    doc.setDrawColor(107, 114, 99);
    doc.line(20, 40, 190, 40);
    
    // Milestones
    let yPos = 55;
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);
    
    retroplanning.milestones.forEach((milestone, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 25;
      }
      
      // Checkbox vide
      doc.setDrawColor(150, 150, 150);
      doc.rect(20, yPos - 4, 5, 5);
      
      // Titre
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(milestone.title, 30, yPos);
      
      // Timing
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`${milestone.monthsBefore} mois avant le mariage`, 30, yPos + 5);
      
      // Description
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      const descLines = doc.splitTextToSize(milestone.description, 155);
      doc.text(descLines, 30, yPos + 10);
      
      yPos += 25 + (descLines.length - 1) * 4;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Généré par Mariable.fr', 20, 285);
    
    doc.save(`checklist-mariage-${format(weddingDate, 'yyyy-MM-dd')}.pdf`);
    
    toast({
      title: "✅ Checklist téléchargée",
      description: "Votre checklist PDF a été générée"
    });
  };

  const getPeriodStatusColor = (status: string) => {
    switch (status) {
      case 'past': return 'bg-red-100 border-red-400 text-red-700';
      case 'current': return 'bg-orange-100 border-orange-400 text-orange-700';
      case 'future': return 'bg-green-100 border-green-400 text-green-700';
      default: return 'bg-muted border-border text-muted-foreground';
    }
  };

  const currentPeriodTasks = getTasksForPeriod(selectedPeriodIndex);
  const completedTasksInPeriod = currentPeriodTasks.filter(t => checkedTasks.has(t.taskId)).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Rétroplanning de Mariage</h1>
        <p className="text-muted-foreground">
          Générez votre planning personnalisé et dynamique avec l'IA
        </p>
      </div>

      {/* Date Selection */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Date de votre mariage</CardTitle>
          <CardDescription>
            Sélectionnez la date de votre mariage pour générer un rétroplanning adapté
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {weddingDate ? format(weddingDate, 'PPP', { locale: fr }) : 'Sélectionner une date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={weddingDate}
                onSelect={setWeddingDate}
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleGenerate}
            disabled={!weddingDate || isGenerating}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                {!canUseFeature('retroplanning') && <Lock className="mr-2 h-4 w-4" />}
                <Sparkles className="mr-2 h-4 w-4" />
                Générer le rétroplanning
                {!canUseFeature('retroplanning') && <span className="ml-1 text-xs">(Premium)</span>}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Message d'attente pendant la génération */}
      {isGenerating && (
        <Card className="border-wedding-olive/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-wedding-olive" />
              <p className="text-lg font-medium text-center">
                ⏳ Cela peut prendre une minute, notre intelligence artificielle réfléchit...
              </p>
              <Progress className="w-full h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Retroplanning */}
      {retroplanning && (
        <>
          {/* Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progression globale</span>
                <span className="text-2xl font-bold text-wedding-olive">{getProgress()}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={getProgress()} className="h-3" />
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-muted-foreground">
                  {checkedTasks.size} / {getTotalTasksCount()} tâches complétées
                </p>
                {autoSaveStatus === 'saving' && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Sauvegarde...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    ✓ Sauvegardé
                  </span>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Frise chronologique horizontale */}
          <Card>
            <CardHeader>
              <CardTitle>📋 Timeline du projet</CardTitle>
              <CardDescription>Cliquez sur une période pour voir les tâches associées</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Navigation mobile */}
              <div className="flex items-center gap-2 mb-4 sm:hidden">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSelectedPeriodIndex(Math.max(0, selectedPeriodIndex - 1))}
                  disabled={selectedPeriodIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1 text-center">
                  <span className="font-semibold">{TIMELINE_PERIODS[selectedPeriodIndex].label}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setSelectedPeriodIndex(Math.min(TIMELINE_PERIODS.length - 1, selectedPeriodIndex + 1))}
                  disabled={selectedPeriodIndex === TIMELINE_PERIODS.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Frise desktop */}
              <ScrollArea className="w-full hidden sm:block">
                <div className="flex items-center gap-2 pb-4 min-w-max">
                  {TIMELINE_PERIODS.map((period, idx) => {
                    const status = getCurrentPeriodStatus(idx);
                    const taskCount = periodTaskCounts[idx];
                    const isSelected = selectedPeriodIndex === idx;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedPeriodIndex(idx)}
                        className={`
                          relative flex flex-col items-center px-4 py-3 rounded-lg border-2 transition-all min-w-[100px]
                          ${isSelected 
                            ? 'bg-wedding-olive text-white border-wedding-olive shadow-lg scale-105' 
                            : getPeriodStatusColor(status)
                          }
                          hover:scale-105 cursor-pointer
                        `}
                      >
                        <span className="text-sm font-semibold whitespace-nowrap">{period.label}</span>
                        <span className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'opacity-70'}`}>
                          {taskCount} tâche{taskCount > 1 ? 's' : ''}
                        </span>
                        {status === 'current' && !isSelected && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Légende */}
              <div className="flex flex-wrap gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span>Passé/Urgent</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-orange-400" />
                  <span>En cours</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span>À venir</span>
                </div>
              </div>

              {/* Tâches de la période sélectionnée */}
              <div className="mt-6 border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">
                    {TIMELINE_PERIODS[selectedPeriodIndex].label}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    {completedTasksInPeriod}/{currentPeriodTasks.length} complétées
                  </span>
                </div>
                
                {currentPeriodTasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Aucune tâche pour cette période
                  </p>
                ) : (
                  <div className="space-y-2">
                    {currentPeriodTasks.map(({ task, taskId }) => (
                      <div 
                        key={taskId} 
                        className="flex items-start gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Checkbox
                          checked={checkedTasks.has(taskId)}
                          onCheckedChange={() => toggleTask(taskId)}
                        />
                        <span className={checkedTasks.has(taskId) ? 'line-through text-muted-foreground' : ''}>
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Étapes clés avec checklist téléchargeable */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>🎯 Étapes clés</CardTitle>
                <CardDescription>Les moments importants à ne pas manquer</CardDescription>
              </div>
              <Button variant="outline" onClick={handleDownloadChecklist}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {retroplanning.milestones.map((milestone, idx) => {
                  const milestoneId = `milestone-${idx}`;
                  const isChecked = checkedMilestones.has(milestoneId);
                  
                  return (
                    <div 
                      key={idx} 
                      className={`flex items-start gap-4 p-4 border rounded-lg transition-colors ${
                        isChecked ? 'bg-muted/50 border-wedding-olive/30' : 'hover:bg-muted'
                      }`}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleMilestone(milestoneId)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className={`font-semibold ${isChecked ? 'line-through text-muted-foreground' : ''}`}>
                          {milestone.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          📅 {milestone.monthsBefore} mois avant le mariage
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-wedding-olive hover:bg-wedding-olive/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" />
                  Sauvegarder dans mon dashboard
                </>
              )}
            </Button>
          </div>
        </>
      )}

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature="Rétroplanning Personnalisé"
        description="Créez votre rétroplanning de mariage intelligent avec l'IA"
      />
    </div>
  );
};

export default WeddingRetroplanningEmbed;
