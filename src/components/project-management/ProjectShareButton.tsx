import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Copy, Share, Check, Eye, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';

interface ShareToken {
  id: string;
  token: string;
  name: string;
  is_active: boolean;
  expires_at?: string;
  created_at: string;
}

const ProjectShareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareTokens, setShareTokens] = useState<ShareToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  const { coordination } = useProjectCoordination();

  // Charger les tokens existants
  const loadShareTokens = async () => {
    if (!coordination?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('planning_share_tokens')
        .select('*')
        .eq('coordination_id', coordination.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShareTokens(data || []);
    } catch (error) {
      console.error('Erreur chargement tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les liens de partage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau token
  const createShareToken = async () => {
    if (!coordination?.id) return;

    try {
      const newToken = crypto.randomUUID();
      const { error } = await supabase
        .from('planning_share_tokens')
        .insert({
          coordination_id: coordination.id,
          token: newToken,
          name: `Partage Mission Mariage - ${new Date().toLocaleDateString('fr-FR')}`,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Lien créé",
        description: "Nouveau lien de partage généré avec succès"
      });

      await loadShareTokens();
    } catch (error) {
      console.error('Erreur création token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le lien de partage",
        variant: "destructive"
      });
    }
  };

  // Supprimer un token
  const deleteToken = async (tokenId: string) => {
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
      console.error('Erreur suppression token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien",
        variant: "destructive"
      });
    }
  };

  // Copier le lien
  const copyLink = async (token: string) => {
    const publicUrl = `${window.location.origin}/planning-public/project/${token}`;
    
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(token);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans le presse-papiers"
      });
      
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  // Prévisualiser le lien
  const previewLink = (token: string) => {
    const publicUrl = `${window.location.origin}/planning-public/project/${token}`;
    window.open(publicUrl, '_blank');
  };

  // Charger les tokens quand le modal s'ouvre
  React.useEffect(() => {
    if (isOpen && coordination?.id) {
      loadShareTokens();
    }
  }, [isOpen, coordination?.id]);

  if (!coordination) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)} 
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Partager
      </Button>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Partager la Mission Mariage</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Mode public :</strong> Les liens de partage permettent de consulter vos tâches en lecture seule, sans connexion requise.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Liens de partage</h3>
            <Button 
              onClick={createShareToken} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau lien
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : shareTokens.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Share className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun lien de partage créé</p>
              <p className="text-sm">Créez votre premier lien pour partager vos tâches</p>
            </div>
          ) : (
            <div className="space-y-3">
              {shareTokens.map((token) => (
                <div key={token.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{token.name}</h4>
                      <Badge variant={token.is_active ? "default" : "secondary"}>
                        {token.is_active ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteToken(token.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Input
                      value={`${window.location.origin}/planning-public/project/${token.token}`}
                      readOnly
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => copyLink(token.token)}
                      className="flex items-center gap-1"
                    >
                      {copied === token.token ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      {copied === token.token ? 'Copié' : 'Copier'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => previewLink(token.token)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Créé le {new Date(token.created_at).toLocaleDateString('fr-FR')} à {new Date(token.created_at).toLocaleTimeString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectShareButton;