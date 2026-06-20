import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, Mail, Phone, Building2, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TeamMember, WeddingCoordination } from '@/types/monjourm-mvp';
import SharePublicButton from './SharePublicButton';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';
import BulkAddTeamModal from './BulkAddTeamModal';

// Rôles spécifiques au mariage
const TEAM_ROLES = [
  'Mariés',
  'Témoins', 
  'Amis',
  'Famille',
  'Co-organisateur',
  'Prestataires : Lieux',
  'Prestataires : Traiteur',
  'Prestataires : Coordinateur',
  'Prestataires : Photographe',
  'Autre prestataire',
  'Autre personne'
];

interface SimpleTeamManagerProps {
  coordination: WeddingCoordination;
}

const SimpleTeamManager: React.FC<SimpleTeamManagerProps> = ({ coordination }) => {
  const { t } = useTranslation('monJourM');
  const { toast } = useToast();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
  });

  const translateRole = (role: string) => t(`team.roles.${role}`, role);

  // Premium action hooks
  const addMemberAction = usePremiumAction({
    feature: t('team.premium.addFeature'),
    description: t('team.premium.addDesc')
  });

  const editMemberAction = usePremiumAction({
    feature: t('team.premium.editFeature'),
    description: t('team.premium.editDesc')
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
        title: t('team.toasts.error'),
        description: t('team.toasts.loadError'),
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
        title: t('team.toasts.error'),
        description: t('team.toasts.nameRoleRequired'),
        variant: "destructive"
      });
      return;
    }

    // Intercepter l'action avec le hook premium
    addMemberAction.executeAction(async () => {
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
            type: formData.role.startsWith('Prestataires :') || formData.role === 'Autre prestataire' ? 'vendor' : 'person'
          });

        if (error) throw error;

        toast({
          title: t('team.toasts.success'),
          description: t('team.toasts.added')
        });

        resetForm();
        setShowAddModal(false);
        await loadTeamMembers();
      } catch (error) {
        console.error('Erreur ajout membre:', error);
        toast({
          title: t('team.toasts.error'),
          description: t('team.toasts.addError'),
          variant: "destructive"
        });
      }
    });
  };

  const handleUpdateMember = async () => {
    if (!editingMember || !editingMember.name.trim() || !editingMember.role.trim()) {
      toast({
        title: t('team.toasts.error'),
        description: t('team.toasts.nameRoleRequired'),
        variant: "destructive"
      });
      return;
    }

    // Intercepter l'action avec le hook premium
    editMemberAction.executeAction(async () => {
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
          title: t('team.toasts.success'),
          description: t('team.toasts.updated')
        });

        setEditingMember(null);
        await loadTeamMembers();
      } catch (error) {
        console.error('Erreur modification membre:', error);
        toast({
          title: t('team.toasts.error'),
          description: t('team.toasts.updateError'),
          variant: "destructive"
        });
      }
    });
  };

  // Supprimer un membre
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm(t('team.deleteConfirm'))) return;

    try {
      const { error } = await supabase
        .from('coordination_team')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: t('team.toasts.success'),
        description: t('team.toasts.deleted')
      });

      await loadTeamMembers();
    } catch (error) {
      console.error('Erreur suppression membre:', error);
      toast({
        title: t('team.toasts.error'),
        description: t('team.toasts.deleteError'),
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
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">{t('team.title')}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {t('team.intro')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('team.subtitle')}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <SharePublicButton coordinationId={coordination.id} />
            <Button variant="outline" onClick={() => setShowBulkModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('team.bulkAdd')}
            </Button>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('team.addMember')}
            </Button>
          </div>
        </div>

        <BulkAddTeamModal
          open={showBulkModal}
          onOpenChange={setShowBulkModal}
          coordinationId={coordination.id}
          onAdded={loadTeamMembers}
        />

        {/* Liste des membres */}
        {teamMembers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">{t('team.empty.title')}</h3>
              <p className="text-muted-foreground mb-4">
                {t('team.empty.desc')}
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t('team.addMember')}
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
                       <div className="flex items-center gap-2 mb-2">
                         <Badge variant="secondary" className="flex items-center gap-1">
                           {(member.role.startsWith('Prestataires :') || member.role === 'Autre prestataire') ? (
                             <Building2 className="h-3 w-3" />
                           ) : (
                             <User className="h-3 w-3" />
                           )}
                           {translateRole(member.role)}
                         </Badge>
                       </div>
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
              <DialogTitle>{t('team.modal.newTitle')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('team.modal.nameLabel')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t('team.modal.namePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="role">{t('team.modal.roleLabel')}</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('team.modal.rolePlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAM_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>{translateRole(role)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email">{t('team.modal.emailLabel')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="marie@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">{t('team.modal.phoneLabel')}</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder={t('team.modal.phonePlaceholder')}
                />
              </div>

              <div>
                <Label htmlFor="notes">{t('team.modal.notesLabel')}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t('team.modal.notesPlaceholder')}
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddMember} 
                  disabled={!formData.name.trim() || !formData.role.trim()}
                >
                  {t('team.modal.add')}
                </Button>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}>
                  {t('team.modal.cancel')}
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
                <DialogTitle>{t('team.modal.editTitle')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">{t('team.modal.nameLabel')}</Label>
                  <Input
                    id="edit-name"
                    value={editingMember.name}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-role">{t('team.modal.roleLabel')}</Label>
                  <Select 
                    value={editingMember.role} 
                    onValueChange={(value) => setEditingMember({ ...editingMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TEAM_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>{translateRole(role)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-email">{t('team.modal.emailLabel')}</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingMember.email || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-phone">{t('team.modal.phoneLabel')}</Label>
                  <Input
                    id="edit-phone"
                    value={editingMember.phone || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="edit-notes">{t('team.modal.notesLabel')}</Label>
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
                    {t('team.modal.save')}
                  </Button>
                  <Button variant="outline" onClick={() => setEditingMember(null)}>
                    {t('team.modal.cancel')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Modals Premium */}
      <PremiumModal
        isOpen={addMemberAction.showPremiumModal}
        onClose={addMemberAction.closePremiumModal}
        feature={addMemberAction.feature}
        description={addMemberAction.description}
      />

      <PremiumModal
        isOpen={editMemberAction.showPremiumModal}
        onClose={editMemberAction.closePremiumModal}
        feature={editMemberAction.feature}
        description={editMemberAction.description}
      />
    </>
  );
};

export default SimpleTeamManager;
