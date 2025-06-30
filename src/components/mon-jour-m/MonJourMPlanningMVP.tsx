import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Calendar, Clock, Users, CheckCircle2, Circle, Edit2, Trash2, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';
import TaskEditModal from './TaskEditModal';
import AISuggestionsModal from './AISuggestionsModal';
import PlanningShareButton from './PlanningShareButton';

interface Task {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  category: string;
  priority: string;
  assigned_to?: string[];
  position: number;
  status?: 'pending' | 'completed' | 'in_progress';
  coordination_id: string;
  is_ai_generated?: boolean;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: 'person' | 'vendor';
}

const MonJourMPlanningMVP: React.FC = () => {
  const { coordination, isLoading } = useWeddingCoordination();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    start_time: '',
    duration: 30,
    category: 'general',
    priority: 'medium',
    assigned_to: [] as string[]
  });
  const { toast } = useToast();

  useEffect(() => {
    if (coordination?.id) {
      loadTasks();
      loadTeamMembers();
    }
  }, [coordination?.id]);

  const loadTasks = async () => {
    if (!coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('position', { ascending: true });

      if (error) throw error;
      
      // Normaliser les données pour correspondre à l'interface Task
      const normalizedTasks: Task[] = (data || []).map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start_time: task.start_time,
        end_time: task.end_time,
        duration: task.duration || 30,
        category: task.category,
        priority: task.priority,
        assigned_to: Array.isArray(task.assigned_to) 
          ? task.assigned_to.filter(item => typeof item === 'string')
          : [],
        position: task.position || 0,
        status: 'pending', // Valeur par défaut car la colonne n'existe pas encore
        coordination_id: task.coordination_id,
        is_ai_generated: task.is_ai_generated || false
      }));
      
      setTasks(normalizedTasks);
    } catch (error) {
      console.error('❌ Error loading tasks:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches",
        variant: "destructive"
      });
    }
  };

  const loadTeamMembers = async () => {
    if (!coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('created_at');

      if (error) throw error;
      
      // Normaliser les données pour correspondre à l'interface TeamMember
      const normalizedTeamMembers: TeamMember[] = (data || []).map(member => ({
        id: member.id,
        name: member.name,
        role: member.role,
        type: (member.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor'
      }));
      
      setTeamMembers(normalizedTeamMembers);
    } catch (error) {
      console.error('❌ Error loading team members:', error);
    }
  };

  const addTask = async () => {
    if (!coordination?.id || !newTask.title.trim()) return;

    try {
      const maxPosition = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) : 0;
      
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: newTask.title,
          description: newTask.description,
          start_time: newTask.start_time || null,
          duration: newTask.duration,
          category: newTask.category,
          priority: newTask.priority,
          assigned_to: newTask.assigned_to.length > 0 ? newTask.assigned_to : null,
          position: maxPosition + 1
        })
        .select()
        .single();

      if (error) throw error;

      // Créer la tâche normalisée avec status par défaut
      const normalizedTask: Task = {
        ...data,
        assigned_to: Array.isArray(data.assigned_to) 
          ? data.assigned_to.filter(item => typeof item === 'string')
          : [],
        status: 'pending'
      };

      setTasks([...tasks, normalizedTask]);
      setNewTask({
        title: '',
        description: '',
        start_time: '',
        duration: 30,
        category: 'general',
        priority: 'medium',
        assigned_to: []
      });
      setShowNewTaskForm(false);

      toast({
        title: "Tâche ajoutée",
        description: "La tâche a été ajoutée avec succès"
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

  const updateTask = async (updatedTask: Partial<Task> & { id: string }) => {
    try {
      // Exclure les propriétés qui n'existent pas dans la table
      const { status, ...taskUpdate } = updatedTask;
      
      const { error } = await supabase
        .from('coordination_planning')
        .update(taskUpdate)
        .eq('id', updatedTask.id);

      if (error) throw error;

      setTasks(tasks.map(task => 
        task.id === updatedTask.id 
          ? { ...task, ...updatedTask } 
          : task
      ));

      toast({
        title: "Tâche mise à jour",
        description: "Les modifications ont été sauvegardées"
      });
    } catch (error) {
      console.error('❌ Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la tâche",
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

      setTasks(tasks.filter(task => task.id !== taskId));

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

  const toggleTaskStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    // Mettre à jour seulement localement car la colonne status n'existe pas en DB
    setTasks(tasks.map(t => 
      t.id === task.id ? { ...t, status: newStatus } : t
    ));
  };

  const convertTaskToPlanningTask = (task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description || '',
    start_time: task.start_time || '09:00',
    duration: task.duration,
    category: task.category,
    priority: task.priority as "low" | "medium" | "high",
    assigned_to: task.assigned_to || [],
    position: task.position,
    is_ai_generated: task.is_ai_generated || false,
    status: (task.status === 'completed' ? 'completed' : 
             task.status === 'in_progress' ? 'in_progress' : 'todo') as 'todo' | 'in_progress' | 'completed'
  });

  const handleTaskUpdate = async (taskData: any) => {
    const updatedTask = {
      id: taskData.id,
      ...taskData
    };
    await updateTask(updatedTask);
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

  const getStatusIcon = (status?: string) => {
    return status === 'completed' 
      ? <CheckCircle2 className="h-4 w-4 text-green-600" />
      : <Circle className="h-4 w-4 text-gray-400" />;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAISuggestion = async (suggestion: { title: string; description: string; category: string; priority: string; duration: number }) => {
    if (!coordination?.id) return;

    try {
      const maxPosition = tasks.length > 0 ? Math.max(...tasks.map(t => t.position)) : 0;
      
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: suggestion.title,
          description: suggestion.description,
          duration: suggestion.duration,
          category: suggestion.category,
          priority: suggestion.priority,
          position: maxPosition + 1,
          is_ai_generated: true
        })
        .select()
        .single();

      if (error) throw error;

      // Créer la tâche normalisée avec status par défaut
      const normalizedTask: Task = {
        ...data,
        assigned_to: Array.isArray(data.assigned_to) 
          ? data.assigned_to.filter(item => typeof item === 'string')
          : [],
        status: 'pending'
      };

      setTasks([...tasks, normalizedTask]);
      console.log('✅ AI suggestion added to planning');
    } catch (error) {
      console.error('❌ Error adding AI suggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la suggestion IA",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!coordination) {
    return <div>Erreur : Coordination non trouvée</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Planning du Jour J</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Organisez votre timeline et assignez les tâches à votre équipe
              </p>
            </div>
            <div className="flex gap-2">
              <PlanningShareButton coordinationId={coordination.id} />
              <Button
                onClick={() => setShowAISuggestions(true)}
                className="bg-purple-600 hover:bg-purple-700"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Suggestions IA
              </Button>
              <Button
                onClick={() => setShowNewTaskForm(true)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une tâche
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Formulaire nouvelle tâche */}
          {showNewTaskForm && (
            <Card className="mb-6 border-dashed">
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="task-title">Titre de la tâche *</Label>
                      <Input
                        id="task-title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        placeholder="Ex: Accueil des invités"
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-time">Heure de début</Label>
                      <Input
                        id="task-time"
                        type="time"
                        value={newTask.start_time}
                        onChange={(e) => setNewTask({...newTask, start_time: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Détails sur la tâche..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="task-duration">Durée (min)</Label>
                      <Input
                        id="task-duration"
                        type="number"
                        value={newTask.duration}
                        onChange={(e) => setNewTask({...newTask, duration: parseInt(e.target.value) || 30})}
                        min="5"
                        step="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="task-category">Catégorie</Label>
                      <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preparation">Préparation</SelectItem>
                          <SelectItem value="ceremony">Cérémonie</SelectItem>
                          <SelectItem value="reception">Réception</SelectItem>
                          <SelectItem value="photos">Photos</SelectItem>
                          <SelectItem value="decoration">Décoration</SelectItem>
                          <SelectItem value="general">Général</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="task-priority">Priorité</Label>
                      <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
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
                    <Button onClick={addTask} disabled={!newTask.title.trim()}>
                      Ajouter
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowNewTaskForm(false)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des tâches */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="mb-2">Aucune tâche planifiée</p>
                <p className="text-sm">Commencez par ajouter des tâches pour votre jour J</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-1"
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </h3>
                        {task.is_ai_generated && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            IA
                          </Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-2 text-xs">
                        {task.start_time && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(task.start_time)}
                          </Badge>
                        )}
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.duration} min
                        </Badge>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority === 'high' ? 'Élevée' : 
                           task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {task.category}
                        </Badge>
                        
                        {task.assigned_to && Array.isArray(task.assigned_to) && task.assigned_to.length > 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {task.assigned_to.length} assigné{task.assigned_to.length > 1 ? 's' : ''}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingTask(task)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {editingTask && (
        <TaskEditModal
          task={convertTaskToPlanningTask(editingTask)}
          teamMembers={teamMembers}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleTaskUpdate}
        />
      )}

      <AISuggestionsModal
        isOpen={showAISuggestions}
        onClose={() => setShowAISuggestions(false)}
        onSelectSuggestion={handleAISuggestion}
        coordination={coordination}
      />
    </div>
  );
};

export default MonJourMPlanningMVP;
