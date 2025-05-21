
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { addDays } from 'date-fns';

const ShareDashboardButton = () => {
  const [open, setOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTemporary, setIsTemporary] = useState(true);
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const generateToken = async () => {
    try {
      setIsGenerating(true);
      
      // Générer un token unique
      const token = uuidv4();
      
      // Calculer la date d'expiration si temporaire (7 jours par défaut)
      const expiresAt = isTemporary ? addDays(new Date(), 7) : null;
      
      // Insérer le token dans la base de données
      const { error } = await supabase
        .from('dashboard_share_tokens')
        .insert({
          token,
          expires_at: expiresAt,
          description: description || 'Lien de partage du tableau de bord'
        });
      
      if (error) throw error;
      
      // Construire l'URL complète
      const shareUrl = `${window.location.origin}/dashboard/lecteur/${token}`;
      setShareLink(shareUrl);
      
      toast({
        title: "Lien généré avec succès",
        description: isTemporary 
          ? "Ce lien sera valide pendant 7 jours" 
          : "Ce lien ne comporte pas de date d'expiration"
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papier"
      });
    });
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
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Partager votre tableau de bord</DialogTitle>
            <DialogDescription>
              Créez un lien de partage en lecture seule pour permettre à d'autres personnes de voir votre tableau de bord sans pouvoir le modifier.
            </DialogDescription>
          </DialogHeader>
          
          {!shareLink ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="temporary">Lien temporaire (7 jours)</Label>
                  <p className="text-sm text-muted-foreground">
                    Désactivez pour créer un lien permanent
                  </p>
                </div>
                <Switch 
                  id="temporary" 
                  checked={isTemporary} 
                  onCheckedChange={setIsTemporary} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input 
                  id="description" 
                  placeholder="Par exemple: Pour mes prestataires" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              
              <Button 
                onClick={generateToken} 
                className="w-full" 
                disabled={isGenerating}
              >
                {isGenerating ? "Génération..." : "Générer un lien de partage"}
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
                    className="flex-1"
                  />
                  <Button onClick={copyToClipboard} size="sm">
                    Copier
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ce lien donne accès en lecture seule à votre tableau de bord.
                </p>
              </div>
              
              <Button 
                onClick={() => {
                  setShareLink('');
                  setDescription('');
                }} 
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
