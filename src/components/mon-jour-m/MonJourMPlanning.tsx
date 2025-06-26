
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Trash2, Edit, CheckCircle, Circle, RefreshCw } from 'lucide-react';
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
  assigned_to?: string[];
  status: string;
  position?: number;
  priority?: string;
  is_ai_generated?: boolean;
  coordination_id: string;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const MonJourMPlanning: React.FC = () => {
  const { coordination, isLoading: coordinationLoading, forceRefreshAfterMutation } = useWeddingCoordination();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    category: 'ceremonie',
    assigned_to: [] as string[]
  });
  const { toast } = useToast();

  const categories = [
    { value: 'ceremonie', label: 'Cérémonie', color: 'bg-purple-100 text-purple-800' },
    { value: 'reception', label: 'Réception', color: 'bg-blue-100 text-blue-800' },
    { value: 'preparation', label: 'Préparation', color: 'bg-green-100 text-green-800' },
    { value: 'transport', label: 'Transport', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'photos', label: 'Photos', color: 'bg-pink-100 text-pink-800' },
    { value: 'autre', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (coordination?.id) {
      loadTasks(coordination.id);
      loadTeamMembers(coordination.id);
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
        .order('position', { ascending: true });

      if (error) {
        console.error('❌ Error loading tasks:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les tâches",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Loaded tasks:', data);
      // Conversion des données pour correspondre au type PlanningTask
      const convertedTasks: PlanningTask[] = (data || []).map(task => ({
        ...task,
        description: task.description || undefined,
        duration: task.duration || undefined,
        start_time: task.start_time ? new Date(task.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        end_time: task.end_time ? new Date(task.end_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined,
        assigned_to: task.assigned_to ? 
          (Array.isArray(task.assigned_to) ? 
            task.assigned_to.map(item => String(item)) : 
            [String(task.assigned_to)]
          ) : undefined
      }));
      setTasks(convertedTasks);
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

  const handleRefresh = async () => {
    if (!coordination?.id) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        forceRefreshAfterMutation(),
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

  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    return Math.max(0, (end.getTime() - start.getTime()) / (1000 * 60));
  };

  const handleAddTask = async () => {
    if (!coordination?.id || !newTask.title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir au moins le titre",
        variant: "destructive"
      });
      return;
    }

    let duration = 0;
    let startTimeFormatted = null;
    let endTimeFormatted = null;

    if (newTask.start_time && newTask.end_time) {
      duration = calculateDuration(newTask.start_time, newTask.end_time);
      
      if (duration <= 0) {
        toast({
          title: "Erreur",
          description: "L'heure de fin doit être postérieure à l'heure de début",
          variant: "destructive"
        });
        return;
      }

      // Convertir les heures en timestamps
      const today = new Date().toISOString().split('T')[0];
      startTimeFormatted = `${today}T${newTask.start_time}:00`;
      endTimeFormatted = `${today}T${newTask.end_time}:00`;
    }

    try {
      console.log('➕ Adding new task:', newTask);
      
      const { error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: newTask.title,
          description: newTask.description || null,
          start_time: startTimeFormatted,
          end_time: endTimeFormatted,
          duration: duration,
          category: newTask.category,
          assigned_to: newTask.assigned_to.length > 0 ? newTask.assigned_to : null,
          status: 'todo',
          position: tasks.length,
          is_ai_generated: false,
          priority: 'medium'
        });

      if (error) throw error;

      toast({
        title: "Tâche ajoutée",
        description: "La tâche a été ajoutée avec succès"
      });

      // Réinitialiser le formulaire
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        category: 'ceremonie',
        assigned_to: []
      });
      setShowAddTask(false);

      // Forcer le rechargement des données
      await loadTasks(coordination.id);
      await forceRefreshAfterMutation();
    } catch (error) {
      console.error('❌ Error adding task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    
    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      // Forcer le rechargement
      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const deleteTask = async (taskId: string) => {
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

      // Forcer le rechargement
      if (coordination?.id) {
        await loadTasks(coordination.id);
        await forceRefreshAfterMutation();
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

  const getCategoryStyle = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.color : 'bg-gray-100 text-gray-800';
  };

  if (coordinationLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Initialisation...</span>
      </div>
    );
  }

  if (!coordination) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Impossible d'initialiser votre espace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton refresh et ajout */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Planning du Jour J</h2>
          <p className="text-gray-600">Organisez le déroulement de votre mariage</p>
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
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une tâche</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Titre de la tâche"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Description de la tâche"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de début</label>
                    <Input
                      type="time"
                      value={newTask.start_time}
                      onChange={(e) => setNewTask({ ...newTask, start_time: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure de fin</label>
                    <Input
                      type="time"
                      value={newTask.end_time}
                      onChange={(e) => setNewTask({ ...newTask, end_time: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <Select value={newTask.category} onValueChange={(value) => setNewTask({ ...newTask, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddTask}>
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddTask(false)}>
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
        /* Liste des tâches */
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className="mt-1 p-1"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.start_time && task.end_time && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {task.start_time} - {task.end_time}
                          </Badge>
                        )}
                        
                        <Badge className={getCategoryStyle(task.category)}>
                          {categories.find(c => c.value === task.category)?.label}
                        </Badge>
                        
                        {task.assigned_to && task.assigned_to.length > 0 && (
                          <Badge variant="secondary">
                            {task.assigned_to.length} assigné(s)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tasks.length === 0 && !isLoadingTasks && (
        <div className="text-center py-12 text-gray-500">
          <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucune tâche planifiée</p>
          <p className="text-sm">Commencez par ajouter les tâches de votre jour J</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMPlanning;
