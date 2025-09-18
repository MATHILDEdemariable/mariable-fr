import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface CarnetAdressesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CarnetAdressesModal = ({ isOpen, onClose }: CarnetAdressesModalProps) => {
  const [formData, setFormData] = useState({
    email: '',
    date_mariage: '',
    region: '',
    nombre_invites: '',
    style_recherche: '',
    budget_approximatif: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('carnet_adresses_requests')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Demande envoyée !",
        description: "Vous recevrez votre carnet d'adresses exclusif par email sous 48h.",
      });

      // Reset form and close modal
      setFormData({
        email: '',
        date_mariage: '',
        region: '',
        nombre_invites: '',
        style_recherche: '',
        budget_approximatif: ''
      });
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-center mb-2">
            Recevez votre carnet d'adresses exclusif
          </DialogTitle>
          <p className="text-sm text-gray-600 text-center">
            Recommandations personnalisées par nos experts selon votre région et budget
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="date_mariage">Date de mariage</Label>
            <Input
              id="date_mariage"
              type="date"
              value={formData.date_mariage}
              onChange={(e) => handleInputChange('date_mariage', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="region">Région</Label>
            <Select onValueChange={(value) => handleInputChange('region', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre région" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ile-de-france">Île-de-France</SelectItem>
                <SelectItem value="provence">Provence-Alpes-Côte d'Azur</SelectItem>
                <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
                <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
                <SelectItem value="occitanie">Occitanie</SelectItem>
                <SelectItem value="grand-est">Grand Est</SelectItem>
                <SelectItem value="hauts-de-france">Hauts-de-France</SelectItem>
                <SelectItem value="normandie">Normandie</SelectItem>
                <SelectItem value="bretagne">Bretagne</SelectItem>
                <SelectItem value="pays-de-la-loire">Pays de la Loire</SelectItem>
                <SelectItem value="centre-val-de-loire">Centre-Val de Loire</SelectItem>
                <SelectItem value="bourgogne-franche-comte">Bourgogne-Franche-Comté</SelectItem>
                <SelectItem value="corse">Corse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nombre_invites">Nombre d'invités</Label>
            <Select onValueChange={(value) => handleInputChange('nombre_invites', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Combien d'invités ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-50">0-50 invités</SelectItem>
                <SelectItem value="50-100">50-100 invités</SelectItem>
                <SelectItem value="100-150">100-150 invités</SelectItem>
                <SelectItem value="150+">150+ invités</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="style_recherche">Style recherché</Label>
            <Select onValueChange={(value) => handleInputChange('style_recherche', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Quel style vous plaît ?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boheme">Bohème</SelectItem>
                <SelectItem value="champetre">Champêtre</SelectItem>
                <SelectItem value="moderne">Moderne</SelectItem>
                <SelectItem value="vintage">Vintage</SelectItem>
                <SelectItem value="classique">Classique</SelectItem>
                <SelectItem value="industriel">Industriel</SelectItem>
                <SelectItem value="romantique">Romantique</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="budget_approximatif">Budget approximatif</Label>
            <Select onValueChange={(value) => handleInputChange('budget_approximatif', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Budget envisagé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="moins-10k">Moins de 10 000€</SelectItem>
                <SelectItem value="10k-20k">10 000€ - 20 000€</SelectItem>
                <SelectItem value="20k-30k">20 000€ - 30 000€</SelectItem>
                <SelectItem value="30k-plus">Plus de 30 000€</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-wedding-olive hover:bg-wedding-olive/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Envoi...
                </>
              ) : (
                'Recevoir le carnet'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CarnetAdressesModal;