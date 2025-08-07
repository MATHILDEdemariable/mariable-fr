import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle2, Circle, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { exportAvantJourJToPDF } from "@/services/avantJourJExportService";
import SEO from "@/components/SEO";

interface Task {
  label: string;
  description?: string;
  priority?: string;
  category?: string;
  icon?: string;
}

interface ChecklistData {
  id: string;
  title: string;
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
  updated_at: string;
}

export default function AvantJourJPublic() {
  const { token } = useParams<{ token: string }>();
  const [checklist, setChecklist] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadChecklistData = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔍 Validation du token:', token);
        
        // Valider le token
        const { data: tokenData, error: tokenError } = await supabase
          .rpc('validate_avant_jour_j_share_token', { token_value: token });

        if (tokenError) {
          console.error('❌ Erreur validation token:', tokenError);
          throw tokenError;
        }

        if (!tokenData || tokenData.length === 0 || !tokenData[0]?.is_valid) {
          console.log('❌ Token invalide ou expiré');
          throw new Error('Token invalide ou expiré');
        }

        const checklistId = tokenData[0].checklist_id;
        console.log('✅ Token valide, checklist ID:', checklistId);

        // Récupérer les données de la checklist
        const { data: checklistData, error: checklistError } = await supabase
          .from('planning_avant_jour_j')
          .select('*')
          .eq('id', checklistId)
          .single();

        if (checklistError) {
          console.error('❌ Erreur récupération checklist:', checklistError);
          throw checklistError;
        }

        console.log('✅ Données checklist récupérées:', checklistData);
        setChecklist({
          ...checklistData,
          tasks: Array.isArray(checklistData.tasks) ? checklistData.tasks as unknown as Task[] : [],
          completed_tasks: Array.isArray(checklistData.completed_tasks) ? checklistData.completed_tasks as unknown as string[] : []
        });

      } catch (error) {
        console.error('❌ Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la checklist. Vérifiez que le lien est correct.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadChecklistData();
  }, [token, toast]);

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
        toast({
          title: "Export réussi",
          description: "Le PDF a été téléchargé avec succès",
        });
      } else {
        throw new Error('Échec de l\'export');
      }
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const getProgressPercentage = () => {
    if (!checklist || checklist.tasks.length === 0) return 0;
    return Math.round((checklist.completed_tasks.length / checklist.tasks.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-orange-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Urgent';
      case 'medium':
        return 'Moyen';
      case 'low':
        return 'Faible';
      default:
        return 'Normal';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title="Chargement de la checklist | Mariable" 
          description="Chargement de la checklist avant le jour J"
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!checklist) {
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title="Checklist introuvable | Mariable" 
          description="La checklist demandée n'a pas été trouvée"
        />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Checklist introuvable</h2>
                <p className="text-muted-foreground">
                  Cette checklist n'existe pas ou le lien de partage a expiré.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Grouper les tâches par catégorie
  const tasksByCategory = checklist.tasks.reduce((acc, task) => {
    const category = task.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${checklist.title} | Mariable`}
        description="Checklist avant le jour J - Consultez les tâches de préparation du mariage"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <Calendar className="h-6 w-6" />
                    {checklist.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Créée le {new Date(checklist.created_at).toLocaleDateString('fr-FR')}</span>
                    <Badge variant="outline">
                      {getProgressPercentage()}% complété
                    </Badge>
                    <Badge variant="outline">
                      {checklist.completed_tasks.length}/{checklist.tasks.length} tâches
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleExportPDF} disabled={isExporting}>
                  <Download className="h-4 w-4 mr-2" />
                  {isExporting ? 'Export...' : 'Exporter PDF'}
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Notice mode public */}
          <Card className="mb-6 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-4">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Mode consultation :</strong> Vous consultez cette checklist en lecture seule. 
                Seul le propriétaire peut modifier les tâches.
              </p>
            </CardContent>
          </Card>

          {/* Tâches par catégorie */}
          {Object.entries(tasksByCategory).map(([category, tasks]) => (
            <Card key={category} className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task, index) => {
                    const isCompleted = checklist.completed_tasks.includes(task.label);
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                          isCompleted 
                            ? 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800' 
                            : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`font-medium leading-relaxed ${
                              isCompleted ? 'line-through text-muted-foreground' : ''
                            }`}>
                              {task.label}
                            </p>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {task.icon && (
                                <span className="text-lg">{task.icon}</span>
                              )}
                              {task.priority && task.priority !== 'medium' && (
                                <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                  {getPriorityLabel(task.priority)}
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground py-8">
            <p>Généré par <strong>Mariable.fr</strong> - Votre assistant mariage</p>
          </div>
        </div>
      </div>
    </div>
  );
}