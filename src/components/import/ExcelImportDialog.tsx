import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Download, Loader2, Upload } from 'lucide-react';
import { downloadImportTemplate, flagDuplicates, mapImportRows, readImportFile, type ImportModuleConfig } from '@/lib/excelImport';

interface ExcelImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: ImportModuleConfig;
  /** Clés de doublon déjà présentes (calculées avec config.duplicateKey) */
  existingKeys: Set<string>;
  /** Enregistre les lignes retenues ; renvoie le nombre importé */
  onImport: (rows: Record<string, string>[]) => Promise<number>;
}

const ExcelImportDialog: React.FC<ExcelImportDialogProps> = ({ open, onOpenChange, config, existingKeys, onImport }) => {
  const { toast } = useToast();
  const [preview, setPreview] = useState<{ row: Record<string, string>; isDuplicate: boolean }[]>([]);
  const [skippedCount, setSkippedCount] = useState(0);
  const [skipDuplicates, setSkipDuplicates] = useState(true);
  const [isWorking, setIsWorking] = useState(false);

  const resetDialog = () => { setPreview([]); setSkippedCount(0); setSkipDuplicates(true); };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setIsWorking(true);
    try {
      const rawRows = await readImportFile(file);
      const { rows, skipped } = mapImportRows(rawRows, config.columns);
      setPreview(flagDuplicates(rows, existingKeys, config.duplicateKey));
      setSkippedCount(skipped);
      if (rows.length === 0) toast({ title: 'Aucune ligne reconnue', description: 'Utilisez le modèle Mariable ou vérifiez les en-têtes de colonnes.', variant: 'destructive' });
    } catch (error) {
      console.error('❌ ExcelImportDialog: lecture impossible', error);
      toast({ title: 'Fichier illisible', description: 'Formats acceptés : .xlsx, .xls, .csv', variant: 'destructive' });
    } finally {
      setIsWorking(false);
    }
  };

  const rowsToImport = preview.filter((p) => !(skipDuplicates && p.isDuplicate)).map((p) => p.row);
  const duplicateCount = preview.filter((p) => p.isDuplicate).length;

  const handleConfirm = async () => {
    setIsWorking(true);
    try {
      const importedCount = await onImport(rowsToImport);
      toast({ title: `${importedCount} ligne(s) importée(s)` });
      resetDialog();
      onOpenChange(false);
    } catch (error) {
      console.error('❌ ExcelImportDialog: import impossible', error);
      toast({ title: "Import impossible", description: 'Aucune donnée n’a été perdue. Réessayez ou contactez le support.', variant: 'destructive' });
    } finally {
      setIsWorking(false);
    }
  };

  const shownColumns = config.columns.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) resetDialog(); onOpenChange(next); }}>
      <DialogContent className="max-w-3xl rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">Importer — {config.title}</DialogTitle>
          <DialogDescription>1. Téléchargez le modèle Mariable · 2. Remplissez-le · 3. Importez-le et vérifiez l’aperçu.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="rounded-none min-h-[44px]" onClick={() => downloadImportTemplate(config)}>
            <Download className="h-4 w-4 mr-2" />Télécharger le modèle Excel
          </Button>
          <Button asChild variant="outline" className="rounded-none min-h-[44px]" disabled={isWorking}>
            <label className="cursor-pointer">
              {isWorking ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
              Choisir un fichier (.xlsx, .csv)
              <input type="file" accept=".xlsx,.xls,.csv" className="sr-only" onChange={handleFileSelected} />
            </label>
          </Button>
        </div>

        {preview.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm">
              <strong>{preview.length}</strong> ligne(s) lue(s)
              {duplicateCount > 0 && <> · <span className="text-destructive">{duplicateCount} doublon(s)</span></>}
              {skippedCount > 0 && <> · {skippedCount} ignorée(s) (champ obligatoire vide)</>}
            </p>
            {duplicateCount > 0 && (
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={skipDuplicates} onCheckedChange={(v) => setSkipDuplicates(v === true)} />
                Ne pas importer les doublons
              </label>
            )}
            <div className="border overflow-x-auto max-h-72">
              <table className="w-full text-xs">
                <thead className="bg-muted sticky top-0">
                  <tr>{shownColumns.map((c) => <th key={c.key} className="text-left p-2 font-medium">{c.label}</th>)}<th className="p-2" /></tr>
                </thead>
                <tbody>
                  {preview.slice(0, 100).map((p, index) => (
                    <tr key={index} className={p.isDuplicate ? 'bg-destructive/10' : 'border-t'}>
                      {shownColumns.map((c) => <td key={c.key} className="p-2 truncate max-w-[160px]">{p.row[c.key]}</td>)}
                      <td className="p-2 text-destructive whitespace-nowrap">{p.isDuplicate ? 'Doublon' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button className="w-full rounded-none min-h-[44px]" onClick={handleConfirm} disabled={isWorking || rowsToImport.length === 0}>
              {isWorking && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Importer {rowsToImport.length} ligne(s)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExcelImportDialog;
