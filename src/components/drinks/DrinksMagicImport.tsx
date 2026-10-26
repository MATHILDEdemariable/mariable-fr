import React, { useState } from 'react';
import { Wand2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { translateDrinkLabel, type DrinkPlanRow } from '@/components/drinks/DrinksPlanTable';

interface Props { isEnglish: boolean; onImport: (rows: DrinkPlanRow[]) => void }

/** Transforme une note libre (email traiteur, caviste…) en lignes du plan des boissons grâce à l'IA. */
const DrinksMagicImport: React.FC<Props> = ({ isEnglish, onImport }) => {
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const [isOpen, setIsOpen] = useState(false);
  const [note, setNote] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewRows, setPreviewRows] = useState<DrinkPlanRow[]>([]);

  const analyzeNote = async () => {
    if (note.trim().length < 5) return;
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('parse-drinks-note', { body: { note } });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      const rows: DrinkPlanRow[] = (data?.rows || []).map((row: any) => ({
        id: crypto.randomUUID(), day: row.day || 'Jour 1', moment: row.moment || 'Apéritif', drinkType: row.drinkType || 'Champagne',
        drinkName: row.drinkName || '', pairing: row.pairing || '', quantity: row.quantity || '', supplier: row.supplier || '',
        notes: row.notes || '', status: 'À choisir',
      }));
      if (rows.length === 0) toast.info(tr('Aucune boisson détectée dans la note', 'No drinks found in the note'));
      setPreviewRows(rows);
    } catch (error) {
      console.error('❌ analyzeNote failed:', error);
      toast.error(tr('Analyse impossible, réessayez', 'Analysis failed, please retry'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const confirmImport = () => {
    onImport(previewRows);
    toast.success(tr(`${previewRows.length} boisson(s) ajoutée(s)`, `${previewRows.length} drink(s) added`));
    setPreviewRows([]); setNote(''); setIsOpen(false);
  };

  return (
    <>
      <Button variant="outline" onClick={() => setIsOpen(true)} className="min-h-[44px]">
        <Wand2 className="h-4 w-4 mr-2" />{tr('Importer une note (IA)', 'Import a note (AI)')}
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl rounded-none max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{tr('Transformer une note en tableau', 'Turn a note into a table')}</DialogTitle>
            <DialogDescription>{tr('Collez un email du traiteur ou du caviste : l’IA en tire jour, moment, type, cuvée, quantité et fournisseur.', 'Paste an email from the caterer or wine merchant: AI extracts day, moment, type, wine, quantity and supplier.')}</DialogDescription>
          </DialogHeader>
          {previewRows.length === 0 ? (
            <div className="space-y-3">
              <Textarea rows={8} className="text-base rounded-none" value={note} onChange={(e) => setNote(e.target.value)} maxLength={15000}
                aria-label={tr('Note à analyser', 'Note to analyse')}
                placeholder={tr('Ex : Pour le vin d’honneur, 30 bouteilles de Ruinart Blanc de Blancs. Au dîner, Chablis 1er cru avec le poisson…', 'E.g. For the cocktail hour, 30 bottles of Ruinart…')} />
              <Button onClick={analyzeNote} disabled={isAnalyzing || note.trim().length < 5} className="w-full min-h-[44px] rounded-none bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                {isAnalyzing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wand2 className="h-4 w-4 mr-2" />}
                {isAnalyzing ? tr('Analyse en cours…', 'Analysing…') : tr('Transformer en tableau', 'Turn into a table')}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {previewRows.map((row) => (
                  <article key={row.id} className="border border-border bg-editorial-beige p-3 text-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{translateDrinkLabel(row.day, isEnglish)} · {translateDrinkLabel(row.moment, isEnglish)}</p>
                    <p className="font-serif text-base">{row.drinkName || translateDrinkLabel(row.drinkType, isEnglish)}</p>
                    <p className="text-muted-foreground">{[translateDrinkLabel(row.drinkType, isEnglish), row.quantity, row.supplier, row.pairing].filter(Boolean).join(' · ')}</p>
                    {row.notes && <p className="text-xs italic text-muted-foreground mt-1">{row.notes}</p>}
                  </article>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setPreviewRows([])} className="min-h-[44px] rounded-none flex-1">{tr('Modifier la note', 'Edit the note')}</Button>
                <Button onClick={confirmImport} className="min-h-[44px] rounded-none flex-1 bg-wedding-olive hover:bg-wedding-olive/90 text-white">{tr('Ajouter au tableau', 'Add to the table')}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DrinksMagicImport;
