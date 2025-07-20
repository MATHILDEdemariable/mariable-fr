
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Edit2, Trash2, Users, Sparkles, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import AISuggestionsModal from './AISuggestionsModal';
import PremiumBadge from '@/components/premium/PremiumBadge';
import PremiumGateClickable from '@/components/premium/PremiumGateClickable';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  WeddingCoordination, 
  PlanningTask, 
  TeamMember, 
  TaskFormData,
  categories,
  normalizeTimeString,
  addMinutesToTime,
  recalculateTimeline
} from '@/types/monjourm';

const MonJourMPlanningContent: React.FC = () => {
  const { toast } = useToast();
  const { isPremium } = useUserProfile();
  
  // États locaux
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États des modales - SÉPARÉS
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  
  // Formulaire UNIQUEMENT pour l'ajout
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    start_time: '09:00',
    duration: 30,
    category: 'Général',
    priority: 'medium',
    assigned_to: [],
    is_manual_time: false
  });

  // DEBUG: Logging pour tracer les erreurs
  useEffect(() => {
    console.log('🚀 MonJourMPlanning - Component mounted');
    console.log('🔍 Initial state:', { 
      coordination, 
      tasks: tasks.length, 
      teamMembers: teamMembers.length,
      isLoading 
    });
  }, []);

  // Chargement initial
  useEffect(() => {
    console.log('🔄 Starting data load...');
    loadData();
  }, []);

  const loadData = async () => {
    try {
      console.log('📊 loadData - Starting...');
      setIsLoading(true);
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log('👤 User data:', { user: user?.id, error: userError });
      
      if (userError) {
        console.error('❌ Auth error:', userError);
        toast({
          title: "Erreur d'authentification",
          description: userError.message,
          variant: "destructive"
        });
        return;
      }

      if (!user) {
        console.warn('⚠️ No user found');
        toast({
          title: "Non connecté",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer ou créer la coordination
      console.log('🔍 Fetching coordination...');
      let { data: coordinations, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      console.log('📋 Coordination query result:', { coordinations, error: coordError });

      if (coordError) {
        console.error('❌ Coordination error:', coordError);
        throw coordError;
      }

      let activeCoordination: WeddingCoordination;

      if (coordinations && coordinations.length > 0) {
        activeCoordination = coordinations[0];
        console.log('✅ Found existing coordination:', activeCoordination.id);
      } else {
        console.log('🆕 Creating new coordination...');
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        console.log('🆕 New coordination result:', { newCoordination, error: createError });

        if (createError) {
          console.error('❌ Create coordination error:', createError);
          throw createError;
        }
        activeCoordination = newCoordination;
      }

      setCoordination(activeCoordination);
      console.log('✅ Coordination set, loading tasks and team...');
      
      await Promise.all([
        loadTasks(activeCoordination.id),
        loadTeamMembers(activeCoordination.id)
      ]);

      console.log('✅ Data loading completed successfully');

    } catch (error) {
      console.error('💥 Error in loadData:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données: " + (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 loadData - Finished, isLoading set to false');
    }
  };

  const loadTasks = async (coordId: string) => {
    try {
      console.log('📝 Loading tasks for coordination:', coordId);
      
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordId)
        .order('position');

      console.log('📝 Tasks query result:', { data, error, count: data?.length });

      if (error) {
        console.error('❌ Tasks error:', error);
        throw error;
      }

      const normalizedTasks: PlanningTask[] = (data || []).map((task, index) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        start_time: normalizeTimeString(task.start_time || "09:00"),
        end_time: task.end_time,
        duration: task.duration || 15,
        category: task.category || 'Général',
        priority: (task.priority as "low" | "medium" | "high") || 'medium',
        assigned_to: Array.isArray(task.assigned_to) 
          ? (task.assigned_to as any[]).map(item => String(item)).filter(item => item && typeof item === 'string')
          : [],
        position: typeof task.position === 'number' ? task.position : index,
        is_ai_generated: task.is_ai_generated || false,
        is_manual_time: false
      }));

      console.log('✅ Tasks normalized:', normalizedTasks.length);
      setTasks(normalizedTasks);
    } catch (error) {
      console.error('💥 Error loading tasks:', error);
    }
  };

  const loadTeamMembers = async (coordId: string) => {
    try {
      console.log('👥 Loading team members for coordination:', coordId);
      
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at');

      console.log('👥 Team query result:', { data, error, count: data?.length });

      if (error) {
        console.error('❌ Team error:', error);
        throw error;
      }

      const mappedData: TeamMember[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        type: (item.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor',
        prestataire_id: item.prestataire_id,
        notes: item.notes
      }));

      console.log('✅ Team members normalized:', mappedData.length);
      setTeamMembers(mappedData);
    } catch (error) {
      console.error('💥 Error loading team members:', error);
    }
  };

  // Reset formulaire
  const resetForm = () => {
    console.log('🔄 Resetting form');
    setFormData({
      title: '',
      description: '',
      start_time: '09:00',
      duration: 30,
      category: 'Général',
      priority: 'medium',
      assigned_to: [],
      is_manual_time: false
    });
  };

  // Ajout de tâche
  const handleAddTask = async () => {
    console.log('➕ Adding task:', formData);
    
    if (!formData.title?.trim() || !coordination?.id) {
      console.warn('⚠️ Missing title or coordination');
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: formData.title,
          description: formData.description || null,
          start_time: formData.start_time || null,
          duration: formData.duration,
          category: formData.category,
          priority: formData.priority,
          assigned_to: formData.assigned_to.length > 0 ? formData.assigned_to : null,
          position: tasks.length,
          is_ai_generated: false
        })
        .select()
        .single();

      console.log('➕ Add task result:', { data, error });

      if (error) {
        console.error('❌ Add task error:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la tâche: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Task added successfully');
      toast({
        title: "Tâche ajoutée",
        description: "La nouvelle tâche a été ajoutée au planning"
      });

      resetForm();
      setShowAddTask(false);
      await loadTasks(coordination.id);
    } catch (error) {
      console.error('💥 Error in handleAddTask:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout",
        variant: "destructive"
      });
    }
  };

  // Modification de tâche
  const handleUpdateTask = async () => {
    console.log('✏️ Updating task:', editingTask);
    
    if (!editingTask || !editingTask.title?.trim()) {
      console.warn('⚠️ Missing task or title for update');
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: editingTask.title,
          description: editingTask.description || null,
          start_time: editingTask.start_time || null,
          duration: editingTask.duration,
          category: editingTask.category,
          priority: editingTask.priority,
          assigned_to: editingTask.assigned_to.length > 0 ? editingTask.assigned_to : null
        })
        .eq('id', editingTask.id);

      console.log('✏️ Update task result:', { error });

      if (error) {
        console.error('❌ Update task error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de modifier la tâche: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Task updated successfully');
      toast({
        title: "Tâche modifiée",
        description: "Les informations ont été mises à jour"
      });

      setEditingTask(null);
      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('💥 Error in handleUpdateTask:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la modification",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (taskId: string) => {
    console.log('🗑️ Deleting task:', taskId);
    
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      console.log('🗑️ Delete task result:', { error });

      if (error) {
        console.error('❌ Delete task error:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la tâche: " + error.message,
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Task deleted successfully');
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été retirée du planning"
      });

      if (coordination?.id) {
        await loadTasks(coordination.id);
      }
    } catch (error) {
      console.error('💥 Error in handleDelete:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    }
  };

  // Fonction pour ajouter les suggestions sélectionnées
  const handleSelectSuggestion = async (suggestion: { title: string; description: string; category: string; priority: string; duration: number }) => {
    console.log('🤖 Adding AI suggestion:', suggestion);
    
    if (!coordination?.id) {
      console.warn('⚠️ No coordination for AI suggestion');
      return Promise.resolve();
    }

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: suggestion.title,
          description: suggestion.description,
          start_time: '09:00', // Heure par défaut
          duration: suggestion.duration,
          category: suggestion.category,
          priority: suggestion.priority,
          assigned_to: null,
          position: tasks.length,
          is_ai_generated: true
        });

      console.log('🤖 AI suggestion result:', { error });

      if (error) {
        console.error('❌ AI suggestion error:', error);
        throw error;
      }

      console.log('✅ AI suggestion added successfully');
      // Recharger les tâches
      await loadTasks(coordination.id);
    } catch (error) {
      console.error('💥 Error in handleSelectSuggestion:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la suggestion: " + (error as Error).message,
        variant: "destructive"
      });
    }
  };

  // Drag & drop avec recalcul automatique
  const handleDragEnd = async (result: any) => {
    console.log('🔄 Drag end:', result);
    
    if (!result.destination || !coordination?.id) {
      console.log('❌ No destination or coordination for drag');
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Mettre à jour les positions
    const reorderedTasks = items.map((task, index) => ({
      ...task,
      position: index
    }));

    // Recalculer automatiquement la timeline
    const recalculatedTasks = recalculateTimeline(reorderedTasks);

    setTasks(recalculatedTasks);

    // Sauvegarder en base avec les nouvelles positions ET les nouvelles heures
    try {
      for (const task of recalculatedTasks) {
        await supabase
          .from('coordination_planning')
          .update({ 
            position: task.position,
            start_time: task.start_time,
            end_time: task.end_time
          })
          .eq('id', task.id);
      }
      
      console.log('✅ Drag reorder saved successfully');
      toast({
        title: "Planning mis à jour",
        description: "Les horaires ont été recalculés automatiquement"
      });
    } catch (error) {
      console.error('💥 Error saving drag reorder:', error);
      await loadTasks(coordination.id);
    }
  };

  // Handlers pour les modales avec debugging
  const handleOpenAddTask = () => {
    console.log('➕ Opening add task modal');
    setShowAddTask(true);
  };

  const handleCloseAddTask = () => {
    console.log('❌ Closing add task modal');
    resetForm();
    setShowAddTask(false);
  };

  const handleOpenAISuggestions = () => {
    console.log('🤖 Opening AI suggestions modal');
    setShowAISuggestions(true);
  };

  const handleCloseAISuggestions = () => {
    console.log('❌ Closing AI suggestions modal');
    setShowAISuggestions(false);
  };

  const getPriorityColor = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    return addMinutesToTime(startTime, duration);
  };

  if (isLoading) {
    console.log('🔄 Rendering loading state');
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive mx-auto mb-4"></div>
          <p>Chargement du planning...</p>
        </div>
      </div>
    );
  }

  console.log('🎨 Rendering main UI');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-serif mb-2">Mon Planning</h2>
          <p className="text-muted-foreground">
            Organisez votre journée parfaite avec un planning détaillé
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <PremiumBadge />
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleOpenAISuggestions}
          >
            <Sparkles className="h-4 w-4" />
            Suggestions IA
          </Button>
          
          <PremiumGateClickable 
            feature="l'ajout d'étapes personnalisées" 
            description="Créez des étapes sur mesure pour votre planning de mariage avec notre version premium"
          >
            <Button 
              className="bg-wedding-olive hover:bg-wedding-olive/90"
              onClick={handleOpenAddTask}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une tâche
            </Button>
          </PremiumGateClickable>
        </div>
      </div>

      {/* MODAL AI SUGGESTIONS */}
      <AISuggestionsModal
        isOpen={showAISuggestions}
        onClose={handleCloseAISuggestions}
        onSelectSuggestion={handleSelectSuggestion}
        coordination={coordination}
      />

      {/* MODALE D'AJOUT - seulement si premium */}
      {isPremium && (
        <Dialog open={showAddTask} onOpenChange={setShowAddTask}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nouvelle tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Titre de la tâche *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Ex: Arrivée des invités"
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

              <div>
                <Label htmlFor="assigned_to">Assigné à</Label>
                <Select
                  value={formData.assigned_to && formData.assigned_to.length > 0 ? formData.assigned_to[0] : ""}
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

              <div className="flex gap-2">
                <Button onClick={handleAddTask} disabled={!formData.title.trim()}>
                  Ajouter la tâche
                </Button>
                <Button variant="outline" onClick={handleCloseAddTask}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
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
                  onClick={handleOpenAISuggestions}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  Suggestions IA
                </Button>
                <PremiumGateClickable 
                  feature="l'ajout d'étapes personnalisées" 
                  description="Créez des étapes sur mesure pour votre planning de mariage avec notre version premium"
                >
                  <Button 
                    onClick={handleOpenAddTask}
                    className="bg-wedding-olive hover:bg-wedding-olive/90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une tâche
                  </Button>
                </PremiumGateClickable>
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
                                        onClick={() => setEditingTask(task)}
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
                                    
                                    {assignedMember && (
                                      <div className="flex items-center gap-1 text-sm">
                                        <Users className="h-3 w-3" />
                                        <span>{assignedMember.name}</span>
                                      </div>
                                    )}
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

      {/* MODALE D'ÉDITION - seulement si premium */}
      {isPremium && editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier la tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">Titre de la tâche *</Label>
                  <Input
                    id="edit-title"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    placeholder="Ex: Arrivée des invités"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-category">Catégorie</Label>
                  <Select 
                    value={editingTask.category} 
                    onValueChange={(value) => setEditingTask({ ...editingTask, category: value })}
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
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  placeholder="Détails de la tâche..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-start_time">Heure de début</Label>
                  <Input
                    id="edit-start_time"
                    type="time"
                    value={editingTask.start_time || '09:00'}
                    onChange={(e) => setEditingTask({ ...editingTask, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration">Durée (minutes)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="5"
                    max="480"
                    value={editingTask.duration}
                    onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) || 30 })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-priority">Priorité</Label>
                  <Select 
                    value={editingTask.priority} 
                    onValueChange={(value: "low" | "medium" | "high") => setEditingTask({ ...editingTask, priority: value })}
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

              <div>
                <Label htmlFor="edit-assigned_to">Assigné à</Label>
                <Select
                  value={editingTask.assigned_to && editingTask.assigned_to.length > 0 ? editingTask.assigned_to[0] : ""}
                  onValueChange={(value) => setEditingTask({ ...editingTask, assigned_to: value ? [value] : [] })}
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

              <div className="flex gap-2">
                <Button onClick={handleUpdateTask}>
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

export default MonJourMPlanningContent;
