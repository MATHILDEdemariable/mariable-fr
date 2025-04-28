
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: () => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ 
  open, 
  onOpenChange,
  onProjectCreated
}) => {
  const [projectTitle, setProjectTitle] = useState('Notre mariage');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [location, setLocation] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = async () => {
    if (!projectTitle) {
      toast({
        title: 'Titre requis',
        description: 'Veuillez saisir un titre pour votre projet de mariage.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const { error } = await supabase.from('projects').insert({
        user_id: user.id,
        title: projectTitle,
        wedding_date: date ? date.toISOString().split('T')[0] : null,
        location: location || null,
        guest_count: guestCount ? parseInt(guestCount) : null,
        budget: budget ? parseFloat(budget) : null,
      });

      if (error) throw error;

      toast({
        title: 'Projet créé',
        description: 'Votre projet de mariage a été créé avec succès.',
      });

      // Reset form and close dialog
      onOpenChange(false);
      onProjectCreated();

    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de la création du projet',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif">Créer votre projet de mariage</DialogTitle>
          <DialogDescription>
            Saisissez les informations de base pour votre projet de mariage.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="project-title">Nom du projet</Label>
            <Input
              id="project-title"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="ex: Notre mariage"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="date">Date du mariage (optionnel)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'd MMMM yyyy', { locale: fr }) : <span>Sélectionner une date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  locale={fr}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="location">Lieu (optionnel)</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="ex: Paris"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="guest-count">Nombre d'invités (optionnel)</Label>
              <Input
                id="guest-count"
                type="number"
                min="0"
                step="1"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="ex: 100"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="budget">Budget en € (optionnel)</Label>
              <Input
                id="budget"
                type="number"
                min="0"
                step="100"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="ex: 15000"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleCreateProject} 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Créer mon projet
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
