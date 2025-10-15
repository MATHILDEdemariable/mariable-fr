import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface QRCodeFormProps {
  onSubmit: (title: string, url: string) => Promise<void>;
}

export const QRCodeForm: React.FC<QRCodeFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir tous les champs',
        variant: 'destructive',
      });
      return;
    }

    try {
      new URL(url);
    } catch {
      toast({
        title: 'URL invalide',
        description: 'Veuillez entrer une URL valide (ex: https://example.com)',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(title, url);
      setTitle('');
      setUrl('');
      toast({
        title: 'QR Code créé',
        description: 'Votre QR code a été créé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le QR code',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre du QR Code</Label>
        <Input
          id="title"
          placeholder="Ex: Cagnotte de mariage"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">Lien URL</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com/ma-cagnotte"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Création en cours...
          </>
        ) : (
          'Créer le QR Code'
        )}
      </Button>
    </form>
  );
};
