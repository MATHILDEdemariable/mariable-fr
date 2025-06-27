
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Phone, Mail, Edit, Trash2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { WeddingCoordination, TeamMember, TeamMemberFormData } from '@/types/monjourm';

const MonJourMEquipe: React.FC = () => {
  const { toast } = useToast();
  
  // États locaux simples
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberFormData>({
    name: '',
    role: '',
    email: '',
    phone: '',
    type: 'person',
    notes: ''
  });

  // Chargement initial
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer ou créer la coordination
      let { data: coordinations, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coordError) throw coordError;

      let activeCoordination: WeddingCoordination;

      if (coordinations && coordinations.length > 0) {
        activeCoordination = coordinations[0];
      } else {
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (createError) throw createError;
        activeCoordination = newCoordination;
      }

      setCoordination(activeCoordination);
      await loadTeamMembers(activeCoordination.id);

    } catch (error) {
      console.error('Erreur initialisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeamMembers = async (coordId: string) => {
    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at');

      if (error) throw error;

      const mappedData: TeamMember[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        type: (item.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor',
        prestataire_id: item.prestataire_id,
        notes: item.notes
      }));

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      type: 'person',
      notes: ''
    });
  };

  const handleAddMember = async () => {
    if (!formData.name.trim() || !coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .insert({
          coordination_id: coordination.id,
          name: formData.name,
          role: formData.role || 'Membre',
          email: formData.email || null,
          phone: formData.phone || null,
          type: formData.type,
          notes: formData.notes || null
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Membre ajouté",
        description: "Le nouveau membre a été ajouté à l'équipe"
      });

      resetForm();
      setShowAddMember(false);
      await loadTeamMembers(coordination.id);

    } catch (error) {
      console.error('Erreur ajout membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive"
      });
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !coordination?.id) return;

    try {
      const { error } = await supabase
        .from('coordination_team')
        .update({
          name: editingMember.name,
          role: editingMember.role,
          email: editingMember.email || null,
          phone: editingMember.phone || null,
          type: editingMember.type,
          notes: editingMember.notes || null
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      setEditingMember(null);
      
      toast({
        title: "Membre modifié",
        description: "Les informations ont été mises à jour"
      });

      await loadTeamMembers(coordination.id);

    } catch (error) {
      console.error('Erreur modification membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_team')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      
      toast({
        title: "Membre supprimé",
        description: "Le membre a été retiré de l'équipe"
      });

      if (coordination?.id) {
        await loadTeamMembers(coordination.id);
      }

    } catch (error) {
      console.error('Erreur suppression membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Équipe du jour J</h2>
          <p className="text-gray-600">Gérez votre équipe et vos prestataires</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un membre
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nom du membre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Rôle ou fonction"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email de contact"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Numéro de téléphone"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select value={formData.type} onValueChange={(value: 'person' | 'vendor') => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">Personne</SelectItem>
                      <SelectItem value="vendor">Prestataire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes additionnelles"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddMember} disabled={!formData.name.trim()}>
                    Ajouter le membre
                  </Button>
                  <Button variant="outline" onClick={() => {
                    resetForm();
                    setShowAddMember(false);
                  }}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Membres de l'équipe</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <h3 className="font-medium">{member.name}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {member.role && (
                      <p className="text-sm text-gray-600">{member.role}</p>
                    )}
                    
                    {member.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    
                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3 text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}

                    <div className="flex gap-1 mt-2">
                      <Badge variant={member.type === 'vendor' ? 'default' : 'secondary'}>
                        {member.type === 'vendor' ? 'Prestataire' : 'Personne'}
                      </Badge>
                    </div>

                    {member.notes && (
                      <p className="text-xs text-gray-500 mt-2">{member.notes}</p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucun membre dans l'équipe</p>
              <p className="text-sm">Commencez par ajouter votre premier membre</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition de membre */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <Input
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  placeholder="Nom du membre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rôle</label>
                <Input
                  value={editingMember.role || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  placeholder="Rôle ou fonction"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    placeholder="Email de contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <Input
                    type="tel"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="Numéro de téléphone"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <Select value={editingMember.type} onValueChange={(value: 'person' | 'vendor') => setEditingMember({ ...editingMember, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="person">Personne</SelectItem>
                    <SelectItem value="vendor">Prestataire</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={editingMember.notes || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  placeholder="Notes additionnelles"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateMember}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setEditingMember(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MonJourMEquipe;
