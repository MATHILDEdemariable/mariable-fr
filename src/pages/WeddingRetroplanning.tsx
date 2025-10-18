import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Loader2, Save, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import PremiumHeader from '@/components/home/PremiumHeader';
import { useNavigate } from 'react-router-dom';

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

const WeddingRetroplanning = () => {
  const [weddingDate, setWeddingDate] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [retroplanning, setRetroplanning] = useState<RetroPlanningData | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [loadedRetroplanningId, setLoadedRetroplanningId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Charger un retroplanning existant depuis l'URL
  useEffect(() => {
    const loadExistingRetroplanning = async () => {
      const params = new URLSearchParams(window.location.search);
      const retroId = params.get('id');
      
      if (!retroId) return;

      try {
        const { data, error } = await supabase
          .from('wedding_retroplanning')
          .select('*')
          .eq('id', retroId)
          .single();

        if (error) throw error;

        if (data) {
          setLoadedRetroplanningId(retroId);
          setWeddingDate(new Date(data.wedding_date));
          setRetroplanning({
            timeline: data.timeline_data as unknown as TimelineItem[],
            categories: data.categories as unknown as Category[],
            milestones: data.milestones as unknown as Milestone[]
          });
          
          // Charger la progression si elle existe
          if (data.progress && typeof data.progress === 'object') {
            const tasksSet = new Set<string>();
            Object.entries(data.progress as Record<string, boolean>).forEach(([key, value]) => {
              if (value) tasksSet.add(key);
            });
            setCheckedTasks(tasksSet);
          }

          toast({
            title: "Rétroplanning chargé",
            description: "Votre rétroplanning a été chargé avec succès.",
          });
        }
      } catch (error: any) {
        console.error('Erreur lors du chargement du rétroplanning:', error);
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

      // Convertir le Set en objet pour la sauvegarde
      const progressObj: Record<string, boolean> = {};
      checkedTasks.forEach(taskId => {
        progressObj[taskId] = true;
      });

      // Si on a déjà un ID chargé, on fait un UPDATE au lieu d'un INSERT
      if (loadedRetroplanningId) {
        const { error } = await supabase
          .from('wedding_retroplanning')
          .update({
            timeline_data: JSON.parse(JSON.stringify(retroplanning.timeline)),
            categories: JSON.parse(JSON.stringify(retroplanning.categories)),
            milestones: JSON.parse(JSON.stringify(retroplanning.milestones)),
            progress: progressObj as any,
          })
          .eq('id', loadedRetroplanningId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('wedding_retroplanning')
          .insert([{
            user_id: user.id,
            title: `Mariage du ${format(weddingDate, 'd MMMM yyyy', { locale: fr })}`,
            wedding_date: format(weddingDate, 'yyyy-MM-dd'),
            timeline_data: JSON.parse(JSON.stringify(retroplanning.timeline)),
            categories: JSON.parse(JSON.stringify(retroplanning.categories)),
            milestones: JSON.parse(JSON.stringify(retroplanning.milestones)),
            progress: progressObj as any,
          }]);

        if (error) throw error;
      }

      toast({
        title: "✅ Rétroplanning sauvegardé",
        description: "Vous pouvez le retrouver dans votre dashboard"
      });

      navigate('/dashboard/mon-mariage');
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

  const getTotalTasksCount = () => {
    if (!retroplanning) return 0;
    const timelineTasks = retroplanning.timeline.reduce((acc, item) => acc + item.tasks.length, 0);
    const categoryTasks = retroplanning.categories.reduce((acc, cat) => acc + cat.tasks.length, 0);
    return timelineTasks + categoryTasks;
  };

  const getProgress = () => {
    const total = getTotalTasksCount();
    if (total === 0) return 0;
    return Math.round((checkedTasks.size / total) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <>
      <PremiumHeader />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-12 page-content-premium">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Rétroplanning de Mariage
            </h1>
            <p className="text-lg text-gray-600">
              Générez votre planning personnalisé et dynamique avec l'IA
            </p>
          </div>

          {/* Date Selection */}
          <Card className="mb-8">
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
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer le rétroplanning
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Retroplanning */}
          {retroplanning && (
            <>
              {/* Progress */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Progression globale</span>
                    <span className="text-2xl font-bold text-wedding-olive">{getProgress()}%</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={getProgress()} className="h-3" />
                  <p className="text-sm text-gray-600 mt-2">
                    {checkedTasks.size} / {getTotalTasksCount()} tâches complétées
                  </p>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>📋 Timeline du projet</CardTitle>
                  <CardDescription>Organisation chronologique par périodes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {retroplanning.timeline.map((item, idx) => (
                      <AccordionItem key={idx} value={`timeline-${idx}`}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(item.priority)}`}>
                              {item.priority === 'high' ? 'Urgent' : item.priority === 'medium' ? 'Important' : 'Normal'}
                            </span>
                            <span className="font-semibold">{item.period}</span>
                            <span className="text-sm text-gray-500">
                              ({item.tasks.length} tâches)
                            </span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pt-2">
                            {item.tasks.map((task, taskIdx) => {
                              const taskId = `timeline-${idx}-${taskIdx}`;
                              return (
                                <div key={taskIdx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                                  <Checkbox
                                    checked={checkedTasks.has(taskId)}
                                    onCheckedChange={() => toggleTask(taskId)}
                                  />
                                  <span className={checkedTasks.has(taskId) ? 'line-through text-gray-400' : ''}>
                                    {task}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Categories */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {retroplanning.categories.map((cat, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </CardTitle>
                      <CardDescription>
                        À faire {cat.dueMonthsBefore} mois avant le mariage
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {cat.tasks.map((task, taskIdx) => {
                          const taskId = `cat-${idx}-${taskIdx}`;
                          return (
                            <div key={taskIdx} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded">
                              <Checkbox
                                checked={checkedTasks.has(taskId)}
                                onCheckedChange={() => toggleTask(taskId)}
                              />
                              <span className={checkedTasks.has(taskId) ? 'line-through text-gray-400' : ''}>
                                {task}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Milestones */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>🎯 Étapes clés</CardTitle>
                  <CardDescription>Les moments importants à ne pas manquer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {retroplanning.milestones.map((milestone, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50">
                        <CheckCircle2 className="w-5 h-5 text-wedding-olive mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg">{milestone.title}</h4>
                          <p className="text-sm text-gray-600">{milestone.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {milestone.monthsBefore} mois avant le mariage
                          </p>
                        </div>
                      </div>
                    ))}
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
        </div>
      </div>
    </>
  );
};

export default WeddingRetroplanning;