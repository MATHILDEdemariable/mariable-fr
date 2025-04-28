
import React, { useState } from 'react';
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
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Database } from '@/integrations/supabase/types';

type VendorStatus = Database['public']['Enums']['vendor_status'];

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: VendorStatus;
  location?: string;
  lastContact?: Date;
  notes?: string;
}

const statusColorMap: Record<VendorStatus, string> = {
  'à contacter': 'bg-gray-100 text-gray-800',
  'contactés': 'bg-blue-100 text-blue-800',
  'en attente': 'bg-orange-100 text-orange-800',
  'réponse reçue': 'bg-green-100 text-green-800',
  'à valider': 'bg-purple-100 text-purple-800',
};

const statusIconMap: Record<VendorStatus, React.ReactNode> = {
  'à contacter': <Phone className="h-4 w-4" />,
  'contactés': <MessageSquare className="h-4 w-4" />,
  'en attente': <Clock className="h-4 w-4" />,
  'réponse reçue': <CheckCircle className="h-4 w-4" />,
  'à valider': <Calendar className="h-4 w-4" />,
};

// Sample vendors data - will be replaced with real data from Supabase
const initialVendors: Vendor[] = [
  {
    id: '1',
    name: 'Château des Fleurs',
    category: 'Lieu de réception',
    status: 'à contacter',
    location: 'Bordeaux',
  },
  {
    id: '2',
    name: 'Traiteur Délices',
    category: 'Traiteur',
    status: 'contactés',
    location: 'Paris',
    lastContact: new Date('2023-04-15'),
  },
  {
    id: '3',
    name: 'Photo Souvenirs',
    category: 'Photographe',
    status: 'en attente',
    location: 'Lyon',
    lastContact: new Date('2023-04-10'),
  },
  {
    id: '4',
    name: 'DJ Animation',
    category: 'DJ',
    status: 'réponse reçue',
    location: 'Nantes',
    lastContact: new Date('2023-04-05'),
  },
  {
    id: '5',
    name: 'Fleuriste Passion',
    category: 'Fleuriste',
    status: 'à valider',
    location: 'Toulouse',
    lastContact: new Date('2023-04-01'),
  },
];

const VendorTracking: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>(initialVendors);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Get unique categories for filter
  const categories = [...new Set(vendors.map(vendor => vendor.category))];
  
  // Filter vendors based on selected filters
  const filteredVendors = vendors.filter(vendor => {
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });
  
  // Update vendor status
  const updateVendorStatus = (id: string, newStatus: VendorStatus) => {
    const updatedVendors = vendors.map(vendor => {
      if (vendor.id === id) {
        return { 
          ...vendor, 
          status: newStatus, 
          lastContact: newStatus === 'contactés' ? new Date() : vendor.lastContact 
        };
      }
      return vendor;
    });
    
    setVendors(updatedVendors);
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
            
            <div className="flex-1 flex justify-end">
              <Button className="bg-wedding-olive hover:bg-wedding-olive/90 ml-auto">
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
                {filteredVendors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      Aucun prestataire trouvé avec ces critères
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id}>
                      <TableCell>
                        <div className="font-medium">{vendor.name}</div>
                        {vendor.location && (
                          <div className="text-xs text-muted-foreground">{vendor.location}</div>
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
                        {vendor.lastContact ? 
                          vendor.lastContact.toLocaleDateString() : 
                          "Aucun contact"
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Select 
                            defaultValue={vendor.status}
                            onValueChange={(value) => updateVendorStatus(vendor.id, value as VendorStatus)}
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="à contacter">À contacter</SelectItem>
                              <SelectItem value="contactés">Contactés</SelectItem>
                              <SelectItem value="en attente">En attente</SelectItem>
                              <SelectItem value="réponse reçue">Réponse reçue</SelectItem>
                              <SelectItem value="à valider">À valider</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="icon">
                            <Mail className="h-4 w-4" />
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
    </Card>
  );
};

export default VendorTracking;
