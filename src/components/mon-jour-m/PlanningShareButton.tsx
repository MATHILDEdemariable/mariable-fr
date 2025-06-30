
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface PlanningShareButtonProps {
  coordinationId: string;
}

const PlanningShareButton: React.FC<PlanningShareButtonProps> = ({ coordinationId }) => {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateToken = async () => {
    try {
      setIsGenerating(true);
      
      // Vérifier s'il existe déjà un token actif pour cette coordination
      const { data: existingTokens, error: fetchError } = await supabase
        .from('planning_share_tokens')
        .select('token')
        .eq('coordination_id', coordinationId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (fetchError) {
        throw fetchError;
      }
      
      let token;
      
      if (existingTokens?.token) {
        // Utiliser le token existant
        token = existingTokens.token;
        console.log('🔄 Using existing planning share token');
      } else {
        // Générer un nouveau token
        token = uuidv4();
        
        const { error: insertError } = await supabase
          .from('planning_share_tokens')
          .insert({
            token,
            coordination_id: coordinationId,
            name: 'Lien de partage planning',
            expires_at: null, // Token permanent
            is_active: true
          });
        
        if (insertError) throw insertError;
        console.log('✅ Created new planning share token');
      }
      
      const shareUrl = `${window.location.origin}/jour-m/${token}`;
      setShareLink(shareUrl);
      
      toast({
        title: "Lien généré avec succès",
        description: "Ce lien permet de voir votre planning en mode consultation"
      });
    } catch (error) {
      console.error('❌ Erreur lors de la génération du lien:', error);
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
            <DialogTitle>Partager votre planning</DialogTitle>
            <DialogDescription>
              Créez un lien public en lecture seule pour permettre à votre équipe de voir le planning du jour J.
            </DialogDescription>
          </DialogHeader>
          
          {!shareLink ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Le lien généré sera permanent et donnera accès à une version publique 
                de votre planning avec possibilité de filtrer par membre d'équipe.
              </p>
              
              <Button 
                onClick={generateToken} 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? "Génération..." : "Générer un lien public"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="share-link">Lien de partage du planning</Label>
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
                  Ce lien donne accès à votre planning en mode consultation uniquement.
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

export default PlanningShareButton;
