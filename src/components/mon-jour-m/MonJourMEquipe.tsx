
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, User, Building, Phone, Mail, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMonJourM } from '@/contexts/MonJourMContext';

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
  const { 
    coordination, 
    teamMembers, 
    isLoading, 
    isInitializing, 
    refreshData, 
    addTeamMember, 
    updateTeamMember, 
    deleteTeamMember 
  } = useMonJourM();

  const [showAddMember, setShowAddMember] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    type: 'person' as 'person' | 'vendor',
    notes: ''
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshData();
    } finally {
      setIsRefreshing(false);
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
    if (!formData.name.trim()) {
      console.error('Member name is required');
      return;
    }

    console.log('Attempting to add member:', formData);
    const success = await addTeamMember({
      name: formData.name,
      role: formData.role || 'Membre',
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      notes: formData.notes
    });

    if (success) {
      resetForm();
      setShowAddMember(false);
    }
  };

  const handleUpdateMember = async () => {
    if (!editingMember) return;

    const success = await updateTeamMember(editingMember);
    if (success) {
      setEditingMember(null);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
      await deleteTeamMember(memberId);
    }
  };

  const getSubRoleOptions = (type: 'person' | 'vendor') => {
    if (type === 'person') {
      return [
        'Témoin',
        'Demoiselle d\'honneur',
        'Garçon d\'honneur',
        'Père de la mariée',
        'Mère de la mariée',
        'Père du marié',
        'Mère du marié',
        'Famille',
        'Ami(e)',
        'Autre'
      ];
    } else {
      return [
        'Photographe',
        'Vidéaste',
        'DJ/Musicien',
        'Fleuriste',
        'Traiteur',
        'Wedding Planner',
        'Officiant',
        'Coiffeur/Maquilleur',
        'Décorateur',
        'Autre prestataire'
      ];
    }
  };

  if (isInitializing) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Initialisation de votre espace...</span>
      </div>
    );
  }

  if (!coordination) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Impossible d'initialiser votre espace Mon Jour-M</p>
        <Button onClick={handleRefresh} className="mt-4" variant="outline">
          Réessayer
        </Button>
      </div>
    );
  }

  const people = teamMembers.filter(m => m.type === 'person');
  const vendors = teamMembers.filter(m => m.type === 'vendor');

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton refresh */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Équipe & Prestataires</h2>
          <p className="text-gray-600">Gérez toutes les personnes impliquées dans votre mariage</p>
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
                Ajouter une personne
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un membre d'équipe</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nom *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nom de la personne"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: 'person' | 'vendor') => setFormData({ ...formData, type: value, role: '' })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="person">👤 Personne</SelectItem>
                        <SelectItem value="vendor">🏢 Prestataire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Rôle spécifique</label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un rôle (optionnel)" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubRoleOptions(formData.type).map((role) => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemple.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Notes et informations complémentaires"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddMember} disabled={!formData.name.trim()}>
                    Ajouter
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

      {isLoading ? (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-olive"></div>
          <span className="ml-3">Chargement de l'équipe...</span>
        </div>
      ) : (
        <div className="space-y-6">
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
                          {member.role && (
                            <Badge variant="outline" className="mt-1">
                              {member.role}
                            </Badge>
                          )}
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
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune personne dans l'équipe</p>
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
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600">
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
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun prestataire dans l'équipe</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal d'édition */}
      {editingMember && (
        <Dialog open={!!editingMember} onOpenChange={() => setEditingMember(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modifier le membre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom *</label>
                  <Input
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    placeholder="Nom de la personne"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type *</label>
                  <Select 
                    value={editingMember.type} 
                    onValueChange={(value: 'person' | 'vendor') => setEditingMember({ ...editingMember, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="person">👤 Personne</SelectItem>
                      <SelectItem value="vendor">🏢 Prestataire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rôle spécifique</label>
                <Select 
                  value={editingMember.role} 
                  onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubRoleOptions(editingMember.type).map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                    placeholder="email@exemple.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <Input
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <Textarea
                  value={editingMember.notes || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, notes: e.target.value })}
                  placeholder="Notes et informations complémentaires"
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
