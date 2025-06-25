import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Circle, 
  User, 
  Calendar, 
  Edit2, 
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import ErrorBoundary from './ErrorBoundary';
import TaskEditModal from './TaskEditModal';

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

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const MonJourMPlanning: React.FC = () => {
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [coordinationId, setCoordinationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    duration: 30,
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('🚀 Initializing planning data for user:', user.id);

      // Récupérer la coordination
      const { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (coordination) {
        console.log('✅ Found coordination:', coordination.id);
        setCoordinationId(coordination.id);
        await Promise.all([
          loadTasks(coordination.id),
          loadTeamMembers(coordination.id)
        ]);
      } else {
        console.log('⚠️ No coordination found, creating one...');
        const { data: newCoordination, error } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage'
          })
          .select()
          .single();

        if (error) {
          console.error('❌ Error creating coordination:', error);
          return;
        }

        console.log('✅ Created new coordination:', newCoordination.id);
        setCoordinationId(newCoordination.id);
        await loadTeamMembers(newCoordination.id);
      }
    } catch (error) {
      console.error('❌ Error initializing data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async (coordId: string) => {
    console.log('📥 Loading tasks for coordination:', coordId);
    
    const { data, error } = await supabase
      .from('coordination_planning')
      .select('*')
      .eq('coordination_id', coordId)
      .order('position');

    if (error) {
      console.error('❌ Error loading tasks:', error);
      return;
    }

    console.log('✅ Loaded tasks:', data);

    const mappedData = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      start_time: item.start_time,
      end_time: item.end_time,
      duration: item.duration || 0,
      category: item.category || 'general',
      position: item.position || 0,
      assigned_to: item.assigned_to ? (Array.isArray(item.assigned_to) ? item.assigned_to : [item.assigned_to]) : [],
      status: (['todo', 'in_progress', 'completed'].includes(item.status) ? item.status : 'todo') as 'todo' | 'in_progress' | 'completed',
      priority: (['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium') as 'low' | 'medium' | 'high',
      is_ai_generated: item.is_ai_generated || false
    }));

    setTasks(mappedData);
  };

  const loadTeamMembers = async (coordId: string) => {
    console.log('👥 Loading team members for coordination:', coordId);
    
    const { data, error } = await supabase
      .from('coordination_team')
      .select('id, name, role')
      .eq('coordination_id', coordId);

    if (error) {
      console.error('❌ Error loading team members:', error);
      return;
    }

    console.log('✅ Loaded team members:', data);
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

  const updateTask = async (taskId: string, taskData: Partial<PlanningTask>) => {
    if (!coordinationId) return;

    console.log('📝 Updating task:', taskId, taskData);
    
    try {
      // Convertir assigned_to en format compatible avec Supabase
      const supabaseTaskData: any = { ...taskData };
      if (taskData.assigned_to !== undefined) {
        // Convertir le tableau en format JSONB pour Supabase
        supabaseTaskData.assigned_to = taskData.assigned_to;
      }

      const { error } = await supabase
        .from('coordination_planning')
        .update(supabaseTaskData)
        .eq('id', taskId)
        .eq('coordination_id', coordinationId);

      if (error) {
        console.error('❌ Error updating task:', error);
        throw error;
      }

      console.log('✅ Task updated successfully');
      toast({
        title: "Tâche modifiée",
        description: "La tâche a été mise à jour avec succès"
      });
    } catch (error) {
      console.error('❌ Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
      throw error;
    }
  };

  const addTask = async () => {
    if (!coordinationId || !newTask.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

    console.log('➕ Adding task:', newTask);

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordinationId,
          title: newTask.title,
          description: newTask.description,
          duration: newTask.duration,
          category: newTask.category,
          priority: newTask.priority,
          position: tasks.length,
          status: 'todo',
          is_ai_generated: false
        });

      if (error) {
        console.error('❌ Error adding task:', error);
        throw error;
      }

      console.log('✅ Task added successfully');
      setNewTask({ title: '', description: '', duration: 30, category: 'general', priority: 'medium' });
      setShowAddTask(false);
      
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée au planning"
      });
    } catch (error) {
      console.error('❌ Error adding task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!coordinationId) return;

    console.log('🗑️ Deleting task:', taskId);
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId)
        .eq('coordination_id', coordinationId);

      if (error) {
        console.error('❌ Error deleting task:', error);
        throw error;
      }

      console.log('✅ Task deleted successfully');
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée avec succès"
      });
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'todo' | 'in_progress' | 'completed') => {
    await updateTask(taskId, { status });
  };

  const handleEditTask = (task: PlanningTask) => {
    setEditingTask(task);
    setShowEditModal(true);
  };

  const handleSaveTask = async (taskData: Partial<PlanningTask>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(destinationIndex, 0, movedTask);

    const updates = reorderedTasks.map((task, index) => ({
      id: task.id,
      position: index
    }));

    setTasks(reorderedTasks);

    try {
      for (const update of updates) {
        await supabase
          .from('coordination_planning')
          .update({ position: update.position })
          .eq('id', update.id);
      }
      console.log('✅ Tasks reordered successfully');
    } catch (error) {
      console.error('❌ Error reordering tasks:', error);
    }
  };

  const generateAITasks = async () => {
    const aiTasks = [
      {
        title: "Préparation des mariés",
        description: "Coiffure, maquillage et habillage",
        duration: 120,
        category: "preparation",
        priority: "high" as const
      },
      {
        title: "Photos de couple",
        description: "Séance photo des mariés",
        duration: 60,
        category: "photos",
        priority: "medium" as const
      },
      {
        title: "Cérémonie",
        description: "Cérémonie de mariage",
        duration: 45,
        category: "ceremonie",
        priority: "high" as const
      },
      {
        title: "Cocktail",
        description: "Vin d'honneur avec les invités",
        duration: 90,
        category: "reception",
        priority: "medium" as const
      }
    ];

    if (!coordinationId) {
      toast({
        title: "Erreur",
        description: "Impossible de générer des tâches pour le moment",
        variant: "destructive"
      });
      return;
    }

    console.log('🤖 Generating AI tasks...');

    try {
      const tasksToInsert = aiTasks.map((task, index) => ({
        coordination_id: coordinationId,
        title: task.title,
        description: task.description,
        duration: task.duration,
        category: task.category,
        priority: task.priority,
        position: tasks.length + index,
        status: 'todo',
        is_ai_generated: true
      }));

      const { error } = await supabase
        .from('coordination_planning')
        .insert(tasksToInsert);

      if (error) throw error;

      console.log('✅ AI tasks generated successfully');
      toast({
        title: "Planning généré !",
        description: "L'IA a ajouté des tâches suggérées à votre planning"
      });
    } catch (error) {
      console.error('❌ Error generating AI tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le planning IA",
        variant: "destructive"
      });
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    try {
      return new Date(timeString).toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const getAssigneeNames = (assignedTo?: string[]) => {
    if (!assignedTo || assignedTo.length === 0) return 'Non assigné';
    
    const names = assignedTo.map(id => {
      const member = teamMembers.find(m => m.id === id);
      return member ? member.name : 'Inconnu';
    });
    
    return names.join(', ');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Chargement du planning...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const DragDropTimeline = () => (
    <ErrorBoundary fallback={
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    }>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${snapshot.isDragging ? 'shadow-lg' : ''}`}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ErrorBoundary>
  );

  const TaskCard = ({ task }: { task: PlanningTask }) => (
    <div className={`p-4 border rounded-lg bg-white shadow-sm ${task.is_ai_generated ? 'border-l-4 border-l-purple-400' : ''}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <button onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'todo' : 'completed')}>
              {getStatusIcon(task.status)}
            </button>
            <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
              {(task.start_time || task.end_time) && (
                <span className="ml-2 text-sm text-gray-600">
                  ({formatTime(task.start_time)} - {formatTime(task.end_time)})
                </span>
              )}
            </h3>
            {task.is_ai_generated && (
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                IA
              </Badge>
            )}
          </div>
          
          {task.description && (
            <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Badge variant="outline">{task.duration} min</Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
            </Badge>
            <span className="capitalize">{task.category}</span>
          </div>

          {task.assigned_to && task.assigned_to.length > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
              <User className="h-3 w-3" />
              <span>Assigné à: {getAssigneeNames(task.assigned_to)}</span>
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditTask(task)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleDeleteTask(task.id)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Actions en-tête */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning & Tâches</h2>
          <p className="text-gray-600">Organisez votre timeline et assignez les tâches</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAddTask(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </Button>
          <Button 
            onClick={generateAITasks}
            className="flex items-center gap-2 bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <Sparkles className="h-4 w-4" />
            Générer avec IA
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout rapide */}
      {showAddTask && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle tâche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <Textarea
              placeholder="Description (optionnel)"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Durée (minutes)</label>
                <Input
                  type="number"
                  value={newTask.duration}
                  onChange={(e) => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Général</SelectItem>
                    <SelectItem value="preparation">Préparation</SelectItem>
                    <SelectItem value="ceremonie">Cérémonie</SelectItem>
                    <SelectItem value="photos">Photos</SelectItem>
                    <SelectItem value="reception">Réception</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priorité</label>
                <Select value={newTask.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({ ...newTask, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Faible</SelectItem>
                    <SelectItem value="medium">Moyenne</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={addTask}>Ajouter</Button>
              <Button variant="outline" onClick={() => setShowAddTask(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline des tâches */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline du jour J</CardTitle>
        </CardHeader>
        <CardContent>
          <DragDropTimeline />

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucune tâche planifiée</p>
              <p className="text-sm">Commencez par ajouter des tâches ou utilisez l'assistant IA</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <TaskEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        task={editingTask}
        teamMembers={teamMembers}
        onSave={handleSaveTask}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette tâche ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteTask} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MonJourMPlanning;
