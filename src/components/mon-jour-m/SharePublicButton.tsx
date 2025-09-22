
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Copy, Share, Check, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SharePublicButtonProps {
  coordinationId?: string;
}

const SharePublicButton: React.FC<SharePublicButtonProps> = ({ coordinationId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  if (!coordinationId) {
    return null;
  }

  // Détection d'environnement pour générer l'URL correcte
  const getPublicDomain = () => {
    if (typeof window === 'undefined') return 'https://mariable.fr';
    
    // Si on est sur Lovable (environnement de dev), utiliser l'origine actuelle
    if (window.location.hostname.includes('lovable.dev')) {
      return window.location.origin;
    }
    
    // Sinon, utiliser le domaine de production
    return 'https://mariable.fr';
  };
  
  const publicUrl = `${getPublicDomain()}/planning-public/${coordinationId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans le presse-papiers"
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien",
        variant: "destructive"
      });
    }
  };

  const handlePreview = () => {
    window.open(publicUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm min-h-[44px] touch-manipulation">
          <Share className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
          <span className="hidden sm:inline">Partager</span>
          <span className="sm:hidden">Export</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md mx-3 sm:mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Partager le planning</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Partagez ce lien pour permettre à votre équipe de consulter le planning en mode lecture seule.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2">
            <Input
              value={publicUrl}
              readOnly
              className="flex-1 text-xs sm:text-sm"
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1 justify-center min-h-[44px] touch-manipulation px-3 sm:px-4"
            >
              {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
              <span className="text-xs sm:text-sm">{copied ? 'Copié' : 'Copier'}</span>
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePreview}
              className="flex items-center gap-2 flex-1 min-h-[44px] touch-manipulation text-xs sm:text-sm"
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
              Prévisualiser
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Mode public :</strong> Ce lien fonctionne partout, même en navigation privée. 
              Aucune connexion requise pour consulter le planning.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePublicButton;
