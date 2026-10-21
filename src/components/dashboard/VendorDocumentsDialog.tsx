import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface VendorDocumentsDialogProps {
  vendorName: string | null;
  weddingId: string | null;
  onClose: () => void;
}

interface VendorDocument {
  id: string;
  file_name: string;
  file_url: string;
  file_path: string;
  created_at: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const VendorDocumentsDialog: React.FC<VendorDocumentsDialogProps> = ({ vendorName, weddingId, onClose }) => {
  const { i18n } = useTranslation();
  const tr = (fr: string, en: string) => (i18n.language?.startsWith('en') ? en : fr);
  const { toast } = useToast();
  const [documents, setDocuments] = useState<VendorDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const loadDocuments = async () => {
    if (!vendorName) return;
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      let query: any = supabase
        .from('wedding_documents')
        .select('id, file_name, file_url, file_path, created_at')
        .eq('vendor_name', vendorName);
      query = weddingId ? query.eq('wedding_id', weddingId) : query.eq('user_id', user.id);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      setDocuments((data || []) as VendorDocument[]);
    } catch (error) {
      console.error('Error in loadVendorDocuments:', error);
      toast({ title: tr('Erreur', 'Error'), description: tr('Impossible de charger les documents', 'Could not load documents'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (vendorName) loadDocuments();
    else setDocuments([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorName, weddingId]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !vendorName) return;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: tr('Fichier trop lourd', 'File too large'), description: tr('10 Mo maximum', '10 MB maximum'), variant: 'destructive' });
      return;
    }
    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${user.id}/vendors/${Date.now()}_${safeName}`;
      const { error: uploadError } = await supabase.storage.from('wedding-documents').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from('wedding-documents').getPublicUrl(filePath);
      const { error: insertError } = await supabase.from('wedding_documents').insert({
        user_id: user.id,
        wedding_id: weddingId,
        vendor_name: vendorName,
        document_type: 'devis',
        category: 'prestataire',
        file_name: file.name,
        file_path: filePath,
        file_url: urlData.publicUrl,
        file_size: file.size,
        mime_type: file.type || null,
      });
      if (insertError) throw insertError;
      toast({ title: tr('Document ajouté', 'Document added'), description: file.name });
      loadDocuments();
    } catch (error) {
      console.error('Error in uploadVendorDocument:', error);
      toast({ title: tr('Erreur', 'Error'), description: tr("Impossible d'ajouter le document", 'Could not add the document'), variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (document: VendorDocument) => {
    try {
      const { error } = await supabase.from('wedding_documents').delete().eq('id', document.id);
      if (error) throw error;
      await supabase.storage.from('wedding-documents').remove([document.file_path]);
      setDocuments(previous => previous.filter(d => d.id !== document.id));
    } catch (error) {
      console.error('Error in deleteVendorDocument:', error);
      toast({ title: tr('Erreur', 'Error'), description: tr('Impossible de supprimer le document', 'Could not delete the document'), variant: 'destructive' });
    }
  };

  return (
    <Dialog open={!!vendorName} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-none">
        <DialogHeader>
          <DialogTitle className="font-serif">{tr('Documents', 'Documents')} — {vendorName}</DialogTitle>
          <DialogDescription>{tr('Devis, contrats, factures… liés à ce prestataire.', 'Quotes, contracts, invoices… for this vendor.')}</DialogDescription>
        </DialogHeader>

        <label className="flex min-h-[44px] cursor-pointer items-center justify-center gap-2 border border-dashed border-wedding-olive/50 px-4 py-3 text-sm text-wedding-olive hover:bg-wedding-olive/5">
          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {tr('Ajouter un document (PDF, image… 10 Mo max)', 'Add a document (PDF, image… 10 MB max)')}
          <input type="file" className="sr-only" onChange={handleUpload} disabled={isUploading} accept=".pdf,.doc,.docx,.xls,.xlsx,image/*" />
        </label>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : documents.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">{tr('Aucun document pour le moment', 'No documents yet')}</p>
          ) : documents.map(document => (
            <div key={document.id} className="flex items-center gap-2 border p-2">
              <FileText className="h-4 w-4 flex-shrink-0 text-wedding-olive" />
              <a href={document.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-sm hover:underline" title={document.file_name}>
                {document.file_name}
              </a>
              <a href={document.file_url} target="_blank" rel="noopener noreferrer" aria-label={tr('Ouvrir', 'Open')} className="p-2">
                <ExternalLink className="h-4 w-4" />
              </a>
              <Button variant="ghost" size="icon" aria-label={tr('Supprimer', 'Delete')} onClick={() => handleDelete(document)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorDocumentsDialog;
