import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileUp, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BlogHtmlImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportSuccess: () => void;
}

const BlogHtmlImport: React.FC<BlogHtmlImportProps> = ({ open, onOpenChange, onImportSuccess }) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const extractTitleFromHtml = (html: string): string => {
    // Chercher un h1
    const h1Match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (h1Match) {
      return h1Match[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Sinon chercher un title
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Défaut
    return 'Article sans titre';
  };

  const extractContentFromHtml = (html: string): string => {
    // Extraire le contenu du body si présent
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      return bodyMatch[1].trim();
    }
    
    // Sinon retourner tout le HTML
    return html.trim();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/html') {
      setFile(selectedFile);
    } else {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier HTML (.html)',
        variant: 'destructive',
      });
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner un fichier HTML',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    console.log('🚀 Import HTML started:', { fileName: file.name });

    try {
      const htmlContent = await file.text();
      const title = extractTitleFromHtml(htmlContent);
      const content = extractContentFromHtml(htmlContent);
      const slug = generateSlug(title);

      console.log('📝 Parsed HTML:', { title, slug, contentLength: content.length });

      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error('Non authentifié');
      }

      const { error } = await supabase.from('blog_posts').insert({
        title,
        slug,
        content,
        status: 'draft',
        h1_title: title,
      });

      if (error) throw error;

      console.log('✅ Article HTML importé avec succès');
      
      toast({
        title: 'Succès',
        description: 'Article HTML importé avec succès en mode brouillon',
      });

      setFile(null);
      onOpenChange(false);
      onImportSuccess();
    } catch (error) {
      console.error('❌ Erreur lors de l\'import HTML:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors de l\'import du fichier HTML',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importer un article HTML</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="html-file">Fichier HTML</Label>
            <Input
              id="html-file"
              type="file"
              accept=".html"
              onChange={handleFileChange}
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground">
              Le système extraira automatiquement le titre (depuis &lt;h1&gt; ou &lt;title&gt;) et le contenu du fichier HTML.
            </p>
          </div>

          {file && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">
                <strong>Fichier sélectionné :</strong> {file.name}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isImporting}
            >
              Annuler
            </Button>
            <Button onClick={handleImport} disabled={!file || isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Importer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BlogHtmlImport;
