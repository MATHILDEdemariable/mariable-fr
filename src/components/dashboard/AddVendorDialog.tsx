
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
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [location, setLocation] = useState('');
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

      const { error } = await supabase.from('vendors_tracking_preprod').insert({
        user_id: user.id,
        project_id: projectId,
        vendor_name: vendorName,
        category,
        email: email || null,
        phone: phone || null,
        website: website || null,
        location: location || null,
        notes,
        status: 'à contacter',
        contact_date: null,
        response_date: null,
        source: 'personal', // Marquer comme prestataire personnel
      });

      if (error) throw error;

      toast({
        title: 'Prestataire ajouté',
        description: `${vendorName} a été ajouté à votre liste de prestataires.`,
      });

      // Reset form and close dialog
      setVendorName('');
      setCategory('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setLocation('');
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
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Ajouter un prestataire personnel</DialogTitle>
          <DialogDescription>
            Ajoutez un prestataire de votre choix à votre liste de suivi.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="vendor-name">Nom du prestataire *</Label>
            <Input
              id="vendor-name"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
              placeholder="ex: Château des Fleurs"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie *</Label>
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
            <Label htmlFor="email">Email du prestataire</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@prestataire.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01 23 45 67 89"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.prestataire.com"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Localisation</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ville, Région"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Informations supplémentaires, prix estimé, etc."
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
