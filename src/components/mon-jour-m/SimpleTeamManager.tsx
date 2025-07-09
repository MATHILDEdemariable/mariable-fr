
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TeamMember, WeddingCoordination } from '@/types/monjourm-mvp';
import SharePublicButton from './SharePublicButton';

// Mêmes rôles que dans Mission Mariage pour la cohérence
const TEAM_ROLES = [
  'Organisateur principal',
  'Co-organisateur',
  'Responsable budget',
  'Responsable prestataires',
  'Responsable logistique',
  'Responsable communication',
  'Responsable administratif',
  'Assistant',
  'Famille proche',
  'Ami(e) de confiance',
  'Autre'
];

interface SimpleTeamManagerProps {
  coordination: WeddingCoordination;
}

const SimpleTeamManager: React.FC<SimpleTeamManagerProps> = ({ coordination }) => {
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Charger les membres de l'équipe
  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('created_at');

      if (error) throw error;

      const mappedData: TeamMember[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        notes: item.notes
      }));

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'équipe",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coordination?.id) {
      loadTeamMembers();
    }
  }, [coordination?.id]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      notes: ''
    });
  };

  // Ajouter un membre
  const handleAddMember = async () => {
    if (!formData.name.trim() || !formData.role.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le rôle sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('coordination_team')
        .insert({
          coordination_id: coordination.id,
          name: formData.name,
          role: formData.role,
          email: formData.email || null,
          phone: formData.phone || null,
          notes: formData.notes || null,
          type: 'person'
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Membre ajouté avec succès"
      });

      resetForm();
      setShowAddModal(false);
      await loadTeamMembers();
    } catch (error) {
      console.error('Erreur ajout membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive"
      });
    }
  };

  // Modifier un membre
  const handleUpdateMember = async () => {
    if (!editingMember || !editingMember.name.trim() || !editingMember.role.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom et le rôle sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('coordination_team')
        .update({
          name: editingMember.name,
          role: editingMember.role,
          email: editingMember.email || null,
          phone: editingMember.phone || null,
          notes: editingMember.notes || null
        })
        .eq('id', editingMember.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Membre modifié avec succès"
      });

      setEditingMember(null);
      await loadTeamMembers();
    } catch (error) {
      console.error('Erreur modification membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre",
        variant: "destructive"
      });
    }
  };

  // Supprimer un membre
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_team')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Membre supprimé avec succès"
      });

      await loadTeamMembers();
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
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Équipe du Jour J</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Créez votre équipe, faites votre planning, enregistrez les documents et partagez.
          </p>
          <p className="text-sm text-muted-foreground">
            Gérez votre équipe et leurs rôles
          </p>
        </div>
        <div className="flex gap-2">
          <SharePublicButton coordinationId={coordination.id} />
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un membre
          </Button>
        </div>
      </div>

      {/* Liste des membres */}
      {teamMembers.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun membre dans l'équipe</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par ajouter les personnes clés de votre mariage
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un membre
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {teamMembers.map((member) => (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <h4 className="font-medium mb-1">{member.name}</h4>
                    <Badge variant="secondary" className="mb-2">
                      {member.role}
                    </Badge>
                    {member.notes && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {member.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingMember(member)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteMember(member.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal d'ajout */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nouveau membre</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nom *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Marie Dupont"
              />
            </div>

            <div>
              <Label htmlFor="role">Rôle *</Label>
              <Select 
                value={formData.role} 
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="marie@example.com"
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="06 12 34 56 78"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Informations supplémentaires..."
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleAddMember} 
                disabled={!formData.name.trim() || !formData.role.trim()}
              >
                Ajouter
              </Button>
              <Button variant="outline" onClick={() => {
                resetForm();
                setShowAddModal(false);
              }}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Modifier le membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Nom *</Label>
                <Input
                  id="edit-name"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-role">Rôle *</Label>
                <Select 
                  value={editingMember.role} 
                  onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editingMember.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={editingMember.phone || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingMember.notes || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleUpdateMember} 
                  disabled={!editingMember.name.trim() || !editingMember.role.trim()}
                >
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

export default SimpleTeamManager;
