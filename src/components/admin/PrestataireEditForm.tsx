import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter,
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Prestataire, PrestataireInsert } from './types';
import { toast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Constants } from '@/integrations/supabase/types';
import { Separator } from '@/components/ui/separator';
import slugify from '@/utils/slugify';

interface EditFormProps {
  isOpen: boolean;
  onClose: () => void;
  prestataire: Prestataire | null;
  onSuccess: () => void;
}

const PrestataireEditForm: React.FC<EditFormProps> = ({ 
  isOpen, 
  onClose, 
  prestataire, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState<Partial<Prestataire>>({
    nom: '',
    description: '',
    description_more: '',
    categorie: undefined,
    region: undefined,
    ville: '',
    email: '',
    telephone: '',
    site_web: '',
    prix_a_partir_de: undefined,
    prix_par_personne: undefined,
    capacite_invites: undefined,
    visible: true,
    featured: false,
    responsable_nom: '',
    responsable_bio: '',
    styles: [],
    siret: '',
    categorie_lieu: '',
    slug: '',
    first_price_package_name: '',
    first_price_package: undefined,
    first_price_package_description: '',
    second_price_package_name: '',
    second_price_package: undefined,
    second_price_package_description: '',
    third_price_package_name: '',
    third_price_package: undefined,
    third_price_package_description: '',
    show_prices: true,
    show_contact_form: true,
    show_photos: true,
    show_brochures: true,
    show_responsable: true,
    show_description: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stylesList, setStylesList] = useState<string[]>([]);
  const [newStyle, setNewStyle] = useState('');

  useEffect(() => {
    if (prestataire) {
      const styles = typeof prestataire.styles === 'string' 
        ? JSON.parse(prestataire.styles as string)
        : prestataire.styles || [];
        
      setFormData({
        ...prestataire,
        styles
      });
      
      setStylesList(Array.isArray(styles) ? styles : []);
    } else {
      // Reset form for new prestataire
      setFormData({
        nom: '',
        description: '',
        description_more: '',
        categorie: undefined,
        region: undefined,
        ville: '',
        email: '',
        telephone: '',
        site_web: '',
        prix_a_partir_de: undefined,
        prix_par_personne: undefined,
        capacite_invites: undefined,
        visible: true,
        featured: false,
        responsable_nom: '',
        responsable_bio: '',
        styles: [],
        siret: '',
        categorie_lieu: '',
        slug: '',
        first_price_package_name: '',
        first_price_package: undefined,
        first_price_package_description: '',
        second_price_package_name: '',
        second_price_package: undefined,
        second_price_package_description: '',
        third_price_package_name: '',
        third_price_package: undefined,
        third_price_package_description: '',
        show_prices: true,
        show_contact_form: true,
        show_photos: true,
        show_brochures: true,
        show_responsable: true,
        show_description: true,
      });
      setStylesList([]);
    }
  }, [prestataire]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Auto-generate slug if name changes
    if (name === 'nom' && (!formData.slug || formData.slug === '')) {
      setFormData(prev => ({ 
        ...prev, 
        slug: slugify(value)
      }));
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const addStyle = () => {
    if (newStyle && !stylesList.includes(newStyle)) {
      const updatedStyles = [...stylesList, newStyle];
      setStylesList(updatedStyles);
      setFormData(prev => ({ ...prev, styles: updatedStyles }));
      setNewStyle('');
    }
  };
  
  const removeStyle = (style: string) => {
    const updatedStyles = stylesList.filter(s => s !== style);
    setStylesList(updatedStyles);
    setFormData(prev => ({ ...prev, styles: updatedStyles }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Ensure required fields are present
      if (!formData.nom) {
        toast({
          title: "Erreur",
          description: "Le nom du prestataire est requis",
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }
      
      // Prepare submission data with proper types
      const submissionData: PrestataireInsert = {
        ...formData,
        styles: JSON.stringify(stylesList || []),
        nom: formData.nom // Explicitly include required field
      };
      
      if (prestataire) {
        // Update existing prestataire
        const { error } = await supabase
          .from('prestataires_rows')
          .update(submissionData)
          .eq('id', prestataire.id);
          
        if (error) throw error;
        toast({
          title: "Succès",
          description: "Prestataire mis à jour avec succès"
        });
      } else {
        // Create new prestataire - ensure required fields
        const { error } = await supabase
          .from('prestataires_rows')
          .insert(submissionData);
          
        if (error) throw error;
        toast({
          title: "Succès",
          description: "Prestataire créé avec succès"
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la sauvegarde",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get category options from Supabase types
  const categorieOptions = Constants.public.Enums.prestataire_categorie;
  const regionOptions = Constants.public.Enums.region_france;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {prestataire ? `Modifier ${prestataire.nom}` : 'Ajouter un prestataire'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Informations générales</h3>
              
              <div className="space-y-2">
                <Label htmlFor="nom">Nom du prestataire*</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom || ''}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug || ''}
                  onChange={handleInputChange}
                  placeholder="auto-generated-from-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categorie">Catégorie</Label>
                <Select
                  value={formData.categorie || ''}
                  onValueChange={(value) => handleSelectChange(value, 'categorie')}
                >
                  <SelectTrigger id="categorie">
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorieOptions.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categorie_lieu">Catégorie lieu (si applicable)</Label>
                <Input
                  id="categorie_lieu"
                  name="categorie_lieu"
                  value={formData.categorie_lieu || ''}
                  onChange={handleInputChange}
                  placeholder="Ex: Château, Domaine, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region">Région</Label>
                <Select
                  value={formData.region || ''}
                  onValueChange={(value) => handleSelectChange(value, 'region')}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  name="ville"
                  value={formData.ville || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description courte</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description_more">Description détaillée</Label>
                <Textarea
                  id="description_more"
                  name="description_more"
                  value={formData.description_more || ''}
                  onChange={handleInputChange}
                  rows={5}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact et prix</h3>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telephone">Téléphone</Label>
                <Input
                  id="telephone"
                  name="telephone"
                  value={formData.telephone || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="site_web">Site web</Label>
                <Input
                  id="site_web"
                  name="site_web"
                  value={formData.site_web || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prix_a_partir_de">Prix à partir de (€)</Label>
                <Input
                  id="prix_a_partir_de"
                  name="prix_a_partir_de"
                  type="number"
                  value={formData.prix_a_partir_de || ''}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="prix_par_personne">Prix par personne (€)</Label>
                <Input
                  id="prix_par_personne"
                  name="prix_par_personne"
                  type="number"
                  value={formData.prix_par_personne || ''}
                  onChange={handleNumberChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="capacite_invites">Capacité d'invités</Label>
                <Input
                  id="capacite_invites"
                  name="capacite_invites"
                  type="number"
                  value={formData.capacite_invites || ''}
                  onChange={handleNumberChange}
                />
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="text-lg font-medium">Responsable</h3>
              
              <div className="space-y-2">
                <Label htmlFor="responsable_nom">Nom du responsable</Label>
                <Input
                  id="responsable_nom"
                  name="responsable_nom"
                  value={formData.responsable_nom || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsable_bio">Bio du responsable</Label>
                <Textarea
                  id="responsable_bio"
                  name="responsable_bio"
                  value={formData.responsable_bio || ''}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siret">SIRET</Label>
                <Input
                  id="siret"
                  name="siret"
                  value={formData.siret || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Prix & Formules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Package 1 */}
              <div className="space-y-2 p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold text-center mb-2">Formule 1</h4>
                <div className="space-y-1">
                  <Label htmlFor="first_price_package_name">Nom de la formule</Label>
                  <Input id="first_price_package_name" name="first_price_package_name" value={formData.first_price_package_name || ''} onChange={handleInputChange} placeholder="Ex: Formule Essentielle"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="first_price_package">Prix (€)</Label>
                  <Input id="first_price_package" name="first_price_package" type="number" value={formData.first_price_package || ''} onChange={handleNumberChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="first_price_package_description">Description</Label>
                  <Textarea id="first_price_package_description" name="first_price_package_description" value={formData.first_price_package_description || ''} onChange={handleInputChange} rows={3} />
                </div>
              </div>
              {/* Package 2 */}
              <div className="space-y-2 p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold text-center mb-2">Formule 2</h4>
                <div className="space-y-1">
                  <Label htmlFor="second_price_package_name">Nom de la formule</Label>
                  <Input id="second_price_package_name" name="second_price_package_name" value={formData.second_price_package_name || ''} onChange={handleInputChange} placeholder="Ex: Formule Premium"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="second_price_package">Prix (€)</Label>
                  <Input id="second_price_package" name="second_price_package" type="number" value={formData.second_price_package || ''} onChange={handleNumberChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="second_price_package_description">Description</Label>
                  <Textarea id="second_price_package_description" name="second_price_package_description" value={formData.second_price_package_description || ''} onChange={handleInputChange} rows={3} />
                </div>
              </div>
              {/* Package 3 */}
              <div className="space-y-2 p-4 border rounded-md bg-gray-50">
                <h4 className="font-semibold text-center mb-2">Formule 3</h4>
                <div className="space-y-1">
                  <Label htmlFor="third_price_package_name">Nom de la formule</Label>
                  <Input id="third_price_package_name" name="third_price_package_name" value={formData.third_price_package_name || ''} onChange={handleInputChange} placeholder="Ex: Formule Luxe"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="third_price_package">Prix (€)</Label>
                  <Input id="third_price_package" name="third_price_package" type="number" value={formData.third_price_package || ''} onChange={handleNumberChange} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="third_price_package_description">Description</Label>
                  <Textarea id="third_price_package_description" name="third_price_package_description" value={formData.third_price_package_description || ''} onChange={handleInputChange} rows={3} />
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Styles</h3>
              
              <div className="flex gap-2 mb-2">
                <Input
                  value={newStyle}
                  onChange={(e) => setNewStyle(e.target.value)}
                  placeholder="Ajouter un style"
                  className="flex-grow"
                />
                <Button type="button" onClick={addStyle} variant="outline">Ajouter</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {stylesList.map((style, index) => (
                  <div key={index} className="flex items-center bg-gray-100 p-2 rounded">
                    <span>{style}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStyle(style)}
                      className="ml-2 h-auto p-1"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                {stylesList.length === 0 && (
                  <p className="text-sm text-gray-500">Aucun style ajouté</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Options d'affichage & Statut</h3>
              
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-md bg-gray-50">
                <div className="flex items-center space-x-2">
                  <Switch id="visible" checked={formData.visible === true} onCheckedChange={(checked) => handleCheckboxChange('visible', checked)} />
                  <Label htmlFor="visible">Visible sur le site</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="featured" checked={formData.featured === true} onCheckedChange={(checked) => handleCheckboxChange('featured', checked)} />
                  <Label htmlFor="featured">Mettre en avant</Label>
                </div>
                 <div className="flex items-center space-x-2">
                  <Switch id="partner" checked={formData.partner === true} onCheckedChange={(checked) => handleCheckboxChange('partner', checked)} />
                  <Label htmlFor="partner">Partenaire</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="hebergement_inclus" checked={formData.hebergement_inclus === true} onCheckedChange={(checked) => handleCheckboxChange('hebergement_inclus', checked)} />
                  <Label htmlFor="hebergement_inclus">Hébergement inclus</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_description" checked={formData.show_description === true} onCheckedChange={(checked) => handleCheckboxChange('show_description', checked)} />
                  <Label htmlFor="show_description">Afficher description</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_prices" checked={formData.show_prices === true} onCheckedChange={(checked) => handleCheckboxChange('show_prices', checked)} />
                  <Label htmlFor="show_prices">Afficher prix</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_contact_form" checked={formData.show_contact_form === true} onCheckedChange={(checked) => handleCheckboxChange('show_contact_form', checked)} />
                  <Label htmlFor="show_contact_form">Afficher form. contact</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_photos" checked={formData.show_photos === true} onCheckedChange={(checked) => handleCheckboxChange('show_photos', checked)} />
                  <Label htmlFor="show_photos">Afficher photos</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_brochures" checked={formData.show_brochures === true} onCheckedChange={(checked) => handleCheckboxChange('show_brochures', checked)} />
                  <Label htmlFor="show_brochures">Afficher brochures</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="show_responsable" checked={formData.show_responsable === true} onCheckedChange={(checked) => handleCheckboxChange('show_responsable', checked)} />
                  <Label htmlFor="show_responsable">Afficher responsable</Label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isSubmitting}>Annuler</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : prestataire ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrestataireEditForm;
