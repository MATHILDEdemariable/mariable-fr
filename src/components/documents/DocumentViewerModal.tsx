import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink, FileText } from 'lucide-react';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: {
    id: string;
    file_name: string;
    file_url: string;
    document_type: string;
    file_size?: number;
  } | null;
}

const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  if (!document) return null;

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase();
  };

  const renderPreview = () => {
    const ext = getFileExtension(document.file_name);

    if (ext === 'pdf') {
      return (
        <iframe
          src={document.file_url}
          className="w-full h-[70vh] border-0 rounded"
          title={document.file_name}
        />
      );
    }

    if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) {
      return (
        <div className="flex items-center justify-center bg-gray-50 rounded p-4">
          <img
            src={document.file_url}
            alt={document.file_name}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <FileText className="h-16 w-16 text-gray-300" />
        <p className="text-muted-foreground">
          Prévisualisation non disponible pour ce format
        </p>
        <Button onClick={() => window.open(document.file_url, '_blank')}>
          <Download className="h-4 w-4 mr-2" />
          Télécharger le fichier
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <span className="truncate">{document.file_name}</span>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(document.file_url, '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(document.file_url, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Ouvrir
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {renderPreview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewerModal;
