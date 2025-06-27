import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Edit2, Trash2, Save, X, Users, Sparkles, GripVertical } from 'lucide-react';
import { useMonJourM, PlanningTask } from '@/contexts/MonJourMContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

// Import du type unifié et des fonctions utilitaires du contexte
import { PlanningTask, normalizeTask, updateTaskPositions } from '@/contexts/MonJourMContext';

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

// Type pour les données brutes de la base de données
interface DatabaseTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration?: number;
  category?: string;
  priority?: string;
  status?: string;
  assigned_to?: any; // Type Json de Supabase
  position?: number;
  is_ai_generated?: boolean;
  coordination_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Fonction pour normaliser assigned_to
const normalizeAssignedTo = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.map(id => String(id));
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed.map(id => String(id));
      }
    } catch {
      return [String(value)];
    }
  }
  return [];
};

// Fonction pour normaliser le status
const normalizeStatus = (value?: string): "todo" | "completed" | "in_progress" => {
  if (!value) return "todo";
  switch (value.toLowerCase()) {
    case "completed":
    case "complete":
    case "done":
      return "completed";
    case "in_progress":
    case "in-progress":
    case "progress":
    case "doing":
      return "in_progress";
    case "todo":
    case "to-do":
    case "pending":
    default:
      return "todo";
  }
};

// Fonction pour normaliser la priorité
const normalizePriority = (value?: string): "low" | "medium" | "high" => {
  if (!value) return "medium";
  switch (value.toLowerCase()) {
    case "high":
    case "élevée":
    case "elevee":
      return "high";
    case "low":
    case "faible":
      return "low";
    case "medium":
    case "moyenne":
    default:
      return "medium";
  }
};

// Fonction de transformation complète des tâches de la base de données
const transformDatabaseTask = (dbTask: DatabaseTask, index: number): PlanningTask => {
  return {
    id: dbTask.id,
    title: dbTask.title,
    description: dbTask.description,
    start_time: dbTask.start_time || "09:00",
    end_time: dbTask.end_time,
    duration: dbTask.duration || 15, // Valeur par défaut de 15 minutes
    category: dbTask.category || 'general',
    priority: normalizePriority(dbTask.priority),
    status: normalizeStatus(dbTask.status),
    assigned_to: normalizeAssignedTo(dbTask.assigned_to),
    position: typeof dbTask.position === 'number' ? dbTask.position : index, // Position obligatoire
    is_ai_generated: dbTask.is_ai_generated || false,
    is_manual_time: false // Valeur par défaut
  };
};

const MonJourMPlanningContent: React.FC = () => {
  const { 
    tasks, 
    teamMembers, 
    isLoading, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useMonJourM();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    start_time: '09:00',
    duration: 30,
    category: 'Général',
    priority: 'medium',
    status: 'todo',
    assigned_to: [],
    is_manual_time: false
  });

  // Fonction pour valider et normaliser les heures au format HH:mm
  const normalizeTimeString = (timeString: string): string => {
    if (!timeString) return "09:00";
    
    // Si c'est déjà au format HH:mm, valider et retourner
    if (timeString.match(/^\d{2}:\d{2}$/)) {
      const [hours, minutes] = timeString.split(':').map(Number);
      if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
        return timeString;
      }
    }
    
    // Si c'est un timestamp ISO, extraire l'heure
    if (timeString.includes('T')) {
      try {
        const date = new Date(timeString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      } catch (error) {
        console.error('Erreur parsing timestamp:', error);
        return "09:00";
      }
    }
    
    return "09:00";
  };

  // Utilitaire pour additionner des minutes à une heure
  const addMinutesToTime = (timeString: string, minutes: number): string => {
    if (!timeString || !minutes) return timeString;
    
    try {
      const normalizedTime = normalizeTimeString(timeString);
      const [hour, minute] = normalizedTime.split(':').map(Number);
      
      const totalMinutes = hour * 60 + minute + minutes;
      const newHour = Math.floor(totalMinutes / 60) % 24;
      const newMinute = totalMinutes % 60;
      
      return `${newHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Erreur lors du calcul du temps:', error);
      return timeString;
    }
  };

  // Recalcule intelligemment les horaires en respectant les heures manuelles
  const recalculateTimeline = (tasksToRecalculate: PlanningTask[]): PlanningTask[] => {
    if (tasksToRecalculate.length === 0) return tasksToRecalculate;
    
    const sortedTasks = [...tasksToRecalculate].sort((a, b) => a.position - b.position);
    const recalculatedTasks: PlanningTask[] = [];
    
    for (let i = 0; i < sortedTasks.length; i++) {
      const task = sortedTasks[i];
      
      if (task.is_manual_time) {
        // Garder l'heure manuelle telle quelle
        const endTime = addMinutesToTime(normalizeTimeString(task.start_time || '09:00'), task.duration);
        recalculatedTasks.push({
          ...task,
          start_time: normalizeTimeString(task.start_time || '09:00'),
          end_time: endTime
        });
      } else {
        // Calculer automatiquement
        if (i === 0) {
          // Première tâche : utiliser l'heure actuelle ou 09:00
          const startTime = normalizeTimeString(task.start_time || '09:00');
          const endTime = addMinutesToTime(startTime, task.duration);
          recalculatedTasks.push({
            ...task,
            start_time: startTime,
            end_time: endTime
          });
        } else {
          // Tâches suivantes : commencer après la précédente
          const previousTask = recalculatedTasks[i - 1];
          const previousEndTime = previousTask.end_time || addMinutesToTime(normalizeTimeString(previousTask.start_time || '09:00'), previousTask.duration);
          const newEndTime = addMinutesToTime(previousEndTime, task.duration);
          
          recalculatedTasks.push({
            ...task,
            start_time: previousEndTime,
            end_time: newEndTime
          });
        }
      }
    }
    
    return recalculatedTasks;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_time: '09:00',
      duration: 30,
      category: 'Général',
      priority: 'medium',
      status: 'todo',
      assigned_to: [],
      is_manual_time: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const taskData: Omit<PlanningTask, 'id'> = {
      title: formData.title,
      description: formData.description,
      start_time: formData.start_time,
      end_time: undefined,
      duration: formData.duration,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      assigned_to: formData.assigned_to,
      position: tasks.length,
      is_ai_generated: false,
      is_manual_time: formData.is_manual_time || false
    };

    const success = await addTask(taskData);
    if (success) {
      resetForm();
      setIsAddingTask(false);
    }
  };

  const handleEdit = (task: PlanningTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      start_time: task.start_time || '09:00',
      duration: task.duration,
      category: task.category,
      priority: task.priority,
      status: task.status,
      assigned_to: task.assigned_to,
      is_manual_time: task.is_manual_time || false
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingTask || !formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

    const updatedTask: PlanningTask = {
      ...editingTask,
      title: formData.title,
      description: formData.description,
      start_time: formData.start_time,
      duration: formData.duration,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      assigned_to: formData.assigned_to,
      is_manual_time: formData.is_manual_time || false
    };

    const success = await updateTask(updatedTask);
    if (success) {
      resetForm();
      setEditingTask(null);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      await deleteTask(taskId);
    }
  };

  const handleStatusChange = async (task: PlanningTask, newStatus: "todo" | "completed" | "in_progress") => {
    const updatedTask: PlanningTask = {
      ...task,
      status: newStatus
    };
    await updateTask(updatedTask);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les positions
    const updatedTasks = items.map((task, index) => ({
      ...task,
      position: index
    }));

    // Sauvegarder les nouvelles positions
    for (const task of updatedTasks) {
      await updateTask(task);
    }
  };

  const generateAITasks = async () => {
    setIsGeneratingTasks(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour utiliser l'IA",
          variant: "destructive"
        });
        return;
      }

      const prompt = `Génère 10 tâches de planning pour un mariage, avec des heures réalistes et des durées appropriées. Format JSON avec: title, description, start_time (format HH:MM), duration (en minutes), category, priority (low/medium/high), status (todo), assigned_to (array vide).`;

      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: {
          message: prompt,
          user_id: user.id
        }
      });

      if (error) throw error;

      const aiTasks = JSON.parse(data.response);
      
      for (let i = 0; i < aiTasks.length; i++) {
        const aiTask = aiTasks[i];
        const taskData: Omit<PlanningTask, 'id'> = {
          title: aiTask.title,
          description: aiTask.description || '',
          start_time: aiTask.start_time || '09:00',
          end_time: undefined,
          duration: aiTask.duration || 30,
          category: aiTask.category || 'Général',
          priority: aiTask.priority || 'medium',
          status: 'todo',
          assigned_to: [],
          position: tasks.length + i,
          is_ai_generated: true,
          is_manual_time: false
        };
        
        await addTask(taskData);
      }

      toast({
        title: "Succès",
        description: `${aiTasks.length} tâches générées par l'IA ont été ajoutées`,
      });
      
      setShowAISuggestions(false);
    } catch (error) {
      console.error('Erreur génération IA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les tâches avec l'IA",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingTasks(false);
    }
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: "todo" | "completed" | "in_progress") => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p>Chargement du planning...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif mb-2">Mon Planning</h2>
          <p className="text-muted-foreground">
            Organisez votre journée parfaite avec un planning détaillé
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={showAISuggestions} onOpenChange={setShowAISuggestions}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Suggestions IA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Suggestions de l'IA</DialogTitle>
                <DialogDescription>
                  Laissez notre IA générer des tâches de planning personnalisées pour votre mariage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  L'IA va analyser votre mariage et créer automatiquement des tâches de planning avec des horaires réalistes.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAISuggestions(false)}>
                  Annuler
                </Button>
                <Button 
                  onClick={generateAITasks} 
                  disabled={isGeneratingTasks}
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  {isGeneratingTasks ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            onClick={() => setIsAddingTask(true)}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout/modification */}
      {(isAddingTask || editingTask) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingTask ? handleUpdate : handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre de la tâche *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Arrivée des invités"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Détails de la tâche..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="start_time">Heure de début</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Les horaires suivantes se calculeront automatiquement
                  </p>
                </div>
                <div>
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    max="480"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                  />
                </div>
                <div>
                  <Label htmlFor="priority">Priorité</Label>
                  <Select 
                    value={formData.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => setFormData({ ...formData, priority: value })}
                  >
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: "todo" | "completed" | "in_progress") => setFormData({ ...formData, status: value })}
                  >
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
                <div>
                  <Label htmlFor="assigned_to">Assigné à</Label>
                  <Select
                    value={formData.assigned_to.length > 0 ? formData.assigned_to[0] : ""}
                    onValueChange={(value) => setFormData({ ...formData, assigned_to: value ? [value] : [] })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une personne" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Non assigné</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddingTask(false);
                    setEditingTask(null);
                    resetForm();
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button type="submit" className="bg-wedding-olive hover:bg-wedding-olive/90">
                  <Save className="h-4 w-4 mr-2" />
                  {editingTask ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Liste des tâches */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucune tâche planifiée</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter des tâches à votre planning ou utilisez nos suggestions IA
              </p>
              <div className="flex justify-center gap-2">
                <Button 
                  onClick={() => setShowAISuggestions(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Suggestions IA
                </Button>
                <Button 
                  onClick={() => setIsAddingTask(true)}
                  className="bg-wedding-olive hover:bg-wedding-olive/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une tâche
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="tasks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {tasks
                  .sort((a, b) => a.position - b.position)
                  .map((task, index) => {
                    const assignedMember = task.assigned_to.length > 0 
                      ? teamMembers.find(m => m.id === task.assigned_to[0])
                      : null;
                    const endTime = calculateEndTime(task.start_time || '09:00', task.duration);
                    
                    return (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <Card 
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`transition-all ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-4">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mt-2 text-muted-foreground hover:text-foreground cursor-grab"
                                >
                                  <GripVertical className="h-4 w-4" />
                                </div>
                                
                                <div className="flex-grow">
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <h3 className="font-medium mb-1">
                                        {task.title}
                                        {task.is_ai_generated && (
                                          <Sparkles className="inline h-4 w-4 ml-2 text-purple-500" />
                                        )}
                                        {task.is_manual_time && (
                                          <Clock className="inline h-4 w-4 ml-2 text-blue-500" />
                                        )}
                                      </h3>
                                      {task.description && (
                                        <p className="text-sm text-muted-foreground mb-2">
                                          {task.description}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleEdit(task)}
                                      >
                                        <Edit2 className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleDelete(task.id)}
                                        className="text-red-600 hover:text-red-700"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <div className="flex items-center gap-1 text-sm">
                                      <Clock className="h-3 w-3" />
                                      <span>{formatTime(task.start_time)} - {endTime}</span>
                                      <span className="text-muted-foreground">
                                        ({task.duration}min)
                                      </span>
                                    </div>
                                    
                                    <Badge variant="outline">
                                      {task.category}
                                    </Badge>
                                    
                                    <Badge className={getPriorityColor(task.priority)}>
                                      {task.priority === 'high' ? 'Élevée' : 
                                       task.priority === 'medium' ? 'Moyenne' : 'Faible'}
                                    </Badge>
                                    
                                    <Badge className={getStatusColor(task.status)}>
                                      {task.status === 'completed' ? 'Terminé' :
                                       task.status === 'in_progress' ? 'En cours' : 'À faire'}
                                    </Badge>
                                    
                                    {assignedMember && (
                                      <div className="flex items-center gap-1 text-sm">
                                        <Users className="h-3 w-3" />
                                        <span>{assignedMember.name}</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant={task.status === 'todo' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(task, 'todo')}
                                      className="text-xs"
                                    >
                                      À faire
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={task.status === 'in_progress' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(task, 'in_progress')}
                                      className="text-xs"
                                    >
                                      En cours
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={task.status === 'completed' ? 'default' : 'outline'}
                                      onClick={() => handleStatusChange(task, 'completed')}
                                      className="text-xs"
                                    >
                                      Terminé
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default MonJourMPlanningContent;
