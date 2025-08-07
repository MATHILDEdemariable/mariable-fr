import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Plus } from "lucide-react";

interface Task {
  id: string;
  label: string;
  description?: string;
  priority: "low" | "medium" | "high";
  category: string;
  icon?: string;
}

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTasks: (tasks: Task[]) => void;
  existingTasks: Task[];
}

const SUGGESTED_TASKS: Task[] = [
  // NETTOYAGE
  {
    id: 'clean-1',
    label: 'Ranger la décoration de la salle',
    description: 'Démonter et emballer tous les éléments décoratifs',
    priority: 'high',
    category: 'NETTOYAGE',
    icon: '🧹'
  },
  {
    id: 'clean-2',
    label: 'Faire le ménage de la salle',
    description: 'Nettoyer la salle de réception et espaces utilisés',
    priority: 'high',
    category: 'NETTOYAGE',
    icon: '🧽'
  },
  {
    id: 'clean-3',
    label: 'Nettoyer la robe de mariée',
    description: 'Faire nettoyer et conserver la robe',
    priority: 'medium',
    category: 'NETTOYAGE',
    icon: '👗'
  },

  // RÉCUPÉRATION
  {
    id: 'retrieve-1',
    label: 'Récupérer l\'urne et les cadeaux',
    description: 'Rassembler tous les cadeaux et l\'urne de mariage',
    priority: 'high',
    category: 'RÉCUPÉRATION',
    icon: '🎁'
  },
  {
    id: 'retrieve-2',
    label: 'Récupérer les restes du traiteur',
    description: 'Récupérer les boissons, vin et nourriture restants',
    priority: 'medium',
    category: 'RÉCUPÉRATION',
    icon: '🍾'
  },
  {
    id: 'retrieve-3',
    label: 'Récupérer les affaires personnelles',
    description: 'Vérifier que tous les effets personnels sont récupérés',
    priority: 'medium',
    category: 'RÉCUPÉRATION',
    icon: '👜'
  },
  {
    id: 'retrieve-4',
    label: 'Récupérer les cartes mémoire photos/vidéos',
    description: 'Collecter toutes les cartes mémoire des photographes et invités',
    priority: 'high',
    category: 'RÉCUPÉRATION',
    icon: '📷'
  },

  // RETOURS
  {
    id: 'return-1',
    label: 'Retourner le mobilier de location',
    description: 'Rendre tables, chaises, vaisselle et matériel loué',
    priority: 'high',
    category: 'RETOURS',
    icon: '🪑'
  },
  {
    id: 'return-2',
    label: 'Retourner les costumes/robes',
    description: 'Rendre les tenues louées pour le mariage',
    priority: 'medium',
    category: 'RETOURS',
    icon: '🤵'
  },
  {
    id: 'return-3',
    label: 'Retourner la décoration louée',
    description: 'Rendre les éléments décoratifs loués',
    priority: 'medium',
    category: 'RETOURS',
    icon: '🎨'
  },

  // DISTRIBUTION
  {
    id: 'distribute-1',
    label: 'Distribuer les fleurs restantes',
    description: 'Offrir les compositions florales aux invités ou famille',
    priority: 'low',
    category: 'DISTRIBUTION',
    icon: '💐'
  },
  {
    id: 'distribute-2',
    label: 'Distribuer les centres de table',
    description: 'Proposer les centres de table aux invités',
    priority: 'low',
    category: 'DISTRIBUTION',
    icon: '🌸'
  },

  // COMMUNICATION
  {
    id: 'comm-1',
    label: 'Envoyer les remerciements',
    description: 'Rédiger et envoyer les cartes de remerciements',
    priority: 'medium',
    category: 'COMMUNICATION',
    icon: '💌'
  },
  {
    id: 'comm-2',
    label: 'Partager les photos du mariage',
    description: 'Créer un album partagé pour les invités',
    priority: 'medium',
    category: 'COMMUNICATION',
    icon: '📸'
  },
  {
    id: 'comm-3',
    label: 'Mettre à jour le statut sur les réseaux',
    description: 'Changer le statut relationnel sur les réseaux sociaux',
    priority: 'low',
    category: 'COMMUNICATION',
    icon: '💍'
  },

  // PAIEMENTS
  {
    id: 'payment-1',
    label: 'Payer les prestataires restants',
    description: 'Régler les soldes des fournisseurs de services',
    priority: 'high',
    category: 'PAIEMENTS',
    icon: '💳'
  },
  {
    id: 'payment-2',
    label: 'Vérifier les factures finales',
    description: 'Contrôler toutes les factures de prestations',
    priority: 'medium',
    category: 'PAIEMENTS',
    icon: '🧾'
  },
  {
    id: 'payment-3',
    label: 'Réclamer les cautions',
    description: 'Récupérer les dépôts de garantie auprès des prestataires',
    priority: 'medium',
    category: 'PAIEMENTS',
    icon: '💰'
  }
];

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({
  isOpen,
  onClose,
  onAddTasks,
  existingTasks
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'NETTOYAGE': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'RÉCUPÉRATION': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'RETOURS': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'DISTRIBUTION': 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      'COMMUNICATION': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'PAIEMENTS': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const addSelectedTasks = () => {
    const tasksToAdd = SUGGESTED_TASKS.filter(task => selectedTasks.includes(task.id));
    const uniqueTasksToAdd = tasksToAdd.filter(task => 
      !existingTasks.some(existingTask => 
        existingTask.label.toLowerCase() === task.label.toLowerCase()
      )
    );
    
    if (uniqueTasksToAdd.length > 0) {
      onAddTasks(uniqueTasksToAdd);
      setSelectedTasks([]);
      onClose();
    }
  };

  const groupedTasks = SUGGESTED_TASKS.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const isTaskAlreadyAdded = (task: Task) => {
    return existingTasks.some(existingTask => 
      existingTask.label.toLowerCase() === task.label.toLowerCase()
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            Suggestions de tâches après le jour-J
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Sélectionnez les tâches que vous souhaitez ajouter à votre checklist. 
            Les tâches déjà présentes dans votre liste sont grisées.
          </p>

          {Object.entries(groupedTasks).map(([category, tasks]) => (
            <Card key={category}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Badge className={getCategoryColor(category)}>
                    {category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tasks.length} suggestion{tasks.length > 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const alreadyAdded = isTaskAlreadyAdded(task);
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-start space-x-3 p-3 border rounded-lg ${
                          alreadyAdded ? 'opacity-50 bg-muted' : 'hover:bg-muted/50'
                        }`}
                      >
                        <Checkbox
                          id={task.id}
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => !alreadyAdded && toggleTaskSelection(task.id)}
                          disabled={alreadyAdded}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {task.icon && <span className="text-lg">{task.icon}</span>}
                            <label
                              htmlFor={task.id}
                              className={`text-sm font-medium cursor-pointer ${
                                alreadyAdded ? 'line-through' : ''
                              }`}
                            >
                              {task.label}
                              {alreadyAdded && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  (déjà ajoutée)
                                </span>
                              )}
                            </label>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
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

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              {selectedTasks.length} tâche{selectedTasks.length !== 1 ? 's' : ''} sélectionnée{selectedTasks.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={addSelectedTasks}
                disabled={selectedTasks.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter les tâches sélectionnées
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};