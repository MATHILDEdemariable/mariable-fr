
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, CheckCircle2, Circle, User, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMonJourM } from '@/contexts/MonJourMContext';

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

const MonJourMPlanning: React.FC = () => {
  const { 
    coordination, 
    tasks, 
    teamMembers, 
    isLoading, 
    isInitializing, 
    refreshData, 
    addTask, 
    updateTask, 
    deleteTask 
  } = useMonJourM();

  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<PlanningTask | null>(null);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
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

  const handleAddTask = async () => {
    if (!formData.title.trim()) return;

    const success = await addTask({
      title: formData.title,
      description: formData.description,
      start_time: formData.start_time,
      end_time: formData.end_time,
      duration: formData.duration,
      category: formData.category,
      priority: formData.priority,
      status: formData.status,
      assigned_to: formData.assigned_to
    });

    if (success) {
      resetForm();
      setShowAddTask(false);
    }
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    const success = await updateTask(editingTask);
    if (success) {
      setEditingTask(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const toggleTaskStatus = async (task: PlanningTask) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    await updateTask({ ...task, status: newStatus });
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

  if (isInitializing) {
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
        <Button onClick={handleRefresh} className="mt-4" variant="outline">
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
                  <Button onClick={handleAddTask}>
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

      {isLoading ? (
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
                              onClick={() => handleDeleteTask(task.id)}
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

export default MonJourMPlanning;
