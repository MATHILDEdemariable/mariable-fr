import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { JeuneMarie } from '@/types/jeunes-maries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Heart, Eye, CheckCircle, XCircle, Edit, Search, Calendar, MapPin, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const AdminJeunesMaries: React.FC = () => {
  const [jeunesMaries, setJeunesMaries] = useState<JeuneMarie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJeuneMarie, setSelectedJeuneMarie] = useState<JeuneMarie | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: 'tous',
    visible: 'tous'
  });

  const fetchJeunesMaries = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('jeunes_maries')
        .select('*')
        .order('date_soumission', { ascending: false });

      if (filters.search) {
        query = query.or(`nom_complet.ilike.%${filters.search}%,lieu_mariage.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'tous') {
        query = query.eq('status_moderation', filters.status);
      }

      if (filters.visible !== '' && filters.visible !== 'tous') {
        query = query.eq('visible', filters.visible === 'true');
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erreur lors du chargement:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les jeunes mariés",
          variant: "destructive"
        });
        return;
      }

      setJeunesMaries((data as JeuneMarie[]) || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateJeuneMarie = async (id: string, updates: Partial<JeuneMarie>) => {
    try {
      const { error } = await supabase
        .from('jeunes_maries')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le profil",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });

      fetchJeunesMaries();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const approveJeuneMarie = async (id: string) => {
    await updateJeuneMarie(id, {
      status_moderation: 'approuve',
      date_approbation: new Date().toISOString(),
      visible: true
    });
  };

  const rejectJeuneMarie = async (id: string) => {
    await updateJeuneMarie(id, {
      status_moderation: 'rejete',
      visible: false
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approuve':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejete':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchJeunesMaries();
  }, [filters]);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedJeuneMarie) {
      updateJeuneMarie(selectedJeuneMarie.id, selectedJeuneMarie);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-wedding-olive" />
          <h2 className="text-2xl font-semibold text-wedding-olive">Gestion des Jeunes Mariés</h2>
        </div>
        <Badge variant="outline">
          {jeunesMaries.length} témoignage{jeunesMaries.length > 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, lieu ou email..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Statut de modération" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="approuve">Approuvé</SelectItem>
                <SelectItem value="rejete">Rejeté</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.visible}
              onValueChange={(value) => setFilters(prev => ({ ...prev, visible: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Visibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Toute visibilité</SelectItem>
                <SelectItem value="true">Visible</SelectItem>
                <SelectItem value="false">Masqué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des témoignages */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {jeunesMaries.map((jeuneMarie) => (
            <Card key={jeuneMarie.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-wedding-olive">
                        {jeuneMarie.nom_complet}
                      </h3>
                      {getStatusBadge(jeuneMarie.status_moderation)}
                      {jeuneMarie.visible && (
                        <Badge variant="outline" className="text-green-600">
                          Visible
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(jeuneMarie.date_mariage)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{jeuneMarie.lieu_mariage}</span>
                      </div>
                      {jeuneMarie.nombre_invites && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{jeuneMarie.nombre_invites} invités</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {jeuneMarie.status_moderation === 'en_attente' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveJeuneMarie(jeuneMarie.id)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectJeuneMarie(jeuneMarie.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                      </>
                    )}
                    
                    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedJeuneMarie(jeuneMarie)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Modifier le témoignage</DialogTitle>
                        </DialogHeader>
                        {selectedJeuneMarie && (
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Nom complet</label>
                                <Input
                                  value={selectedJeuneMarie.nom_complet}
                                  onChange={(e) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, nom_complet: e.target.value } : null
                                  )}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <Input
                                  type="email"
                                  value={selectedJeuneMarie.email}
                                  onChange={(e) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, email: e.target.value } : null
                                  )}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Lieu du mariage</label>
                                <Input
                                  value={selectedJeuneMarie.lieu_mariage}
                                  onChange={(e) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, lieu_mariage: e.target.value } : null
                                  )}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-2">Date du mariage</label>
                                <Input
                                  type="date"
                                  value={selectedJeuneMarie.date_mariage}
                                  onChange={(e) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, date_mariage: e.target.value } : null
                                  )}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-2">Statut</label>
                                <Select
                                  value={selectedJeuneMarie.status_moderation}
                                  onValueChange={(value) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, status_moderation: value as any } : null
                                  )}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en_attente">En attente</SelectItem>
                                    <SelectItem value="approuve">Approuvé</SelectItem>
                                    <SelectItem value="rejete">Rejeté</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={selectedJeuneMarie.visible}
                                  onCheckedChange={(checked) => setSelectedJeuneMarie(prev => 
                                    prev ? { ...prev, visible: checked } : null
                                  )}
                                />
                                <label className="text-sm font-medium">Visible</label>
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2">Notes admin</label>
                              <Textarea
                                value={selectedJeuneMarie.admin_notes || ''}
                                onChange={(e) => setSelectedJeuneMarie(prev => 
                                  prev ? { ...prev, admin_notes: e.target.value } : null
                                )}
                                rows={3}
                              />
                            </div>

                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsModalOpen(false)}
                              >
                                Annuler
                              </Button>
                              <Button type="submit" className="bg-wedding-olive hover:bg-wedding-olive/90">
                                Sauvegarder
                              </Button>
                            </div>
                          </form>
                        )}
                      </DialogContent>
                    </Dialog>

                    {jeuneMarie.visible && (
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a
                          href={`/jeunes-maries/${jeuneMarie.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {jeuneMarie.experience_partagee && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      <span className="font-medium">Expérience:</span> {jeuneMarie.experience_partagee}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-500">
                  <span>Soumis le {formatDate(jeuneMarie.date_soumission)}</span>
                  {jeuneMarie.date_approbation && (
                    <span>• Approuvé le {formatDate(jeuneMarie.date_approbation)}</span>
                  )}
                  <span>• {jeuneMarie.prestataires_recommandes.length} recommandation{jeuneMarie.prestataires_recommandes.length > 1 ? 's' : ''}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJeunesMaries;