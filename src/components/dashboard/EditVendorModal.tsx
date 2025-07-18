
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface Vendor {
  id: string;
  vendor_name: string;
  category: string;
  status: VendorStatus;
  location?: string;
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  notes?: string | null;
  budget?: string | null;
  user_notes?: string | null;
  points_forts?: string | null;
  points_faibles?: string | null;
  feeling?: string | null;
}

interface EditVendorModalProps {
  vendor: Vendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVendorUpdated: () => void;
}

const EditVendorModal: React.FC<EditVendorModalProps> = ({
  vendor,
  open,
  onOpenChange,
  onVendorUpdated
}) => {
  const [formData, setFormData] = useState({
    vendor_name: '',
    status: 'à contacter' as VendorStatus,
    email: '',
    phone: '',
    website: '',
    location: '',
    notes: '',
    budget: '',
    user_notes: '',
    points_forts: '',
    points_faibles: '',
    feeling: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (vendor) {
      console.log('🔍 Loading vendor data:', vendor);
      setFormData({
        vendor_name: vendor.vendor_name || '',
        status: vendor.status,
        email: vendor.email || '',
        phone: vendor.phone || '',
        website: vendor.website || '',
        location: vendor.location || '',
        notes: vendor.notes || '',
        budget: vendor.budget || '',
        user_notes: vendor.user_notes || '',
        points_forts: vendor.points_forts || '',
        points_faibles: vendor.points_faibles || '',
        feeling: vendor.feeling || ''
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    console.log('🚀 Updating vendor with data:', formData);
    
    setLoading(true);
    try {
      const updateData = {
        vendor_name: formData.vendor_name,
        status: formData.status,
        email: formData.email || null,
        phone: formData.phone || null,
        website: formData.website || null,
        location: formData.location || null,
        notes: formData.notes || null,
        budget: formData.budget || null,
        user_notes: formData.user_notes || null,
        points_forts: formData.points_forts || null,
        points_faibles: formData.points_faibles || null,
        feeling: formData.feeling || null,
        updated_at: new Date().toISOString()
      };

      console.log('📤 Sending update to database:', updateData);

      const { error } = await supabase
        .from('vendors_tracking_preprod')
        .update(updateData)
        .eq('id', vendor.id);

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }

      console.log('✅ Vendor updated successfully');

      toast({
        title: "Prestataire mis à jour",
        description: "Les informations du prestataire ont été mises à jour avec succès.",
      });

      onVendorUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ Error updating vendor:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le prestataire.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!vendor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier le prestataire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informations de base */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_name">Nom du prestataire *</Label>
              <Input
                id="vendor_name"
                value={formData.vendor_name}
                onChange={(e) => setFormData(prev => ({ ...prev, vendor_name: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as VendorStatus }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="à contacter">À contacter</SelectItem>
                  <SelectItem value="contactés">Contactés</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="réponse reçue">Réponse reçue</SelectItem>
                  <SelectItem value="à valider">À valider</SelectItem>
                  <SelectItem value="annuler">Annuler</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          {/* Budget et Feeling */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget estimé</Label>
              <Input
                id="budget"
                value={formData.budget}
                onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                placeholder="ex: 2000€"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feeling">Feeling général</Label>
              <Select value={formData.feeling || undefined} onValueChange={(value) => setFormData(prev => ({ ...prev, feeling: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez votre impression" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent ⭐⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="Bon">Bon ⭐⭐⭐⭐</SelectItem>
                  <SelectItem value="Moyen">Moyen ⭐⭐⭐</SelectItem>
                  <SelectItem value="Mauvais">Mauvais ⭐⭐</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes générales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              placeholder="Notes générales sur le prestataire..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user_notes">Notes personnelles</Label>
            <Textarea
              id="user_notes"
              value={formData.user_notes}
              onChange={(e) => setFormData(prev => ({ ...prev, user_notes: e.target.value }))}
              rows={2}
              placeholder="Vos notes et impressions détaillées..."
            />
          </div>

          {/* Points forts et faibles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="points_forts">Points forts</Label>
              <Textarea
                id="points_forts"
                value={formData.points_forts}
                onChange={(e) => setFormData(prev => ({ ...prev, points_forts: e.target.value }))}
                rows={3}
                placeholder="Ce qui vous plaît chez ce prestataire..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points_faibles">Points faibles</Label>
              <Textarea
                id="points_faibles"
                value={formData.points_faibles}
                onChange={(e) => setFormData(prev => ({ ...prev, points_faibles: e.target.value }))}
                rows={3}
                placeholder="Ce qui vous inquiète ou déplaît..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="bg-wedding-olive hover:bg-wedding-olive/90">
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorModal;
