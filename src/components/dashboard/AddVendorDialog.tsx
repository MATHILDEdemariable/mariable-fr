
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Loader2, ExternalLink } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface AddVendorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorAdded: () => void;
  projectId?: string;
}

interface Prestataire {
  id: string;
  nom: string;
  categorie: string | null;
  description: string | null;
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Initialize with empty array to avoid undefined is not iterable error
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [selectedPrestataire, setSelectedPrestataire] = useState<Prestataire | null>(null);
  const { toast } = useToast();

  // Fetch prestataires when search term changes
  useEffect(() => {
    const fetchPrestataires = async () => {
      if (searchTerm.length < 2) {
        setPrestataires([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('prestataires')
          .select('id, nom, categorie, description')
          .ilike('nom', `%${searchTerm}%`)
          .limit(10);
          
        if (error) throw error;
        
        // Ensure we always set an array, even if data is null or undefined
        setPrestataires(data || []);
      } catch (error) {
        console.error('Error fetching prestataires:', error);
        // Reset to empty array on error to prevent undefined
        setPrestataires([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrestataires();
  }, [searchTerm]);
  
  // Handle prestataire selection
  const handlePrestataireSelect = (prestataire: Prestataire) => {
    setSelectedPrestataire(prestataire);
    setVendorName(prestataire.nom);
    if (prestataire.categorie) {
      setCategory(prestataire.categorie);
    }
    if (prestataire.description) {
      setNotes(prestataire.description);
    }
    setSearchOpen(false);
  };

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
        prestataire_id: selectedPrestataire?.id || null,
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
      setSelectedPrestataire(null);
      setSearchTerm('');
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
            <Label htmlFor="vendor-search">Rechercher un prestataire</Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="w-full justify-between"
                >
                  {selectedPrestataire ? selectedPrestataire.nom : "Rechercher un prestataire..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput 
                    placeholder="Nom du prestataire..." 
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  {isLoading && (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  )}
                  <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                  <CommandGroup>
                    {/* Ensure we're iterating over a valid array */}
                    {prestataires.map((prestataire) => (
                      <CommandItem
                        key={prestataire.id}
                        value={prestataire.nom}
                        onSelect={() => handlePrestataireSelect(prestataire)}
                      >
                        {prestataire.nom}
                        {prestataire.categorie && (
                          <span className="ml-2 text-xs bg-wedding-cream/50 px-2 py-0.5 rounded-full">
                            {prestataire.categorie}
                          </span>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
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

          {selectedPrestataire && (
            <div className="bg-wedding-cream/20 p-3 rounded-md border border-wedding-olive/20">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fiche prestataire disponible</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 text-xs border-wedding-olive/30"
                  asChild
                >
                  <Link to={`/demo?id=${selectedPrestataire.id}`} target="_blank">
                    Voir la fiche complète <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
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
