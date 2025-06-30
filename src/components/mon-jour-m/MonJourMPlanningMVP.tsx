
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
import EnhancedDragDropTimeline from '../wedding-day/components/EnhancedDragDropTimeline';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { PlanningProvider } from '../wedding-day/context/PlanningContext';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

const MonJourMPlanningContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<PlanningEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Utilisation du nouveau hook optimisé
  const { 
    coordination, 
    isLoading: coordinationLoading, 
    isInitializing,
    error: coordinationError,
    refreshCoordination 
  } = useMonJourMCoordination();

  console.log('🎯 MonJourMPlanningContent: coordination state:', { 
    coordination: coordination?.id, 
    loading: coordinationLoading, 
    initializing: isInitializing,
    error: coordinationError 
  });

  // Charger les événements existants quand la coordination est prête
  useEffect(() => {
    if (!coordination || coordinationLoading || isInitializing) {
      console.log('⏳ MonJourMPlanningContent: Waiting for coordination...');
      return;
    }

    const loadExistingPlanning = async () => {
      try {
        setIsLoading(true);
        console.log('📋 Loading existing planning for coordination:', coordination.id);

        const { data, error } = await supabase
          .from('planning_reponses_utilisateur')
          .select('planning_genere')
          .eq('user_id', coordination.user_id)
          .order('date_creation', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;

        if (data?.planning_genere && Array.isArray(data.planning_genere)) {
          // Convertir les dates string en objets Date
          const convertedEvents: PlanningEvent[] = data.planning_genere.map((event: any) => ({
            ...event,
            startTime: new Date(event.startTime),
            endTime: new Date(event.endTime)
          }));
          
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
  }, [coordination, coordinationLoading, isInitializing, toast]);

  // Gestionnaire pour l'intégration des événements générés par l'IA
  const handlePlanningGenerated = async (newEvents: PlanningEvent[]) => {
    console.log('🤖 Handling AI-generated planning:', newEvents.length, 'events');
    
    try {
      // Ajouter les nouveaux événements aux existants
      const updatedEvents = [...events, ...newEvents];
      setEvents(updatedEvents);
      
      toast({
        title: "Planning mis à jour",
        description: `${newEvents.length} nouvelle${newEvents.length > 1 ? 's' : ''} étape${newEvents.length > 1 ? 's ont été ajoutées' : ' a été ajoutée'}.`
      });
      
      // Fermer le modal
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
  const handleEventsUpdate = (updatedEvents: PlanningEvent[]) => {
    console.log('🔄 Updating events from timeline:', updatedEvents.length);
    setEvents(updatedEvents);
  };

  // Fonction fallback pour l'ancienne méthode (suggestions individuelles)
  const handleSelectSuggestion = async (suggestion: any) => {
    console.log('📝 Adding individual suggestion:', suggestion.title);
  };

  const getEventStats = () => {
    const total = events.length;
    const highlights = events.filter(e => e.isHighlight).length;
    const categories = [...new Set(events.map(e => e.category))].length;
    
    return { total, highlights, categories };
  };

  const stats = getEventStats();

  // Guard pour les erreurs de coordination
  if (coordinationError) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 mb-4">Erreur de chargement de la coordination</p>
            <Button onClick={refreshCoordination} variant="outline">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state pendant l'initialisation
  if (coordinationLoading || isInitializing || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  // Guard pour coordination manquante
  if (!coordination) {
    return (
      <div className="flex justify-center items-center h-64">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-4">Coordination non disponible</p>
            <Button onClick={refreshCoordination} variant="outline">
              Actualiser
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                <p className="text-sm text-gray-600">Catégories</p>
                <p className="text-2xl font-bold text-blue-600">{stats.categories}</p>
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
              onEventsUpdate={handleEventsUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const MonJourMPlanningMVP: React.FC = () => {
  const { coordination } = useMonJourMCoordination();

  // Récupérer l'utilisateur de la coordination
  const user = coordination ? { id: coordination.user_id } : null;

  console.log('🎯 MonJourMPlanningMVP: Wrapping with PlanningProvider, user:', user?.id);

  return (
    <PlanningProvider user={user}>
      <MonJourMPlanningContent />
    </PlanningProvider>
  );
};

export default MonJourMPlanningMVP;
