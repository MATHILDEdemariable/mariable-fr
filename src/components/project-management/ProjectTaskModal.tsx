import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlanningEvent } from '../wedding-day/types/planningTypes';

interface ProjectTaskModalProps {
  coordinationId: string;
  onEventAdded: (event: PlanningEvent) => void;
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

const ProjectTaskModal: React.FC<ProjectTaskModalProps> = ({
  coordinationId,
  onEventAdded,
  onClose
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Planification',
    priority: 'medium' as 'low' | 'medium' | 'high',
    estimatedDuration: 60
  });
  const [isLoading, setIsLoading] = useState(false);

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
      // Créer l'événement dans la base de données
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordinationId,
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          priority: formData.priority,
          duration: formData.estimatedDuration,
          start_time: '09:00', // Heure par défaut pour les tâches de projet
          position: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Créer l'objet PlanningEvent pour l'interface
      const baseDate = new Date();
      baseDate.setHours(9, 0, 0, 0);
      
      const newEvent: PlanningEvent = {
        id: data.id,
        title: formData.title,
        notes: formData.description,
        startTime: baseDate,
        endTime: new Date(baseDate.getTime() + formData.estimatedDuration * 60000),
        duration: formData.estimatedDuration,
        category: formData.category,
        type: formData.category,
        isHighlight: formData.priority === 'high',
        assignedTo: []
      };

      onEventAdded(newEvent);
      
      toast({
        title: "Succès",
        description: "Tâche ajoutée avec succès"
      });
      
      onClose();
    } catch (error) {
      console.error('❌ Error adding project task:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la tâche",
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

        <div>
          <Label htmlFor="duration">Durée estimée (minutes)</Label>
          <Input
            id="duration"
            type="number"
            min="15"
            max="480"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ 
              ...formData, 
              estimatedDuration: parseInt(e.target.value) || 60 
            })}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={isLoading || !formData.title.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Ajout...' : 'Ajouter la tâche'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
      </div>
    </form>
  );
};

export default ProjectTaskModal;