import { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { FileSpreadsheet, Upload } from 'lucide-react';

interface ImportExcelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planId: string;
  onImported: () => void;
}

export const ImportExcelDialog = ({ open, onOpenChange, planId, onImported }: ImportExcelDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any[]>([]);
  const [fullData, setFullData] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('✅ Fichier parsé:', results.data);
        setFullData(results.data);
        setPreview(results.data.slice(0, 5)); // Prévisualiser 5 lignes
        toast({ 
          title: 'Fichier chargé', 
          description: `${results.data.length} ligne(s) détectée(s)` 
        });
      },
      error: (error) => {
        toast({ title: 'Erreur parsing', description: error.message, variant: 'destructive' });
      }
    });
  };

  const handleImport = async () => {
    if (fullData.length === 0) return;

    setLoading(true);
    try {
      const guestsToImport = fullData.map((row: any) => {
        const guestName = row['Nom'] || row['nom'] || row['name'] || row['Name'] || row['Prénom'] || row['prenom'];
        
        if (!guestName || guestName.trim() === '') {
          return null;
        }

        const guestType = (row['Type'] || row['type'] || 'adult').toLowerCase();
        const validGuestType = ['adult', 'child', 'vip'].includes(guestType) ? guestType : 'adult';

        return {
          seating_plan_id: planId,
          table_id: null,
          guest_name: guestName.trim(),
          guest_type: validGuestType,
          dietary_restrictions: row['Restrictions'] || row['restrictions'] || row['Régime'] || row['regime'] || null,
          notes: row['Notes'] || row['notes'] || null
        };
      }).filter(Boolean);

      if (guestsToImport.length === 0) {
        toast({ 
          title: 'Aucun invité valide', 
          description: 'Vérifiez que votre fichier contient une colonne "Nom"',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('seating_assignments')
        .insert(guestsToImport);

      if (error) throw error;

      toast({ 
        title: 'Import réussi', 
        description: `${guestsToImport.length} invité(s) importé(s) en "Non placés"` 
      });
      onImported();
      onOpenChange(false);
      setPreview([]);
      setFullData([]);
    } catch (error: any) {
      console.error('❌ Erreur import Excel:', error);
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importer depuis Excel/CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Choisir un fichier CSV</span>
              </Button>
            </label>
            <p className="text-sm text-muted-foreground mt-2">
              Format CSV avec colonnes : <strong>Nom</strong>, Type, Restrictions, Notes
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              (Seule la colonne "Nom" est obligatoire)
            </p>
          </div>

          {preview.length > 0 && (
            <div>
              <p className="font-medium mb-2">
                Prévisualisation ({fullData.length} ligne(s) au total) :
              </p>
              <div className="border rounded p-3 max-h-48 overflow-y-auto bg-muted/30">
                {preview.map((row, i) => (
                  <div key={i} className="text-sm py-1 border-b last:border-0">
                    <span className="font-medium">
                      {row['Nom'] || row['nom'] || row['name'] || row['Name'] || row['Prénom'] || row['prenom']}
                    </span>
                    {row['Type'] && ` - ${row['Type']}`}
                    {row['Restrictions'] && ` - ${row['Restrictions']}`}
                  </div>
                ))}
                {fullData.length > 5 && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    ... et {fullData.length - 5} autre(s) ligne(s)
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleImport} disabled={loading || fullData.length === 0}>
            {loading ? 'Import...' : `Importer ${fullData.length} invité(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
