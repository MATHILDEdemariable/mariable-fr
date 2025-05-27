
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share, Copy, Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const ShareDashboardButton = () => {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateToken = async () => {
    try {
      setIsGenerating(true);
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) {
        throw new Error("Utilisateur non connecté");
      }
      
      // Check if user already has an active token
      const { data: existingTokens, error: fetchError } = await supabase
        .from('dashboard_share_tokens')
        .select('token')
        .eq('user_id', sessionData.session.user.id)
        .eq('active', true)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let token;
      
      if (existingTokens?.token) {
        // Use existing token
        token = existingTokens.token;
      } else {
        // Generate new token
        token = uuidv4();
        
        const { error: insertError } = await supabase
          .from('dashboard_share_tokens')
          .insert({
            token,
            user_id: sessionData.session.user.id,
            expires_at: null, // Permanent token
            description: 'Lien de partage public du tableau de bord',
            active: true
          });
        
        if (insertError) throw insertError;
      }
      
      const shareUrl = `${window.location.origin}/dashboard/lecteur/${token}`;
      setShareLink(shareUrl);
      
      toast({
        title: "Lien généré avec succès",
        description: "Ce lien est permanent et restera valide"
      });
    } catch (error) {
      console.error('Erreur lors de la génération du lien:', error);
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
            <DialogTitle>Partager votre tableau de bord</DialogTitle>
            <DialogDescription>
              Créez un lien public en lecture seule pour permettre à d'autres personnes de voir votre avancement.
            </DialogDescription>
          </DialogHeader>
          
          {!shareLink ? (
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Le lien généré sera permanent et donnera accès à une version publique 
                et mobile de votre tableau de bord.
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
                <Label htmlFor="share-link">Lien de partage public</Label>
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
                  Ce lien donne accès à une version publique et mobile de votre tableau de bord (lecture seule).
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

export default ShareDashboardButton;
