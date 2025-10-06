import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Database, CheckCircle, XCircle, Clock } from 'lucide-react';

const ScraperManager = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: number;
    errors: number;
    timestamp: Date;
  } | null>(null);

  const loadPendingCount = async () => {
    try {
      const { count, error } = await supabase
        .from('google_maps_urls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Erreur lors du chargement des URLs en attente:', error);
    }
  };

  useEffect(() => {
    loadPendingCount();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRunScraper = async () => {
    if (pendingCount === 0) {
      toast.info('Aucune URL en attente à traiter');
      return;
    }

    setIsRunning(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-venues-scraper');

      if (error) {
        console.error('Erreur scraper:', error);
        toast.error('Erreur lors du lancement du scraper');
        return;
      }

      if (data) {
        const result = {
          success: data.success_count || 0,
          errors: data.error_count || 0,
          timestamp: new Date()
        };
        setLastResult(result);

        if (result.success > 0) {
          toast.success(`✅ ${result.success} lieu${result.success > 1 ? 'x' : ''} traité${result.success > 1 ? 's' : ''} avec succès`);
        }
        
        if (result.errors > 0) {
          toast.warning(`⚠️ ${result.errors} erreur${result.errors > 1 ? 's' : ''} rencontrée${result.errors > 1 ? 's' : ''}`);
        }
      }

      // Refresh pending count
      await loadPendingCount();
      
    } catch (error) {
      console.error('Erreur lors du lancement du scraper:', error);
      toast.error('Erreur lors du lancement du scraper');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Google Venues Scraper
        </CardTitle>
        <CardDescription>
          Traiter les URLs Google Maps en attente pour créer automatiquement des fiches prestataires
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium text-muted-foreground">URLs en attente</p>
            <p className="text-3xl font-bold text-wedding-olive">{pendingCount}</p>
          </div>
          <Clock className="h-8 w-8 text-muted-foreground" />
        </div>

        {lastResult && (
          <div className="space-y-2 p-4 border rounded-lg">
            <p className="text-sm font-medium">Dernier traitement</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{lastResult.success} succès</span>
              </div>
              <div className="flex items-center gap-1 text-red-600">
                <XCircle className="h-4 w-4" />
                <span>{lastResult.errors} erreurs</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {lastResult.timestamp.toLocaleString('fr-FR')}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            onClick={handleRunScraper}
            disabled={isRunning || pendingCount === 0}
            className="flex-1"
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Traitement en cours...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Lancer le scraper
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={loadPendingCount}
            disabled={isRunning}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {pendingCount > 20 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              ℹ️ Le scraper traite jusqu'à 20 URLs par exécution. 
              Vous devrez relancer {Math.ceil(pendingCount / 20)} fois pour tout traiter.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScraperManager;
