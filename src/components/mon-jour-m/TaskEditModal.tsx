
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

interface PlanningTask {
  id: string;
  title: string;
  description?: string;
  start_time?: string;
  end_time?: string;
  duration: number;
  category: string;
  position: number;
  assigned_to?: string[];
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  is_ai_generated: boolean;
}

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlanningTask | null;
  teamMembers: TeamMember[];
  onSave: (taskData: Partial<PlanningTask>) => Promise<void>;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  onClose,
  task,
  teamMembers,
  onSave
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high',
    start_time: '',
    assigned_to: [] as string[]
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (task) {
      // Fix timezone issue by properly extracting time from ISO string
      let startTimeValue = '';
      if (task.start_time) {
        try {
          const date = new Date(task.start_time);
          // Extract time in HH:MM format without timezone conversion
          startTimeValue = task.start_time.substring(11, 16); // Extract HH:MM from ISO string
        } catch (error) {
          console.error('Error parsing start_time:', error);
        }
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        duration: task.duration || 30,
        category: task.category || 'general',
        priority: task.priority || 'medium',
        start_time: startTimeValue,
        assigned_to: Array.isArray(task.assigned_to) ? task.assigned_to : (task.assigned_to ? [task.assigned_to] : [])
      });
    } else {
      setFormData({
        title: '',
        description: '',
        duration: 30,
        category: 'general',
        priority: 'medium',
        start_time: '',
        assigned_to: []
      });
    }
  }, [task]);

  // Calculer automatiquement l'heure de fin
  const calculateEndTime = (startTime: string, durationMinutes: number): string => {
    if (!startTime) return '';
    
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(hours, minutes, 0, 0);
      
      const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
      return endDate.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  const displayedEndTime = calculateEndTime(formData.start_time, formData.duration);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);
    try {
      const taskData: Partial<PlanningTask> = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        category: formData.category,
        priority: formData.priority,
        assigned_to: formData.assigned_to,
      };

      // Only add start_time if provided
      if (formData.start_time) {
        const today = new Date().toISOString().split('T')[0];
        taskData.start_time = `${today}T${formData.start_time}:00`;
      }

      await onSave(taskData);
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addAssignee = (memberId: string) => {
    if (!formData.assigned_to.includes(memberId)) {
      setFormData(prev => ({
        ...prev,
        assigned_to: [...prev.assigned_to, memberId]
      }));
    }
  };

  const removeAssignee = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      assigned_to: prev.assigned_to.filter(id => id !== memberId)
    }));
  };

  const getAssigneeName = (memberId: string) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? `${member.name} (${member.role})` : 'Personne inconnue';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Modifier la tâche' : 'Nouvelle tâche'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de la tâche"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la tâche"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="start_time">Heure de début</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              />
              {displayedEndTime && (
                <p className="text-sm text-gray-600 mt-1">
                  Heure de fin calculée : {displayedEndTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Catégorie</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Général</SelectItem>
                  <SelectItem value="preparation">Préparation</SelectItem>
                  <SelectItem value="ceremonie">Cérémonie</SelectItem>
                  <SelectItem value="photos">Photos</SelectItem>
                  <SelectItem value="reception">Réception</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priorité</Label>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setFormData(prev => ({ ...prev, priority: value }))}>
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
            <Label>Assignations</Label>
            <div className="space-y-2">
              <Select onValueChange={addAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Ajouter une personne" />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter(member => !formData.assigned_to.includes(member.id))
                    .map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name} ({member.role})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {formData.assigned_to.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.assigned_to.map((memberId) => (
                    <Badge key={memberId} variant="secondary" className="flex items-center gap-1">
                      {getAssigneeName(memberId)}
                      <button
                        type="button"
                        onClick={() => removeAssignee(memberId)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSaving || !formData.title.trim()}>
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditModal;
