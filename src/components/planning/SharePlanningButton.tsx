import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Share2, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useWeddingCoordination } from '@/hooks/useWeddingCoordination';

interface SharePlanningButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
}

const SharePlanningButton: React.FC<SharePlanningButtonProps> = ({ 
  variant = 'outline', 
  size = 'default' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { coordination } = useWeddingCoordination();
  const { toast } = useToast();

  const getShareUrl = () => {
    if (!coordination) return '';
    
    if (coordination.slug) {
      return `${window.location.origin}/planning-public/slug/${coordination.slug}`;
    }
    return `${window.location.origin}/planning-public/${coordination.id}`;
  };

  const handleCopyUrl = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Lien copié !",
        description: "Le lien de partage a été copié dans votre presse-papiers.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      });
    }
  };

  if (!coordination) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="flex items-center gap-2">
          <Share2 className="h-4 w-4" />
          Partager
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager votre planning</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Partagez votre planning Jour J avec votre équipe et vos proches.
          </p>
          
          <div className="space-y-2">
            <Label htmlFor="share-url">Lien de partage</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={getShareUrl()}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={handleCopyUrl}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copié' : 'Copier'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              <strong>Mode consultation :</strong> Les personnes avec ce lien pourront voir votre planning mais ne pourront pas le modifier.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePlanningButton;