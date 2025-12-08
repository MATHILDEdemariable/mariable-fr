import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Download, Calendar, MapPin, Users, Building2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface CarnetAdressesRequest {
  id: string;
  email: string;
  date_mariage: string;
  region: string;
  nombre_invites: string;
  style_recherche: string;
  budget_approximatif: string;
  categories_prestataires?: string[];
  commentaires?: string;
  created_at: string;
  source_lieu?: string;
  whatsapp?: string;
}

const CarnetAdressesAdmin: React.FC = () => {
  const [requests, setRequests] = useState<CarnetAdressesRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sourceLieuFilter, setSourceLieuFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('carnet_adresses_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Parse categories_prestataires JSON strings
      const processedData = data?.map(item => ({
        ...item,
        categories_prestataires: item.categories_prestataires 
          ? (typeof item.categories_prestataires === 'string' 
              ? JSON.parse(item.categories_prestataires) 
              : item.categories_prestataires)
          : []
      })) || [];

      setRequests(processedData);
    } catch (error) {
      console.log('🚀 fetchRequests error:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de carnet d'adresses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Get unique source_lieu values for filter
  const uniqueSourceLieux = [...new Set(requests.filter(r => r.source_lieu).map(r => r.source_lieu))];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.commentaires?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = regionFilter === 'all' || request.region === regionFilter;
    const matchesSourceLieu = sourceLieuFilter === 'all' || request.source_lieu === sourceLieuFilter;
    return matchesSearch && matchesRegion && matchesSourceLieu;
  });

  const exportToCsv = () => {
    const headers = ['Email', 'WhatsApp', 'Date Mariage', 'Région', 'Nb Invités', 'Style', 'Budget', 'Catégories', 'Commentaires', 'Source Lieu', 'Date Demande'];
    const csvContent = [
      headers.join(','),
      ...filteredRequests.map(req => [
        req.email,
        req.whatsapp || '',
        req.date_mariage || '',
        req.region || '',
        req.nombre_invites || '',
        req.style_recherche || '',
        req.budget_approximatif || '',
        req.categories_prestataires?.join(';') || '',
        req.commentaires?.replace(/,/g, ';') || '',
        req.source_lieu || '',
        format(new Date(req.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `carnet-adresses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Demandes de Carnet d'Adresses ({filteredRequests.length})
          </CardTitle>
          <Button 
            onClick={exportToCsv}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher par email, région ou commentaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={regionFilter} onValueChange={setRegionFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filtrer par région" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les régions</SelectItem>
              <SelectItem value="ile-de-france">Île-de-France</SelectItem>
              <SelectItem value="provence">Provence-Alpes-Côte d'Azur</SelectItem>
              <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
              <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
              <SelectItem value="occitanie">Occitanie</SelectItem>
              <SelectItem value="bretagne">Bretagne</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sourceLieuFilter} onValueChange={setSourceLieuFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Source lieu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les lieux</SelectItem>
              {uniqueSourceLieux.map((source) => (
                <SelectItem key={source} value={source || ''}>
                  {source?.replace(/_/g, ' ') || 'Non défini'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Date de demande</SelectItem>
              <SelectItem value="date_mariage">Date de mariage</SelectItem>
              <SelectItem value="region">Région</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Date Mariage</TableHead>
                <TableHead>Région</TableHead>
                <TableHead>Invités</TableHead>
                <TableHead>Style</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Catégories</TableHead>
                <TableHead>Commentaires</TableHead>
                <TableHead>Source Lieu</TableHead>
                <TableHead>Date Demande</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.email}</TableCell>
                  <TableCell>
                    {request.whatsapp ? (
                      <span className="text-xs">{request.whatsapp}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.date_mariage ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(request.date_mariage), 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    ) : (
                      <span className="text-gray-400">Non précisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.region ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <Badge variant="outline" className="text-xs">
                          {request.region.replace('-', ' ')}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non précisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.nombre_invites ? (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span className="text-xs">{request.nombre_invites}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400">Non précisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.style_recherche ? (
                      <Badge variant="secondary" className="text-xs">
                        {request.style_recherche}
                      </Badge>
                    ) : (
                      <span className="text-gray-400">Non précisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.budget_approximatif ? (
                      <span className="text-xs">{request.budget_approximatif}</span>
                    ) : (
                      <span className="text-gray-400">Non précisé</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.categories_prestataires && request.categories_prestataires.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {request.categories_prestataires.map((category, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">Aucune</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {request.commentaires ? (
                      <p className="text-xs truncate" title={request.commentaires}>
                        {request.commentaires}
                      </p>
                    ) : (
                      <span className="text-gray-400">Aucun</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {request.source_lieu ? (
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-primary" />
                        <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                          {request.source_lieu.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">
                      {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucune demande trouvée</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CarnetAdressesAdmin;
