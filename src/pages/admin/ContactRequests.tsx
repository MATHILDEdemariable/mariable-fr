import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Heart, Building, Briefcase, User, MessageSquare, Loader2, Bug, HelpCircle, UserX, Lightbulb, MoreHorizontal } from 'lucide-react';

interface ContactRequest {
  id: string;
  type: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  created_at: string;
}

const ContactRequests = () => {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading contact requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'couple': return <Heart className="w-4 h-4" />;
      case 'lieu': return <Building className="w-4 h-4" />;
      case 'marque': return <Briefcase className="w-4 h-4" />;
      case 'prestataire': return <User className="w-4 h-4" />;
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <HelpCircle className="w-4 h-4" />;
      case 'account': return <UserX className="w-4 h-4" />;
      case 'suggestion': return <Lightbulb className="w-4 h-4" />;
      case 'other': return <MoreHorizontal className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'couple': return 'Couple';
      case 'lieu': return 'Lieu';
      case 'marque': return 'Marque';
      case 'prestataire': return 'Prestataire';
      case 'bug': return 'Bug technique';
      case 'feature': return 'Question fonctionnalité';
      case 'account': return 'Problème compte';
      case 'suggestion': return 'Suggestion';
      case 'other': return 'Autre';
      default: return type;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'couple': return 'bg-pink-100 text-pink-700';
      case 'lieu': return 'bg-blue-100 text-blue-700';
      case 'marque': return 'bg-purple-100 text-purple-700';
      case 'prestataire': return 'bg-amber-100 text-amber-700';
      case 'bug': return 'bg-red-100 text-red-700';
      case 'feature': return 'bg-cyan-100 text-cyan-700';
      case 'account': return 'bg-orange-100 text-orange-700';
      case 'suggestion': return 'bg-green-100 text-green-700';
      case 'other': return 'bg-slate-100 text-slate-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRequests = typeFilter === 'all' 
    ? requests 
    : requests.filter(r => r.type === typeFilter);

  const stats = {
    total: requests.length,
    couples: requests.filter(r => r.type === 'couple').length,
    lieux: requests.filter(r => r.type === 'lieu').length,
    marques: requests.filter(r => r.type === 'marque').length,
    prestataires: requests.filter(r => r.type === 'prestataire').length,
    problemes: requests.filter(r => ['bug', 'feature', 'account', 'suggestion', 'other'].includes(r.type)).length
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-wedding-olive" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-wedding-olive">Demandes de Contact</h1>
          <p className="text-gray-600">Gérez les demandes reçues via le formulaire de contact</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-pink-600 flex items-center gap-2">
                <Heart className="w-4 h-4" /> Couples
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.couples}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 flex items-center gap-2">
                <Building className="w-4 h-4" /> Lieux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.lieux}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> Marques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.marques}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-600 flex items-center gap-2">
                <User className="w-4 h-4" /> Prestataires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.prestataires}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 flex items-center gap-2">
                <Bug className="w-4 h-4" /> Problèmes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats.problemes}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium">Filtrer par type :</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Tous les types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="couple">Couples</SelectItem>
              <SelectItem value="lieu">Lieux</SelectItem>
              <SelectItem value="marque">Marques</SelectItem>
              <SelectItem value="prestataire">Prestataires</SelectItem>
              <SelectItem value="bug">Bug technique</SelectItem>
              <SelectItem value="feature">Question fonctionnalité</SelectItem>
              <SelectItem value="account">Problème compte</SelectItem>
              <SelectItem value="suggestion">Suggestion</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Téléphone</TableHead>
                  <TableHead className="max-w-md">Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      Aucune demande de contact
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(request.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getTypeBadgeColor(request.type)} flex items-center gap-1 w-fit`}>
                          {getTypeIcon(request.type)}
                          {getTypeLabel(request.type)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${request.email}`} className="text-wedding-olive hover:underline">
                          {request.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {request.phone ? (
                          <a href={`tel:${request.phone}`} className="text-wedding-olive hover:underline">
                            {request.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-md">
                        <button 
                          onClick={() => setSelectedRequest(request)}
                          className="text-left hover:text-wedding-olive transition-colors"
                        >
                          <p className="truncate max-w-[300px]" title="Cliquer pour voir le message complet">
                            {request.message}
                          </p>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Dialog pour voir le message complet */}
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedRequest && getTypeIcon(selectedRequest.type)}
                Détails de la demande
              </DialogTitle>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Type</p>
                    <Badge className={`${getTypeBadgeColor(selectedRequest.type)} flex items-center gap-1 w-fit`}>
                      {getTypeIcon(selectedRequest.type)}
                      {getTypeLabel(selectedRequest.type)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Date</p>
                    <p className="font-medium">
                      {format(new Date(selectedRequest.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${selectedRequest.email}`} className="text-wedding-olive hover:underline font-medium">
                      {selectedRequest.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Téléphone</p>
                    {selectedRequest.phone ? (
                      <a href={`tel:${selectedRequest.phone}`} className="text-wedding-olive hover:underline font-medium">
                        {selectedRequest.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">Non renseigné</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 mb-2">Message</p>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm max-h-[300px] overflow-y-auto">
                    {selectedRequest.message}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default ContactRequests;
