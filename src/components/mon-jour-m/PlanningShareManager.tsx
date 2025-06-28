
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Share2, Link, Copy, Trash2, Plus, Users, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { WeddingCoordination } from '@/types/monjourm-mvp';
import { PlanningShareToken } from '@/types/planningShare';
import { v4 as uuidv4 } from 'uuid';

interface PlanningShareManagerProps {
  coordination: WeddingCoordination;
  availableRoles: string[];
}

const PlanningShareManager: React.FC<PlanningShareManagerProps> = ({
  coordination,
  availableRoles
}) => {
  const { toast } = useToast();
  const [shareTokens, setShareTokens] = useState<PlanningShareToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    roles_filter: [] as string[],
    expires_in_days: 30
  });

  useEffect(() => {
    loadShareTokens();
  }, [coordination.id]);

  const loadShareTokens = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('planning_share_tokens')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convertir les données Supabase vers notre interface
      const convertedTokens: PlanningShareToken[] = (data || []).map(token => ({
        id: token.id,
        coordination_id: token.coordination_id,
        token: token.token,
        name: token.name,
        roles_filter: Array.isArray(token.roles_filter) ? token.roles_filter as string[] : null,
        expires_at: token.expires_at,
        is_active: token.is_active,
        created_at: token.created_at,
        updated_at: token.updated_at
      }));

      setShareTokens(convertedTokens);
    } catch (error) {
      console.error('❌ Erreur chargement tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les liens de partage",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createShareToken = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Erreur",
        description: "Le nom du partage est obligatoire",
        variant: "destructive"
      });
      return;
    }

    try {
      const token = uuidv4();
      const expiresAt = formData.expires_in_days > 0 
        ? new Date(Date.now() + formData.expires_in_days * 24 * 60 * 60 * 1000).toISOString()
        : null;

      const { data, error } = await supabase
        .from('planning_share_tokens')
        .insert({
          coordination_id: coordination.id,
          token,
          name: formData.name,
          roles_filter: formData.roles_filter.length > 0 ? formData.roles_filter : null,
          expires_at: expiresAt,
          is_active: true
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Lien créé",
        description: "Le lien de partage a été créé avec succès"
      });

      setFormData({ name: '', roles_filter: [], expires_in_days: 30 });
      setShowCreateModal(false);
      await loadShareTokens();
    } catch (error) {
      console.error('❌ Erreur création token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le lien de partage",
        variant: "destructive"
      });
    }
  };

  const copyShareLink = (token: string) => {
    const url = `${window.location.origin}/planning-partage/${token}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Lien copié",
      description: "Le lien de partage a été copié dans le presse-papiers"
    });
  };

  const toggleTokenStatus = async (tokenId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('planning_share_tokens')
        .update({ is_active: !isActive })
        .eq('id', tokenId);

      if (error) throw error;

      toast({
        title: isActive ? "Lien désactivé" : "Lien activé",
        description: `Le lien de partage a été ${isActive ? 'désactivé' : 'activé'}`
      });

      await loadShareTokens();
    } catch (error) {
      console.error('❌ Erreur toggle token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du lien",
        variant: "destructive"
      });
    }
  };

  const deleteToken = async (tokenId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce lien de partage ?')) return;

    try {
      const { error } = await supabase
        .from('planning_share_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      toast({
        title: "Lien supprimé",
        description: "Le lien de partage a été supprimé"
      });

      await loadShareTokens();
    } catch (error) {
      console.error('❌ Erreur suppression token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Partage du planning
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Créez des liens pour partager votre planning avec vos proches
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau lien
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-olive mx-auto"></div>
          </div>
        ) : shareTokens.length === 0 ? (
          <div className="text-center py-8">
            <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun lien de partage</h3>
            <p className="text-gray-500 mb-4">
              Créez votre premier lien pour partager votre planning
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un lien
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {shareTokens.map((shareToken) => (
              <div key={shareToken.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{shareToken.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={shareToken.is_active ? "default" : "secondary"}>
                        {shareToken.is_active ? 'Actif' : 'Inactif'}
                      </Badge>
                      {shareToken.expires_at && (
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          Expire le {new Date(shareToken.expires_at).toLocaleDateString('fr-FR')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyShareLink(shareToken.token)}
                      disabled={!shareToken.is_active}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleTokenStatus(shareToken.id, shareToken.is_active)}
                    >
                      {shareToken.is_active ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteToken(shareToken.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {shareToken.roles_filter && shareToken.roles_filter.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">Filtré pour:</span>
                    <div className="flex gap-1">
                      {shareToken.roles_filter.map((role) => (
                        <Badge key={role} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Modal de création */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un lien de partage</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="share-name">Nom du partage *</Label>
              <Input
                id="share-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Planning pour les témoins"
              />
            </div>

            <div>
              <Label htmlFor="roles-filter">Filtrer par rôles (optionnel)</Label>
              <Select
                value={formData.roles_filter.length > 0 ? formData.roles_filter[0] : ""}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  roles_filter: value ? [value] : [] 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les rôles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous les rôles</SelectItem>
                  {availableRoles.map((role) => (
                    <SelectItem key={role} value={role}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="expires-days">Expiration (jours)</Label>
              <Select
                value={formData.expires_in_days.toString()}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  expires_in_days: parseInt(value) 
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="90">90 jours</SelectItem>
                  <SelectItem value="0">Jamais</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={createShareToken} disabled={!formData.name.trim()}>
                Créer le lien
              </Button>
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PlanningShareManager;
