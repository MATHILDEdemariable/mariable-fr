import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentCardProps {
  document: {
    id: string;
    file_name: string;
    file_url: string;
    document_type: string;
    vendor_name?: string;
    category?: string;
    created_at: string;
    file_size?: number;
  };
  onDelete: (id: string) => void;
  onViewSummary: (document: any) => void;
  onViewDocument: (document: any) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, onViewSummary, onViewDocument }) => {
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      'devis': '📋 Devis',
      'contrat': '📄 Contrat',
      'facture': '💰 Facture',
      'autre': '📎 Autre'
    };
    return types[type] || type;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileText className="h-8 w-8 text-wedding-olive flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{document.file_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(document.created_at), 'dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDocument(document)}
                >
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(document.file_url, '_blank')}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(document.id)}
                >
                  <Trash className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline">{getDocumentTypeLabel(document.document_type)}</Badge>
              {document.vendor_name && (
                <Badge variant="secondary">{document.vendor_name}</Badge>
              )}
              {document.category && (
                <Badge variant="outline">{document.category}</Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {formatFileSize(document.file_size)}
              </Badge>
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
