
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Mail, Phone, Trash2, UserCheck } from 'lucide-react';
import { useCoordination } from '@/hooks/useCoordination';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MonJourMEquipe = () => {
  const { coordination, teamMembers, addTeamMember } = useCoordination();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    type: 'person' as const,
    email: '',
    phone: '',
    notes: ''
  });
  const { toast } = useToast();

  const roles = [
    'Témoin',
    'Demoiselle d\'honneur',
    'Garçon d\'honneur',
    'Organisateur',
    'Photographe',
    'Vidéaste',
    'Officiant',
    'Musicien',
    'Traiteur',
    'Fleuriste',
    'Autre'
  ];

  const handleAddMember = async () => {
    if (!coordination || !newMember.name.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour le membre",
        variant: "destructive"
      });
      return;
    }

    if (!newMember.role.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un rôle pour le membre",
        variant: "destructive"
      });
      return;
    }

    try {
      await addTeamMember({
        coordination_id: coordination.id,
        name: newMember.name,
        role: newMember.role,
        type: newMember.type,
        email: newMember.email || null,
        phone: newMember.phone || null,
        notes: newMember.notes || null,
        prestataire_id: null
      });

      setNewMember({
        name: '',
        role: '',
        type: 'person',
        email: '',
        phone: '',
        notes: ''
      });
      setShowAddForm(false);

      toast({
        title: "Membre ajouté",
        description: "Le membre a été ajouté à votre équipe"
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du membre:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le membre",
        variant: "destructive"
      });
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre de l\'équipe ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_team')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: "Membre supprimé",
        description: "Le membre a été retiré de votre équipe"
      });

      // Recharger les données
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive"
      });
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'vendor' ? UserCheck : Users;
  };

  const getTypeBadge = (type: string) => {
    return type === 'vendor' ? 
      <Badge variant="outline" className="bg-blue-50 text-blue-700">Prestataire</Badge> :
      <Badge variant="outline" className="bg-green-50 text-green-700">Personne</Badge>;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Actions responsive */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Équipe du Jour-M</h2>
          <p className="text-sm text-gray-600">
            {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''} dans votre équipe
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Formulaire d'ajout responsive */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau membre d'équipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nom complet"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
              />
              <Input
                placeholder="Rôle"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                list="roles"
              />
              <datalist id="roles">
                {roles.map(role => (
                  <option key={role} value={role} />
                ))}
              </datalist>
            </div>
            <Select value={newMember.type} onValueChange={(value: any) => setNewMember({...newMember, type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="person">Personne</SelectItem>
                <SelectItem value="vendor">Prestataire</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="Email (optionnel)"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
              />
              <Input
                type="tel"
                placeholder="Téléphone (optionnel)"
                value={newMember.phone}
                onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
              />
            </div>
            <Input
              placeholder="Notes (optionnel)"
              value={newMember.notes}
              onChange={(e) => setNewMember({...newMember, notes: e.target.value})}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button onClick={handleAddMember} className="w-full sm:w-auto">
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des membres responsive */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => {
          const IconComponent = getTypeIcon(member.type);
          return (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <IconComponent className="h-5 w-5 text-wedding-olive flex-shrink-0" />
                    <h3 className="font-medium truncate">{member.name}</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 flex-shrink-0"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{member.role}</Badge>
                    {getTypeBadge(member.type)}
                  </div>
                  
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3 flex-shrink-0" />
                      <a 
                        href={`mailto:${member.email}`} 
                        className="hover:text-wedding-olive truncate"
                      >
                        {member.email}
                      </a>
                    </div>
                  )}
                  
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <a 
                        href={`tel:${member.phone}`} 
                        className="hover:text-wedding-olive"
                      >
                        {member.phone}
                      </a>
                    </div>
                  )}
                  
                  {member.notes && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded break-words">
                      {member.notes}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {teamMembers.length === 0 && (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-base md:text-lg">Aucun membre dans votre équipe</p>
          <p className="text-sm">Ajoutez les personnes et prestataires qui vous aideront le jour J</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMEquipe;
