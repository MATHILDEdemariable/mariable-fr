
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, User, Building, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  type: 'person' | 'vendor';
  prestataire_id?: string;
  notes?: string;
}

const MonJourMEquipe: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [coordinationId, setCoordinationId] = useState<string | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    type: 'person' as 'person' | 'vendor',
    notes: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer la coordination
      const { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (coordination) {
        setCoordinationId(coordination.id);
        await loadTeamMembers(coordination.id);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadTeamMembers = async (coordId: string) => {
    const { data, error } = await supabase
      .from('coordination_team')
      .select('*')
      .eq('coordination_id', coordId)
      .order('created_at');

    if (error) {
      console.error('Error loading team members:', error);
      return;
    }

    setTeamMembers(data || []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('coordination-team-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_team'
        },
        () => {
          if (coordinationId) {
            loadTeamMembers(coordinationId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const addMember = async () => {
    if (!coordinationId || !newMember.name.trim() || !newMember.role.trim()) {
      toast({
        title: "Erreur",
        description: "Nom et rôle sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('coordination_team')
        .insert({
          coordination_id: coordinationId,
          name: newMember.name,
          role: newMember.role,
          email: newMember.email || null,
          phone: newMember.phone || null,
          type: newMember.type,
          notes: newMember.notes || null
        });

      if (error) throw error;

      setNewMember({ name: '', role: '', email: '', phone: '', type: 'person', notes: '' });
      setShowAddMember(false);
      
      toast({
        title: "Membre ajouté",
        description: "Le nouveau membre a été ajouté à l'équipe"
      });
    } catch (error) {
      console.error('Error adding member:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive"
      });
    }
  };

  const updateMember = async () => {
    if (!editingMember) return;

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
    } catch (error) {
      console.error('Error updating member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le membre",
        variant: "destructive"
      });
    }
  };

  const deleteMember = async (memberId: string) => {
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
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
    }
  };

  const rolePresets = [
    'Témoin',
    'Demoiselle d\'honneur',
    'Garçon d\'honneur',
    'Père de la mariée',
    'Mère de la mariée',
    'Père du marié',
    'Mère du marié',
    'Photographe',
    'Vidéaste',
    'DJ/Musicien',
    'Fleuriste',
    'Traiteur',
    'Wedding Planner',
    'Officiant',
    'Coiffeur/Maquilleur'
  ];

  const MemberForm = ({ 
    member, 
    onSave, 
    onCancel 
  }: { 
    member: any, 
    onSave: () => void, 
    onCancel: () => void 
  }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom *</label>
          <Input
            value={member.name}
            onChange={(e) => {
              if (editingMember) {
                setEditingMember({ ...editingMember, name: e.target.value });
              } else {
                setNewMember({ ...newMember, name: e.target.value });
              }
            }}
            placeholder="Nom de la personne"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rôle *</label>
          <Select 
            value={member.role} 
            onValueChange={(value) => {
              if (editingMember) {
                setEditingMember({ ...editingMember, role: value });
              } else {
                setNewMember({ ...newMember, role: value });
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {rolePresets.map((role) => (
                <SelectItem key={role} value={role}>{role}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            value={member.email || ''}
            onChange={(e) => {
              if (editingMember) {
                setEditingMember({ ...editingMember, email: e.target.value });
              } else {
                setNewMember({ ...newMember, email: e.target.value });
              }
            }}
            placeholder="email@exemple.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Téléphone</label>
          <Input
            value={member.phone || ''}
            onChange={(e) => {
              if (editingMember) {
                setEditingMember({ ...editingMember, phone: e.target.value });
              } else {
                setNewMember({ ...newMember, phone: e.target.value });
              }
            }}
            placeholder="06 12 34 56 78"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select 
          value={member.type} 
          onValueChange={(value: 'person' | 'vendor') => {
            if (editingMember) {
              setEditingMember({ ...editingMember, type: value });
            } else {
              setNewMember({ ...newMember, type: value });
            }
          }}
        >
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
          value={member.notes || ''}
          onChange={(e) => {
            if (editingMember) {
              setEditingMember({ ...editingMember, notes: e.target.value });
            } else {
              setNewMember({ ...newMember, notes: e.target.value });
            }
          }}
          placeholder="Notes et informations complémentaires"
          rows={3}
        />
      </div>

      <div className="flex gap-2">
        <Button onClick={onSave}>
          {editingMember ? 'Modifier' : 'Ajouter'}
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>
    </div>
  );

  const people = teamMembers.filter(m => m.type === 'person');
  const vendors = teamMembers.filter(m => m.type === 'vendor');

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Équipe & Prestataires</h2>
          <p className="text-gray-600">Gérez toutes les personnes impliquées dans votre mariage</p>
        </div>
        
        <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Ajouter une personne
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un membre d'équipe</DialogTitle>
            </DialogHeader>
            <MemberForm 
              member={newMember}
              onSave={addMember}
              onCancel={() => setShowAddMember(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Section Personnes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personnes ({people.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {people.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {people.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant="outline" className="mt-1">
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
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
                        onClick={() => deleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.notes && (
                      <p className="text-xs mt-2 p-2 bg-gray-50 rounded">
                        {member.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune personne ajoutée</p>
              <p className="text-sm">Commencez par ajouter vos témoins et famille</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section Prestataires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Prestataires ({vendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {vendors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vendors.map((member) => (
                <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium">{member.name}</h3>
                      <Badge variant="outline" className="mt-1 bg-blue-50 text-blue-700">
                        {member.role}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
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
                        onClick={() => deleteMember(member.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.notes && (
                      <p className="text-xs mt-2 p-2 bg-gray-50 rounded">
                        {member.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun prestataire ajouté</p>
              <p className="text-sm">Ajoutez vos prestataires pour mieux organiser</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de modification */}
      <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le membre</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <MemberForm 
              member={editingMember}
              onSave={updateMember}
              onCancel={() => setEditingMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonJourMEquipe;
