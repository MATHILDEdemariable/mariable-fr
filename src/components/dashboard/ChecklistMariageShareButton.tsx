import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ChecklistMariageShareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateShareUrl = async () => {
    try {
      setIsGenerating(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour partager votre checklist",
          variant: "destructive"
        });
        return;
      }

      // Générer l'URL de partage basée sur l'ID utilisateur
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/checklist-public/${user.id}`;
      setShareUrl(url);
      
      toast({
        title: "Lien généré",
        description: "Votre lien de partage est prêt !"
      });
    } catch (error) {
      console.error('Error generating share URL:', error);
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
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans votre presse-papiers"
      });
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (!shareUrl) {
      generateShareUrl();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleOpen}
          className="gap-2"
        >
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager votre checklist</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Partagez votre checklist de mariage avec votre équipe ou vos proches. 
            Ils pourront la consulter en lecture seule.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="share-url">Lien de partage</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                placeholder={isGenerating ? "Génération du lien..." : "Le lien apparaîtra ici"}
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                disabled={!shareUrl || isGenerating}
                size="sm"
                variant="outline"
              >
                {isCopied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground">
            <p className="font-medium mb-1">💡 À savoir :</p>
            <p>• Les personnes avec ce lien peuvent uniquement consulter votre checklist</p>
            <p>• Aucune modification ne peut être apportée par les visiteurs</p>
            <p>• Le lien reste valide tant que votre compte existe</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecklistMariageShareButton;