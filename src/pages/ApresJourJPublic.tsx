import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Loader2, Download, Calendar, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { exportApresJourJToPDF } from "@/services/apresJourJExportService";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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
  tasks: Task[];
  completed_tasks: string[];
  created_at: string;
}

const ApresJourJPublic: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [checklistData, setChecklistData] = useState<ChecklistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPublicChecklist = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Validate the token directly
        const { data: tokenData, error: tokenError } = await supabase
          .from('apres_jour_j_share_tokens')
          .select('checklist_id, is_active, expires_at')
          .eq('token', token)
          .eq('is_active', true)
          .single();

        if (tokenError || !tokenData) {
          console.error('Token validation error:', tokenError);
          setIsLoading(false);
          return;
        }

        // Check if token is expired
        if (tokenData.expires_at && new Date(tokenData.expires_at) < new Date()) {
          console.error('Token expired');
          setIsLoading(false);
          return;
        }

        // Load the checklist
        const { data: checklistData, error: checklistError } = await supabase
          .from('planning_apres_jour_j')
          .select('*')
          .eq('id', tokenData.checklist_id)
          .single();

        if (checklistError || !checklistData) {
          console.error('Checklist loading error:', checklistError);
          setIsLoading(false);
          return;
        }

        setChecklistData({
          id: checklistData.id,
          title: checklistData.title,
          tasks: (checklistData.tasks as unknown as Task[]) || [],
          completed_tasks: (checklistData.completed_tasks as unknown as string[]) || [],
          created_at: checklistData.created_at
        });

      } catch (error) {
        console.error('Erreur lors du chargement de la checklist publique:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublicChecklist();
  }, [token]);

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
          description: "La checklist a été exportée en PDF.",
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

  const getProgressPercentage = () => {
    if (!checklistData || checklistData.tasks.length === 0) return 0;
    return Math.round((checklistData.completed_tasks.length / checklistData.tasks.length) * 100);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span>Chargement de la checklist...</span>
        </div>
      </div>
    );
  }

  if (!checklistData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Checklist introuvable</h1>
            <p className="text-muted-foreground mb-4">
              Cette checklist n'existe pas ou le lien de partage n'est plus valide.
            </p>
            <p className="text-sm text-muted-foreground">
              Veuillez vérifier le lien ou contacter la personne qui vous l'a partagé.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group tasks by category
  const groupedTasks = checklistData.tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-bold">{checklistData.title}</CardTitle>
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
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  Créée le {format(new Date(checklistData.created_at), 'dd MMMM yyyy', { locale: fr })}
                </span>
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
            {Object.entries(groupedTasks).map(([category, tasks]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.filter(task => checklistData.completed_tasks.includes(task.id)).length}/{tasks.length} terminée{tasks.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-2 mb-6">
                  {tasks.map((task) => {
                    const isCompleted = checklistData.completed_tasks.includes(task.id);
                    return (
                      <div key={task.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                        <div className="mt-1">
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {task.icon && <span className="text-lg">{task.icon}</span>}
                            <span
                              className={`text-sm font-medium ${
                                isCompleted 
                                  ? 'line-through text-muted-foreground' 
                                  : ''
                              }`}
                            >
                              {task.label}
                            </span>
                          </div>
                          {task.description && (
                            <p className={`text-sm text-muted-foreground ${
                              isCompleted ? 'line-through' : ''
                            }`}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <div className="text-center py-4 border-t">
              <p className="text-sm text-muted-foreground">
                Mode consultation publique - Vous consultez cette checklist en lecture seule
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApresJourJPublic;