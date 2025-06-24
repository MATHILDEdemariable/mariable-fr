
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, User, Sparkles, GripVertical, Trash2, Calendar } from 'lucide-react';
import { useCoordination } from '@/hooks/useCoordination';
import { useToast } from '@/hooks/use-toast';
import type { CoordinationPlanning } from '@/types/coordination';

const MonJourMPlanning = () => {
  const { coordination, planningItems, teamMembers, addPlanningItem, updatePlanningItem, deletePlanningItem } = useCoordination();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'ceremonie',
    priority: 'medium' as const,
    duration: 30
  });
  const { toast } = useToast();

  const categories = [
    { value: 'ceremonie', label: 'Cérémonie' },
    { value: 'reception', label: 'Réception' },
    { value: 'logistique', label: 'Logistique' },
    { value: 'photo', label: 'Photo/Vidéo' },
    { value: 'autre', label: 'Autre' }
  ];

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const handleAddTask = async () => {
    if (!coordination || !newTask.title.trim()) return;

    try {
      await addPlanningItem({
        coordination_id: coordination.id,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        priority: newTask.priority,
        duration: newTask.duration,
        status: 'todo',
        is_ai_generated: false,
        position: planningItems.length,
        start_time: null,
        end_time: null,
        assigned_to: null
      });

      setNewTask({
        title: '',
        description: '',
        category: 'ceremonie',
        priority: 'medium',
        duration: 30
      });
      setShowAddForm(false);

      toast({
        title: "Tâche ajoutée",
        description: "La tâche a été ajoutée au planning"
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la tâche:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
        variant: "destructive"
      });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: CoordinationPlanning['status']) => {
    try {
      await updatePlanningItem(taskId, { status: newStatus });
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la tâche a été modifié"
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;

    try {
      await deletePlanningItem(taskId);
      toast({
        title: "Tâche supprimée",
        description: "La tâche a été supprimée du planning"
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la tâche",
        variant: "destructive"
      });
    }
  };

  const generateAITasks = async () => {
    if (!coordination) return;

    // Simulation de génération IA - à remplacer par un vrai appel API
    const aiTasks = [
      { title: 'Accueil des invités', category: 'logistique', duration: 30, priority: 'high' as const },
      { title: 'Installation photographe', category: 'photo', duration: 15, priority: 'medium' as const },
      { title: 'Préparation de la cérémonie', category: 'ceremonie', duration: 45, priority: 'high' as const },
      { title: 'Vérification du matériel sonore', category: 'logistique', duration: 20, priority: 'medium' as const }
    ];

    try {
      for (const task of aiTasks) {
        await addPlanningItem({
          coordination_id: coordination.id,
          title: task.title,
          description: `Tâche générée automatiquement par l'IA`,
          category: task.category,
          priority: task.priority,
          duration: task.duration,
          status: 'todo',
          is_ai_generated: true,
          position: planningItems.length,
          start_time: null,
          end_time: null,
          assigned_to: null
        });
      }

      toast({
        title: "Tâches générées",
        description: `${aiTasks.length} tâches ont été ajoutées par l'IA`
      });
    } catch (error) {
      console.error('Erreur lors de la génération IA:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer les tâches IA",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Planning du Jour-M</h2>
          <p className="text-sm text-gray-600">
            {planningItems.length} tâche{planningItems.length > 1 ? 's' : ''} planifiée{planningItems.length > 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateAITasks} variant="outline" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Générer avec IA
          </Button>
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter une tâche
          </Button>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle tâche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Titre de la tâche"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            />
            <Textarea
              placeholder="Description (optionnelle)"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({...newTask, priority: value})}>
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddTask}>
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des tâches */}
      <div className="space-y-3">
        {planningItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <GripVertical className="h-4 w-4 text-gray-400 mt-1 cursor-grab" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.is_ai_generated && (
                        <Badge variant="secondary" className="text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          IA
                        </Badge>
                      )}
                      <Badge className={priorityColors[item.priority]}>
                        {item.priority === 'high' ? 'Élevée' : item.priority === 'medium' ? 'Moyenne' : 'Faible'}
                      </Badge>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.duration}min
                      </span>
                      <span>{categories.find(c => c.value === item.category)?.label}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={item.status} onValueChange={(value: any) => handleStatusChange(item.id, value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">À faire</SelectItem>
                      <SelectItem value="in_progress">En cours</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {planningItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune tâche planifiée pour le moment</p>
            <p className="text-sm">Ajoutez votre première tâche ou utilisez l'IA pour générer un planning</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonJourMPlanning;
