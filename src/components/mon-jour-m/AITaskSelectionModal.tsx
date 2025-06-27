
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Sparkles } from 'lucide-react';
import { PlanningTask } from '@/types/monjourm-mvp';

interface SuggestedTask {
  title: string;
  description: string;
  start_time: string;
  duration: number;
  category: string;
  priority: "low" | "medium" | "high";
  assigned_role?: string;
}

interface AITaskSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksSelected: (tasks: SuggestedTask[]) => void;
  existingTasks: PlanningTask[];
}

const AITaskSelectionModal: React.FC<AITaskSelectionModalProps> = ({
  isOpen,
  onClose,
  onTasksSelected,
  existingTasks
}) => {
  const [selectedTasks, setSelectedTasks] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);

  // Tâches suggérées par l'IA (simulation)
  const suggestedTasks: SuggestedTask[] = [
    {
      title: "Accueil des invités",
      description: "Placement des invités et distribution des programmes",
      start_time: "14:00",
      duration: 30,
      category: "Arrivée",
      priority: "high",
      assigned_role: "Témoin(s)"
    },
    {
      title: "Cérémonie laïque",
      description: "Déroulement de la cérémonie avec échange des vœux",
      start_time: "14:30",
      duration: 45,
      category: "Cérémonie",
      priority: "high",
      assigned_role: "Célébrant"
    },
    {
      title: "Cocktail et photos",
      description: "Vin d'honneur et séance photos avec les invités",
      start_time: "15:15",
      duration: 90,
      category: "Cocktail",
      priority: "medium",
      assigned_role: "Photographe"
    },
    {
      title: "Ouverture de bal",
      description: "Première danse des mariés",
      start_time: "21:00",
      duration: 15,
      category: "Animation",
      priority: "medium",
      assigned_role: "DJ/Musiciens"
    },
    {
      title: "Préparation des mariés",
      description: "Coiffure, maquillage et habillage",
      start_time: "10:00",
      duration: 180,
      category: "Préparation",
      priority: "high",
      assigned_role: "Coiffeur/Maquilleur"
    },
    {
      title: "Installation florale",
      description: "Mise en place de la décoration florale",
      start_time: "12:00",
      duration: 60,
      category: "Logistique",
      priority: "medium",
      assigned_role: "Fleuriste"
    }
  ];

  const handleTaskToggle = (index: number) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === suggestedTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(suggestedTasks.map((_, index) => index)));
    }
  };

  const handleAddSelectedTasks = async () => {
    const tasksToAdd = Array.from(selectedTasks).map(index => suggestedTasks[index]);
    
    if (tasksToAdd.length === 0) return;

    setIsGenerating(true);
    
    try {
      await onTasksSelected(tasksToAdd);
      setSelectedTasks(new Set());
      onClose();
    } catch (error) {
      console.error('❌ Erreur ajout tâches sélectionnées:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  };

  const addMinutesToTime = (timeString: string, minutes: number): string => {
    const [hour, minute] = timeString.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + minutes;
    const newHour = Math.floor(totalMinutes / 60) % 24;
    const newMinute = totalMinutes % 60;
    return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-wedding-olive" />
            Suggestions IA pour votre planning
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Sélectionnez les tâches que vous souhaitez ajouter à votre planning
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
            >
              {selectedTasks.size === suggestedTasks.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </Button>
          </div>

          <div className="grid gap-3">
            {suggestedTasks.map((task, index) => {
              const endTime = addMinutesToTime(task.start_time, task.duration);
              const isSelected = selectedTasks.has(index);

              return (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-wedding-olive bg-wedding-olive/5' : 'hover:shadow-md'
                  }`}
                  onClick={() => handleTaskToggle(index)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handleTaskToggle(index)}
                        className="mt-1"
                      />
                      
                      <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm">{task.title}</h4>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{task.start_time} - {endTime}</span>
                            <span>({task.duration}min)</span>
                          </div>
                        </div>
                        
                        {task.description && (
                          <p className="text-xs text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-1">
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          
                          <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </Badge>
                          
                          {task.assigned_role && (
                            <Badge variant="secondary" className="text-xs">
                              {task.assigned_role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddSelectedTasks}
              disabled={selectedTasks.size === 0 || isGenerating}
            >
              {isGenerating ? 'Ajout en cours...' : `Ajouter ${selectedTasks.size} tâche${selectedTasks.size > 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AITaskSelectionModal;
