import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface DashboardDoc {
  id: string;
  file_name: string;
  file_url: string;
  file_path: string | null;
  mime_type: string | null;
  file_size: number | null;
  document_type: string | null;
  vendor_name: string | null;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coordinationId: string;
  alreadyImportedSourceIds: string[];
  onImported: () => void;
}

const ImportFromDashboardModal: React.FC<Props> = ({
  open, onOpenChange, coordinationId, alreadyImportedSourceIds, onImported,
}) => {
  const { toast } = useToast();
  const [docs, setDocs] = useState<DashboardDoc[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data, error } = await supabase
          .from('wedding_documents')
          .select('id, file_name, file_url, file_path, mime_type, file_size, document_type, vendor_name')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setDocs(data || []);
      } catch (e) {
        console.error('❌ Load wedding_documents:', e);
        toast({ title: 'Erreur', description: 'Chargement impossible', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, toast]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleImport = async () => {
    if (selected.size === 0) return;
    setImporting(true);
    try {
      const payload = docs
        .filter(d => selected.has(d.id))
        .map(d => ({
          coordination_id: coordinationId,
          title: d.file_name,
          description: d.vendor_name ? `Source: ${d.vendor_name}` : null,
          category: 'jour-m',
          file_url: d.file_url,
          file_path: d.file_path,
          file_type: d.document_type,
          file_size: d.file_size,
          mime_type: d.mime_type,
          source_document_id: d.id,
        }));
      const { error } = await supabase.from('coordination_documents').insert(payload);
      if (error) throw error;
      toast({ title: 'Documents importés', description: `${payload.length} document(s) ajouté(s) au Jour J.` });
      setSelected(new Set());
      onImported();
      onOpenChange(false);
    } catch (e) {
      console.error('❌ Import documents:', e);
      toast({ title: 'Erreur', description: "Import impossible", variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Importer depuis mon Dashboard</DialogTitle>
          <DialogDescription>
            Sélectionnez les documents à associer à votre Jour J. Aucune copie n'est créée, le fichier reste celui du Dashboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto border rounded-md">
          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-6 w-6" /></div>
          ) : docs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-40" />
              Aucun document dans votre Dashboard.
            </div>
          ) : (
            <ul className="divide-y">
              {docs.map(d => {
                const already = alreadyImportedSourceIds.includes(d.id);
                const checked = selected.has(d.id);
                return (
                  <li key={d.id} className={`flex items-center gap-3 p-3 ${already ? 'opacity-60' : 'hover:bg-muted/40'}`}>
                    <Checkbox
                      checked={checked}
                      disabled={already}
                      onCheckedChange={() => toggle(d.id)}
                    />
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{d.file_name}</p>
                      <div className="flex gap-2 mt-0.5 flex-wrap">
                        {d.document_type && <Badge variant="outline" className="text-xs">{d.document_type}</Badge>}
                        {d.vendor_name && <span className="text-xs text-muted-foreground">{d.vendor_name}</span>}
                        {already && <Badge variant="secondary" className="text-xs">déjà importé</Badge>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>Annuler</Button>
          <Button onClick={handleImport} disabled={selected.size === 0 || importing}>
            {importing ? 'Import…' : `Importer ${selected.size} document(s)`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportFromDashboardModal;
