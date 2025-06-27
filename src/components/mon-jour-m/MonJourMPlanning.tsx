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
  
  // États locaux simples (comme dans l'équipe)
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // États des modales - SÉPARÉS comme dans l'équipe
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [isGeneratingTasks, setIsGeneratingTasks] = useState(false);
  
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

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
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
      await Promise.all([
        loadTasks(activeCoordination.id),
        loadTeamMembers(activeCoordination.id)
      ]);

    } catch (error) {
      console.error('Erreur chargement:', error);
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

      setTasks(normalizedTasks);
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

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  // Reset formulaire (uniquement pour l'ajout)
  const resetForm = () => {
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

  // LOGIQUE SIMPLIFIÉE - Ajout
  const handleAddTask = async () => {
    if (!formData.title?.trim() || !coordination?.id) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

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

    if (error) {
      console.error('Erreur ajout tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Tâche ajoutée",
      description: "La nouvelle tâche a été ajoutée au planning"
    });

    resetForm();
    setShowAddTask(false);
    await loadTasks(coordination.id);
  };

  // LOGIQUE SIMPLIFIÉE - Modification
  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title?.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre de la tâche est obligatoire",
        variant: "destructive"
      });
      return;
    }

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

    if (error) {
      console.error('Erreur modification tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Tâche modifiée",
      description: "Les informations ont été mises à jour"
    });

    setEditingTask(null);
    if (coordination?.id) {
      await loadTasks(coordination.id);
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    const { error } = await supabase
      .from('coordination_planning')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Erreur suppression tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Tâche supprimée",
      description: "La tâche a été retirée du planning"
    });

    if (coordination?.id) {
      await loadTasks(coordination.id);
    }
  };

  // Drag & drop avec recalcul automatique
  const handleDragEnd = async (result: any) => {
    if (!result.destination || !coordination?.id) return;

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
      
      toast({
        title: "Planning mis à jour",
        description: "Les horaires ont été recalculés automatiquement"
      });
    } catch (error) {
      console.error('Erreur sauvegarde positions:', error);
      await loadTasks(coordination.id);
    }
  };

  const generateAITasks = async () => {
    if (!coordination?.id) return;
    
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

      const prompt = `Génère 10 tâches de planning pour un mariage, avec des heures réalistes et des durées appropriées. Format JSON avec: title, description, start_time (format HH:MM), duration (en minutes), category, priority (low/medium/high), assigned_to (array vide).`;

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
        await supabase
          .from('coordination_planning')
          .insert({
            coordination_id: coordination.id,
            title: aiTask.title,
            description: aiTask.description || '',
            start_time: aiTask.start_time || '09:00',
            duration: aiTask.duration || 30,
            category: aiTask.category || 'Général',
            priority: aiTask.priority || 'medium',
            assigned_to: null,
            position: tasks.length + i,
            is_ai_generated: true
          });
      }

      toast({
        title: "Succès",
        description: `${aiTasks.length} tâches générées par l'IA ont été ajoutées`,
      });
      
      setShowAISuggestions(false);
      await loadTasks(coordination.id);
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

  const formatTime = (time?: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const calculateEndTime = (startTime: string, duration: number) => {
    return addMinutesToTime(startTime, duration);
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
          {/* BOUTON IA SUGGESTIONS - sans DialogTrigger */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowAISuggestions(true)}
          >
            <Sparkles className="h-4 w-4" />
            Suggestions IA
          </Button>
          
          {/* BOUTON AJOUTER TÂCHE - sans DialogTrigger */}
          <Button 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            onClick={() => setShowAddTask(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      {/* MODALE IA SUGGESTIONS */}
      <Dialog open={showAISuggestions} onOpenChange={setShowAISuggestions}>
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
          
      {/* MODALE D'AJOUT - utilise formData, sans DialogTrigger */}
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
                  onClick={() => setShowAddTask(true)}
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

      {/* MODALE D'ÉDITION - utilise directement editingTask */}
      {editingTask && (
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
