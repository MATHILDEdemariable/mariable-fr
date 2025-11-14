import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Image, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface MigrationResult {
  name: string;
  success: boolean;
  error?: string;
}

export const PhotoMigrationManager = () => {
  const [photosToMigrate, setPhotosToMigrate] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResults, setMigrationResults] = useState<{
    migrated: number;
    errors: number;
    remaining: number;
    results?: MigrationResult[];
  } | null>(null);

  const loadPendingPhotos = async () => {
    setIsLoading(true);
    try {
      const { count, error } = await supabase
        .from('prestataires_photos_preprod')
        .select('*', { count: 'exact', head: true })
        .like('url', '%maps.googleapis.com%')
        .eq('principale', true);

      if (error) throw error;
      setPhotosToMigrate(count || 0);
    } catch (error) {
      console.error('Error loading photos count:', error);
      toast.error('Erreur lors du chargement du compteur');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPendingPhotos();
  }, []);

  const handleMigrate = async () => {
    setIsMigrating(true);
    setMigrationResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('migrate-google-photos');

      if (error) throw error;

      if (data && data.success) {
        setMigrationResults({
          migrated: data.migrated,
          errors: data.errors,
          remaining: data.remaining,
          results: data.results
        });

        if (data.migrated > 0) {
          toast.success(`✅ ${data.migrated} photo${data.migrated > 1 ? 's' : ''} migrée${data.migrated > 1 ? 's' : ''} avec succès`);
        }

        if (data.errors > 0) {
          toast.error(`❌ ${data.errors} erreur${data.errors > 1 ? 's' : ''} rencontrée${data.errors > 1 ? 's' : ''}`);
        }

        // Rafraîchir le compteur
        await loadPendingPhotos();
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast.error('Erreur lors de la migration des photos');
    } finally {
      setIsMigrating(false);
    }
  };

  const progressPercentage = migrationResults 
    ? Math.round(((migrationResults.migrated + migrationResults.errors) / (migrationResults.migrated + migrationResults.errors + migrationResults.remaining)) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Migration des Photos vers Supabase Storage
        </CardTitle>
        <CardDescription>
          Migrez les URLs temporaires Google Maps vers des URLs permanentes Supabase Storage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Compteur de photos à migrer */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Photos à migrer</p>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                photosToMigrate
              )}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={loadPendingPhotos}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Bouton de migration */}
        <Button
          onClick={handleMigrate}
          disabled={isMigrating || photosToMigrate === 0}
          className="w-full"
          size="lg"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migration en cours...
            </>
          ) : (
            <>
              <Image className="mr-2 h-4 w-4" />
              Migrer 20 photos (max)
            </>
          )}
        </Button>

        {/* Info sur le processus par batch */}
        {photosToMigrate > 20 && (
          <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
            ℹ️ La migration traite 20 photos par exécution. Vous devrez lancer la migration{' '}
            <strong>{Math.ceil(photosToMigrate / 20)} fois</strong> pour migrer toutes les photos.
          </div>
        )}

        {/* Résultats de la migration */}
        {migrationResults && (
          <div className="space-y-3">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium">
                    {migrationResults.migrated} photo{migrationResults.migrated > 1 ? 's' : ''} migrée{migrationResults.migrated > 1 ? 's' : ''}
                  </span>
                </div>
                {migrationResults.errors > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium text-red-600">
                      {migrationResults.errors} erreur{migrationResults.errors > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>

              {migrationResults.remaining > 0 && (
                <>
                  <Progress value={progressPercentage} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    Encore {migrationResults.remaining} photo{migrationResults.remaining > 1 ? 's' : ''} à migrer
                  </p>
                </>
              )}

              {migrationResults.remaining === 0 && (
                <div className="text-sm font-medium text-green-600">
                  ✅ Migration terminée ! Toutes les photos ont été migrées.
                </div>
              )}
            </div>

            {/* Détails des résultats */}
            {migrationResults.results && migrationResults.results.length > 0 && (
              <details className="text-sm">
                <summary className="cursor-pointer font-medium mb-2">
                  Voir les détails ({migrationResults.results.length} prestataires)
                </summary>
                <div className="space-y-1 max-h-60 overflow-y-auto border rounded p-2">
                  {migrationResults.results.map((result, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-2 p-2 rounded ${
                        result.success ? 'bg-green-50 dark:bg-green-950/20' : 'bg-red-50 dark:bg-red-950/20'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{result.name}</p>
                        {result.error && (
                          <p className="text-xs text-red-600">{result.error}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
