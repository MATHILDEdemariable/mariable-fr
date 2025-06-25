
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { generateShareToken } from '@/utils/tokenUtils';
import { supabase } from '@/integrations/supabase/client';

const ShareDashboardButton: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const generateShareUrl = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour partager votre tableau de bord",
          variant: "destructive"
        });
        return;
      }

      console.log('Generating share token for user:', user.id);
      const token = await generateShareToken(user.id);
      
      if (!token) {
        toast({
          title: "Erreur",
          description: "Impossible de générer le lien de partage",
          variant: "destructive"
        });
        return;
      }

      const baseUrl = window.location.origin;
      const fullShareUrl = `${baseUrl}/jour-m-vue/${token}`;
      
      console.log('Generated share URL:', fullShareUrl);
      setShareUrl(fullShareUrl);
      
      toast({
        title: "Lien généré",
        description: "Votre lien de partage a été créé avec succès"
      });
    } catch (error) {
      console.error('Error generating share URL:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du lien",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open);
    if (open && !shareUrl) {
      generateShareUrl();
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Partager votre planning de mariage</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Partagez votre planning avec votre équipe, votre famille ou vos prestataires. 
            Le lien permet d'accéder à une version en lecture seule de votre planning.
          </p>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span className="ml-2 text-sm text-gray-600">Génération du lien...</span>
            </div>
          ) : shareUrl ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copié' : 'Copier'}
                </Button>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Note :</strong> Ce lien permet un accès en lecture seule à votre planning. 
                  Les visiteurs pourront voir vos tâches, votre équipe et vos documents, mais ne pourront pas les modifier.
                </p>
              </div>
            </div>
          ) : (
            <Button onClick={generateShareUrl} className="w-full">
              <Share2 className="h-4 w-4 mr-2" />
              Générer le lien de partage
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareDashboardButton;
