
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

  const publicUrl = `${window.location.origin}/planning-public/${coordinationId}`;

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
        <Button variant="outline" className="flex items-center gap-2">
          <Share className="h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager le planning</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Partagez ce lien pour permettre à votre équipe de consulter le planning en mode lecture seule.
          </p>
          
          <div className="flex items-center space-x-2">
            <Input
              value={publicUrl}
              readOnly
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copié' : 'Copier'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePreview}
              className="flex items-center gap-2 flex-1"
            >
              <Eye className="h-4 w-4" />
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
