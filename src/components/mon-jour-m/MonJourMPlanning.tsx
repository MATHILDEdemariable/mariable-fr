
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, CheckCircle2, Circle, User, RefreshCw, Edit, Trash2, Sparkles, GripVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AISuggestionsModal from './AISuggestionsModal';
import TaskEditModal from './TaskEditModal';

// Utilisation du type PlanningTask du contexte - pas de duplication d'interface
import { PlanningTask } from '@/contexts/MonJourMContext';

interface WeddingCoordination {
  id: string;
  title: string;
  description?: string;
  wedding_date?: string;
  wedding_location?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  type: 'person' | 'vendor';
  prestataire_id?: string;
  notes?: string;
}

const MonJourMPlanning: React.FC = () => {
  const { toast } = useToast();
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    duration: 30,
    category: 'general',
    priority: 'medium',
    status: 'todo',
    assigned_to: [] as string[]
  });

  // Initialisation simple
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer ou créer la coordination
      let { data: coordinations, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coordError) throw coordError;

      let activeCoordination: WeddingCoordination;

      if (coordinations && coordinations.length > 0) {
        activeCoordination = coordinations[0];
      } else {
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (createError) throw createError;
        activeCoordination = newCoordination;
      }

      setCoordination(activeCoordination);

      // Charger les tâches et l'équipe
      await Promise.all([
        loadTasks(activeCoordination.id),
        loadTeamMembers(activeCoordination.id)
      ]);

    } catch (error) {
      console.error('Erreur initialisation:', error);
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
    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordId)
        .order('position');

      if (error) throw error;

      const formattedTasks: PlanningTask[] = (data || []).map(task => ({
        ...task,
        assigned_to: Array.isArray(task.assigned_to) 
          ? task.assigned_to.map(id => String(id))
          : task.assigned_to 
            ? [String(task.assigned_to)]
            : []
      }));
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Erreur chargement tâches:', error);
    }
  };

  const loadTeamMembers = async (coordId: string) => {
    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at');

      if (error) throw error;

      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        type: (item.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor',
        prestataire_id: item.prestataire_id,
        notes: item.notes
      }));

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  const refreshData = async () => {
    if (coordination?.id) {
      await Promise.all([
        loadTasks(coordination.id),
        loadTeamMembers(coordination.id)
      ]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      duration: 30,
      category: 'general',
      priority: 'medium',
      status: 'todo',
      assigned_to: []
    });
  };

  const handleAddTask = async () => {
    if (!formData.title.trim() || !coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: formData.title,
          description: formData.description || null,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          duration: formData.duration || 30,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          assigned_to: formData.assigned_to && formData.assigned_to.length > 0 ? formData.assigned_to : null,
          position: tasks.length,
          is_ai_generated: false
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: PlanningTask = {
        ...data,
        assigned_to: Array.isArray(data.assigned_to) 
          ? data.assigned_to.map(id => String(id))
          : data.assigned_to 
            ? [String(data.assigned_to)]
            : [],
        is_ai_generated: data.is_ai_generated || false
      };
      
      setTasks(prev => [...prev, newTask]);
      resetForm();
      setShowAddTask(false);
      
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée au planning"
      });

    } catch (error) {
      console.error('Erreur ajout tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const handleSaveTask = async (taskData: Partial<PlanningTask>) => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: taskData.title,
          description: taskData.description || null,
          start_time: taskData.start_time || null,
          end_time: taskData.end_time || null,
          duration: taskData.duration || 30,
          category: taskData.category,
          priority: taskData.priority,
          assigned_to: taskData.assigned_to && taskData.assigned_to.length > 0 ? taskData.assigned_to : null,
          is_ai_generated: taskData.is_ai_generated || false
        })
        .eq('id', editingTask.id);

      if (error) throw error;

      // Mettre à jour la tâche dans le state local
      setTasks(prev => prev.map(t => 
        t.id === editingTask.id 
          ? { ...t, ...taskData } 
          : t
      ));
      
      setEditingTask(null);
      
      toast({
        title: "Tâche modifiée",
        description: "Les informations ont été mises à jour"
      });

    } catch (error) {
      console.error('Erreur modification tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(prev => prev.filter(t => t.id !== taskId));
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été retirée du planning"
      });

    } catch (error) {
      console.error('Erreur suppression tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
  };

  const toggleTaskStatus = async (task: PlanningTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    const updatedTask = { ...task, status: newStatus };
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;
      
      setTasks(prev => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Erreur changement statut:', error);
    }
  };

  const handleAISuggestion = async (suggestion: { title: string; description: string; category: string; priority: string; duration: number }) => {
    if (!coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: suggestion.title,
          description: suggestion.description,
          category: suggestion.category,
          priority: suggestion.priority,
          status: 'todo',
          duration: suggestion.duration,
          position: tasks.length,
          is_ai_generated: true
        })
        .select()
        .single();

      if (error) throw error;

      const newTask: PlanningTask = {
        ...data,
        assigned_to: [],
        is_ai_generated: true
      };
      
      setTasks(prev => [...prev, newTask]);
      
      toast({
        title: "Suggestion ajoutée",
        description: "La tâche suggérée a été ajoutée au planning"
      });

    } catch (error) {
      console.error('Erreur ajout suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la suggestion",
        variant: "destructive"
      });
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      // Si c'est un timestamp complet
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        return date.toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      // Si c'est déjà au format HH:MM
      if (timeString.match(/^\d{2}:\d{2}$/)) {
        return timeString;
      }
      // Autres formats
      const date = new Date(`1970-01-01T${timeString}`);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return timeString;
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mise à jour des positions SEULEMENT
    const updatedTasks = items.map((task, index) => ({
      ...task,
      position: index
    }));
    
    setTasks(updatedTasks);

    // Mettre à jour en base - SEULEMENT les positions
    try {
      for (const task of updatedTasks) {
        await supabase
          .from('coordination_planning')
          .update({ position: task.position })
          .eq('id', task.id);
      }
      
      toast({
        title: "Planning réorganisé",
        description: "L'ordre des tâches a été mis à jour"
      });
    } catch (error) {
      console.error('Erreur mise à jour positions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'ordre",
        variant: "destructive"
      });
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning du jour J</h2>
          <p className="text-gray-600">Organisez et coordonnez tous les détails de votre mariage</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={refreshData}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>

          <Button
            onClick={() => setShowAISuggestions(true)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100"
          >
            <Sparkles className="h-4 w-4 text-purple-600" />
            Générer avec l'IA
          </Button>

          <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une tâche
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter une tâche au planning</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre de la tâche"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description détaillée de la tâche"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de début</label>
                    <Input
                      type="time"
                      value={formData.start_time}
                      onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de fin</label>
                    <Input
                      type="time"
                      value={formData.end_time}
                      onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Durée (min)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                      min="1"
                      max="1440"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Général</SelectItem>
                        <SelectItem value="ceremony">Cérémonie</SelectItem>
                        <SelectItem value="reception">Réception</SelectItem>
                        <SelectItem value="photos">Photos</SelectItem>
                        <SelectItem value="music">Musique</SelectItem>
                        <SelectItem value="catering">Traiteur</SelectItem>
                        <SelectItem value="decoration">Décoration</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Priorité</label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
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

                  <div>
                    <label className="block text-sm font-medium mb-1">Statut</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">À faire</SelectItem>
                        <SelectItem value="in_progress">En cours</SelectItem>
                        <SelectItem value="completed">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddTask} disabled={!formData.title.trim()}>
                    Ajouter la tâche
                  </Button>
                  <Button variant="outline" onClick={() => {
                    resetForm();
                    setShowAddTask(false);
                  }}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline du jour J</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
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
                              <div
                                {...provided.dragHandleProps}
                                className="mt-1 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>

                              <button
                                onClick={() => toggleTaskStatus(task)}
                                className="mt-1"
                              >
                                {getStatusIcon(task.status)}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                      {task.title}
                                    </h3>
                                    {task.description && (
                                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-1 ml-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingTask(task)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 mt-2 text-xs flex-wrap">
                                  {task.start_time && (
                                    <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded">
                                      <Clock className="h-3 w-3 text-blue-600" />
                                      <span className="text-blue-700 font-medium">
                                        {formatTime(task.start_time)}
                                      </span>
                                    </div>
                                  )}
                                  
                                  <Badge variant="outline">{task.duration || 30} min</Badge>
                                  <Badge className={getPriorityColor(task.priority)}>
                                    {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                                  </Badge>
                                  <Badge variant="secondary" className="capitalize">{task.category}</Badge>
                                </div>

                                {task.assigned_to && Array.isArray(task.assigned_to) && task.assigned_to.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {task.assigned_to.map((memberId: string) => {
                                      const member = teamMembers.find(m => m.id === memberId);
                                      return member ? (
                                        <Badge key={memberId} variant="secondary">
                                          <User className="h-3 w-3 mr-1" />
                                          {member.name}
                                        </Badge>
                                      ) : null;
                                    })}
                                  </div>
                                )}
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
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucune tâche planifiée</p>
              <p className="text-sm">Commencez par ajouter votre première tâche au planning</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition de tâche */}
      <TaskEditModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        teamMembers={teamMembers}
        onSave={handleSaveTask}
      />

      {/* Modal de suggestions IA */}
      <AISuggestionsModal
        isOpen={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        onSelectSuggestion={handleAISuggestion}
        coordination={coordination}
      />
    </div>
  );
};

export default MonJourMPlanning;
