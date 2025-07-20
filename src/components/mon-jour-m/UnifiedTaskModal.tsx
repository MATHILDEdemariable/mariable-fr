import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';
import { Plus, Sparkles, Clock, Users, Camera, Utensils, Heart } from 'lucide-react';

interface UnifiedTaskModalProps {
  coordinationId: string;
  referenceTime: Date;
  onEventAdded: (event: PlanningEvent) => void;
  onPlanningGenerated: (events: PlanningEvent[]) => void;
  onClose: () => void;
}

const CATEGORIES = [
  { value: 'préparatifs_final', label: 'Préparatifs' },
  { value: 'logistique', label: 'Logistique' },
  { value: 'cérémonie', label: 'Cérémonie' },
  { value: 'photos', label: 'Photos' },
  { value: 'cocktail', label: 'Cocktail' },
  { value: 'repas', label: 'Repas' },
  { value: 'soiree', label: 'Soirée' },
  { value: 'personnalisé', label: 'Personnalisé' }
];

// Suggestions prédéfinies
const PREDEFINED_SUGGESTIONS = [
  {
    id: '1',
    title: 'Préparation des mariés',
    description: 'Coiffure, maquillage et habillage des mariés',
    duration: 120,
    category: 'préparatifs_final',
    priority: 'high',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '2',
    title: 'Accueil des invités',
    description: 'Accueil et placement des invités avant la cérémonie',
    duration: 30,
    category: 'cérémonie',
    priority: 'medium',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '3',
    title: 'Cérémonie civile',
    description: 'Cérémonie de mariage civil',
    duration: 45,
    category: 'cérémonie',
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
    category: 'cocktail',
    priority: 'medium',
    icon: <Utensils className="h-4 w-4" />
  },
  {
    id: '7',
    title: 'Dîner de mariage',
    description: 'Repas principal avec les invités',
    duration: 120,
    category: 'repas',
    priority: 'high',
    icon: <Utensils className="h-4 w-4" />
  },
  {
    id: '8',
    title: 'Ouverture du bal',
    description: 'Première danse des mariés',
    duration: 15,
    category: 'soiree',
    priority: 'medium',
    icon: <Heart className="h-4 w-4" />
  }
];

const UnifiedTaskModal: React.FC<UnifiedTaskModalProps> = ({
  coordinationId,
  referenceTime,
  onEventAdded,
  onPlanningGenerated,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  // Premium action hooks for different actions
  const manualTaskAction = usePremiumAction({
    feature: "Ajout d'étape manuelle",
    description: "Pour ajouter des étapes personnalisées à votre planning, vous devez être abonné à notre version premium."
  });

  const suggestionsAction = usePremiumAction({
    feature: "Suggestions d'étapes",
    description: "Pour ajouter des étapes suggérées à votre planning, vous devez être abonné à notre version premium."
  });

  // État pour l'ajout manuel
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    startTime: referenceTime.toTimeString().slice(0, 5),
    category: 'personnalisé',
    isHighlight: false
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le titre est obligatoire.",
        variant: "destructive"
      });
      return;
    }

    if (formData.duration < 5) {
      toast({
        title: "Erreur de validation",
        description: "La durée minimum est de 5 minutes.",
        variant: "destructive"
      });
      return;
    }

    // Intercepter l'action avec le hook premium
    manualTaskAction.executeAction(async () => {
      setIsLoading(true);

      try {
        const [hours, minutes] = formData.startTime.split(':').map(Number);
        const startDateTime = new Date(referenceTime);
        startDateTime.setHours(hours, minutes, 0, 0);

        const { data, error } = await supabase
          .from('coordination_planning')
          .insert({
            coordination_id: coordinationId,
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            start_time: formData.startTime,
            duration: formData.duration,
            category: 'jour-m', // Force jour-m category
            priority: formData.isHighlight ? 'high' : 'medium',
            position: 999,
            assigned_to: []
          })
          .select()
          .single();

        if (error) throw error;

        const newEvent: PlanningEvent = {
          id: data.id,
          title: formData.title.trim(),
          notes: formData.description.trim() || undefined,
          startTime: startDateTime,
          endTime: new Date(startDateTime.getTime() + formData.duration * 60000),
          duration: formData.duration,
          category: formData.category,
          type: formData.category,
          isHighlight: formData.isHighlight,
          assignedTo: []
        };

        onEventAdded(newEvent);
        
        toast({
          title: "Étape ajoutée",
          description: `"${formData.title}" a été ajoutée au planning.`
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          duration: 30,
          startTime: referenceTime.toTimeString().slice(0, 5),
          category: 'personnalisé',
          isHighlight: false
        });
        
        onClose();
      } catch (error) {
        console.error('❌ Error adding manual event:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'étape.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleSuggestionToggle = (suggestionId: string) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleAddSuggestions = async () => {
    if (selectedSuggestions.length === 0) return;

    // Intercepter l'action avec le hook premium
    suggestionsAction.executeAction(async () => {
      setIsLoading(true);

      try {
        const suggestionsToAdd = PREDEFINED_SUGGESTIONS.filter(s => selectedSuggestions.includes(s.id));
        
        const eventsToInsert = suggestionsToAdd.map((suggestion, index) => ({
          coordination_id: coordinationId,
          title: suggestion.title,
          description: suggestion.description,
          start_time: '09:00',
          duration: suggestion.duration,
          category: 'jour-m', // Force jour-m category
          priority: suggestion.priority,
          position: 999 + index,
          assigned_to: [],
          is_ai_generated: true
        }));

        const { error } = await supabase
          .from('coordination_planning')
          .insert(eventsToInsert);

        if (error) {
          // Si erreur de conflit de contrainte unique, on l'ignore (doublon)
          if (error.code === '23505') {
            console.log('⚠️ Some suggestions already exist, skipping duplicates');
          } else {
            throw error;
          }
        }

        toast({
          title: "Suggestions ajoutées",
          description: `${selectedSuggestions.length} étape${selectedSuggestions.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'}.`
        });

        setSelectedSuggestions([]);
        onClose();
        
        // Déclencher un rechargement des données depuis la base
        // au lieu d'ajouter directement à l'état local
        onPlanningGenerated([]);
      } catch (error) {
        console.error('❌ Error adding suggestions:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter les suggestions.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    });
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
    return CATEGORIES.find(c => c.value === category)?.label || 'Général';
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manuel
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Suggestions
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            IA Personnalisé
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4 mt-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nom de l'étape"
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description optionnelle"
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (min) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                  min="5"
                  max="480"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? 'Ajout...' : 'Ajouter'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4 mt-4">
          <p className="text-gray-600 text-sm">
            Sélectionnez les étapes prédéfinies que vous souhaitez ajouter à votre planning :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREDEFINED_SUGGESTIONS.map((suggestion) => (
              <Card key={suggestion.id} className={`cursor-pointer transition-all ${
                selectedSuggestions.includes(suggestion.id) 
                  ? 'ring-2 ring-purple-400 bg-purple-50' 
                  : 'hover:shadow-md'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedSuggestions.includes(suggestion.id)}
                      onCheckedChange={() => handleSuggestionToggle(suggestion.id)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {suggestion.icon}
                        <h3 className="font-medium">{suggestion.title}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {suggestion.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {suggestion.duration} min
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {suggestion.priority === 'high' ? 'Élevée' : 
                           suggestion.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                        <Badge variant="secondary">
                          {getCategoryLabel(suggestion.category)}
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
              onClick={handleAddSuggestions}
              disabled={selectedSuggestions.length === 0 || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? 'Ajout...' : `Ajouter ${selectedSuggestions.length} suggestion${selectedSuggestions.length > 1 ? 's' : ''}`}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <PersonalizedScenarioTab 
            onSelectSuggestion={async () => {}}
            onClose={onClose}
            onPlanningGenerated={onPlanningGenerated}
          />
        </TabsContent>
      </Tabs>

      {/* Modals Premium */}
      <PremiumModal
        isOpen={manualTaskAction.showPremiumModal}
        onClose={manualTaskAction.closePremiumModal}
        feature={manualTaskAction.feature}
        description={manualTaskAction.description}
      />

      <PremiumModal
        isOpen={suggestionsAction.showPremiumModal}
        onClose={suggestionsAction.closePremiumModal}
        feature={suggestionsAction.feature}
        description={suggestionsAction.description}
      />
    </>
  );
};

export default UnifiedTaskModal;
