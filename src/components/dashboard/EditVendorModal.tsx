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
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (vendor) {
      setFormData({
        vendor_name: vendor.vendor_name || '',
        status: vendor.status,
        email: vendor.email || '',
        phone: vendor.phone || '',
        website: vendor.website || '',
        location: vendor.location || '',
        notes: vendor.notes || ''
      });
    }
  }, [vendor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendor) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vendors_tracking_preprod')
        .update({
          vendor_name: formData.vendor_name,
          status: formData.status,
          email: formData.email || null,
          phone: formData.phone || null,
          website: formData.website || null,
          location: formData.location || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', vendor.id);

      if (error) throw error;

      toast({
        title: "Prestataire mis à jour",
        description: "Les informations du prestataire ont été mises à jour avec succès.",
      });

      onVendorUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating vendor:', error);
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier le prestataire</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vendor_name">Nom du prestataire</Label>
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

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVendorModal;