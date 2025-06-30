
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Calendar, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';
import EnhancedDragDropTimeline from './MonJourMTimeline';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

interface MonJourMPlanningContentProps {
  coordinationId: string;
}

const MonJourMPlanningContent: React.FC<MonJourMPlanningContentProps> = ({ 
  coordinationId 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const { toast } = useToast();
  
  const { coordination } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningContent: coordination:', coordinationId);

  // Charger les membres d'équipe
  useEffect(() => {
    const loadTeamMembers = async () => {
      if (!coordinationId) return;

      try {
        const { data, error } = await supabase
          .from('coordination_team')
          .select('*')
          .eq('coordination_id', coordinationId);

        if (error) throw error;

        console.log('👥 Loaded team members:', data?.length);
        setTeamMembers(data || []);
      } catch (error) {
        console.error('❌ Error loading team members:', error);
      }
    };

    loadTeamMembers();
  }, [coordinationId]);

  // Charger les événements existants
  useEffect(() => {
    const loadExistingPlanning = async () => {
      if (!coordination?.user_id) return;

      try {
        setIsLoading(true);
        console.log('📋 Loading existing planning for user:', coordination.user_id);

        const { data, error } = await supabase
          .from('coordination_planning')
          .select('*')
          .eq('coordination_id', coordinationId)
          .order('position', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          // Convertir les données de la base vers le format PlanningEvent
          const convertedEvents: PlanningEvent[] = data.map((item: any) => {
            const startTime = item.start_time ? 
              new Date(`2025-01-01T${item.start_time}:00`) : 
              new Date(`2025-01-01T09:00:00`);
            
            return {
              id: item.id,
              title: item.title,
              notes: item.description,
              startTime,
              endTime: new Date(startTime.getTime() + (item.duration || 30) * 60000),
              duration: item.duration || 30,
              category: item.category || 'general',
              type: item.category || 'general', // Ajout de la propriété type
              isHighlight: item.priority === 'high',
              assignedTo: Array.isArray(item.assigned_to) ? item.assigned_to : []
            };
          });
          
          console.log('✅ Loaded', convertedEvents.length, 'existing events');
          setEvents(convertedEvents);
        } else {
          console.log('📋 No existing planning found');
          setEvents([]);
        }
      } catch (error) {
        console.error('❌ Error loading existing planning:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger le planning existant.",
          variant: "destructive"
        });
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadExistingPlanning();
  }, [coordination?.user_id, coordinationId, toast]);

  // Gestionnaire pour l'intégration des événements générés par l'IA
  const handlePlanningGenerated = async (newEvents: PlanningEvent[]) => {
    console.log('🤖 Handling AI-generated planning:', newEvents.length, 'events');
    
    try {
      // Sauvegarder les nouveaux événements en base
      const eventsToSave = newEvents.map((event, index) => ({
        coordination_id: coordinationId,
        title: event.title,
        description: event.notes,
        start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        duration: event.duration,
        category: event.category,
        priority: event.isHighlight ? 'high' : 'medium',
        position: events.length + index,
        assigned_to: []
      }));

      const { data, error } = await supabase
        .from('coordination_planning')
        .insert(eventsToSave)
        .select();

      if (error) throw error;

      // Convertir et ajouter aux événements existants
      const convertedNewEvents: PlanningEvent[] = data.map((item: any) => {
        const startTime = new Date(`2025-01-01T${item.start_time}:00`);
        return {
          id: item.id,
          title: item.title,
          notes: item.description,
          startTime,
          endTime: new Date(startTime.getTime() + item.duration * 60000),
          duration: item.duration,
          category: item.category,
          type: item.category, // Ajout de la propriété type
          isHighlight: item.priority === 'high',
          assignedTo: []
        };
      });

      setEvents(prev => [...prev, ...convertedNewEvents]);
      
      toast({
        title: "Planning mis à jour",
        description: `${newEvents.length} nouvelle${newEvents.length > 1 ? 's' : ''} étape${newEvents.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'}.`
      });
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Error handling AI planning:', error);
      toast({
        title: "Erreur d'intégration",
        description: "Impossible d'ajouter les événements générés.",
        variant: "destructive"
      });
    }
  };

  // Gestionnaire pour la mise à jour des événements
  const handleEventsUpdate = async (updatedEvents: PlanningEvent[]) => {
    console.log('🔄 Updating events from timeline:', updatedEvents.length);
    
    try {
      // Sauvegarder en base
      for (const event of updatedEvents) {
        await supabase
          .from('coordination_planning')
          .update({
            title: event.title,
            description: event.notes,
            start_time: event.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            duration: event.duration,
            assigned_to: event.assignedTo || []
          })
          .eq('id', event.id);
      }

      setEvents(updatedEvents);
    } catch (error) {
      console.error('❌ Error updating events:', error);
      toast({
        title: "Erreur de sauvegarde",
        description: "Impossible de sauvegarder les modifications.",
        variant: "destructive"
      });
    }
  };

  const getEventStats = () => {
    const total = events.length;
    const highlights = events.filter(e => e.isHighlight).length;
    const assigned = events.filter(e => e.assignedTo && e.assignedTo.length > 0).length;
    
    return { total, highlights, assigned };
  };

  const stats = getEventStats();

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  // Gestionnaire pour les suggestions IA (corrigé)
  const handleSelectSuggestion = async (suggestion: { title: string; description: string; category: string; priority: string; duration: number; }) => {
    console.log('🤖 Adding AI suggestion:', suggestion.title);
    
    const newEvent: PlanningEvent = {
      id: `ai-${Date.now()}-${Math.random()}`,
      title: suggestion.title,
      notes: suggestion.description,
      startTime: new Date(),
      endTime: new Date(Date.now() + suggestion.duration * 60000),
      duration: suggestion.duration,
      category: suggestion.category,
      type: suggestion.category,
      isHighlight: suggestion.priority === 'high',
      assignedTo: []
    };

    try {
      // Sauvegarder en base
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordinationId,
          title: newEvent.title,
          description: newEvent.notes,
          start_time: newEvent.startTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          duration: newEvent.duration,
          category: newEvent.category,
          priority: newEvent.isHighlight ? 'high' : 'medium',
          position: events.length,
          assigned_to: []
        })
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour l'état local
      const savedEvent: PlanningEvent = {
        ...newEvent,
        id: data.id
      };
      
      setEvents(prev => [...prev, savedEvent]);
      
      toast({
        title: "Tâche ajoutée",
        description: `"${suggestion.title}" a été ajoutée au planning.`
      });
    } catch (error) {
      console.error('❌ Error adding suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche suggérée.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total étapes</p>
                <p className="text-2xl font-bold text-wedding-olive">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-wedding-olive/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Moments clés</p>
                <p className="text-2xl font-bold text-amber-600">{stats.highlights}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-600/60" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tâches assignées</p>
                <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700 flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions de tâches IA
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Assistant IA pour votre planning</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="personalized" className="w-full">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="personalized">Scénario personnalisé</TabsTrigger>
              </TabsList>
              <TabsContent value="personalized">
                <PersonalizedScenarioTab
                  onSelectSuggestion={handleSelectSuggestion}
                  onClose={() => setIsModalOpen(false)}
                  onPlanningGenerated={handlePlanningGenerated}
                />
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        <Button variant="outline" className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape manuelle
        </Button>
      </div>

      {/* Planning principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Planning du jour J</span>
            {events.length > 0 && (
              <Badge variant="secondary">
                {events.length} étape{events.length > 1 ? 's' : ''}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun planning pour le moment
              </h3>
              <p className="text-gray-500 mb-4">
                Commencez par utiliser l'assistant IA pour générer votre planning personnalisé.
              </p>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Générer mon planning
              </Button>
            </div>
          ) : (
            <EnhancedDragDropTimeline
              events={events}
              teamMembers={teamMembers}
              onEventsUpdate={handleEventsUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonJourMPlanningContent;
