import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, ExternalLink, Eye, EyeOff, Trash2, Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ApresJourJShareButtonProps {
  checklistId: string;
}

interface ShareToken {
  id: string;
  token: string;
  name: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

export const ApresJourJShareButton: React.FC<ApresJourJShareButtonProps> = ({ checklistId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [newTokenName, setNewTokenName] = useState('');
  const { toast } = useToast();

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('apres_jour_j_share_tokens')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tokens:', error);
    }
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    loadTokens();
  };

  const generateShareToken = async () => {
    if (!newTokenName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez donner un nom au lien de partage.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = `apres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('apres_jour_j_share_tokens')
        .insert([{
          checklist_id: checklistId,
          name: newTokenName.trim(),
          token: token,
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setNewTokenName('');
      await loadTokens();
      
      toast({
        title: "Lien créé !",
        description: "Votre lien de partage a été généré avec succès.",
      });

    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le lien de partage.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (token: string) => {
    const url = `${window.location.origin}/apres-jour-j-public/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié !",
        description: "Le lien a été copié dans votre presse-papier.",
      });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  const previewLink = (token: string) => {
    const url = `${window.location.origin}/apres-jour-j-public/${token}`;
    window.open(url, '_blank');
  };

  const toggleTokenStatus = async (tokenId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('apres_jour_j_share_tokens')
        .update({ is_active: !currentStatus })
        .eq('id', tokenId);

      if (error) throw error;

      await loadTokens();
      
      toast({
        title: !currentStatus ? "Lien activé" : "Lien désactivé",
        description: `Le lien de partage a été ${!currentStatus ? 'activé' : 'désactivé'}.`,
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du lien.",
        variant: "destructive",
      });
    }
  };

  const deleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('apres_jour_j_share_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      await loadTokens();
      
      toast({
        title: "Lien supprimé",
        description: "Le lien de partage a été supprimé définitivement.",
      });

    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpenDialog}>
          <Share2 className="mr-2 h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Partager votre checklist après le jour-J</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Créer un nouveau lien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Nom du lien (ex: Famille, Témoins...)"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                />
                <Button 
                  onClick={generateShareToken}
                  disabled={isLoading || !newTokenName.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Créez un lien pour permettre à d'autres personnes de consulter votre checklist en mode lecture seule.
              </p>
            </CardContent>
          </Card>

          {tokens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Liens existants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{token.name}</span>
                        <Badge variant={token.is_active ? "default" : "secondary"}>
                          {token.is_active ? "Actif" : "Inactif"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Créé le {format(new Date(token.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(token.token)}
                        title="Copier le lien"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => previewLink(token.token)}
                        title="Prévisualiser"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleTokenStatus(token.id, token.is_active)}
                        title={token.is_active ? "Désactiver" : "Activer"}
                      >
                        {token.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteToken(token.id)}
                        title="Supprimer"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
            <p><strong>Mode consultation publique :</strong></p>
            <p>Les personnes avec le lien pourront voir votre checklist en lecture seule. Elles ne pourront pas modifier ou cocher les tâches.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};