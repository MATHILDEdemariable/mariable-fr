import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Clock, Search, AlertCircle, Mail, Phone, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { exportPaymentLeadsToCSV } from '@/lib/csvExport';

interface PaymentLead {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  category: string;
  message: string | null;
  created_at: string;
  status: string;
  admin_notes: string | null;
}

const AdminPaymentLeads = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [leads, setLeads] = useState<PaymentLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<PaymentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<PaymentLead | null>(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/admin/dashboard');
      return;
    }

    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!adminUser) {
      navigate('/admin/dashboard');
      return;
    }

    fetchLeads();
  };

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('professional_payment_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setLeads(data || []);
      setFilteredLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching payment leads:', err);
      setError(err.message || 'Erreur lors du chargement des demandes');
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de paiements",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(lead => lead.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    setFilteredLeads(filtered);
  }, [searchTerm, categoryFilter, statusFilter, leads]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('professional_payment_leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la demande a été modifié avec succès"
      });

      fetchLeads();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;

    try {
      const { error } = await supabase
        .from('professional_payment_leads')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedLead.id);

      if (error) throw error;

      toast({
        title: "Notes enregistrées",
        description: "Les notes admin ont été sauvegardées avec succès"
      });

      setSelectedLead(null);
      setAdminNotes('');
      fetchLeads();
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'nouveau':
        return <Badge className="bg-blue-500 hover:bg-blue-600"><Clock className="w-3 h-3 mr-1" />Nouveau</Badge>;
      case 'en_cours':
        return <Badge className="bg-orange-500 hover:bg-orange-600"><AlertCircle className="w-3 h-3 mr-1" />En cours</Badge>;
      case 'traite':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle className="w-3 h-3 mr-1" />Traité</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'traiteur': 'bg-purple-100 text-purple-800',
      'photographe': 'bg-pink-100 text-pink-800',
      'fleuriste': 'bg-green-100 text-green-800',
      'dj': 'bg-blue-100 text-blue-800',
      'lieu': 'bg-orange-100 text-orange-800',
      'autre': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['autre'];
  };

  const getRecentLeads = () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return leads.filter(lead => new Date(lead.created_at) > sevenDaysAgo).length;
  };

  const getUniqueCategories = () => {
    return [...new Set(leads.map(lead => lead.category))];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-olive" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Demandes Paiements Simplifiés</h1>
            <p className="text-muted-foreground mt-2">
              Gérez les demandes de démonstration pour la solution de paiements
            </p>
          </div>
          <Button 
            onClick={() => exportPaymentLeadsToCSV(filteredLeads)}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter CSV
          </Button>
        </div>

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
              <Button 
                onClick={fetchLeads} 
                variant="outline" 
                className="mt-4"
              >
                Réessayer
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{leads.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Nouvelles (7j)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{getRecentLeads()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                En attente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {leads.filter(l => l.status === 'nouveau' || l.status === 'en_cours').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniqueCategories().length}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
            <CardDescription>Recherchez et filtrez les demandes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {getUniqueCategories().map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="en_cours">En cours</SelectItem>
                  <SelectItem value="traite">Traité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des demandes ({filteredLeads.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom complet</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Catégorie</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Aucune demande trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-medium">{lead.full_name}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1 text-sm">
                            <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                              <Mail className="w-3 h-3" />
                              {lead.email}
                            </a>
                            <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-green-600 hover:underline">
                              <Phone className="w-3 h-3" />
                              {lead.phone}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getCategoryBadgeColor(lead.category)}>
                            {lead.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate text-sm text-muted-foreground">
                            {lead.message || 'Pas de message'}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(lead.created_at)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(lead.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Select 
                              value={lead.status} 
                              onValueChange={(value) => handleStatusChange(lead.id, value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="nouveau">Nouveau</SelectItem>
                                <SelectItem value="en_cours">En cours</SelectItem>
                                <SelectItem value="traite">Traité</SelectItem>
                              </SelectContent>
                            </Select>

                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setAdminNotes(lead.admin_notes || '');
                                  }}
                                >
                                  Notes
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Notes admin - {lead.full_name}</DialogTitle>
                                  <DialogDescription>
                                    Ajoutez des notes internes sur cette demande
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium mb-2">Message du prospect:</p>
                                    <p className="text-sm text-muted-foreground p-3 bg-gray-50 rounded">
                                      {lead.message || 'Aucun message'}
                                    </p>
                                  </div>
                                  <Textarea
                                    placeholder="Vos notes internes..."
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={5}
                                  />
                                  <Button onClick={handleSaveNotes} className="w-full">
                                    Enregistrer les notes
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminPaymentLeads;
