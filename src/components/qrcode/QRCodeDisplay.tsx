import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { exportQRCodePDF } from '@/utils/exportQRCodePDF';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface QRCode {
  id: string;
  title: string;
  url: string;
  qr_code_data: string;
  created_at: string;
}

interface QRCodeDisplayProps {
  qrCode: QRCode;
  onDelete: (id: string) => Promise<void>;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ qrCode, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = () => {
    try {
      exportQRCodePDF(qrCode.qr_code_data, qrCode.url, qrCode.title);
      toast({
        title: 'PDF téléchargé',
        description: 'Le QR code a été téléchargé en PDF',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de télécharger le PDF',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(qrCode.id);
      toast({
        title: 'QR Code supprimé',
        description: 'Le QR code a été supprimé avec succès',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le QR code',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">{qrCode.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center bg-white p-4 rounded-lg">
          <img
            src={qrCode.qr_code_data}
            alt={`QR Code pour ${qrCode.title}`}
            className="w-48 h-48"
          />
        </div>
        <div className="text-sm text-gray-600 break-all">
          <a
            href={qrCode.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-wedding-olive transition-colors"
          >
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{qrCode.url}</span>
          </a>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="flex-1"
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              size="sm"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir supprimer ce QR code ? Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
