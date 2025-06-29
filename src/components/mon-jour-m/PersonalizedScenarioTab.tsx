
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizedTask {
  title: string;
  description: string;
  start_time: string;
  duration: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  assigned_role: string;
  day?: string;
  notes?: string;
}

interface PersonalizedScenarioTabProps {
  onSelectSuggestion: (suggestion: { title: string; description: string; category: string; priority: string; duration: number }) => Promise<void>;
  onClose: () => void;
}

const PersonalizedScenarioTab: React.FC<PersonalizedScenarioTabProps> = ({
  onSelectSuggestion,
  onClose
}) => {
  const [scenario, setScenario] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTasks, setGeneratedTasks] = useState<PersonalizedTask[]>([]);
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [summary, setSummary] = useState('');

  const handleGenerate = async () => {
    if (!scenario.trim()) return;

    console.log('🎯 Generating personalized planning from scenario');
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-wedding-planner', {
        body: {
          scenario: scenario.trim(),
          weddingDate: new Date().toISOString().split('T')[0], // Placeholder
          guestCount: 50, // Placeholder
          ceremonyTime: '15:00' // Placeholder
        }
      });

      if (error) {
        console.error('❌ Error calling AI wedding planner:', error);
        throw error;
      }

      console.log('✅ AI planning generated:', data);
      
      if (data.tasks && Array.isArray(data.tasks)) {
        setGeneratedTasks(data.tasks);
        setSummary(data.summary || '');
      } else {
        throw new Error('Format de réponse invalide');
      }

    } catch (error) {
      console.error('❌ Error generating personalized planning:', error);
      // TODO: Show error toast
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTaskToggle = (taskIndex: number) => {
    const taskId = taskIndex.toString();
    setSelectedTasks(prev => 
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleAddSelected = async () => {
    const tasksToAdd = generatedTasks.filter((_, index) => 
      selectedTasks.includes(index.toString())
    );
    
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

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Standard';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-medium">Décrivez votre vision du jour J</h3>
        </div>
        
        <p className="text-sm text-gray-600">
          Décrivez votre scénario idéal : horaires clés, préparatifs, qui fait quoi, vos priorités... 
          L'IA créera un planning personnalisé pour vous !
        </p>

        <Textarea
          placeholder="Exemple : La cérémonie est à 15h dans le jardin. Je veux me préparer tranquillement avec mes témoins pendant 2h le matin. La décoration sera installée par le fleuriste à 10h. Mon photographe arrive à 13h pour les photos de préparation. Le cocktail se fera sur la terrasse après la cérémonie..."
          value={scenario}
          onChange={(e) => setScenario(e.target.value)}
          className="min-h-[120px] resize-none"
          disabled={isGenerating}
        />

        <Button 
          onClick={handleGenerate}
          disabled={!scenario.trim() || isGenerating}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Générer mon planning
            </>
          )}
        </Button>
      </div>

      {summary && (
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-purple-800 mb-2">Conseils personnalisés</h4>
            <p className="text-sm text-purple-700">{summary}</p>
          </CardContent>
        </Card>
      )}

      {generatedTasks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">Planning personnalisé généré</h4>
            <Badge variant="secondary">
              {generatedTasks.length} tâche{generatedTasks.length > 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto">
            {generatedTasks.map((task, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all ${
                  selectedTasks.includes(index.toString()) 
                    ? 'ring-2 ring-purple-400 bg-purple-50' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTasks.includes(index.toString())}
                      onCheckedChange={() => handleTaskToggle(index)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">{task.title}</h5>
                        {task.day && (
                          <Badge variant="outline" className="text-xs">
                            {task.day}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>
                      
                      {task.notes && (
                        <p className="text-xs text-purple-600 mb-3 italic">
                          💡 {task.notes}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        {task.start_time && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.start_time}
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.duration} min
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <Badge variant="secondary">
                          {task.category}
                        </Badge>
                        {task.assigned_role && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {task.assigned_role}
                          </Badge>
                        )}
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
        </div>
      )}
    </div>
  );
};

export default PersonalizedScenarioTab;
