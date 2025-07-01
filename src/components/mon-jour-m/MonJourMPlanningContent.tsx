import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Sparkles, Calendar, Clock, Users, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import PersonalizedScenarioTab from './PersonalizedScenarioTab';
import AISuggestionsModal from './AISuggestionsModal';
import AddManualEventModal from './AddManualEventModal';
import TimeReferenceModal from './TimeReferenceModal';
import EnhancedDragDropTimeline from './MonJourMTimeline';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

interface MonJourMPlanningContentProps {
  coordinationId: string;
}

// Interface pour typer les paramètres JSON
interface ReferenceTimeParams {
  reference_time: string;
}

const MonJourMPlanningContent: React.FC<MonJourMPlanningContentProps> = ({ 
  coordinationId 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isTimeReferenceModalOpen, setIsTimeReferenceModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [referenceTime, setReferenceTime] = useState(new Date());
  const { toast } = useToast();
  
  const { coordination } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningContent: coordination:', coordinationId);

  // Initialiser l'heure de référence
  useEffect(() => {
    const initReferenceTime = async () => {
      try {
        const { data, error } = await supabase
          .from('coordination_parameters')
          .select('parameters')
          .eq('user_id', coordination?.user_id || '')
          .eq('name', 'reference_time')
          .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (data?.parameters && typeof data.parameters === 'object' && data.parameters !== null) {
          const params = data.parameters as ReferenceTimeParams;
          if (params.reference_time) {
            const [hours, minutes] = params.reference_time.split(':').map(Number);
            const refTime = new Date();
            refTime.setHours(hours, minutes, 0, 0);
            setReferenceTime(refTime);
          } else {
            // Heure par défaut : 15h00
            const defaultTime = new Date();
            defaultTime.setHours(15, 0, 0, 0);
            setReferenceTime(defaultTime);
          }
        } else {
          // Heure par défaut : 15h00
          const defaultTime = new Date();
          defaultTime.setHours(15, 0, 0, 0);
          setReferenceTime(defaultTime);
        }
      } catch (error) {
        console.error('❌ Error loading reference time:', error);
        const defaultTime = new Date();
        defaultTime.setHours(15, 0, 0, 0);
        setReferenceTime(defaultTime);
      }
    };

    if (coordinationId && coordination?.user_id) {
      initReferenceTime();
    }
  }, [coordinationId, coordination?.user_id]);

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
            let startTime: Date;
            
            if (item.start_time) {
              const [hours, minutes] = item.start_time.split(':').map(Number);
              startTime = new Date(referenceTime);
              startTime.setHours(hours, minutes, 0, 0);
            } else {
              startTime = new Date(referenceTime);
            }
            
            return {
              id: item.id,
              title: item.title,
              notes: item.description,
              startTime,
              endTime: new Date(startTime.getTime() + (item.duration || 30) * 60000),
              duration: item.duration || 30,
              category: item.category || 'general',
              type: item.category || 'general',
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
  }, [coordination?.user_id, coordinationId, referenceTime, toast]);

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
        const [hours, minutes] = item.start_time.split(':').map(Number);
        const startTime = new Date(referenceTime);
        startTime.setHours(hours, minutes, 0, 0);
        
        return {
          id: item.id,
          title: item.title,
          notes: item.description,
          startTime,
          endTime: new Date(startTime.getTime() + item.duration * 60000),
          duration: item.duration,
          category: item.category,
          type: item.category,
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

  // Gestionnaire pour l'ajout d'événement manuel
  const handleManualEventAdded = (newEvent: PlanningEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  // Gestionnaire pour la mise à jour de l'heure de référence
  const handleTimeReferenceUpdated = (newTime: Date) => {
    setReferenceTime(newTime);
    
    // Recalculer tous les événements avec la nouvelle heure de référence
    const updatedEvents = events.map(event => {
      const [hours, minutes] = event.startTime.toTimeString().slice(0, 5).split(':').map(Number);
      const newStartTime = new Date(newTime);
      newStartTime.setHours(hours, minutes, 0, 0);
      
      return {
        ...event,
        startTime: newStartTime,
        endTime: new Date(newStartTime.getTime() + event.duration * 60000)
      };
    });
    
    setEvents(updatedEvents);
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

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heure de référence</p>
                <p className="text-lg font-bold text-purple-600">
                  {referenceTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsTimeReferenceModalOpen(true)}
                className="text-purple-600 hover:bg-purple-100"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions principales */}
      <div className="flex flex-col sm:flex-row gap-4">
        <AISuggestionsModal
          coordination={{ id: coordinationId, user_id: coordination?.user_id || '' }}
          onClose={() => setIsModalOpen(false)}
          onPlanningGenerated={handlePlanningGenerated}
          trigger={
            <Button className="bg-purple-600 hover:bg-purple-700 flex-1">
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions de tâches IA
            </Button>
          }
        />

        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => setIsManualModalOpen(true)}
        >
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
              <AISuggestionsModal
                coordination={{ id: coordinationId, user_id: coordination?.user_id || '' }}
                onClose={() => setIsModalOpen(false)}
                onPlanningGenerated={handlePlanningGenerated}
                trigger={
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Générer mon planning
                  </Button>
                }
              />
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

      {/* Modals */}
      <AddManualEventModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        coordinationId={coordinationId}
        onEventAdded={handleManualEventAdded}
        referenceTime={referenceTime}
      />

      <TimeReferenceModal
        isOpen={isTimeReferenceModalOpen}
        onClose={() => setIsTimeReferenceModalOpen(false)}
        coordinationId={coordinationId}
        currentReferenceTime={referenceTime}
        onTimeReferenceUpdated={handleTimeReferenceUpdated}
      />
    </div>
  );
};

export default MonJourMPlanningContent;
