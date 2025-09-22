import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ParsedUrl {
  url: string;
  status: 'valid' | 'invalid' | 'duplicate';
  error?: string;
}

interface CSVUploadTabProps {
  onSuccess?: () => void;
}

const CSVUploadTab: React.FC<CSVUploadTabProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedUrls, setParsedUrls] = useState<ParsedUrl[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Lieu de réception');
  const [uploadProgress, setUploadProgress] = useState(0);

  const categories = [
    'Lieu de réception',
    'Traiteur',
    'Photographe',
    'Vidéaste',
    'Fleuriste',
    'DJ/Musicien',
    'Wedding planner',
    'Décorateur',
    'Voiture de mariage',
    'Autre'
  ];

  const validateGoogleMapsUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('google') && urlObj.pathname.includes('/place/');
    } catch {
      return false;
    }
  };

  const parseCSV = useCallback((content: string): string[] => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const urls: string[] = [];

    for (const line of lines) {
      // Handle different CSV formats
      const cells = line.split(',').map(cell => cell.trim().replace(/"/g, ''));
      
      for (const cell of cells) {
        if (cell.includes('google') && cell.includes('/place/')) {
          urls.push(cell);
        }
      }
    }

    return urls;
  }, []);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      toast.error('Veuillez sélectionner un fichier CSV');
      return;
    }

    setFile(selectedFile);

    // Parse the file
    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const urls = parseCSV(content);
      
      // Validate URLs
      const parsed: ParsedUrl[] = [];
      for (const url of urls) {
        if (validateGoogleMapsUrl(url)) {
          // Check if URL already exists
          const { data: existing } = await supabase
            .from('google_maps_urls')
            .select('id')
            .eq('url', url)
            .single();

          parsed.push({
            url,
            status: existing ? 'duplicate' : 'valid',
            error: existing ? 'URL déjà présente' : undefined
          });
        } else {
          parsed.push({
            url,
            status: 'invalid',
            error: 'URL Google Maps invalide'
          });
        }
      }

      setParsedUrls(parsed);
      toast.success(`${parsed.length} URLs détectées dans le fichier`);
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (parsedUrls.length === 0) {
      toast.error('Aucune URL valide à traiter');
      return;
    }

    const validUrls = parsedUrls.filter(p => p.status === 'valid');
    if (validUrls.length === 0) {
      toast.error('Aucune URL valide et nouvelle à importer');
      return;
    }

    setIsProcessing(true);
    setUploadProgress(0);

    try {
      // Prepare data for insertion
      const urlsToInsert = validUrls.map(p => ({
        url: p.url,
        categorie: selectedCategory,
        status: 'pending'
      }));

      // Insert URLs in batches
      const batchSize = 50;
      let inserted = 0;

      for (let i = 0; i < urlsToInsert.length; i += batchSize) {
        const batch = urlsToInsert.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('google_maps_urls')
          .insert(batch);

        if (error) {
          console.error('Error inserting batch:', error);
          toast.error(`Erreur lors de l'insertion du lot ${Math.floor(i/batchSize) + 1}`);
          continue;
        }

        inserted += batch.length;
        setUploadProgress(Math.round((inserted / urlsToInsert.length) * 100));
      }

      // Trigger the scraper function
      const { error: scraperError } = await supabase.functions.invoke('google-venues-scraper');
      
      if (scraperError) {
        console.error('Error triggering scraper:', scraperError);
        toast.warning('URLs importées mais erreur lors du déclenchement du scraper');
      } else {
        toast.success(`${inserted} URLs importées et traitement en cours`);
        onSuccess?.(); // Callback to refresh parent data
      }

      // Reset state
      setFile(null);
      setParsedUrls([]);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'import');
    } finally {
      setIsProcessing(false);
    }
  };

  const validCount = parsedUrls.filter(p => p.status === 'valid').length;
  const duplicateCount = parsedUrls.filter(p => p.status === 'duplicate').length;
  const invalidCount = parsedUrls.filter(p => p.status === 'invalid').length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import CSV d'URLs Google Maps
          </CardTitle>
          <CardDescription>
            Importez en masse des URLs Google Maps pour créer automatiquement des fiches prestataires.
            Le fichier CSV peut contenir les URLs dans n'importe quelle colonne.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie par défaut</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">Fichier CSV</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {parsedUrls.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{validCount} valides</span>
                  </div>
                  <div className="flex items-center gap-1 text-orange-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{duplicateCount} doublons</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>{invalidCount} invalides</span>
                  </div>
                </div>
                
                {uploadProgress > 0 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Import en cours... {uploadProgress}%
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleUpload}
              disabled={validCount === 0 || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <FileText className="h-4 w-4 mr-2 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Importer {validCount} URLs valides
                </>
              )}
            </Button>
          </div>

          {parsedUrls.length > 0 && (
            <div className="max-h-40 overflow-y-auto border rounded p-2 text-sm">
              {parsedUrls.slice(0, 10).map((parsed, index) => (
                <div key={index} className={`flex items-center gap-2 py-1 ${
                  parsed.status === 'valid' ? 'text-green-600' :
                  parsed.status === 'duplicate' ? 'text-orange-600' : 'text-red-600'
                }`}>
                  {parsed.status === 'valid' ? <CheckCircle className="h-3 w-3" /> : 
                   <AlertCircle className="h-3 w-3" />}
                  <span className="truncate flex-1">{parsed.url}</span>
                  {parsed.error && <span className="text-xs">({parsed.error})</span>}
                </div>
              ))}
              {parsedUrls.length > 10 && (
                <div className="text-muted-foreground text-center py-1">
                  ... et {parsedUrls.length - 10} autres
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CSVUploadTab;