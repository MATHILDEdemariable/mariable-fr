import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RefreshCw, Database, CheckCircle, XCircle, Clock, RotateCcw, AlertTriangle } from 'lucide-react';

interface UrlRecord {
  id: string;
  url: string;
  categorie: string;
  status: string;
  error_message: string | null;
  processed_at: string | null;
  created_at: string;
}

const ScraperManager = () => {
  const [pendingCount, setPendingCount] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [urlHistory, setUrlHistory] = useState<UrlRecord[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [lastResult, setLastResult] = useState<{
    success: number;
    errors: number;
    timestamp: Date;
  } | null>(null);

  const loadData = async () => {
    try {
      // Load pending count
      const { count: pending, error: pendingError } = await supabase
        .from('google_maps_urls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) throw pendingError;
      setPendingCount(pending || 0);

      // Load error count
      const { count: errors, error: errorError } = await supabase
        .from('google_maps_urls')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'error');

      if (errorError) throw errorError;
      setErrorCount(errors || 0);

      // Load URL history (last 30 URLs)
      const { data: history, error: historyError } = await supabase
        .from('google_maps_urls')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (historyError) throw historyError;
      setUrlHistory(history || []);

    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
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

      await loadData();
      
    } catch (error) {
      console.error('Erreur lors du lancement du scraper:', error);
      toast.error('Erreur lors du lancement du scraper');
    } finally {
      setIsRunning(false);
    }
  };

  const handleResetAllErrors = async () => {
    if (errorCount === 0) {
      toast.info('Aucune erreur à relancer');
      return;
    }

    setIsResetting(true);
    
    try {
      const { error } = await supabase
        .from('google_maps_urls')
        .update({ 
          status: 'pending', 
          error_message: null, 
          processed_at: null 
        })
        .eq('status', 'error');

      if (error) throw error;

      toast.success(`✅ ${errorCount} URL${errorCount > 1 ? 's' : ''} remise${errorCount > 1 ? 's' : ''} en attente`);
      setSelectedUrls(new Set());
      await loadData();
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast.error('Erreur lors de la réinitialisation des URLs');
    } finally {
      setIsResetting(false);
    }
  };

  const handleResetSelected = async () => {
    if (selectedUrls.size === 0) {
      toast.info('Sélectionnez des URLs à relancer');
      return;
    }

    setIsResetting(true);
    
    try {
      const { error } = await supabase
        .from('google_maps_urls')
        .update({ 
          status: 'pending', 
          error_message: null, 
          processed_at: null 
        })
        .in('id', Array.from(selectedUrls));

      if (error) throw error;

      toast.success(`✅ ${selectedUrls.size} URL${selectedUrls.size > 1 ? 's' : ''} remise${selectedUrls.size > 1 ? 's' : ''} en attente`);
      setSelectedUrls(new Set());
      await loadData();
      
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast.error('Erreur lors de la réinitialisation des URLs');
    } finally {
      setIsResetting(false);
    }
  };

  const toggleUrlSelection = (id: string) => {
    const newSelected = new Set(selectedUrls);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUrls(newSelected);
  };

  const selectAllErrors = () => {
    const errorIds = urlHistory.filter(u => u.status === 'error').map(u => u.id);
    setSelectedUrls(new Set(errorIds));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Succès</Badge>;
      case 'error':
        return <Badge variant="destructive">Erreur</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">En attente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const extractPlaceName = (url: string) => {
    try {
      const match = url.match(/place\/([^\/]+)/);
      if (match) {
        return decodeURIComponent(match[1].replace(/\+/g, ' ')).substring(0, 40);
      }
      return url.substring(0, 40);
    } catch {
      return url.substring(0, 40);
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
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">URLs en attente</p>
              <p className="text-3xl font-bold text-wedding-olive">{pendingCount}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">URLs en erreur</p>
              <p className="text-3xl font-bold text-red-600">{errorCount}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
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

        {/* Actions */}
        <div className="flex flex-wrap gap-2">
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
            onClick={handleResetAllErrors}
            disabled={isResetting || errorCount === 0}
            className="flex-1"
          >
            {isResetting ? (
              <>
                <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                Réinitialisation...
              </>
            ) : (
              <>
                <RotateCcw className="h-4 w-4 mr-2" />
                Relancer toutes les erreurs ({errorCount})
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={loadData}
            disabled={isRunning || isResetting}
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

        {/* URL History */}
        {urlHistory.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Historique récent ({urlHistory.length} URLs)</h4>
              <div className="flex gap-2">
                {selectedUrls.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetSelected}
                    disabled={isResetting}
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Relancer sélection ({selectedUrls.size})
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllErrors}
                >
                  Sélectionner erreurs
                </Button>
              </div>
            </div>
            
            <div className="border rounded-lg max-h-80 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr>
                    <th className="p-2 text-left w-8"></th>
                    <th className="p-2 text-left">Statut</th>
                    <th className="p-2 text-left">Lieu</th>
                    <th className="p-2 text-left">Catégorie</th>
                    <th className="p-2 text-left">Erreur</th>
                  </tr>
                </thead>
                <tbody>
                  {urlHistory.map((url) => (
                    <tr 
                      key={url.id} 
                      className={`border-t hover:bg-muted/50 ${
                        url.status === 'error' ? 'bg-red-50' : 
                        url.status === 'success' ? 'bg-green-50' : 
                        'bg-yellow-50'
                      }`}
                    >
                      <td className="p-2">
                        {url.status === 'error' && (
                          <Checkbox
                            checked={selectedUrls.has(url.id)}
                            onCheckedChange={() => toggleUrlSelection(url.id)}
                          />
                        )}
                      </td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(url.status)}
                          {getStatusBadge(url.status)}
                        </div>
                      </td>
                      <td className="p-2 font-medium truncate max-w-[200px]" title={url.url}>
                        {extractPlaceName(url.url)}
                      </td>
                      <td className="p-2 text-muted-foreground">
                        {url.categorie}
                      </td>
                      <td className="p-2 text-red-600 text-xs truncate max-w-[200px]" title={url.error_message || ''}>
                        {url.error_message || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ScraperManager;
