
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface CustomBlockDialogProps {
  onAddBlock: (block: {
    duration: number;
    title: string;
    description?: string;
  }) => void;
}

const CustomBlockDialog: React.FC<CustomBlockDialogProps> = ({ onAddBlock }) => {
  const [open, setOpen] = useState(false);
  const [duration, setDuration] = useState<string>('15');
  const [title, setTitle] = useState('Nouvelle étape');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    onAddBlock({
      duration: parseInt(duration),
      title: title.trim() || 'Nouvelle étape',
      description: description.trim() || undefined
    });
    
    // Reset form
    setDuration('15');
    setTitle('Nouvelle étape');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-wedding-olive hover:bg-wedding-olive/80 text-white"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter une étape
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une étape personnalisée</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="duration">Durée</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="title">Nom de l'étape</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nouvelle étape"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails de cette étape..."
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-wedding-olive hover:bg-wedding-olive/80"
            >
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CustomBlockDialog;
