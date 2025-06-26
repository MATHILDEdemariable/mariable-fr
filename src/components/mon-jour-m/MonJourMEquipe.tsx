
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Trash2, Mail, Phone, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  contact_info?: string;
  email?: string;
  phone?: string;
  notes?: string;
  coordination_id: string;
  created_at: string;
}

const MonJourMEquipe: React.FC = () => {
  const { coordination, isLoading: coordinationLoading, forceRefreshAfterMutation } = useWeddingCoordination();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'famille',
    email: '',
    phone: '',
    notes: ''
  });
  const { toast } = useToast();

  const roles = [
    { value: 'famille', label: 'Famille', color: 'bg-blue-100 text-blue-800' },
    { value: 'amis', label: 'Amis', color: 'bg-green-100 text-green-800' },
    { value: 'photographe', label: 'Photographe', color: 'bg-purple-100 text-purple-800' },
    { value: 'traiteur', label: 'Traiteur', color: 'bg-orange-100 text-orange-800' },
    { value: 'dj', label: 'DJ/Musicien', color: 'bg-pink-100 text-pink-800' },
    { value: 'fleuriste', label: 'Fleuriste', color: 'bg-rose-100 text-rose-800' },
    { value: 'coordinateur', label: 'Coordinateur', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'autre', label: 'Autre', color: 'bg-gray-100 text-gray-800' }
  ];

  useEffect(() => {
    if (coordination?.id) {
      loadTeamMembers(coordination.id);
    }
  }, [coordination?.id]);

  const loadTeamMembers = async (coordId: string) => {
    console.log('👥 Loading team members for coordination:', coordId);
    setIsLoadingMembers(true);
    
    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading team members:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger l'équipe",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Loaded team members:', data);
      setTeamMembers(data || []);
    } catch (error) {
      console.error('❌ Error in loadTeamMembers:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement",
        variant: "destructive"
      });
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const handleRefresh = async () => {
    if (!coordination?.id) return;
    
    setIsRefreshing(true);
    try {
      await Promise.all([
        forceRefreshAfterMutation(),
        loadTeamMembers(coordination.id)
      ]);
      toast({
        title: "Données actualisées", 
        description: "L'équipe a été rechargée avec succès"
      });
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleAddMember = async () => {
    if (!coordination?.id || !newMember.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir au moins le nom",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('➕ Adding new team member:', newMember);
      
      const { error } = await supabase
        .from('coordination_team')
        .insert({
          coordination_id: coordination.id,
          name: newMember.name,
          role: newMember.role,
          email: newMember.email || null,
          phone: newMember.phone || null,
          notes: newMember.notes || null
        });

      if (error) throw error;

      toast({
        title: "Membre ajouté",
        description: "Le membre a été ajouté à l'équipe avec succès"
      });

      // Réinitialiser le formulaire
      setNewMember({
        name: '',
        role: 'famille',
        email: '',
        phone: '',
        notes: ''
      });
      setShowAddMember(false);

      // Forcer le rechargement des données
      await loadTeamMembers(coordination.id);
      await forceRefreshAfterMutation();
    } catch (error) {
      console.error('❌ Error adding team member:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
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

      // Forcer le rechargement
      if (coordination?.id) {
        await loadTeamMembers(coordination.id);
        await forceRefreshAfterMutation();
      }
    } catch (error) {
      console.error('❌ Error deleting team member:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
    }
  };

  const getRoleStyle = (role: string) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo ? roleInfo.color : 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role: string) => {
    const roleInfo = roles.find(r => r.value === role);
    return roleInfo ? roleInfo.label : role;
  };

  if (coordinationLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Initialisation...</span>
      </div>
    );
  }

  if (!coordination) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Impossible d'initialiser votre espace</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton refresh et ajout */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Mon Équipe</h2>
          <p className="text-gray-600">Gérez les personnes impliquées dans votre mariage</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>

          <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un membre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un membre à l'équipe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <Input
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="Nom de la personne"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Rôle</label>
                  <Select value={newMember.role} onValueChange={(value) => setNewMember({ ...newMember, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      type="tel"
                      value={newMember.phone}
                      onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    value={newMember.notes}
                    onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                    placeholder="Notes sur cette personne"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddMember}>
                    Ajouter
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddMember(false)}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoadingMembers ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-olive"></div>
          <span className="ml-3">Chargement de l'équipe...</span>
        </div>
      ) : (
        /* Liste de l'équipe */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{member.name}</h3>
                    <Badge className={`${getRoleStyle(member.role)} mt-1`}>
                      {getRoleLabel(member.role)}
                    </Badge>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMember(member.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  )}
                  
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  
                  {member.notes && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {member.notes}
                    </p>
                  )}
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Ajouté le {new Date(member.created_at).toLocaleDateString('fr-FR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {teamMembers.length === 0 && !isLoadingMembers && (
        <div className="text-center py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucun membre dans l'équipe</p>
          <p className="text-sm">Commencez par ajouter les personnes impliquées</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMEquipe;
