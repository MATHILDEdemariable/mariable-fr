import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Download, Eye, Calendar, User, Mail, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Helmet } from "react-helmet-async";

interface DevisData {
  id: string;
  nom_professionnel: string;
  email_professionnel: string;
  email_client: string;
  message: string | null;
  fichier_url: string;
  fichier_nom: string;
  fichier_taille: number;
  statut: 'nouveau' | 'vu' | 'traité';
  created_at: string;
  updated_at: string;
}

const AdminDevisProfessionnels = () => {
  const [devis, setDevis] = useState<DevisData[]>([]);
  const [filteredDevis, setFilteredDevis] = useState<DevisData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchDevis();
  }, []);

  useEffect(() => {
    filterDevis();
  }, [devis, searchTerm, statusFilter]);

  const fetchDevis = async () => {
    try {
      const { data, error } = await supabase
        .from('devis_professionnels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevis((data as DevisData[]) || []);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des devis:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les devis."
      });
    } finally {
      setLoading(false);
    }
  };

  const filterDevis = () => {
    let filtered = devis;

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.nom_professionnel.toLowerCase().includes(term) ||
        item.email_professionnel.toLowerCase().includes(term) ||
        item.email_client.toLowerCase().includes(term) ||
        item.fichier_nom.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.statut === statusFilter);
    }

    setFilteredDevis(filtered);
  };

  const updateStatut = async (id: string, newStatut: 'nouveau' | 'vu' | 'traité') => {
    try {
      const { error } = await supabase
        .from('devis_professionnels')
        .update({ statut: newStatut })
        .eq('id', id);

      if (error) throw error;

      setDevis(prev => prev.map(item => 
        item.id === id ? { ...item, statut: newStatut } : item
      ));

      toast({
        title: "Statut mis à jour",
        description: `Le devis a été marqué comme "${newStatut}".`
      });
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut."
      });
    }
  };

  const downloadFile = async (devisItem: DevisData) => {
    try {
      // Créer l'URL signée pour télécharger le fichier
      const { data: signedUrl } = await supabase.storage
        .from('devis-pdf')
        .createSignedUrl(devisItem.fichier_url.split('/').pop() || '', 3600);

      const downloadUrl = signedUrl?.signedUrl || devisItem.fichier_url;
      
      // Créer un lien temporaire pour télécharger le fichier
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = devisItem.fichier_nom;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Marquer comme vu si ce n'est pas déjà fait
      if (devisItem.statut === 'nouveau') {
        updateStatut(devisItem.id, 'vu');
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de télécharger le fichier."
      });
    }
  };

  const viewFile = async (devisItem: DevisData) => {
    try {
      // Créer l'URL signée pour accéder au fichier 
      const { data: signedUrl } = await supabase.storage
        .from('devis-pdf')
        .createSignedUrl(devisItem.fichier_url.split('/').pop() || '', 3600);

      if (signedUrl?.signedUrl) {
        window.open(signedUrl.signedUrl, '_blank');
      } else {
        // Fallback vers l'URL directe si le bucket est public
        window.open(devisItem.fichier_url, '_blank');
      }
      
      // Marquer comme vu si ce n'est pas déjà fait
      if (devisItem.statut === 'nouveau') {
        updateStatut(devisItem.id, 'vu');
      }
    } catch (error) {
      console.error('Erreur lors de l\'accès au fichier:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'ouvrir le fichier PDF."
      });
    }
  };

  const getStatusVariant = (statut: string) => {
    switch (statut) {
      case 'nouveau': return 'destructive';
      case 'vu': return 'secondary';
      case 'traité': return 'default';
      default: return 'outline';
    }
  };

  const getStatusText = (statut: string) => {
    switch (statut) {
      case 'nouveau': return 'Nouveau';
      case 'vu': return 'Vu';
      case 'traité': return 'Traité';
      default: return statut;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStats = () => {
    const total = devis.length;
    const nouveaux = devis.filter(d => d.statut === 'nouveau').length;
    const vus = devis.filter(d => d.statut === 'vu').length;
    const traités = devis.filter(d => d.statut === 'traité').length;

    return { total, nouveaux, vus, traités };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Devis Professionnels - Admin - Mariable</title>
        <meta name="description" content="Gestion des devis PDF envoyés par les professionnels." />
      </Helmet>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Devis Professionnels</h1>
          <p className="text-muted-foreground">
            Gestion des devis PDF envoyés par les professionnels
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Nouveaux</p>
                <p className="text-2xl font-bold">{stats.nouveaux}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Vus</p>
                <p className="text-2xl font-bold">{stats.vus}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Traités</p>
                <p className="text-2xl font-bold">{stats.traités}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email ou fichier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="nouveau">Nouveau</SelectItem>
                  <SelectItem value="vu">Vu</SelectItem>
                  <SelectItem value="traité">Traité</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des devis */}
      <Card>
        <CardHeader>
          <CardTitle>
            Devis reçus ({filteredDevis.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredDevis.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun devis trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professionnel</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Fichier</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevis.map((devisItem) => (
                    <TableRow key={devisItem.id}>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{devisItem.nom_professionnel}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {devisItem.email_professionnel}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-3 h-3 text-muted-foreground" />
                          {devisItem.email_client}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-sm">{devisItem.fichier_nom}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatFileSize(devisItem.fichier_taille)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={devisItem.statut} 
                          onValueChange={(value) => updateStatut(devisItem.id, value as any)}
                        >
                          <SelectTrigger className="w-32">
                            <Badge variant={getStatusVariant(devisItem.statut)}>
                              {getStatusText(devisItem.statut)}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nouveau">Nouveau</SelectItem>
                            <SelectItem value="vu">Vu</SelectItem>
                            <SelectItem value="traité">Traité</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(devisItem.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(devisItem.created_at), 'HH:mm')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewFile(devisItem)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadFile(devisItem)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDevisProfessionnels;