import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import Papa from 'papaparse';

interface GuestImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}

interface ParsedGuest {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  type: 'adult' | 'child';
}

const GuestImportDialog: React.FC<GuestImportDialogProps> = ({ isOpen, onClose, onImported }) => {
  const [importing, setImporting] = useState(false);
  const [preview, setPreview] = useState<ParsedGuest[]>([]);
  const [fileType, setFileType] = useState<'excel' | 'txt' | null>(null);
  const { toast } = useToast();

  const parseCSV = (content: string): ParsedGuest[] => {
    const results = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().trim(),
    });

    return results.data.map((row: any) => {
      const guestType: 'adult' | 'child' = (row.type?.toLowerCase() === 'enfant' || row.type?.toLowerCase() === 'child') ? 'child' : 'adult';
      return {
        firstName: row.prénom || row.prenom || row.firstname || row.first_name || '',
        lastName: row.nom || row.lastname || row.last_name || '',
        email: row.email || row.mail || undefined,
        phone: row.téléphone || row.telephone || row.phone || undefined,
        address: row.adresse || row.address || undefined,
        type: guestType,
      };
    }).filter(g => g.firstName && g.lastName);
  };

  const parseTXT = (content: string): ParsedGuest[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const guests: ParsedGuest[] = [];

    for (const line of lines) {
      // Format : Prénom Nom <email> (téléphone) [adresse]
      const emailMatch = line.match(/<([^>]+)>/);
      const phoneMatch = line.match(/\(([^)]+)\)/);
      const addressMatch = line.match(/\[([^\]]+)\]/);
      
      let namePart = line
        .replace(/<[^>]+>/, '')
        .replace(/\([^)]+\)/, '')
        .replace(/\[[^\]]+\]/, '')
        .trim();

      const nameParts = namePart.split(' ').filter(p => p);
      if (nameParts.length >= 2) {
        guests.push({
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(' '),
          email: emailMatch ? emailMatch[1] : undefined,
          phone: phoneMatch ? phoneMatch[1] : undefined,
          address: addressMatch ? addressMatch[1] : undefined,
          type: 'adult',
        });
      }
    }

    return guests;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      try {
        let parsed: ParsedGuest[] = [];
        
        if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx')) {
          setFileType('excel');
          parsed = parseCSV(content);
        } else if (file.name.endsWith('.txt')) {
          setFileType('txt');
          parsed = parseTXT(content);
        }

        if (parsed.length === 0) {
          toast({
            title: 'Erreur de parsing',
            description: 'Aucun invité valide trouvé dans le fichier',
            variant: 'destructive',
          });
          return;
        }

        setPreview(parsed);
      } catch (error) {
        console.error('Erreur lors du parsing:', error);
        toast({
          title: 'Erreur',
          description: 'Impossible de lire le fichier',
          variant: 'destructive',
        });
      }
    };

    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (preview.length === 0) return;

    setImporting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const guestsToInsert = preview.map(guest => ({
        user_id: user.id,
        guest_first_name: guest.firstName,
        guest_last_name: guest.lastName,
        guest_email: guest.email || null,
        guest_phone: guest.phone || null,
        guest_address: guest.address || null,
        guest_type: guest.type,
        source: fileType || 'manual',
      }));

      const { error } = await supabase
        .from('wedding_guest_list')
        .insert(guestsToInsert);

      if (error) throw error;

      toast({
        title: 'Import réussi',
        description: `${preview.length} invité${preview.length > 1 ? 's' : ''} importé${preview.length > 1 ? 's' : ''}`,
      });

      setPreview([]);
      setFileType(null);
      onImported();
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible d\'importer les invités',
        variant: 'destructive',
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importer une liste d'invités</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {preview.length === 0 ? (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">📋 Format CSV uniquement</h3>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">Comment créer votre fichier CSV :</p>
                    <ol className="list-decimal list-inside space-y-1 ml-2">
                      <li>Créez votre liste dans Excel ou Google Sheets avec les colonnes suivantes :<br/>
                        <span className="font-mono text-xs">Prénom | Nom | Email | Téléphone | Adresse | Type (adulte/enfant)</span>
                      </li>
                      <li>Enregistrez sous format CSV :
                        <ul className="list-disc list-inside ml-4 mt-1">
                          <li>Excel : Fichier → Enregistrer sous → Format CSV (.csv)</li>
                          <li>Google Sheets : Fichier → Télécharger → Valeurs séparées par des virgules (.csv)</li>
                        </ul>
                      </li>
                      <li>Importez le fichier .csv ici</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <Label>Format Texte (.txt)</Label>
                  <p className="text-sm text-muted-foreground">
                    Format : Prénom Nom &lt;email&gt; (téléphone) [adresse]
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Exemple : Marie Dupont &lt;marie@exemple.com&gt; (06 12 34 56 78) [10 Rue de Paris, 75001 Paris]
                  </p>
                </div>
              </div>

              <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-12 text-center">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:underline">Choisir un fichier</span>
                  <span className="text-muted-foreground"> ou glisser-déposer</span>
                </Label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".csv,.txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Fichier CSV ou TXT uniquement (max 5MB)
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">
                      {preview.length} invité{preview.length > 1 ? 's' : ''} détecté{preview.length > 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-green-700">
                      Vérifiez les données avant d'importer
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setPreview([])}>
                  Annuler
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[400px]">
                  <table className="w-full">
                    <thead className="bg-muted/30 sticky top-0">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Prénom</th>
                        <th className="text-left p-3 text-sm font-medium">Nom</th>
                        <th className="text-left p-3 text-sm font-medium">Email</th>
                        <th className="text-left p-3 text-sm font-medium">Téléphone</th>
                        <th className="text-left p-3 text-sm font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((guest, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-3 text-sm">{guest.firstName}</td>
                          <td className="p-3 text-sm">{guest.lastName}</td>
                          <td className="p-3 text-sm">{guest.email || '-'}</td>
                          <td className="p-3 text-sm">{guest.phone || '-'}</td>
                          <td className="p-3 text-sm">
                            {guest.type === 'adult' ? 'Adulte' : 'Enfant'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setPreview([])}>
                  Annuler
                </Button>
                <Button onClick={handleImport} disabled={importing}>
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Import en cours...
                    </>
                  ) : (
                    `Importer ${preview.length} invité${preview.length > 1 ? 's' : ''}`
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestImportDialog;
