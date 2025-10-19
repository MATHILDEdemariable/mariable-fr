import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Trash, Sparkles, Eye } from 'lucide-react';
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
    ai_summary?: string;
    ai_key_points?: any;
    is_analyzed: boolean;
    created_at: string;
    file_size?: number;
  };
  onDelete: (id: string) => void;
  onViewSummary: (document: any) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete, onViewSummary }) => {
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

            {document.is_analyzed && document.ai_summary && (
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Résumé IA</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {document.ai_summary}
                </p>
                <Button
                  size="sm"
                  variant="link"
                  className="text-yellow-700 p-0 h-auto mt-2"
                  onClick={() => onViewSummary(document)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Voir le résumé complet
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
