
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import vendorsData from '@/data/vendors.json';
import type { Database } from '@/integrations/supabase/types';
import { VendorJson } from '@/types/vendorTypes';

type Prestataire = Database['public']['Tables']['prestataires']['Row'];

// Convertir les données JSON au format attendu
const convertedVendors: VendorJson[] = Array.isArray(vendorsData) ? 
  vendorsData.map((vendor: any) => ({
    nom: vendor.nom || '',
    type_prestataire: vendor.type || vendor.type_prestataire || '',
    description_courte: vendor.description_courte || vendor.description || '',
    region: vendor.region || '',
    prix_affiche: vendor.prix_affiche || (vendor.budget ? `A partir de ${vendor.budget}€` : ''),
    distance_grande_ville: vendor.distance_grande_ville || vendor.lieu || '',
    instagram_url: vendor.instagram_url || vendor.lien || vendor.contact || '',
    sous_categorie: vendor.sous_categorie || '',
    capacite_max_invites: vendor.capacite_max_invites || '',
    brochure_url: vendor.brochure_url || ''
  })) : [];

const ImportAirtable = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    success: number;
    errors: number;
    errorDetails: any[];
    suggestions?: string[];
    photoCount?: number;
    brochureCount?: number;
  } | null>(null);

  const mapTypeToCategorie = (type: string): Database['public']['Enums']['prestataire_categorie'] => {
    const typeMapping: Record<string, Database['public']['Enums']['prestataire_categorie']> = {
      "Lieu de récéption": "Lieu de réception",
      "Restauration": "Traiteur",
      "Photographe": "Photographe",
      "Vidéaste": "Vidéaste",
      "Coordination": "Coordination",
      "Fleuriste": "Fleuriste",
      "Maquillage à domicile": "Décoration",
      "Conciergerie / Navette privée": "Coordination",
    };

    // Si le type contient plusieurs valeurs (séparées par des virgules), on prend la première
    const primaryType = type.split(',')[0].trim();
    return typeMapping[primaryType] || "Lieu de réception";
  };

  const extractPriceNumber = (priceString: string): number | null => {
    if (!priceString) return null;
    
    const matches = priceString.match(/(\d+)/);
    if (matches) {
      return Number(matches[1]);
    }
    return null;
  };

  const mapRegion = (region: string): Database['public']['Enums']['region_france'] | null => {
    const regionMapping: Record<string, Database['public']['Enums']['region_france']> = {
      "Centre Val-de-Loire": "Centre-Val de Loire",
      "Grand-Est": "Grand Est",
      "Aquitaine": "Nouvelle-Aquitaine",
      "Basse Normandie": "Normandie"
    };
    
    return region ? regionMapping[region] || null : null;
  };

  const handleImport = async () => {
    setIsLoading(true);
    setResults(null);

    const importResults = {
      success: 0,
      errors: 0,
      errorDetails: [] as any[],
      suggestions: [] as string[]
    };

    try {
      for (const vendor of convertedVendors) {
        try {
          const prestataireData = {
            nom: vendor.nom,
            categorie: mapTypeToCategorie(vendor.type_prestataire),
            description: vendor.description_courte || null,
            region: mapRegion(vendor.region || ''),
            prix_a_partir_de: extractPriceNumber(vendor.prix_affiche || ''),
            ville: vendor.distance_grande_ville ? vendor.distance_grande_ville.split(' ').pop() : null,
            distance: vendor.distance_grande_ville || null,
            site_web: vendor.instagram_url || null,
            visible: true
          };

          const { error } = await supabase
            .from('prestataires')
            .insert([prestataireData]);

          if (error) {
            console.error("Erreur lors de l'insertion:", error);
            importResults.errors++;
            importResults.errorDetails.push({
              nom: vendor.nom,
              error: error.message
            });
          } else {
            importResults.success++;
          }
        } catch (error: any) {
          console.error("Erreur pour le prestataire", vendor.nom, error);
          importResults.errors++;
          importResults.errorDetails.push({
            nom: vendor.nom,
            error: error.message
          });
        }
      }

      setResults(importResults);
      
      toast({
        title: "Importation terminée",
        description: `${importResults.success} prestataires importés avec succès.`,
      });
    } catch (error: any) {
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
                  <div className="text-3xl font-bold text-wedding-olive">{results.success}</div>
                  <div className="text-sm text-muted-foreground">Prestataires importés avec succès</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-3xl font-bold text-wedding-olive">{results.photoCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Photos importées</div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-md">
                  <div className="text-3xl font-bold text-wedding-olive">{results.brochureCount || 0}</div>
                  <div className="text-sm text-muted-foreground">Brochures importées</div>
                </div>
              </div>
              
              {results.errors > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2 text-red-600">{results.errors} erreurs détectées</h3>
                  <div className="bg-red-50 p-4 rounded-md max-h-60 overflow-auto">
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(results.errorDetails, null, 2)}</pre>
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
