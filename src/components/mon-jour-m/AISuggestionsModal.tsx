
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Plus, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AISuggestion {
  title: string;
  description: string;
  duration: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
}

interface AISuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestions: (suggestions: AISuggestion[]) => void;
  coordinationId: string | null;
}

const AISuggestionsModal: React.FC<AISuggestionsModalProps> = ({
  isOpen,
  onClose,
  onAddSuggestions,
  coordinationId
}) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateAISuggestions = async () => {
    if (!coordinationId) return;
    
    setIsGenerating(true);
    
    try {
      console.log('🤖 Generating AI suggestions for coordination:', coordinationId);
      
      // Récupérer les tâches existantes pour éviter les doublons
      const { data: existingTasks } = await supabase
        .from('coordination_planning')
        .select('title, category')
        .eq('coordination_id', coordinationId);

      const existingTaskTitles = existingTasks?.map(t => t.title.toLowerCase()) || [];
      
      // Appeler la fonction Edge pour générer des suggestions
      const { data, error } = await supabase.functions.invoke('generate-wedding-tasks', {
        body: { 
          coordinationId,
          existingTasks: existingTaskTitles
        }
      });

      if (error) {
        console.error('Error calling AI function:', error);
        throw error;
      }

      if (data?.suggestions) {
        console.log('✨ Generated suggestions:', data.suggestions);
        setSuggestions(data.suggestions);
        setSelectedSuggestions(new Set()); // Reset selection
      } else {
        throw new Error('No suggestions returned from AI');
      }
    } catch (error) {
      console.error('❌ Error generating AI suggestions:', error);
      toast({
        title: "Erreur IA",
        description: "Impossible de générer des suggestions. Essayez avec les suggestions par défaut.",
        variant: "destructive"
      });
      
      // Fallback vers des suggestions statiques en cas d'erreur
      const fallbackSuggestions: AISuggestion[] = [
        {
          title: "Accueil des invités",
          description: "Accueillir et orienter les invités à leur arrivée",
          duration: 30,
          category: "ceremonie",
          priority: "high"
        },
        {
          title: "Photos de couple",
          description: "Séance photo privée des mariés",
          duration: 45,
          category: "photos",
          priority: "medium"
        },
        {
          title: "Cocktail de bienvenue",
          description: "Service du cocktail et amuse-bouches",
          duration: 60,
          category: "reception",
          priority: "medium"
        }
      ];
      
      setSuggestions(fallbackSuggestions);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleSuggestion = (index: number) => {
    const newSelected = new Set(selectedSuggestions);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedSuggestions(newSelected);
  };

  const handleAddSelected = () => {
    const selectedItems = suggestions.filter((_, index) => selectedSuggestions.has(index));
    if (selectedItems.length > 0) {
      onAddSuggestions(selectedItems);
      toast({
        title: "Tâches ajoutées",
        description: `${selectedItems.length} tâche(s) ajoutée(s) à votre planning`
      });
      onClose();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'ceremonie': '💒',
      'reception': '🍽️',
      'photos': '📸',
      'musique': '🎵',
      'fleurs': '💐',
      'transport': '🚗',
      'preparation': '💄',
      'coordination': '📋',
      'general': '📝'
    };
    return icons[category] || '📝';
  };

  React.useEffect(() => {
    if (isOpen && suggestions.length === 0) {
      generateAISuggestions();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Suggestions IA pour votre planning
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Actions */}
          <div className="flex justify-between items-center">
            <Button
              onClick={generateAISuggestions}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isGenerating ? 'Génération...' : 'Générer d\'autres tâches'}
            </Button>

            {selectedSuggestions.size > 0 && (
              <Button onClick={handleAddSelected} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter sélectionnées ({selectedSuggestions.size})
              </Button>
            )}
          </div>

          {/* Loading State */}
          {isGenerating && suggestions.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">L'IA génère des suggestions personnalisées...</p>
              </div>
            </div>
          )}

          {/* Suggestions Grid */}
          {suggestions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedSuggestions.has(index)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => toggleSuggestion(index)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(suggestion.category)}</span>
                      <h3 className="font-medium">{suggestion.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {selectedSuggestions.has(index) && (
                        <div className="w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                          <Plus className="h-2 w-2 text-white" />
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>

                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant="outline">{suggestion.duration} min</Badge>
                    <Badge className={getPriorityColor(suggestion.priority)}>
                      {suggestion.priority === 'high' ? 'Élevée' : 
                       suggestion.priority === 'medium' ? 'Moyenne' : 'Faible'}
                    </Badge>
                    <span className="text-gray-500 capitalize">{suggestion.category}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && suggestions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucune suggestion disponible</p>
              <p className="text-sm">Cliquez sur "Générer d'autres tâches" pour obtenir des suggestions IA</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISuggestionsModal;
