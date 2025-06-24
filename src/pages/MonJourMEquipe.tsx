
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Users, Mail, Phone, Trash2, UserCheck } from 'lucide-react';
import { useCoordination } from '@/hooks/useCoordination';
import { useToast } from '@/hooks/use-toast';

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
    if (!coordination || !newMember.name.trim()) return;

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

  const getTypeIcon = (type: string) => {
    return type === 'vendor' ? UserCheck : Users;
  };

  const getTypeBadge = (type: string) => {
    return type === 'vendor' ? 
      <Badge variant="outline" className="bg-blue-50 text-blue-700">Prestataire</Badge> :
      <Badge variant="outline" className="bg-green-50 text-green-700">Personne</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Équipe du Jour-M</h2>
          <p className="text-sm text-gray-600">
            {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''} dans votre équipe
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un membre
        </Button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau membre d'équipe</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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
            <div className="grid grid-cols-2 gap-4">
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
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddMember}>
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des membres */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {teamMembers.map((member) => {
          const IconComponent = getTypeIcon(member.type);
          return (
            <Card key={member.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-wedding-olive" />
                    <h3 className="font-medium">{member.name}</h3>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{member.role}</Badge>
                    {getTypeBadge(member.type)}
                  </div>
                  
                  {member.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      <a href={`mailto:${member.email}`} className="hover:text-wedding-olive">
                        {member.email}
                      </a>
                    </div>
                  )}
                  
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-3 w-3" />
                      <a href={`tel:${member.phone}`} className="hover:text-wedding-olive">
                        {member.phone}
                      </a>
                    </div>
                  )}
                  
                  {member.notes && (
                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
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
        <div className="text-center py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun membre dans votre équipe</p>
          <p className="text-sm">Ajoutez les personnes et prestataires qui vous aideront le jour J</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMEquipe;
