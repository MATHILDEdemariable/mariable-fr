
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';

const ImportAirtable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleImport = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const response = await fetch(
        'https://bgidfcqktsttzlwlumtz.supabase.co/functions/v1/import-airtable', 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue lors de l\'importation');
      }

      setResults(data);
      toast({
        title: "Importation terminée",
        description: `${data.results.success} prestataires importés avec succès.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'importation:", error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="container max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-serif mb-6">Importation Airtable</h1>
        
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-2">Importer les données d'Airtable</h2>
            <p className="text-muted-foreground">
              Cette fonctionnalité va importer les données des prestataires depuis Airtable vers la base de données Supabase.
            </p>
          </div>
          
          <Button 
            onClick={handleImport}
            disabled={isLoading}
            className="bg-wedding-olive hover:bg-wedding-olive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importation en cours...
              </>
            ) : "Lancer l'importation"}
          </Button>
        </Card>
        
        {results && (
          <Card className="p-6 mt-6">
            <h2 className="text-xl font-medium mb-4">Résultats de l'importation</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-3xl font-bold text-wedding-olive">{results.results.success}</div>
                  <div className="text-sm text-muted-foreground">Prestataires importés avec succès</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-3xl font-bold text-wedding-olive">{results.results.photoCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Photos importées</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-3xl font-bold text-wedding-olive">{results.results.brochureCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Brochures importées</div>
                </div>
              </div>
              
              {results.results.errors > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2 text-red-600">{results.results.errors} erreurs détectées</h3>
                  <div className="bg-red-50 p-4 rounded-md max-h-60 overflow-auto">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(results.results.errorDetails, null, 2)}</pre>
                  </div>
                </div>
              )}
              
              {results.suggestions && results.suggestions.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Suggestions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {results.suggestions.map((suggestion: string, index: number) => (
                      <li key={index} className="text-muted-foreground">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
};

export default ImportAirtable;
