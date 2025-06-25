
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle2, Circle, AlertCircle, Sparkles, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import TaskEditModal from './TaskEditModal';
import AISuggestionsModal from './AISuggestionsModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  category: string;
  position: number;
  assigned_to?: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
}

const MonJourMPlanning: React.FC = () => {
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [coordinationId, setCoordinationId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<PlanningTask | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer ou créer la coordination
      let { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!coordination) {
        const { data: newCoordination, error } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage'
          })
          .select()
          .single();

        if (error) throw error;
        coordination = newCoordination;
      }

      setCoordinationId(coordination.id);
      await loadTasks(coordination.id);
      await loadTeamMembers(coordination.id);
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadTasks = async (coordId: string) => {
    const { data, error } = await supabase
      .from('coordination_planning')
      .select('*')
      .eq('coordination_id', coordId)
      .order('position');

    if (error) {
      console.error('Error loading tasks:', error);
      return;
    }

    const formattedTasks = (data || []).map((task: any) => ({
      ...task,
      assigned_to: Array.isArray(task.assigned_to) ? task.assigned_to : []
    }));

    setTasks(formattedTasks);
  };

  const loadTeamMembers = async (coordId: string) => {
    const { data, error } = await supabase
      .from('coordination_team')
      .select('id, name, role')
      .eq('coordination_id', coordId);

    if (error) {
      console.error('Error loading team members:', error);
      return;
    }

    setTeamMembers(data || []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('coordination-planning-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_planning'
        },
        () => {
          if (coordinationId) {
            loadTasks(coordinationId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  // Fonction corrigée pour calculer les heures séquentielles
  const recalculateSequentialTimes = (updatedTasks: PlanningTask[]) => {
    console.log('Recalculating sequential times...');
    
    // Trier les tâches par position
    const sortedTasks = [...updatedTasks].sort((a, b) => a.position - b.position);
    let currentTime: Date | null = null;
    
    const recalculatedTasks = sortedTasks.map((task, index) => {
      // Si la tâche a déjà une heure de début définie, l'utiliser comme référence
      if (task.start_time) {
        const taskStartTime = new Date(task.start_time);
        console.log(`Task "${task.title}" has custom start time:`, taskStartTime.toLocaleTimeString());
        
        // Calculer l'heure de fin basée sur la durée
        const endTime = new Date(taskStartTime.getTime() + task.duration * 60000);
        currentTime = endTime; // Mettre à jour la référence pour les tâches suivantes
        
        return {
          ...task,
          start_time: task.start_time, // Conserver l'heure personnalisée
          end_time: endTime.toISOString()
        };
      }
      
      // Pour les tâches sans heure définie, utiliser la séquence
      if (currentTime) {
        const startTime = new Date(currentTime);
        const endTime = new Date(startTime.getTime() + task.duration * 60000);
        
        console.log(`Task "${task.title}" calculated time:`, startTime.toLocaleTimeString(), '-', endTime.toLocaleTimeString());
        
        currentTime = endTime;
        
        return {
          ...task,
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString()
        };
      }
      
      // Première tâche sans heure définie, ne pas forcer d'heure
      return task;
    });
    
    return recalculatedTasks;
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !coordinationId) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les positions
    const updatedTasks = items.map((task, index) => ({
      ...task,
      position: index
    }));

    // Recalculer les heures en préservant les heures personnalisées
    const tasksWithTimes = recalculateSequentialTimes(updatedTasks);
    setTasks(tasksWithTimes);

    // Sauvegarder en base
    try {
      const updates = tasksWithTimes.map(task => ({
        id: task.id,
        position: task.position,
        start_time: task.start_time,
        end_time: task.end_time
      }));

      for (const update of updates) {
        await supabase
          .from('coordination_planning')
          .update({
            position: update.position,
            start_time: update.start_time,
            end_time: update.end_time
          })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating task order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'ordre des tâches",
        variant: "destructive"
      });
    }
  };

  const handleSaveTask = async (taskData: Partial<PlanningTask>) => {
    if (!coordinationId) return;

    try {
      console.log('Saving task with data:', taskData);
      
      if (selectedTask) {
        // Mise à jour d'une tâche existante
        const { error } = await supabase
          .from('coordination_planning')
          .update({
            ...taskData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedTask.id);

        if (error) throw error;

        toast({
          title: "Tâche mise à jour",
          description: "La tâche a été mise à jour avec succès"
        });
      } else {
        // Création d'une nouvelle tâche
        const newPosition = tasks.length;
        
        const { error } = await supabase
          .from('coordination_planning')
          .insert({
            coordination_id: coordinationId,
            position: newPosition,
            ...taskData
          });

        if (error) throw error;

        toast({
          title: "Tâche créée",
          description: "La nouvelle tâche a été ajoutée avec succès"
        });
      }

      setShowTaskModal(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error saving task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la tâche",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès"
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
  };

  const handleToggleTaskStatus = async (task: PlanningTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la tâche",
        variant: "destructive"
      });
    }
  };

  const handleAddAISuggestions = async (suggestions: any[]) => {
    if (!coordinationId) return;

    try {
      const startPosition = tasks.length;
      
      const tasksToInsert = suggestions.map((suggestion, index) => ({
        coordination_id: coordinationId,
        title: suggestion.title,
        description: suggestion.description,
        duration: suggestion.duration,
        category: suggestion.category,
        priority: suggestion.priority,
        position: startPosition + index,
        status: 'todo',
        is_ai_generated: true
      }));

      const { error } = await supabase
        .from('coordination_planning')
        .insert(tasksToInsert);

      if (error) throw error;

      toast({
        title: "Tâches ajoutées",
        description: `${suggestions.length} tâche(s) ajoutée(s) avec succès`
      });
    } catch (error) {
      console.error('Error adding AI suggestions:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les suggestions IA",
        variant: "destructive"
      });
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      const date = new Date(timeString);
      // Utiliser toLocaleTimeString avec les options françaises pour éviter les problèmes de timezone
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Paris' // Forcer le fuseau horaire français
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning du jour J</h2>
          <p className="text-gray-600">Organisez le déroulement de votre mariage minute par minute</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAIModal(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Sparkles className="h-4 w-4" />
            Générer avec IA
          </Button>
          <Button 
            onClick={() => {
              setSelectedTask(null);
              setShowTaskModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline du jour J</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="planning-tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {tasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div {...provided.dragHandleProps} className="mt-1">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <button onClick={() => handleToggleTaskStatus(task)}>
                                {getStatusIcon(task.status)}
                              </button>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                  {task.title}
                                </h3>
                                {task.description && (
                                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                )}
                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                  <Badge variant="outline">{task.duration} min</Badge>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                                  </Badge>
                                  <span className="capitalize">{task.category}</span>
                                  {task.is_ai_generated && (
                                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                                      <Sparkles className="h-3 w-3 mr-1" />
                                      IA
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              {task.start_time && (
                                <div className="text-sm font-medium">
                                  {formatTime(task.start_time)}
                                  {task.end_time && (
                                    <span className="text-gray-500 ml-1">
                                      - {formatTime(task.end_time)}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {task.assigned_to && task.assigned_to.length > 0 && (
                                <div className="mt-1">
                                  {task.assigned_to.map((memberId) => {
                                    const member = teamMembers.find(m => m.id === memberId);
                                    return member ? (
                                      <Badge key={memberId} variant="secondary" className="text-xs">
                                        {member.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              )}
                              
                              <div className="mt-2 flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedTask(task);
                                    setShowTaskModal(true);
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteTask(task.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Supprimer
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucune tâche planifiée</p>
              <p className="text-sm">Commencez par ajouter vos premières tâches ou utilisez l'IA pour générer un planning</p>
            </div>
          )}
        </CardContent>
      </Card>

      <TaskEditModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        teamMembers={teamMembers}
        onSave={handleSaveTask}
      />

      <AISuggestionsModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onAddSuggestions={handleAddAISuggestions}
      />
    </div>
  );
};

export default MonJourMPlanning;
