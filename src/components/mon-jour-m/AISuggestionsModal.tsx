import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Camera, Utensils, Heart, Sparkles, Lightbulb } from 'lucide-react';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';

interface TaskSuggestion {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  icon: React.ReactNode;
}

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSuggestion: (suggestion: { title: string; description: string; category: string; priority: string; duration: number }) => Promise<void>;
  coordination?: any;
}

const taskSuggestions: TaskSuggestion[] = [
  {
    id: '1',
    title: 'Préparation des mariés',
    description: 'Coiffure, maquillage et habillage des mariés',
    duration: 120,
    category: 'preparation',
    priority: 'high',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '2',
    title: 'Accueil des invités',
    description: 'Accueil et placement des invités avant la cérémonie',
    duration: 30,
    category: 'ceremony',
    priority: 'medium',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '3',
    title: 'Cérémonie civile',
    description: 'Cérémonie de mariage civil',
    duration: 45,
    category: 'ceremony',
    priority: 'high',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '4',
    title: 'Photos de couple',
    description: 'Séance photo des mariés après la cérémonie',
    duration: 60,
    category: 'photos',
    priority: 'medium',
    icon: <Camera className="h-4 w-4" />
  },
  {
    id: '5',
    title: 'Photos de famille',
    description: 'Photos avec les familles et témoins',
    duration: 45,
    category: 'photos',
    priority: 'medium',
    icon: <Camera className="h-4 w-4" />
  },
  {
    id: '6',
    title: 'Cocktail',
    description: 'Vin d\'honneur avec les invités',
    duration: 90,
    category: 'reception',
    priority: 'medium',
    icon: <Utensils className="h-4 w-4" />
  },
  {
    id: '7',
    title: 'Dîner de mariage',
    description: 'Repas principal avec les invités',
    duration: 120,
    category: 'reception',
    priority: 'high',
    icon: <Utensils className="h-4 w-4" />
  },
  {
    id: '8',
    title: 'Ouverture du bal',
    description: 'Première danse des mariés',
    duration: 15,
    category: 'reception',
    priority: 'medium',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '9',
    title: 'Animation soirée',
    description: 'Musique et animation pour la soirée dansante',
    duration: 180,
    category: 'reception',
    priority: 'low',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '10',
    title: 'Préparation du lieu',
    description: 'Installation et décoration du lieu de réception',
    duration: 60,
    category: 'decoration',
    priority: 'medium',
    icon: <Heart className="h-4 w-4" />
  }
];

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  isOpen,
  onClose,
  onSelectSuggestion
}) => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

  const handleTaskToggle = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAddSelected = async () => {
    const tasksToAdd = taskSuggestions.filter(task => selectedTasks.includes(task.id));
    
    for (const task of tasksToAdd) {
      await onSelectSuggestion({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
        duration: task.duration
      });
    }
    
    setSelectedTasks([]);
    onClose();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'preparation': return 'Préparation';
      case 'ceremony': return 'Cérémonie';
      case 'photos': return 'Photos';
      case 'reception': return 'Réception';
      case 'decoration': return 'Décoration';
      default: return 'Général';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Suggestions de tâches IA
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="predefined" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="predefined" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Suggestions prédéfinies
            </TabsTrigger>
            <TabsTrigger value="personalized" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Scénario personnalisé
            </TabsTrigger>
          </TabsList>

          <TabsContent value="predefined" className="space-y-4">
            <p className="text-gray-600 text-sm">
              Sélectionnez les tâches que vous souhaitez ajouter à votre planning :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {taskSuggestions.map((task) => (
                <Card key={task.id} className={`cursor-pointer transition-all ${
                  selectedTasks.includes(task.id) 
                    ? 'ring-2 ring-purple-400 bg-purple-50' 
                    : 'hover:shadow-md'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {task.icon}
                          <h3 className="font-medium">{task.title}</h3>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          {task.description}
                        </p>
                        
                        <div className="flex items-center gap-2 text-xs">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.duration} min
                          </Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Élevée' : 
                             task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                          </Badge>
                          <Badge variant="secondary">
                            {getCategoryLabel(task.category)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddSelected}
                disabled={selectedTasks.length === 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Ajouter {selectedTasks.length} tâche{selectedTasks.length > 1 ? 's' : ''}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="personalized">
            <PersonalizedScenarioTab 
              onSelectSuggestion={onSelectSuggestion}
              onClose={onClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionsModal;
