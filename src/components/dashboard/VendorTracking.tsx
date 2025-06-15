
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Phone, 
  Mail, 
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  Plus,
  RefreshCw,
  Trash
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AddVendorDialog from './AddVendorDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface Vendor {
  id: string;
  vendor_name: string;
  category: string;
  status: VendorStatus;
  location?: string;
  contact_date?: Date | null;
  response_date?: Date | null;
  notes?: string | null;
}

const statusColorMap: Record<VendorStatus, string> = {
  'à contacter': 'bg-gray-100 text-gray-800',
  'contactés': 'bg-blue-100 text-blue-800',
  'en attente': 'bg-orange-100 text-orange-800',
  'réponse reçue': 'bg-green-100 text-green-800',
  'à valider': 'bg-purple-100 text-purple-800',
  'annuler': 'bg-red-100 text-red-800',
};

const statusIconMap: Record<VendorStatus, React.ReactNode> = {
  'à contacter': <Phone className="h-4 w-4" />,
  'contactés': <MessageSquare className="h-4 w-4" />,
  'en attente': <Clock className="h-4 w-4" />,
  'réponse reçue': <CheckCircle className="h-4 w-4" />,
  'à valider': <Calendar className="h-4 w-4" />,
  'annuler': <Trash className="h-4 w-4" />,
};

// interface VendorTrackingProps {
//   projectId?: string;
// }

type VendorTrackingProps = {
  project_id?: string;
};

const VendorTracking = ({ project_id }: VendorTrackingProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const { toast } = useToast();
  // Fetch vendors from the database
  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsLoading(false);
        return;
      }


      let query = supabase
        .from('vendors_tracking_preprod')
        .select('*')
        .eq('user_id', user.id);
        
      // if (projectId) {
      //   query = query.eq('project_id', projectId);
      // }
        
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        setVendors(data.map(v => ({
          ...v,
          contact_date: v.contact_date ? new Date(v.contact_date) : null,
          response_date: v.response_date ? new Date(v.response_date) : null
        })));
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer la liste des prestataires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchVendors();
  }, []);
  
  // Get unique categories for filter
  const categories = [...new Set(vendors.map(vendor => vendor.category))];
  
  // Filter vendors based on selected filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });
  
  // Update vendor status
  const updateVendorStatus = async (id: string, newStatus: VendorStatus) => {
    try {
      const updates: any = { 
        status: newStatus,
      };
      
      // Update date based on status
      if (newStatus === 'contactés') {
        updates.contact_date = new Date().toISOString();
      } else if (newStatus === 'réponse reçue') {
        updates.response_date = new Date().toISOString();
      }
      
      const { error } = await supabase
        .from('vendors_tracking_preprod')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setVendors(prev => prev.map(vendor => {
        if (vendor.id === id) {
          return { 
            ...vendor, 
            status: newStatus,
            contact_date: newStatus === 'contactés' ? new Date() : vendor.contact_date,
            response_date: newStatus === 'réponse reçue' ? new Date() : vendor.response_date
          };
        }
        return vendor;
      }));
      
      toast({
        title: "Statut mis à jour",
        description: "Le statut du prestataire a été mis à jour",
      });
      
    } catch (error) {
      console.error('Error updating vendor status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };
  
  // Delete vendor
  const deleteVendor = async () => {
    if (!vendorToDelete) return;
    
    try {
      const { error } = await supabase
        .from('vendors_tracking_preprod')
        .delete()
        .eq('id', vendorToDelete);
        
      if (error) throw error;
      
      // Update local state
      setVendors(prev => prev.filter(vendor => vendor.id !== vendorToDelete));
      
      toast({
        title: "Prestataire supprimé",
        description: "Le prestataire a été supprimé de votre liste",
      });
      
      setVendorToDelete(null);
      setDeleteDialogOpen(false);
      
    } catch (error) {
      console.error('Error deleting vendor:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le prestataire",
        variant: "destructive",
      });
    }
  };
  
  // Format date for display
  const formatDate = (date?: Date | null) => {
    if (!date) return "Aucun contact";
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="font-serif">Mes prestataires</CardTitle>
        <CardDescription>
          Gérez vos prestataires de mariage et suivez l'avancement de vos démarches
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="à contacter">À contacter</SelectItem>
                <SelectItem value="contactés">Contactés</SelectItem>
                <SelectItem value="en attente">En attente</SelectItem>
                <SelectItem value="réponse reçue">Réponse reçue</SelectItem>
                <SelectItem value="à valider">À valider</SelectItem>
                <SelectItem value="annuler">Annuler</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 flex gap-2 justify-end">
              <Button 
                variant="outline"
                onClick={fetchVendors}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
              </Button>
              
              <Button 
                className="bg-wedding-olive hover:bg-wedding-olive/90"
                onClick={()=> (
                  window.open('/recherche','_self')
                )}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un prestataire
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prestataire</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernier contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      <div className="flex justify-center">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      {vendors.length === 0 ? 
                        "Aucun prestataire ajouté. Cliquez sur 'Ajouter un prestataire' pour commencer." :
                        "Aucun prestataire trouvé avec ces critères"
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="font-medium">{vendor.vendor_name}</div>
                        {vendor.notes && (
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {vendor.notes}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{vendor.category}</TableCell>
                      <TableCell>
                        <Badge className={cn("flex items-center gap-1 w-fit", statusColorMap[vendor.status])}>
                          {statusIconMap[vendor.status]}
                          <span>{vendor.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(vendor.contact_date)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant='outline' onClick={
                              () => {
                                window.open(`/prestataire/tracking?id=${vendor.id}&edit=user`, '_blank');
                              }
                            }>Voir la demande</Button>
                          <Select 

                            defaultValue={vendor.status}
                            onValueChange={(value) => updateVendorStatus(vendor.id, value as VendorStatus)}
                          >
                            <SelectTrigger className="w-[140px] hidden">
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
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="hidden"
                            onClick={() => {
                              setVendorToDelete(vendor.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
      
      {/* Add Vendor Dialog */}
      <AddVendorDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onVendorAdded={fetchVendors}
        // projectId={projectId}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le prestataire sera définitivement supprimé de votre liste.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteVendor}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default VendorTracking;
