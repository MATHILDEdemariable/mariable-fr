import { useState } from "react";
import { Share, Copy, Eye, Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AvantJourJShareButtonProps {
  checklistId?: string;
}

interface ShareToken {
  id: string;
  token: string;
  name: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export function AvantJourJShareButton({ checklistId }: AvantJourJShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<ShareToken[]>([]);
  const [newTokenName, setNewTokenName] = useState("");
  const { toast } = useToast();

  if (!checklistId) {
    return null;
  }

  const loadTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('avant_jour_j_share_tokens')
        .select('*')
        .eq('checklist_id', checklistId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des tokens:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les liens de partage",
        variant: "destructive",
      });
    }
  };

  const handleOpenDialog = () => {
    setIsOpen(true);
    loadTokens();
  };

  const generateShareToken = async () => {
    if (!newTokenName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour le lien",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = uuidv4();
      const { error } = await supabase
        .from('avant_jour_j_share_tokens')
        .insert({
          checklist_id: checklistId,
          token,
          name: newTokenName,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Lien de partage créé avec succès",
      });

      setNewTokenName("");
      await loadTokens();
    } catch (error) {
      console.error('Erreur lors de la création du token:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le lien de partage",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (token: string) => {
    const url = `${window.location.origin}/avant-jour-j-public/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers",
      });
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive",
      });
    }
  };

  const previewLink = (token: string) => {
    const url = `${window.location.origin}/avant-jour-j-public/${token}`;
    window.open(url, '_blank');
  };

  const toggleTokenStatus = async (tokenId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('avant_jour_j_share_tokens')
        .update({ is_active: !currentStatus })
        .eq('id', tokenId);

      if (error) throw error;
      await loadTokens();
      
      toast({
        title: "Succès",
        description: `Lien ${!currentStatus ? 'activé' : 'désactivé'}`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut",
        variant: "destructive",
      });
    }
  };

  const deleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('avant_jour_j_share_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;
      await loadTokens();
      
      toast({
        title: "Succès",
        description: "Lien supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleOpenDialog}>
          <Share className="h-4 w-4 mr-2" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Partager la checklist</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Créer un nouveau token */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Créer un nouveau lien de partage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Nom du lien (ex: Pour l'équipe)"
                value={newTokenName}
                onChange={(e) => setNewTokenName(e.target.value)}
              />
              <Button onClick={generateShareToken} disabled={isLoading} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Créer le lien
              </Button>
            </CardContent>
          </Card>

          {/* Liste des tokens existants */}
          {tokens.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Liens de partage existants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tokens.map((token) => (
                    <div key={token.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{token.name}</span>
                          <Badge variant={token.is_active ? "default" : "secondary"}>
                            {token.is_active ? "Actif" : "Inactif"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Créé le {new Date(token.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(token.token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => previewLink(token.token)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleTokenStatus(token.id, token.is_active)}
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteToken(token.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
            <p><strong>Mode public :</strong></p>
            <p>• Les personnes avec le lien peuvent consulter votre checklist en lecture seule</p>
            <p>• Aucune connexion n'est requise</p>
            <p>• Vous pouvez activer/désactiver ou supprimer les liens à tout moment</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}