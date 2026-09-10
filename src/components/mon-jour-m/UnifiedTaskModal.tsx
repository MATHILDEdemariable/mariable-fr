import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const CATEGORY_VALUES = [
  'préparatifs_final',
  'logistique',
  'cérémonie',
  'photos',
  'cocktail',
  'repas',
  'soiree',
  'personnalisé'
];

// Suggestions prédéfinies
const PREDEFINED_SUGGESTIONS = [
  {
    id: '1',
    duration: 120,
    category: 'préparatifs_final',
    priority: 'high',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '2',
    duration: 30,
    category: 'cérémonie',
    priority: 'medium',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: '3',
    duration: 45,
    category: 'cérémonie',
    priority: 'high',
    icon: <Heart className="h-4 w-4" />
  },
  {
    id: '4',
    duration: 60,
    category: 'photos',
    priority: 'medium',
    icon: <Camera className="h-4 w-4" />
  },
  {
    id: '5',
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
    duration: 120,
    category: 'repas',
    priority: 'high',
    icon: <Utensils className="h-4 w-4" />
  },
  {
    id: '8',
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
  const { t } = useTranslation('monJourM');
  const { toast } = useToast();

  // Premium action hooks for different actions
  const manualTaskAction = usePremiumAction({
    feature: t('taskModal.premium.manualFeature'),
    description: t('taskModal.premium.manualDesc')
  });

  const suggestionsAction = usePremiumAction({
    feature: t('taskModal.premium.suggestionsFeature'),
    description: t('taskModal.premium.suggestionsDesc')
  });

  const aiPersonalizedAction = usePremiumAction({
    feature: t('taskModal.premium.aiFeature'),
    description: t('taskModal.premium.aiDesc')
  });

  // État pour l'ajout manuel
  const [formData, setFormData] = useState({
    duration: '',
    startTime: referenceTime.toTimeString().slice(0, 5),
    category: 'personnalisé',
    isHighlight: false
  });

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: t('taskModal.toast.validationTitle'),
        description: t('taskModal.toast.titleRequired'),
        variant: "destructive"
      });
      return;
    }

    const durationNum = parseInt(formData.duration as string) || 0;
    if (durationNum < 5) {
      toast({
        title: t('taskModal.toast.validationTitle'),
        description: t('taskModal.toast.minDuration'),
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

        // Vérifier que la session est toujours valide (sinon RLS bloque l'insertion)
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          throw new Error(t('taskModal.toast.sessionExpired'));
        }

        const { data, error } = await supabase
          .from('coordination_planning')
          .insert({
            coordination_id: coordinationId,
            title: formData.title.trim(),
            description: formData.description.trim() || null,
            start_time: formData.startTime,
            duration: durationNum,
            category: 'jour-m', // Force jour-m category
            priority: 'medium',
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
          endTime: new Date(startDateTime.getTime() + durationNum * 60000),
          duration: durationNum,
          category: formData.category,
          type: formData.category,
          
          assignedTo: []
        };

        onEventAdded(newEvent);
        
        toast({
          title: t('taskModal.toast.added'),
          description: t('taskModal.toast.addedDesc', { title: formData.title })
        });

        // Reset form
        setFormData({
          title: '',
          description: '',
          duration: '',
          startTime: referenceTime.toTimeString().slice(0, 5),
          category: 'personnalisé',
          isHighlight: false
        });
        
        onClose();
      } catch (error: any) {
        console.error('❌ Error adding manual event:', error);
        const isDuplicateTitle = error?.code === '23505';
        toast({
          title: isDuplicateTitle ? t('taskModal.toast.duplicateTitle') : t('taskModal.toast.errorTitle'),
          description: isDuplicateTitle
            ? t('taskModal.toast.duplicateDesc')
            : t('taskModal.toast.addError'),
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
          title: t(`taskModal.suggestions.${suggestion.id}.title`),
          description: t(`taskModal.suggestions.${suggestion.id}.description`),
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
          title: t('taskModal.toast.suggestionsAdded'),
          description: t('taskModal.toast.suggestionsAddedDesc', { count: selectedSuggestions.length })
        });

        setSelectedSuggestions([]);
        onClose();
        
        // Déclencher un rechargement des données depuis la base
        // au lieu d'ajouter directement à l'état local
        onPlanningGenerated([]);
      } catch (error) {
        console.error('❌ Error adding suggestions:', error);
        toast({
          title: t('taskModal.toast.errorTitle'),
          description: t('taskModal.toast.suggestionsError'),
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
    return CATEGORY_VALUES.includes(category)
      ? t(`taskModal.categories.${category}`)
      : t('taskModal.categories.default');
  };

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('taskModal.tabs.manual')}
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t('taskModal.tabs.suggestions')}
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            {t('taskModal.tabs.ai')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4 mt-4">
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('taskModal.fields.title')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('taskModal.fields.titlePlaceholder')}
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('taskModal.fields.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t('taskModal.fields.descriptionPlaceholder')}
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">{t('taskModal.fields.startTime')}</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">{t('taskModal.fields.duration')}</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  min="5"
                  max="480"
                  placeholder="30"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('taskModal.fields.category')}</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_VALUES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`taskModal.categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                {t('taskModal.buttons.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading || !formData.title.trim()}>
                {isLoading ? t('taskModal.buttons.adding') : t('taskModal.buttons.add')}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4 mt-4">
          <p className="text-gray-600 text-sm">
            {t('taskModal.suggestionsIntro')}
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
                        <h3 className="font-medium">{t(`taskModal.suggestions.${suggestion.id}.title`)}</h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {t(`taskModal.suggestions.${suggestion.id}.description`)}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {t('taskModal.minutes', { count: suggestion.duration })}
                        </Badge>
                        <Badge className={getPriorityColor(suggestion.priority)}>
                          {t(`taskModal.priority.${suggestion.priority}`)}
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
              {t('taskModal.buttons.cancel')}
            </Button>
            <Button 
              onClick={handleAddSuggestions}
              disabled={selectedSuggestions.length === 0 || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isLoading ? t('taskModal.buttons.adding') : t('taskModal.buttons.addSuggestions', { count: selectedSuggestions.length })}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="ai" className="mt-4">
          <PersonalizedScenarioTab 
            onSelectSuggestion={async () => {}}
            onClose={onClose}
            onPlanningGenerated={onPlanningGenerated}
            premiumAction={aiPersonalizedAction}
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

      <PremiumModal
        isOpen={aiPersonalizedAction.showPremiumModal}
        onClose={aiPersonalizedAction.closePremiumModal}
        feature={aiPersonalizedAction.feature}
        description={aiPersonalizedAction.description}
      />
    </>
  );
};

export default UnifiedTaskModal;
