import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { PlanningEvent } from '../wedding-day/types/planningTypes';

interface WeddingTask {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface ProjectAISuggestionsModalProps {
  coordinationId: string;
  onTasksAdded: (tasks: PlanningEvent[]) => void;
  onClose: () => void;
}

// Tâches prédéfinies pour l'organisation d'un mariage
const WEDDING_TASKS: WeddingTask[] = [
  // Budget et finances
  {
    id: 'budget-1',
    title: 'Définir le budget total du mariage',
    description: 'Établir un budget réaliste en fonction de vos moyens et priorités',
    category: 'Budget et finances',
    priority: 'high',
    timeframe: '12-18 mois avant'
  },
  {
    id: 'budget-2',
    title: 'Ouvrir un compte épargne mariage',
    description: 'Créer un compte dédié pour économiser et gérer les dépenses',
    category: 'Budget et finances',
    priority: 'medium',
    timeframe: '12-18 mois avant'
  },
  
  // Recherche prestataires
  {
    id: 'vendor-1',
    title: 'Réserver le lieu de réception',
    description: 'Visiter et réserver votre salle de mariage',
    category: 'Recherche prestataires',
    priority: 'high',
    timeframe: '12-18 mois avant'
  },
  {
    id: 'vendor-2',
    title: 'Choisir et réserver le photographe',
    description: 'Sélectionner un photographe pour immortaliser votre jour J',
    category: 'Recherche prestataires',
    priority: 'high',
    timeframe: '8-12 mois avant'
  },
  {
    id: 'vendor-3',
    title: 'Réserver le traiteur',
    description: 'Organiser une dégustation et signer le contrat traiteur',
    category: 'Recherche prestataires',
    priority: 'high',
    timeframe: '6-8 mois avant'
  },
  {
    id: 'vendor-4',
    title: 'Réserver le DJ ou groupe de musique',
    description: 'Choisir l\'animation musicale pour la soirée',
    category: 'Recherche prestataires',
    priority: 'medium',
    timeframe: '6-8 mois avant'
  },
  
  // Administratif
  {
    id: 'admin-1',
    title: 'Choisir la date du mariage',
    description: 'Fixer la date définitive en tenant compte des disponibilités',
    category: 'Administratif',
    priority: 'high',
    timeframe: '12-18 mois avant'
  },
  {
    id: 'admin-2',
    title: 'Réserver la mairie',
    description: 'Prendre RDV et réserver votre créneau en mairie',
    category: 'Administratif',
    priority: 'high',
    timeframe: '12 mois avant'
  },
  {
    id: 'admin-3',
    title: 'Rassembler les documents d\'état civil',
    description: 'Préparer tous les papiers nécessaires pour le mariage civil',
    category: 'Administratif',
    priority: 'medium',
    timeframe: '2-3 mois avant'
  },
  
  // Shopping et achats
  {
    id: 'shopping-1',
    title: 'Choisir la robe de mariée',
    description: 'Essayer et commander votre robe de rêve',
    category: 'Shopping et achats',
    priority: 'high',
    timeframe: '6-8 mois avant'
  },
  {
    id: 'shopping-2',
    title: 'Choisir le costume du marié',
    description: 'Sélectionner et commander le costume ou smoking',
    category: 'Shopping et achats',
    priority: 'medium',
    timeframe: '3-4 mois avant'
  },
  {
    id: 'shopping-3',
    title: 'Acheter les alliances',
    description: 'Choisir vos alliances et prévoir la gravure',
    category: 'Shopping et achats',
    priority: 'high',
    timeframe: '2-3 mois avant'
  },
  
  // Communication
  {
    id: 'comm-1',
    title: 'Créer la liste des invités',
    description: 'Établir la liste définitive avec les adresses',
    category: 'Communication',
    priority: 'medium',
    timeframe: '6-8 mois avant'
  },
  {
    id: 'comm-2',
    title: 'Envoyer les faire-part',
    description: 'Concevoir et envoyer les invitations',
    category: 'Communication',
    priority: 'medium',
    timeframe: '2-3 mois avant'
  },
  {
    id: 'comm-3',
    title: 'Créer un site web de mariage',
    description: 'Informer vos invités avec un site dédié',
    category: 'Communication',
    priority: 'low',
    timeframe: '3-4 mois avant'
  },
  
  // Planification
  {
    id: 'plan-1',
    title: 'Organiser le plan de table',
    description: 'Répartir vos invités selon les affinités',
    category: 'Planification',
    priority: 'medium',
    timeframe: '1 mois avant'
  },
  {
    id: 'plan-2',
    title: 'Planifier la décoration',
    description: 'Choisir le thème et organiser la déco',
    category: 'Planification',
    priority: 'medium',
    timeframe: '2-3 mois avant'
  },
  {
    id: 'plan-3',
    title: 'Organiser l\'enterrement de vie',
    description: 'Planifier vos soirées EVJF/EVG',
    category: 'Planification',
    priority: 'low',
    timeframe: '1-2 mois avant'
  }
];

const ProjectAISuggestionsModal: React.FC<ProjectAISuggestionsModalProps> = ({
  coordinationId,
  onTasksAdded,
  onClose
}) => {
  const { toast } = useToast();
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTaskToggle = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => 
      checked 
        ? [...prev, taskId]
        : prev.filter(id => id !== taskId)
    );
  };

  const handleSelectAll = () => {
    if (selectedTasks.length === WEDDING_TASKS.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(WEDDING_TASKS.map(task => task.id));
    }
  };

  const handleAddSelectedTasks = async () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "Aucune tâche sélectionnée",
        description: "Veuillez sélectionner au moins une tâche",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const tasksToAdd = WEDDING_TASKS.filter(task => selectedTasks.includes(task.id));
      
      // Créer les événements pour l'interface
      const newEvents: PlanningEvent[] = tasksToAdd.map((task, index) => {
        const baseDate = new Date();
        baseDate.setHours(9, 0, 0, 0);
        
        return {
          id: `temp-${Date.now()}-${index}`, // ID temporaire
          title: task.title,
          notes: task.description,
          startTime: baseDate,
          endTime: new Date(baseDate.getTime() + 30 * 60000), // 30 minutes par défaut
          duration: 30,
          category: task.category,
          type: task.category,
          
          assignedTo: []
        };
      });

      onTasksAdded(newEvents);
      
      toast({
        title: "Tâches ajoutées",
        description: `${selectedTasks.length} tâche${selectedTasks.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'} à votre TODO List`
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error adding AI suggestions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les tâches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case 'medium':
        return <Clock className="h-3 w-3 text-amber-600" />;
      default:
        return <Clock className="h-3 w-3 text-green-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const groupedTasks = WEDDING_TASKS.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, WeddingTask[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-medium">Suggestions IA pour votre mariage</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Sélectionnez les tâches que vous souhaitez ajouter à votre TODO List. 
        Ces suggestions sont basées sur les étapes clés de l'organisation d'un mariage.
      </p>

      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
        >
          {selectedTasks.length === WEDDING_TASKS.length ? 'Tout désélectionner' : 'Tout sélectionner'}
        </Button>
        
        <Badge variant="secondary">
          {selectedTasks.length} tâche{selectedTasks.length > 1 ? 's' : ''} sélectionnée{selectedTasks.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.entries(groupedTasks).map(([category, tasks]) => (
          <div key={category}>
            <h4 className="font-medium text-gray-900 mb-2 sticky top-0 bg-white py-1">
              {category}
            </h4>
            <div className="space-y-2">
              {tasks.map((task) => (
                <Card key={task.id} className="cursor-pointer hover:bg-gray-50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => 
                          handleTaskToggle(task.id, checked as boolean)
                        }
                        className="mt-1"
                      />
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h5 className="font-medium text-sm">{task.title}</h5>
                          <div className="flex items-center gap-1 ml-2">
                            {getPriorityIcon(task.priority)}
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getPriorityColor(task.priority)}`}
                            >
                              {task.priority === 'high' ? 'Élevée' : 
                               task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {task.timeframe}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button 
          onClick={handleAddSelectedTasks}
          disabled={isLoading || selectedTasks.length === 0}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {isLoading ? 'Ajout...' : `Ajouter ${selectedTasks.length} tâche${selectedTasks.length > 1 ? 's' : ''}`}
        </Button>
        <Button variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default ProjectAISuggestionsModal;