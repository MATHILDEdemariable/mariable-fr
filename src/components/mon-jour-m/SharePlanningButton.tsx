
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PREDEFINED_ROLES } from '@/types/monjourm-mvp';
import { v4 as uuidv4 } from 'uuid';

interface SharePlanningButtonProps {
  coordinationId: string;
}

const SharePlanningButton: React.FC<SharePlanningButtonProps> = ({ coordinationId }) => {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateShareLink = async () => {
    try {
      setIsGenerating(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Générer un nouveau token
      const token = uuidv4();
      
      const { error: insertError } = await supabase
        .from('dashboard_share_tokens')
        .insert({
          token,
          user_id: sessionData.session.user.id,
          filter_role: selectedRole === 'all' ? null : selectedRole,
          expires_at: null, // Token permanent
          description: `Partage planning Mon Jour-M${selectedRole !== 'all' ? ` - ${selectedRole}` : ''}`,
          active: true
        });
      
      if (insertError) throw insertError;
      
      const shareUrl = `${window.location.origin}/planning/shared/${token}`;
      setShareLink(shareUrl);
      
      toast({
        title: "Lien généré avec succès",
        description: selectedRole !== 'all' 
          ? `Lien filtré pour le rôle "${selectedRole}"` 
          : "Lien pour toutes les tâches"
      });
    } catch (error) {
      console.error('❌ Erreur génération lien:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le lien de partage",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papier"
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const resetDialog = () => {
    setShareLink('');
    setSelectedRole('all');
    setIsCopied(false);
  };

  return (
    <>
      <Button 
        onClick={() => setOpen(true)} 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
      >
        <Share className="h-4 w-4" />
        Partager
      </Button>
      
      <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetDialog();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager le planning</DialogTitle>
            <DialogDescription>
              Créez un lien public en lecture seule pour partager votre planning Jour-M.
            </DialogDescription>
          </DialogHeader>
          
          {!shareLink ? (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="role-filter">Filtrer par rôle (optionnel)</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les tâches</SelectItem>
                    {PREDEFINED_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {selectedRole === 'all' 
                    ? "Le lien donnera accès à toutes les tâches du planning"
                    : `Le lien ne montrera que les tâches assignées au rôle "${selectedRole}"`
                  }
                </p>
              </div>
              
              <Button 
                onClick={generateShareLink} 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? "Génération..." : "Générer le lien"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="share-link">Lien de partage</Label>
                <div className="flex items-center space-x-2">
                  <Input 
                    id="share-link" 
                    value={shareLink} 
                    readOnly 
                    className="flex-1 text-xs"
                  />
                  <Button 
                    onClick={copyToClipboard} 
                    size="sm"
                    variant={isCopied ? "default" : "outline"}
                  >
                    {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {selectedRole !== 'all' 
                    ? `Lien filtré pour le rôle "${selectedRole}" - Version mobile et imprimable`
                    : "Lien pour toutes les tâches - Version mobile et imprimable"
                  }
                </p>
              </div>
              
              <Button 
                onClick={resetDialog} 
                variant="outline" 
                className="w-full"
              >
                Générer un nouveau lien
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SharePlanningButton;
