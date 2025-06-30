
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Info } from 'lucide-react';

interface TimeReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinationId: string;
  currentReferenceTime: Date;
  onTimeReferenceUpdated: (newTime: Date) => void;
}

const TimeReferenceModal: React.FC<TimeReferenceModalProps> = ({
  isOpen,
  onClose,
  coordinationId,
  currentReferenceTime,
  onTimeReferenceUpdated
}) => {
  const [referenceTime, setReferenceTime] = useState(
    currentReferenceTime.toTimeString().slice(0, 5)
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setReferenceTime(currentReferenceTime.toTimeString().slice(0, 5));
  }, [currentReferenceTime]);

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Sauvegarder la configuration dans coordination_parameters
      const { error } = await supabase
        .from('coordination_parameters')
        .upsert({
          coordination_id: coordinationId,
          name: 'reference_time',
          parameters: { reference_time: referenceTime }
        });

      if (error) throw error;

      // Créer la nouvelle date de référence
      const [hours, minutes] = referenceTime.split(':').map(Number);
      const newReferenceTime = new Date();
      newReferenceTime.setHours(hours, minutes, 0, 0);

      onTimeReferenceUpdated(newReferenceTime);
      
      toast({
        title: "Heure de référence mise à jour",
        description: `Nouvelle heure de référence : ${referenceTime}`
      });

      onClose();
    } catch (error) {
      console.error('❌ Error saving reference time:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'heure de référence.",
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
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Heure de référence
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">À quoi sert l'heure de référence ?</p>
              <p>Cette heure sert de base pour calculer automatiquement tous les créneaux de votre planning. Par exemple, si vous définissez 15h00 comme heure de cérémonie, les préparatifs seront programmés avant, et le cocktail après.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="referenceTime">Heure de référence (ex: heure de cérémonie)</Label>
            <Input
              id="referenceTime"
              type="time"
              value={referenceTime}
              onChange={(e) => setReferenceTime(e.target.value)}
              className="text-lg"
            />
            <p className="text-sm text-gray-600">
              Recommandation : choisissez l'heure de votre cérémonie principale
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeReferenceModal;
