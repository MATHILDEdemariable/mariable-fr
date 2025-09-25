import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { supabase } from '@/integrations/supabase/client';
import { generateBlogCSVTemplate } from '@/lib/csvExport';

interface CSVRow {
  title: string;
  subtitle?: string;
  category?: string;
  content?: string;
  tags?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  meta_title?: string;
  meta_description?: string;
  h1_title?: string;
  h2_titles?: string;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

interface ProcessingResult {
  success: number;
  errors: Array<{ row: number; error: string }>;
}

const BlogCSVImport: React.FC<{ onImportComplete: () => void }> = ({ onImportComplete }) => {
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRow = (row: CSVRow, index: number): ValidationError[] => {
    const errors: ValidationError[] = [];
    
    if (!row.title?.trim()) {
      errors.push({ row: index + 1, field: 'title', message: 'Le titre est obligatoire' });
    }
    
    if (row.status && !['draft', 'published'].includes(row.status)) {
      errors.push({ row: index + 1, field: 'status', message: 'Le statut doit être "draft" ou "published"' });
    }
    
    if (row.featured && !['true', 'false'].includes(String(row.featured))) {
      errors.push({ row: index + 1, field: 'featured', message: 'Featured doit être "true" ou "false"' });
    }
    
    return errors;
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('🚀 handleFileUpload started:', { filename: file.name });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('📊 CSV parsing completed:', { rowCount: results.data.length });
        
        const data = results.data as CSVRow[];
        setCsvData(data);
        
        // Valider toutes les lignes
        const allErrors: ValidationError[] = [];
        data.forEach((row, index) => {
          const rowErrors = validateRow(row, index);
          allErrors.push(...rowErrors);
        });
        
        setValidationErrors(allErrors);
        
        if (allErrors.length === 0) {
          toast.success(`${data.length} articles prêts à être importés`);
        } else {
          toast.warning(`${allErrors.length} erreurs de validation détectées`);
        }
      },
      error: (error) => {
        console.error('❌ CSV parsing error:', error);
        toast.error('Erreur lors de la lecture du fichier CSV');
      }
    });
  };

  const processImport = async () => {
    if (csvData.length === 0 || validationErrors.length > 0) {
      toast.error('Veuillez corriger les erreurs avant l\'import');
      return;
    }

    console.log('🚀 processImport started:', { articleCount: csvData.length });
    setIsProcessing(true);
    setProgress(0);
    
    const results: ProcessingResult = { success: 0, errors: [] };

    try {
      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i];
        setProgress(((i + 1) / csvData.length) * 100);

        try {
          // Préparer les données pour Supabase (avec current user pour RLS)
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            throw new Error('Utilisateur non authentifié');
          }

          const articleData = {
            title: row.title.trim(),
            subtitle: row.subtitle?.trim() || null,
            category: row.category?.trim() || null,
            content: row.content?.trim() || null,
            slug: generateSlug(row.title),
            tags: row.tags ? row.tags.split(',').map(tag => tag.trim()) : [],
            status: row.status || 'draft',
            featured: String(row.featured) === 'true' || row.featured === true,
            meta_title: row.meta_title?.trim() || null,
            meta_description: row.meta_description?.trim() || null,
            h1_title: row.h1_title?.trim() || null,
            h2_titles: row.h2_titles ? row.h2_titles.split(',').map(h => h.trim()) : [],
            order_index: 0,
            published_at: (row.status === 'published') ? new Date().toISOString() : null
          };

          console.log(`💾 Inserting article ${i + 1}:`, { title: articleData.title });

          const { error } = await supabase
            .from('blog_posts')
            .insert(articleData);

          if (error) {
            console.error(`❌ Insert error for article ${i + 1}:`, error);
            results.errors.push({ row: i + 1, error: error.message });
          } else {
            results.success++;
          }

        } catch (err) {
          console.error(`❌ Processing error for row ${i + 1}:`, err);
          results.errors.push({ row: i + 1, error: err.message });
        }

        // Pause pour éviter de surcharger
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResult(results);
      
      if (results.success > 0) {
        toast.success(`${results.success} articles importés avec succès !`);
        onImportComplete();
      }
      
      if (results.errors.length > 0) {
        toast.error(`${results.errors.length} erreurs lors de l'import`);
      }

    } catch (error) {
      console.error('❌ Erreur générale lors de l\'import:', error);
      toast.error('Erreur lors de l\'import des articles');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setCsvData([]);
    setValidationErrors([]);
    setResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import CSV en masse
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Download */}
          <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <div>
              <h4 className="font-medium">Template CSV</h4>
              <p className="text-sm text-gray-600">
                Téléchargez le template pour voir le format requis
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={generateBlogCSVTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Télécharger template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fichier CSV</label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Card className="border-red-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  Erreurs de validation ({validationErrors.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {validationErrors.slice(0, 10).map((error, idx) => (
                    <div key={idx} className="text-sm text-red-600">
                      Ligne {error.row}, {error.field}: {error.message}
                    </div>
                  ))}
                  {validationErrors.length > 10 && (
                    <div className="text-sm text-gray-500">
                      Et {validationErrors.length - 10} autres erreurs...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview */}
          {csvData.length > 0 && validationErrors.length === 0 && (
            <Card className="border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  Aperçu ({csvData.length} articles)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {csvData.slice(0, 5).map((row, idx) => (
                    <div key={idx} className="text-sm flex items-center gap-2">
                      <Badge variant={row.status === 'published' ? 'default' : 'secondary'}>
                        {row.status || 'draft'}
                      </Badge>
                      <span>{row.title}</span>
                      {String(row.featured) === 'true' && <Badge variant="outline">Featured</Badge>}
                    </div>
                  ))}
                  {csvData.length > 5 && (
                    <div className="text-sm text-gray-500">
                      Et {csvData.length - 5} autres articles...
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Processing */}
          {isProcessing && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Import en cours...</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {result && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Résultats de l'import
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  {result.success} articles importés avec succès
                </div>
                {result.errors.length > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-600">
                      <XCircle className="h-4 w-4" />
                      {result.errors.length} erreurs
                    </div>
                    <div className="max-h-20 overflow-y-auto text-sm text-gray-600">
                      {result.errors.slice(0, 3).map((err, idx) => (
                        <div key={idx}>Ligne {err.row}: {err.error}</div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={processImport}
              disabled={csvData.length === 0 || validationErrors.length > 0 || isProcessing}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {isProcessing ? 'Import en cours...' : `Importer ${csvData.length} articles`}
            </Button>
            
            {(csvData.length > 0 || result) && (
              <Button variant="outline" onClick={resetImport}>
                Réinitialiser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogCSVImport;