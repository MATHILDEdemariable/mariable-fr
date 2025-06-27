import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, Plus, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { PlanningTask, WeddingCoordination, PREDEFINED_ROLES, TASK_CATEGORIES, normalizeTimeString, addMinutesToTime } from '@/types/monjourm-mvp';

interface SimpleTaskManagerProps {
  coordination: WeddingCoordination;
}

const SimpleTaskManager: React.FC<SimpleTaskManagerProps> = ({ coordination }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '09:00',
    duration: 30,
    category: 'Autre',
    priority: 'medium' as "low" | "medium" | "high",
    assigned_role: ''
  });

  // Charger les tâches
  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('coordination_planning')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('position');

      if (error) throw error;

      const normalizedTasks: PlanningTask[] = (data || []).map((task, index) => {
        console.log('🔍 Processing task:', task.title, 'assigned_to:', task.assigned_to);
        
        // Gérer l'assigned_role - extraire le premier rôle s'il y en a
        let assignedRole: string | undefined;
        if (task.assigned_to) {
          if (Array.isArray(task.assigned_to) && task.assigned_to.length > 0) {
            assignedRole = String(task.assigned_to[0]);
          } else if (typeof task.assigned_to === 'string') {
            assignedRole = task.assigned_to;
          }
        }

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          start_time: normalizeTimeString(task.start_time || "09:00"),
          duration: task.duration || 30,
          category: task.category || 'Autre',
          priority: (task.priority as "low" | "medium" | "high") || 'medium',
          assigned_role: assignedRole,
          position: typeof task.position === 'number' ? task.position : index,
          is_ai_generated: task.is_ai_generated || false
        };
      });

      console.log('✅ Normalized tasks:', normalizedTasks);
      setTasks(normalizedTasks);
    } catch (error) {
      console.error('❌ Erreur chargement tâches:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les tâches",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coordination?.id) {
      loadTasks();
    }
  }, [coordination?.id]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      start_time: '09:00',
      duration: 30,
      category: 'Autre',
      priority: 'medium',
      assigned_role: ''
    });
  };

  // Ajouter une tâche
  const handleAddTask = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🚀 Adding task with role:', formData.assigned_role);
      
      const { error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordination.id,
          title: formData.title,
          description: formData.description || null,
          start_time: formData.start_time,
          duration: formData.duration,
          category: formData.category,
          priority: formData.priority,
          assigned_to: formData.assigned_role ? [formData.assigned_role] : null,
          position: tasks.length
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche ajoutée avec succès"
      });

      resetForm();
      setShowAddModal(false);
      await loadTasks();
    } catch (error) {
      console.error('❌ Erreur ajout tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  // Modifier une tâche
  const handleUpdateTask = async () => {
    if (!editingTask || !editingTask.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('🔄 Updating task with role:', editingTask.assigned_role);
      
      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: editingTask.title,
          description: editingTask.description || null,
          start_time: editingTask.start_time,
          duration: editingTask.duration,
          category: editingTask.category,
          priority: editingTask.priority,
          assigned_to: editingTask.assigned_role ? [editingTask.assigned_role] : null
        })
        .eq('id', editingTask.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche modifiée avec succès"
      });

      setEditingTask(null);
      await loadTasks();
    } catch (error) {
      console.error('❌ Erreur modification tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
    }
  };

  // Supprimer une tâche
  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_planning')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Tâche supprimée avec succès"
      });

      await loadTasks();
    } catch (error) {
      console.error('Erreur suppression tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
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

  const getPriorityLabel = (priority: "low" | "medium" | "high") => {
    switch (priority) {
      case 'high': return 'Élevée';
      case 'medium': return 'Moyenne';
      case 'low': return 'Faible';
      default: return 'Moyenne';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Planning du Jour J</h3>
          <p className="text-sm text-muted-foreground">
            Gérez vos tâches et leurs horaires
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une tâche
        </Button>
      </div>

      {/* Liste des tâches */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune tâche planifiée</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter votre première tâche
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une tâche
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks
            .sort((a, b) => a.position - b.position)
            .map((task) => {
              const endTime = addMinutesToTime(task.start_time, task.duration);
              
              return (
                <Card key={task.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-grow">
                        <h4 className="font-medium mb-1">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
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
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>{task.start_time} - {endTime}</span>
                        <span className="text-muted-foreground">
                          ({task.duration}min)
                        </span>
                      </div>
                      
                      <Badge variant="outline">{task.category}</Badge>
                      
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      
                      {task.assigned_role && (
                        <Badge variant="secondary">
                          {task.assigned_role}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouvelle tâche</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Arrivée des invités"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Détails de la tâche..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="duration">Durée (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="480"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })}
                />
              </div>
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
                  {TASK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div>
              <Label htmlFor="assigned_role">Assigné à (rôle)</Label>
              <Select
                value={formData.assigned_role}
                onValueChange={(value) => setFormData({ ...formData, assigned_role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Non assigné</SelectItem>
                  {PREDEFINED_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddTask} disabled={!formData.title.trim()}>
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowAddModal(false);
              }}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier la tâche</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title">Titre *</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ''}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-start_time">Heure de début</Label>
                  <Input
                    id="edit-start_time"
                    type="time"
                    value={editingTask.start_time}
                    onChange={(e) => setEditingTask({ ...editingTask, start_time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-duration">Durée (min)</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="5"
                    max="480"
                    value={editingTask.duration}
                    onChange={(e) => setEditingTask({ ...editingTask, duration: parseInt(e.target.value) || 30 })}
                  />
                </div>
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
                    {TASK_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

              <div>
                <Label htmlFor="edit-assigned_role">Assigné à (rôle)</Label>
                <Select
                  value={editingTask.assigned_role || ''}
                  onValueChange={(value) => setEditingTask({ ...editingTask, assigned_role: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Non assigné</SelectItem>
                    {PREDEFINED_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateTask} disabled={!editingTask.title.trim()}>
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

export default SimpleTaskManager;
