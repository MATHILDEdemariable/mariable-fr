
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlanningEvent } from '../wedding-day/types/planningTypes';

interface AddManualEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinationId: string;
  onEventAdded: (event: PlanningEvent) => void;
  referenceTime: Date;
}

const CATEGORIES = [
  { value: 'préparatifs_final', label: 'Préparatifs' },
  { value: 'logistique', label: 'Logistique' },
  { value: 'cérémonie', label: 'Cérémonie' },
  { value: 'photos', label: 'Photos' },
  { value: 'cocktail', label: 'Cocktail' },
  { value: 'repas', label: 'Repas' },
  { value: 'soiree', label: 'Soirée' },
  { value: 'personnalisé', label: 'Personnalisé' }
];

const AddManualEventModal: React.FC<AddManualEventModalProps> = ({
  isOpen,
  onClose,
  coordinationId,
  onEventAdded,
  referenceTime
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    startTime: referenceTime.toTimeString().slice(0, 5),
    category: 'personnalisé',
    isHighlight: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Erreur de validation",
        description: "Le titre est obligatoire.",
        variant: "destructive"
      });
      return;
    }

    if (formData.duration < 5) {
      toast({
        title: "Erreur de validation",
        description: "La durée minimum est de 5 minutes.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Créer la date de début basée sur l'heure saisie
      const [hours, minutes] = formData.startTime.split(':').map(Number);
      const startDateTime = new Date(referenceTime);
      startDateTime.setHours(hours, minutes, 0, 0);

      // Sauvegarder en base
      const { data, error } = await supabase
        .from('coordination_planning')
        .insert({
          coordination_id: coordinationId,
          title: formData.title.trim(),
          description: formData.description.trim() || null,
          start_time: formData.startTime,
          duration: formData.duration,
          category: formData.category,
          priority: formData.isHighlight ? 'high' : 'medium',
          position: 999, // Position temporaire
          assigned_to: []
        })
        .select()
        .single();

      if (error) throw error;

      // Créer l'événement pour l'état local
      const newEvent: PlanningEvent = {
        id: data.id,
        title: formData.title.trim(),
        notes: formData.description.trim() || undefined,
        startTime: startDateTime,
        endTime: new Date(startDateTime.getTime() + formData.duration * 60000),
        duration: formData.duration,
        category: formData.category,
        type: formData.category,
        isHighlight: formData.isHighlight,
        assignedTo: []
      };

      onEventAdded(newEvent);
      
      toast({
        title: "Étape ajoutée",
        description: `"${formData.title}" a été ajoutée au planning.`
      });

      // Reset et fermeture
      setFormData({
        title: '',
        description: '',
        duration: 30,
        startTime: referenceTime.toTimeString().slice(0, 5),
        category: 'personnalisé',
        isHighlight: false
      });
      onClose();
    } catch (error) {
      console.error('❌ Error adding manual event:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'étape.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter une étape manuelle</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Nom de l'étape"
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description optionnelle"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Heure de début et Durée */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Heure de début</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (min) *</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                min="5"
                max="480"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading || !formData.title.trim()}>
              {isLoading ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManualEventModal;
