import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Image, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const PhotoCompressionManager: React.FC = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    remaining: 0,
    compressed: 0,
    totalSavingsKB: 0
  });
  const [results, setResults] = useState<any[]>([]);

  const fetchStats = async () => {
    try {
      const { count } = await supabase
        .from('prestataires_photos_preprod')
        .select('*', { count: 'exact', head: true })
        .is('thumbnail_url', null)
        .not('url', 'is', null);

      const { count: totalCount } = await supabase
        .from('prestataires_photos_preprod')
        .select('*', { count: 'exact', head: true })
        .not('url', 'is', null);

      setStats(prev => ({
        ...prev,
        remaining: count || 0,
        total: totalCount || 0
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleCompress = async () => {
    setIsCompressing(true);
    setProgress(0);
    setResults([]);

    try {
      let totalCompressed = 0;
      let totalSavings = 0;
      let batchResults: any[] = [];
      let consecutiveErrors = 0;
      const MAX_CONSECUTIVE_ERRORS = 3;
      let batchNumber = 0;

      // Traiter par batch jusqu'à ce qu'il n'y ait plus de photos
      while (consecutiveErrors < MAX_CONSECUTIVE_ERRORS) {
        batchNumber++;
        
        toast.info('Compression en cours...', {
          description: `Batch ${batchNumber} en cours (5 photos)`
        });

        const { data, error } = await supabase.functions.invoke('batch-compress-existing');

        if (error || !data?.success) {
          consecutiveErrors++;
          console.error('Batch error:', error || data?.error);
          
          if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            throw new Error(`Arrêt après ${MAX_CONSECUTIVE_ERRORS} erreurs consécutives. Vérifiez les logs Supabase.`);
          }
          
          toast.warning(`Erreur batch ${batchNumber}, nouvelle tentative...`, {
            description: `Tentative ${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}`
          });
          
          // Attendre plus longtemps avant de réessayer
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue;
        }

        // Réinitialiser le compteur d'erreurs si succès
        consecutiveErrors = 0;
        totalCompressed += data.compressed || 0;
        totalSavings += data.total_savings_kb || 0;
        
        if (data.results) {
          batchResults = [...batchResults, ...data.results];
        }

        setStats(prev => ({
          ...prev,
          compressed: totalCompressed,
          remaining: data.remaining || 0,
          totalSavingsKB: totalSavings
        }));

        setResults(batchResults);
        
        // Calculer le progrès
        if (totalCompressed + data.remaining > 0) {
          const progressPercent = Math.round(
            (totalCompressed / (totalCompressed + data.remaining)) * 100
          );
          setProgress(progressPercent);
        }

        // Arrêter si aucune photo n'a été traitée (toutes en erreur)
        if (data.compressed === 0 && data.remaining > 0) {
          throw new Error('Aucune photo n\'a pu être compressée dans ce batch. Vérifiez les formats de fichiers.');
        }

        // Si plus de photos à traiter, arrêter
        if (data.remaining === 0) {
          toast.success('Compression terminée !', {
            description: `${totalCompressed} photos compressées, ${Math.round(totalSavings / 1024)} MB économisés`
          });
          break;
        }

        // Pause entre les batches
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await fetchStats();
    } catch (error: any) {
      console.error('Compression error:', error);
      toast.error('Erreur lors de la compression', {
        description: error.message
      });
    } finally {
      setIsCompressing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Image className="w-5 h-5" />
          Optimisation des Photos
        </CardTitle>
        <CardDescription>
          Compressez les photos existantes pour réduire l'utilisation du stockage et améliorer les performances
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">À optimiser</p>
            <p className="text-2xl font-bold text-orange-600">{stats.remaining}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Optimisées</p>
            <p className="text-2xl font-bold text-green-600">{stats.compressed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Économies</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round(stats.totalSavingsKB / 1024)} MB
            </p>
          </div>
        </div>

        {/* Barre de progression */}
        {isCompressing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}

        {/* Bouton de compression */}
        <Button
          onClick={handleCompress}
          disabled={isCompressing || stats.remaining === 0}
          className="w-full"
        >
          {isCompressing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Compression en cours...
            </>
          ) : stats.remaining === 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Toutes les photos sont optimisées
            </>
          ) : (
            <>
              <Image className="w-4 h-4 mr-2" />
              Optimiser {stats.remaining} photo{stats.remaining > 1 ? 's' : ''}
            </>
          )}
        </Button>

        {/* Estimation des gains */}
        {stats.remaining > 0 && !isCompressing && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">Estimation des gains :</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Réduction de taille : ~80%</li>
              <li>• Économie estimée : ~{Math.round((stats.remaining * 500) / 1024)} MB</li>
              <li>• Temps de chargement : -60% sur mobile</li>
            </ul>
          </div>
        )}

        {/* Résultats */}
        {results.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Derniers résultats :</p>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {results.slice(-10).reverse().map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 rounded bg-muted"
                >
                  <span className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    {result.name}
                  </span>
                  {result.success && (
                    <span className="text-xs text-muted-foreground">
                      -{result.savings_percent}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoCompressionManager;
