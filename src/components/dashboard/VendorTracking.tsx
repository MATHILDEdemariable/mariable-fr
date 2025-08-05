
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
  Trash,
  Edit,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import AddVendorDialog from './AddVendorDialog';
import EditVendorModal from './EditVendorModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { exportVendorTrackingToPDF } from '@/services/vendorTrackingExportService';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useIsMobile } from '@/hooks/use-mobile';

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
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  source?: string;
  budget?: string | null;
  user_notes?: string | null;
  points_forts?: string | null;
  points_faibles?: string | null;
  feeling?: string | null;
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

type VendorTrackingProps = {
  project_id?: string;
};

const VendorTracking = ({ project_id }: VendorTrackingProps) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [vendorToEdit, setVendorToEdit] = useState<Vendor | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();
  
  console.log('🔍 VendorTracking - isMobile:', isMobile, 'window.innerWidth:', typeof window !== 'undefined' ? window.innerWidth : 'SSR');

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

  // Export to PDF
  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const exportData = {
        vendors: filteredVendors,
        userName: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : undefined,
        weddingDate: profile?.wedding_date ? new Date(profile.wedding_date).toLocaleDateString('fr-FR') : undefined
      };

      const success = await exportVendorTrackingToPDF(exportData);
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre suivi des prestataires a été exporté en PDF",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast({
        title: "Erreur d'export",
        description: "Impossible d'exporter le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
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
                onClick={handleExportPDF}
                disabled={isExporting || filteredVendors.length === 0}
                className="hidden sm:flex"
              >
                {isExporting ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export PDF
              </Button>
              
              <Button 
                variant="outline"
                onClick={fetchVendors}
                className="hidden sm:flex"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
              </Button>
              
              <Button 
                variant="outline"
                className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                onClick={() => window.location.href = '/dashboard/selection'}
              >
                <Plus className="h-4 w-4 mr-2" /> Sélection Mariable
              </Button>
              
              <Button 
                className="bg-wedding-olive hover:bg-wedding-olive/90"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Sélection personnelle
              </Button>
            </div>
          </div>
          
          {/* Actions mobiles */}
          {isMobile && (
            <div className="flex gap-2 mb-4">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting || filteredVendors.length === 0}
                className="flex-1"
              >
                {isExporting ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Download className="h-3 w-3 mr-1" />
                )}
                PDF
              </Button>
              
              <Button 
                variant="outline"
                size="sm"
                onClick={fetchVendors}
                className="flex-1"
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Actualiser
              </Button>
            </div>
          )}

          {isMobile ? (
            // Version mobile avec cards
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-6">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                </div>
              ) : filteredVendors.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  {vendors.length === 0 ? 
                    "Aucun prestataire ajouté. Utilisez les boutons ci-dessus pour commencer." :
                    "Aucun prestataire trouvé avec ces critères"
                  }
                </div>
              ) : (
                filteredVendors.map((vendor) => (
                  <Card key={vendor.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{vendor.vendor_name}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{vendor.category}</Badge>
                            <Badge 
                              variant={vendor.source === 'personal' ? 'secondary' : 'default'}
                              className={cn(
                                "text-xs px-2 py-1",
                                vendor.source === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              )}
                            >
                              {vendor.source === 'personal' ? '👤 Personnel' : '🏢 Mariable'}
                            </Badge>
                          </div>
                        </div>
                        <Badge className={cn("flex items-center gap-1 text-xs px-2 py-1", statusColorMap[vendor.status])}>
                          {statusIconMap[vendor.status]}
                          {vendor.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        {vendor.budget && (
                          <div className="flex justify-between">
                            <span>Budget:</span>
                            <span className="font-medium">{vendor.budget}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Contact:</span>
                          <span>{formatDate(vendor.contact_date)}</span>
                        </div>
                        {vendor.feeling && (
                          <div className="flex justify-between">
                            <span>Feeling:</span>
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-2 py-1",
                                vendor.feeling === 'Excellent' && 'bg-green-100 text-green-800 border-green-300',
                                vendor.feeling === 'Bon' && 'bg-blue-100 text-blue-800 border-blue-300',
                                vendor.feeling === 'Moyen' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                vendor.feeling === 'Mauvais' && 'bg-red-100 text-red-800 border-red-300'
                              )}
                            >
                              {vendor.feeling}
                            </Badge>
                          </div>
                        )}
                      </div>

                      {vendor.source === 'personal' && (vendor.email || vendor.phone || vendor.location) && (
                        <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                          {vendor.email && (
                            <div className="flex items-center gap-1 mb-1">
                              <Mail className="h-3 w-3" />
                              <span>{vendor.email}</span>
                            </div>
                          )}
                          {vendor.phone && (
                            <div className="flex items-center gap-1 mb-1">
                              <Phone className="h-3 w-3" />
                              <span>{vendor.phone}</span>
                            </div>
                          )}
                          {vendor.location && (
                            <div className="flex items-center gap-1">
                              <span>📍 {vendor.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {(vendor.user_notes || vendor.points_forts || vendor.points_faibles || vendor.notes) && (
                        <div className="mb-4 text-xs space-y-1">
                          {vendor.user_notes && (
                            <div className="text-gray-600">
                              📝 {vendor.user_notes}
                            </div>
                          )}
                          {vendor.points_forts && (
                            <div className="text-green-600">
                              ✅ {vendor.points_forts}
                            </div>
                          )}
                          {vendor.points_faibles && (
                            <div className="text-red-600">
                              ❌ {vendor.points_faibles}
                            </div>
                          )}
                          {vendor.notes && (
                            <div className="text-gray-600">
                              💭 {vendor.notes}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2">
                        <Select 
                          defaultValue={vendor.status}
                          onValueChange={(value) => updateVendorStatus(vendor.id, value as VendorStatus)}
                        >
                          <SelectTrigger className="w-full">
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
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setVendorToEdit(vendor);
                              setEditDialogOpen(true);
                            }}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setVendorToDelete(vendor.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="flex-1 text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            // Version desktop avec table
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Prestataire</TableHead>
                    <TableHead className="w-[120px]">Catégorie</TableHead>
                    <TableHead className="w-[100px]">Source</TableHead>
                    <TableHead className="w-[140px]">Statut</TableHead>
                    <TableHead className="w-[100px]">Budget</TableHead>
                    <TableHead className="w-[120px]">Feeling</TableHead>
                    <TableHead className="w-[150px]">Notes</TableHead>
                    <TableHead className="w-[150px]">Points +/-</TableHead>
                    <TableHead className="w-[110px]">Contact</TableHead>
                    <TableHead className="text-right w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6">
                        <div className="flex justify-center">
                          <RefreshCw className="h-5 w-5 animate-spin" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-6 text-muted-foreground">
                        {vendors.length === 0 ? 
                          "Aucun prestataire ajouté. Utilisez les boutons ci-dessus pour commencer." :
                          "Aucun prestataire trouvé avec ces critères"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <TableRow key={vendor.id}>
                        <TableCell className="w-[250px]">
                          <div className="font-medium truncate" title={vendor.vendor_name}>
                            {vendor.vendor_name}
                          </div>
                          {vendor.source === 'personal' && (
                            <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                              {vendor.email && (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate" title={vendor.email}>{vendor.email}</span>
                                </div>
                              )}
                              {vendor.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{vendor.phone}</span>
                                </div>
                              )}
                              {vendor.location && (
                                <div className="truncate" title={vendor.location}>📍 {vendor.location}</div>
                              )}
                            </div>
                          )}
                          {vendor.notes && (
                            <div className="text-xs text-muted-foreground truncate mt-1" title={vendor.notes}>
                              💭 {vendor.notes}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="truncate text-sm">{vendor.category}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={vendor.source === 'personal' ? 'secondary' : 'default'}
                            className={cn(
                              "text-xs px-2 py-1",
                              vendor.source === 'personal' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            )}
                          >
                            {vendor.source === 'personal' ? '👤' : '🏢'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("flex items-center gap-1 text-xs px-2 py-1", statusColorMap[vendor.status])}>
                            {statusIconMap[vendor.status]}
                            <span className="hidden sm:inline">{vendor.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium truncate">
                            {vendor.budget || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {vendor.feeling ? (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "text-xs px-2 py-1",
                                vendor.feeling === 'Excellent' && 'bg-green-100 text-green-800 border-green-300',
                                vendor.feeling === 'Bon' && 'bg-blue-100 text-blue-800 border-blue-300',
                                vendor.feeling === 'Moyen' && 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                vendor.feeling === 'Mauvais' && 'bg-red-100 text-red-800 border-red-300'
                              )}
                              title={vendor.feeling}
                            >
                              {vendor.feeling.charAt(0)}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {vendor.user_notes ? (
                            <div className="text-xs text-muted-foreground truncate" title={vendor.user_notes}>
                              📝 {vendor.user_notes}
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {vendor.points_forts && (
                              <div className="text-xs text-green-600 truncate" title={vendor.points_forts}>
                                ✅ {vendor.points_forts}
                              </div>
                            )}
                            {vendor.points_faibles && (
                              <div className="text-xs text-red-600 truncate" title={vendor.points_faibles}>
                                ❌ {vendor.points_faibles}
                              </div>
                            )}
                            {!vendor.points_forts && !vendor.points_faibles && (
                              <span className="text-muted-foreground text-sm">-</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm truncate">
                            {formatDate(vendor.contact_date)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVendorToEdit(vendor);
                                setEditDialogOpen(true);
                              }}
                              className="p-2"
                              title="Modifier"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setVendorToDelete(vendor.id);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-2 text-red-600 hover:text-red-700"
                              title="Supprimer"
                            >
                              <Trash className="h-3 w-3" />
                            </Button>
                            
                            <Select 
                              defaultValue={vendor.status}
                              onValueChange={(value) => updateVendorStatus(vendor.id, value as VendorStatus)}
                            >
                              <SelectTrigger className="w-[100px] text-xs">
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
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Add Vendor Dialog */}
      <AddVendorDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        onVendorAdded={fetchVendors}
      />
      
      {/* Edit Vendor Modal */}
      <EditVendorModal
        vendor={vendorToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onVendorUpdated={fetchVendors}
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
