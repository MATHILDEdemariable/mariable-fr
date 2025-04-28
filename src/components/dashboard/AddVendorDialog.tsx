
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2 } from 'lucide-react';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorAdded: () => void;
  projectId?: string;
}

const vendorCategories = [
  'Lieu de réception',
  'Traiteur',
  'Photographe',
  'Vidéaste',
  'DJ',
  'Fleuriste',
  'Décoration',
  'Wedding planner',
  'Tenues',
  'Bijoux',
  'Beauté',
  'Transport',
  'Animation',
  'Autre'
];

const AddVendorDialog: React.FC<AddVendorDialogProps> = ({ 
  open, 
  onOpenChange,
  onVendorAdded,
  projectId
}) => {
  const [vendorName, setVendorName] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddVendor = async () => {
    if (!vendorName || !category) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez saisir un nom et une catégorie pour le prestataire.',
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

      const { error } = await supabase.from('vendors_tracking').insert({
        user_id: user.id,
        project_id: projectId,
        vendor_name: vendorName,
        category,
        notes,
        status: 'à contacter',
        contact_date: null,
        response_date: null,
      });

      if (error) throw error;

      toast({
        title: 'Prestataire ajouté',
        description: `${vendorName} a été ajouté à votre liste de prestataires.`,
      });

      // Reset form and close dialog
      setVendorName('');
      setCategory('');
      setNotes('');
      onOpenChange(false);
      onVendorAdded();

    } catch (error: any) {
      console.error('Error adding vendor:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Une erreur est survenue lors de l\'ajout du prestataire',
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
          <DialogTitle className="font-serif">Ajouter un prestataire</DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau prestataire à votre liste de contacts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vendor-name">Nom du prestataire</Label>
            <Input
              id="vendor-name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="ex: Château des Fleurs"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {vendorCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes (facultatif)</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires, contacts, etc."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button 
            onClick={handleAddVendor} 
            className="bg-wedding-olive hover:bg-wedding-olive/90"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVendorDialog;
