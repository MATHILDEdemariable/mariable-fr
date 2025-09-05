import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlanningEvent } from '../wedding-day/types/planningTypes';
import { supabase } from '@/integrations/supabase/client';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';

interface ProjectTaskEditModalProps {
  event: PlanningEvent;
  onSave: (event: PlanningEvent) => void;
  onClose: () => void;
}

const PROJECT_CATEGORIES = [
  'Budget et finances',
  'Recherche prestataires',
  'Administratif',
  'Shopping et achats',
  'Communication',
  'Planification',
  'Tests et essayages',
  'Confirmations',
  'Autre'
];

const ProjectTaskEditModal: React.FC<ProjectTaskEditModalProps> = ({
  event,
  onSave,
  onClose
}) => {
  const { toast } = useToast();
  const { coordination } = useProjectCoordination();
  const [teamMembers, setTeamMembers] = useState<Array<{id: string, name: string, role: string}>>([]);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.notes || '',
    category: event.category,
    priority: 'medium',
    assignedTo: event.assignedTo || []
  });
  const [isLoading, setIsLoading] = useState(false);

  // Charger les membres de l'équipe
  React.useEffect(() => {
    if (coordination?.id) {
      loadTeamMembers();
    }
  }, [coordination?.id]);

  const loadTeamMembers = async () => {
    if (!coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('id, name, role')
        .eq('coordination_id', coordination.id);

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre est obligatoire",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mettre à jour dans la base de données
      const { error } = await supabase
        .from('coordination_planning')
        .update({
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          priority: formData.priority,
          assigned_to: formData.assignedTo
        })
        .eq('id', event.id);

      if (error) throw error;

      // Créer l'objet mis à jour
      const updatedEvent: PlanningEvent = {
        ...event,
        title: formData.title,
        notes: formData.description,
        category: formData.category,
        type: formData.category,
        
        assignedTo: formData.assignedTo
      };

      onSave(updatedEvent);
      
      toast({
        title: "Succès",
        description: "Tâche modifiée avec succès"
      });
    } catch (error) {
      console.error('❌ Error updating task:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la tâche",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Titre de la tâche *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Réserver le photographe"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Détails sur cette tâche..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {PROJECT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="priority">Priorité</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setFormData({ ...formData, priority: value })
              }
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

        {/* Assignation */}
        {teamMembers.length > 0 && (
          <div>
            <Label>Assigner à</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border rounded-lg p-2">
              {teamMembers.map((member) => (
                <label key={member.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(member.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          assignedTo: [...prev.assignedTo, member.id]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          assignedTo: prev.assignedTo.filter(id => id !== member.id)
                        }));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm">{member.name} ({member.role})</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !formData.title.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Modification...' : 'Modifier la tâche'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default ProjectTaskEditModal;