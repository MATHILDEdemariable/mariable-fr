import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Download, CheckCircle2, Mail, Building2, Phone, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PartnershipRequest {
  id: string;
  name: string;
  email: string;
  company_name: string | null;
  phone: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const statusConfig = {
  new: { label: 'Nouveau', color: 'bg-blue-100 text-blue-800' },
  contacted: { label: 'Contacté', color: 'bg-yellow-100 text-yellow-800' },
  converted: { label: 'Converti', color: 'bg-green-100 text-green-800' },
  refused: { label: 'Refusé', color: 'bg-red-100 text-red-800' }
};

const AdminPartenariats = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [requests, setRequests] = useState<PartnershipRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchRequests();
    }
  }, [isAuthenticated]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('partnership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching partnership requests:', error);
      toast.error('Erreur lors du chargement des demandes');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('partnership_requests')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success('Statut mis à jour');
      fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const exportToCSV = () => {
    const filteredRequests = filterStatus === 'all' 
      ? requests 
      : requests.filter(r => r.status === filterStatus);

    const headers = ['Date', 'Nom', 'Email', 'Entreprise', 'Téléphone', 'Message', 'Statut'];
    const csvContent = [
      headers.join(','),
      ...filteredRequests.map(req => [
        format(new Date(req.created_at), 'dd/MM/yyyy HH:mm', { locale: fr }),
        req.name,
        req.email,
        req.company_name || '',
        req.phone || '',
        `"${(req.message || '').replace(/"/g, '""')}"`,
        statusConfig[req.status as keyof typeof statusConfig]?.label || req.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `demandes-partenariat-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    
    toast.success('Export CSV téléchargé');
  };

  const filteredRequests = filterStatus === 'all' 
    ? requests 
    : requests.filter(r => r.status === filterStatus);

  const newRequestsCount = requests.filter(r => r.status === 'new').length;

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <p>Chargement...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-wedding-black">
              Demandes de Partenariat
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les demandes de partenariat reçues via le formulaire.
            </p>
          </div>
          
          {newRequestsCount > 0 && (
            <Badge className="bg-blue-500 text-white px-4 py-2">
              {newRequestsCount} nouvelle{newRequestsCount > 1 ? 's' : ''} demande{newRequestsCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="contacted">Contacté</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
              <SelectItem value="refused">Refusé</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={exportToCSV} 
            variant="outline"
            className="ml-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter CSV
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Chargement des demandes...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <p className="text-lg">Aucune demande de partenariat</p>
              <p className="text-sm mt-2">Les nouvelles demandes apparaîtront ici</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="text-sm">
                      {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.name}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <a href={`mailto:${request.email}`} className="text-blue-600 hover:underline">
                            {request.email}
                          </a>
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <a href={`tel:${request.phone}`} className="text-blue-600 hover:underline">
                              {request.phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {request.company_name ? (
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{request.company_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {request.message ? (
                        <div className="max-w-xs">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {request.message}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[request.status as keyof typeof statusConfig]?.color || 'bg-gray-100 text-gray-800'}>
                        {statusConfig[request.status as keyof typeof statusConfig]?.label || request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={request.status}
                          onValueChange={(value) => updateStatus(request.id, value)}
                        >
                          <SelectTrigger className="w-[140px] h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Nouveau</SelectItem>
                            <SelectItem value="contacted">Contacté</SelectItem>
                            <SelectItem value="converted">Converti</SelectItem>
                            <SelectItem value="refused">Refusé</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        {request.status === 'new' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateStatus(request.id, 'contacted')}
                            className="h-8"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPartenariats;
