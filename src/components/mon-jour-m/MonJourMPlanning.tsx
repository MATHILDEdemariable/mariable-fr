
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, CheckCircle2, Circle, User, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  category: string;
  priority: string;
  status: string;
  assigned_to?: string[];
  position?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const MonJourMPlanning: React.FC = () => {
  const { coordination, isLoading: coordinationLoading, refreshCoordination } = useWeddingCoordination();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
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
  const { toast } = useToast();

  useEffect(() => {
    if (coordination?.id) {
      loadTasks(coordination.id);
      loadTeamMembers(coordination.id);
      setupRealtimeSubscription();
    }
  }, [coordination?.id]);

  const loadTasks = async (coordId: string) => {
    console.log('📥 Loading tasks for coordination:', coordId);
    setIsLoadingTasks(true);
    
    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordId)
        .order('position');

      if (error) {
        console.error('❌ Error loading tasks:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger le planning",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Loaded tasks:', data);
      setTasks(data || []);
    } catch (error) {
      console.error('❌ Error in loadTasks:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTasks(false);
    }
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
          if (coordination?.id) {
            loadTasks(coordination.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleRefresh = async () => {
    if (!coordination?.id) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        refreshCoordination(),
        loadTasks(coordination.id),
        loadTeamMembers(coordination.id)
      ]);
      toast({
        title: "Données actualisées",
        description: "Le planning a été rechargé avec succès"
      });
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setIsRefreshing(false);
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

  const addTask = async () => {
    if (!coordination?.id || !formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    console.log('➕ Adding task:', formData);

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: formData.title,
          description: formData.description || null,
          start_time: formData.start_time || null,
          end_time: formData.end_time || null,
          duration: formData.duration,
          category: formData.category,
          priority: formData.priority,
          status: formData.status,
          assigned_to: formData.assigned_to.length > 0 ? formData.assigned_to : null,
          position: tasks.length
        });

      if (error) throw error;

      resetForm();
      setShowAddTask(false);
      
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée au planning"
      });

      // Recharger la liste
      await loadTasks(coordination.id);
    } catch (error) {
      console.error('❌ Error adding task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;

    console.log('✏️ Updating task:', editingTask);

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: editingTask.title,
          description: editingTask.description || null,
          start_time: editingTask.start_time || null,
          end_time: editingTask.end_time || null,
          duration: editingTask.duration,
          category: editingTask.category,
          priority: editingTask.priority,
          status: editingTask.status,
          assigned_to: editingTask.assigned_to && editingTask.assigned_to.length > 0 ? editingTask.assigned_to : null
        })
        .eq('id', editingTask.id);

      if (error) throw error;

      setEditingTask(null);
      
      toast({
        title: "Tâche modifiée",
        description: "Les informations ont été mises à jour"
      });

      // Recharger la liste
      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('❌ Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    console.log('🗑️ Deleting task:', taskId);
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été retirée du planning"
      });

      // Recharger la liste
      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('❌ Error deleting task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
  };

  const toggleTaskStatus = async (task: PlanningTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      // Recharger la liste
      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('Error toggling task status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de changer l'état de la tâche",
        variant: "destructive"
      });
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
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

  if (coordinationLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Initialisation de votre espace...</span>
      </div>
    );
  }

  if (!coordination) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Impossible d'initialiser votre espace Mon Jour-M</p>
        <Button onClick={refreshCoordination} className="mt-4" variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton refresh */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning du jour J</h2>
          <p className="text-gray-600">Organisez et coordonnez tous les détails de votre mariage</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
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
                  <Button onClick={addTask}>
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

      {isLoadingTasks ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-olive"></div>
          <span className="ml-3">Chargement du planning...</span>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Timeline du jour J</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
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
                              onClick={() => deleteTask(task.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-xs">
                          {task.start_time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(task.start_time)}</span>
                              {task.end_time && (
                                <span>- {formatTime(task.end_time)}</span>
                              )}
                            </div>
                          )}
                          
                          <Badge variant="outline">{task.duration} min</Badge>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority === 'high' ? 'Élevée' : task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                          </Badge>
                          <span className="capitalize text-gray-500">{task.category}</span>
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
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Aucune tâche planifiée</p>
                <p className="text-sm">Commencez par ajouter votre première tâche au planning</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Modal d'édition */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <Input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Titre de la tâche"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Description détaillée de la tâche"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Heure de début</label>
                  <Input
                    type="time"
                    value={editingTask.start_time || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Heure de fin</label>
                  <Input
                    type="time"
                    value={editingTask.end_time || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, end_time: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée (min)</label>
                  <Input
                    type="number"
                    value={editingTask.duration || 30}
                    onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) || 30 })}
                    min="1"
                    max="1440"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <Select value={editingTask.category} onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}>
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
                  <Select value={editingTask.priority} onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}>
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
                  <Select value={editingTask.status} onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}>
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
                <Button onClick={updateTask}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setEditingTask(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MonJourMPlanning;
