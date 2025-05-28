
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Plus, GripVertical, Edit2, Trash2, Save, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface TeamTask {
  id: string;
  task_name: string;
  phase: string;
  responsible_person: string | null;
  position: number;
  is_custom: boolean;
}

interface TeamTasksManagerProps {
  user: User | null;
}

const defaultTasks = [
  {
    task_name: 'Être le relais des prestataires pour toutes questions ou ajustements',
    phase: 'Avant la cérémonie',
    position: 1
  },
  {
    task_name: 'Accueillir les prestataires à leur arrivée',
    phase: 'Avant la cérémonie',
    position: 2
  },
  {
    task_name: 'Vérifier l\'installation de la décoration',
    phase: 'Avant la cérémonie',
    position: 3
  },
  {
    task_name: 'Coordonner l\'installation du mobilier ou des éléments techniques',
    phase: 'Avant la cérémonie',
    position: 4
  },
  {
    task_name: 'Faire le lien avec le personnel du lieu (accès, clés, consignes)',
    phase: 'Avant la cérémonie',
    position: 5
  },
  {
    task_name: 'Gérer les livraisons de dernière minute (gâteau, fleurs, cadeaux…)',
    phase: 'Avant la cérémonie',
    position: 6
  },
  {
    task_name: 'Installer la signalétique et le plan de table',
    phase: 'Avant la cérémonie',
    position: 7
  },
  {
    task_name: 'Apporter ou installer les éléments oubliés (alliances, accessoires…)',
    phase: 'Avant la cérémonie',
    position: 8
  },
  {
    task_name: 'Préparer une trousse d\'urgence (kit couture, mouchoirs, pansements…)',
    phase: 'Avant la cérémonie',
    position: 9
  },
  {
    task_name: 'Accueillir les invités à l\'entrée de la cérémonie',
    phase: 'Pendant la cérémonie',
    position: 1
  },
  {
    task_name: 'Distribuer les livrets, confettis, pétales ou accessoires',
    phase: 'Pendant la cérémonie',
    position: 2
  },
  {
    task_name: 'Guider les intervenants : officiant, musiciens, témoins',
    phase: 'Pendant la cérémonie',
    position: 3
  },
  {
    task_name: 'Gérer le timing de la cérémonie (entrée des mariés, musique, discours)',
    phase: 'Pendant la cérémonie',
    position: 4
  },
  {
    task_name: 'Coordonner le passage entre deux cérémonies si besoin',
    phase: 'Pendant la cérémonie',
    position: 5
  },
  {
    task_name: 'Organiser les photos de groupe (suivi de la liste, appels des groupes)',
    phase: 'Photos / Cocktail',
    position: 1
  },
  {
    task_name: 'Vérifier que les prestataires prennent leur pause repas',
    phase: 'Photos / Cocktail',
    position: 2
  },
  {
    task_name: 'Guider les invités vers les animations (photobooth, jeux, livre d\'or…)',
    phase: 'Photos / Cocktail',
    position: 3
  },
  {
    task_name: 'Gérer les trajets invités (navettes, taxis, itinéraires)',
    phase: 'Photos / Cocktail',
    position: 4
  },
  {
    task_name: 'Prévoir un moment calme pour les mariés avant la soirée',
    phase: 'Photos / Cocktail',
    position: 5
  },
  {
    task_name: 'S\'assurer que les mariés boivent et mangent pendant la journée',
    phase: 'Photos / Cocktail',
    position: 6
  },
  {
    task_name: 'Aider la mariée à faire des retouches beauté ou ajuster sa tenue',
    phase: 'Photos / Cocktail',
    position: 7
  },
  {
    task_name: 'Vérifier les placements selon le plan de table',
    phase: 'Soirée',
    position: 1
  },
  {
    task_name: 'Coordonner l\'entrée des mariés dans la salle de réception',
    phase: 'Soirée',
    position: 2
  },
  {
    task_name: 'Introduire les discours et les surprises des invités',
    phase: 'Soirée',
    position: 3
  },
  {
    task_name: 'Gérer le déroulé du repas, des animations et de l\'ouverture du bal',
    phase: 'Soirée',
    position: 4
  },
  {
    task_name: 'Distribuer les cadeaux ou petits présents aux invités',
    phase: 'Soirée',
    position: 5
  },
  {
    task_name: 'Aider à ranger et récupérer les affaires personnelles des mariés',
    phase: 'Fin de soirée',
    position: 1
  },
  {
    task_name: 'Vérifier qu\'aucun objet n\'a été oublié (déco, accessoires, vêtements…)',
    phase: 'Fin de soirée',
    position: 2
  },
  {
    task_name: 'Encadrer le rangement et la récupération du matériel loué',
    phase: 'Fin de soirée',
    position: 3
  },
  {
    task_name: 'Organiser les retours ou départs en fin de soirée (chauffeurs, navettes)',
    phase: 'Fin de soirée',
    position: 4
  },
  {
    task_name: 'Vérifier les derniers paiements ou pourboires aux prestataires',
    phase: 'Fin de soirée',
    position: 5
  }
];

const phases = [
  'Avant la cérémonie',
  'Pendant la cérémonie',
  'Photos / Cocktail',
  'Soirée',
  'Fin de soirée'
];

const TeamTasksManager: React.FC<TeamTasksManagerProps> = ({ user }) => {
  const [tasks, setTasks] = useState<TeamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [newTaskPhase, setNewTaskPhase] = useState<string>('');
  const [newTaskName, setNewTaskName] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('team_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('phase')
        .order('position');

      if (error) throw error;

      if (!data || data.length === 0) {
        // Initialize with default tasks
        await initializeDefaultTasks();
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeDefaultTasks = async () => {
    if (!user) return;

    try {
      const tasksToInsert = defaultTasks.map(task => ({
        user_id: user.id,
        task_name: task.task_name,
        phase: task.phase,
        position: task.position,
        is_custom: false
      }));

      const { data, error } = await supabase
        .from('team_tasks')
        .insert(tasksToInsert)
        .select();

      if (error) throw error;

      if (data) {
        setTasks(data);
      }
    } catch (error) {
      console.error('Error initializing default tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'initialiser les tâches par défaut",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newTasks = Array.from(tasks);
    const [reorderedTask] = newTasks.splice(source.index, 1);
    newTasks.splice(destination.index, 0, reorderedTask);

    // Update positions
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      position: index + 1
    }));

    setTasks(updatedTasks);

    // Save to database
    try {
      const updates = updatedTasks.map(task => ({
        id: task.id,
        position: task.position
      }));

      for (const update of updates) {
        await supabase
          .from('team_tasks')
          .update({ position: update.position })
          .eq('id', update.id);
      }
    } catch (error) {
      console.error('Error updating task positions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le nouvel ordre",
        variant: "destructive"
      });
    }
  };

  const updateTaskResponsible = async (taskId: string, responsiblePerson: string) => {
    try {
      const { error } = await supabase
        .from('team_tasks')
        .update({ responsible_person: responsiblePerson })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, responsible_person: responsiblePerson }
          : task
      ));
    } catch (error) {
      console.error('Error updating responsible person:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le responsable",
        variant: "destructive"
      });
    }
  };

  const addCustomTask = async () => {
    if (!newTaskName.trim() || !newTaskPhase || !user) return;

    const maxPosition = Math.max(
      ...tasks.filter(t => t.phase === newTaskPhase).map(t => t.position),
      0
    );

    try {
      const { data, error } = await supabase
        .from('team_tasks')
        .insert({
          user_id: user.id,
          task_name: newTaskName.trim(),
          phase: newTaskPhase,
          position: maxPosition + 1,
          is_custom: true
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setTasks(prev => [...prev, data]);
        setNewTaskName('');
        setNewTaskPhase('');
        toast({
          title: "Tâche ajoutée",
          description: "La nouvelle tâche a été ajoutée avec succès"
        });
      }
    } catch (error) {
      console.error('Error adding custom task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('team_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== taskId));
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

  const updateTaskName = async (taskId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('team_tasks')
        .update({ task_name: newName })
        .eq('id', taskId);

      if (error) throw error;

      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, task_name: newName }
          : task
      ));
      
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task name:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  const tasksByPhase = phases.reduce((acc, phase) => {
    acc[phase] = tasks.filter(task => task.phase === phase).sort((a, b) => a.position - b.position);
    return acc;
  }, {} as Record<string, TeamTask[]>);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif text-wedding-olive">Gestion d'équipe</h2>
        <div className="flex gap-2">
          <select
            value={newTaskPhase}
            onChange={(e) => setNewTaskPhase(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="">Sélectionner une phase</option>
            {phases.map(phase => (
              <option key={phase} value={phase}>{phase}</option>
            ))}
          </select>
          <Input
            placeholder="Nouvelle tâche..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addCustomTask()}
            className="w-64"
          />
          <Button onClick={addCustomTask} disabled={!newTaskName.trim() || !newTaskPhase}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-6">
          {phases.map(phase => (
            <Card key={phase}>
              <CardHeader>
                <CardTitle className="text-lg">{phase}</CardTitle>
              </CardHeader>
              <CardContent>
                <Droppable droppableId={phase}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {tasksByPhase[phase].map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                            >
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              
                              <div className="flex-1">
                                {editingTask === task.id ? (
                                  <div className="flex gap-2">
                                    <Input
                                      defaultValue={task.task_name}
                                      onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                          updateTaskName(task.id, e.currentTarget.value);
                                        }
                                      }}
                                      className="flex-1"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const input = document.querySelector(`input[defaultValue="${task.task_name}"]`) as HTMLInputElement;
                                        if (input) {
                                          updateTaskName(task.id, input.value);
                                        }
                                      }}
                                    >
                                      <Save className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingTask(null)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-sm">{task.task_name}</span>
                                )}
                              </div>
                              
                              <Input
                                placeholder="Responsable..."
                                value={task.responsible_person || ''}
                                onChange={(e) => updateTaskResponsible(task.id, e.target.value)}
                                className="w-48"
                              />
                              
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingTask(task.id)}
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                {task.is_custom && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => deleteTask(task.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default TeamTasksManager;
