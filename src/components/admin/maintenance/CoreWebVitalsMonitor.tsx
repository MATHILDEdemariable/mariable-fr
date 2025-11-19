import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { onCLS, onLCP, onINP, onTTFB, onFCP } from 'web-vitals';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface WebVitalsMetrics {
  lcp: number | null;
  fcp: number | null;
  cls: number | null;
  inp: number | null;
  ttfb: number | null;
}

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  status: 'success' | 'warning' | 'error' | 'loading';
  target: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, subtitle, value, status, target }) => {
  const statusColors = {
    success: 'border-green-500 bg-green-50',
    warning: 'border-yellow-500 bg-yellow-50',
    error: 'border-red-500 bg-red-50',
    loading: 'border-gray-300 bg-gray-50',
  };

  const statusIcons = {
    success: '✅',
    warning: '⚠️',
    error: '❌',
    loading: '⏳',
  };

  return (
    <Card className={`p-4 border-2 ${statusColors[status]}`}>
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-bold">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-2xl">{statusIcons[status]}</span>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground mt-1">Objectif : {target}</p>
      </div>
    </Card>
  );
};

const CoreWebVitalsMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    lcp: null,
    fcp: null,
    cls: null,
    inp: null,
    ttfb: null,
  });
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    // Capturer les métriques
    onLCP((metric) => {
      setMetrics(prev => ({ ...prev, lcp: metric.value }));
      saveMetricToDb('LCP', metric.value);
    });
    
    onFCP((metric) => {
      setMetrics(prev => ({ ...prev, fcp: metric.value }));
      saveMetricToDb('FCP', metric.value);
    });
    
    onCLS((metric) => {
      setMetrics(prev => ({ ...prev, cls: metric.value }));
      saveMetricToDb('CLS', metric.value);
    });
    
    onINP((metric) => {
      setMetrics(prev => ({ ...prev, inp: metric.value }));
      saveMetricToDb('INP', metric.value);
    });
    
    onTTFB((metric) => {
      setMetrics(prev => ({ ...prev, ttfb: metric.value }));
      saveMetricToDb('TTFB', metric.value);
    });

    setTimeout(() => setIsCapturing(false), 5000);
  }, []);

  const saveMetricToDb = async (metricName: string, value: number) => {
    // Temporairement commenté jusqu'à la création de la table
    console.log('Metric captured:', metricName, value);
  };

  const getStatus = (metricName: string, value: number | null): 'success' | 'warning' | 'error' | 'loading' => {
    if (value === null) return 'loading';
    
    const thresholds: Record<string, { good: number; poor: number }> = {
      lcp: { good: 2500, poor: 4000 },
      fcp: { good: 1800, poor: 3000 },
      cls: { good: 0.1, poor: 0.25 },
      inp: { good: 200, poor: 500 },
      ttfb: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metricName];
    if (value <= threshold.good) return 'success';
    if (value <= threshold.poor) return 'warning';
    return 'error';
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const globalScore = useMemo(() => {
    const scores = {
      lcp: metrics.lcp !== null ? (metrics.lcp <= 2500 ? 100 : metrics.lcp <= 4000 ? 50 : 0) : 0,
      fcp: metrics.fcp !== null ? (metrics.fcp <= 1800 ? 100 : metrics.fcp <= 3000 ? 50 : 0) : 0,
      cls: metrics.cls !== null ? (metrics.cls <= 0.1 ? 100 : metrics.cls <= 0.25 ? 50 : 0) : 0,
      inp: metrics.inp !== null ? (metrics.inp <= 200 ? 100 : metrics.inp <= 500 ? 50 : 0) : 0,
      ttfb: metrics.ttfb !== null ? (metrics.ttfb <= 800 ? 100 : metrics.ttfb <= 1800 ? 50 : 0) : 0,
    };
    const validScores = Object.values(scores).filter(s => s > 0);
    if (validScores.length === 0) return 0;
    return Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length);
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* Header avec score global */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Score Global</h2>
            <p className="text-muted-foreground">Core Web Vitals Performance</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">{globalScore}/100</div>
            <Button onClick={handleRefresh} size="sm" className="mt-2" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </Button>
          </div>
        </div>
      </Card>

      {/* Info capture */}
      {isCapturing && (
        <Card className="p-4 border-blue-500 bg-blue-50">
          <p className="text-sm">
            ⏳ Capture des métriques en cours... Les valeurs s'afficheront progressivement.
          </p>
        </Card>
      )}

      {/* Métriques en temps réel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="LCP"
          subtitle="Largest Contentful Paint"
          value={metrics.lcp ? `${(metrics.lcp / 1000).toFixed(2)}s` : '...'}
          status={getStatus('lcp', metrics.lcp)}
          target="< 2.5s"
        />
        <MetricCard
          title="FCP"
          subtitle="First Contentful Paint"
          value={metrics.fcp ? `${(metrics.fcp / 1000).toFixed(2)}s` : '...'}
          status={getStatus('fcp', metrics.fcp)}
          target="< 1.8s"
        />
        <MetricCard
          title="CLS"
          subtitle="Cumulative Layout Shift"
          value={metrics.cls !== null ? metrics.cls.toFixed(3) : '...'}
          status={getStatus('cls', metrics.cls)}
          target="< 0.1"
        />
        <MetricCard
          title="INP"
          subtitle="Interaction to Next Paint"
          value={metrics.inp ? `${metrics.inp.toFixed(0)}ms` : '...'}
          status={getStatus('inp', metrics.inp)}
          target="< 200ms"
        />
        <MetricCard
          title="TTFB"
          subtitle="Time to First Byte"
          value={metrics.ttfb ? `${metrics.ttfb.toFixed(0)}ms` : '...'}
          status={getStatus('ttfb', metrics.ttfb)}
          target="< 800ms"
        />
      </div>

      {/* Explications */}
      <Card>
        <CardHeader>
          <CardTitle>📚 Comprendre les Core Web Vitals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">LCP - Largest Contentful Paint</h4>
            <p className="text-sm text-muted-foreground">
              Temps nécessaire pour afficher le plus grand élément visible de la page. 
              Bon : &lt;2.5s, Moyen : 2.5-4s, Mauvais : &gt;4s
            </p>
          </div>
          <div>
            <h4 className="font-semibold">FCP - First Contentful Paint</h4>
            <p className="text-sm text-muted-foreground">
              Temps pour afficher le premier contenu (texte, image, etc.).
              Bon : &lt;1.8s, Moyen : 1.8-3s, Mauvais : &gt;3s
            </p>
          </div>
          <div>
            <h4 className="font-semibold">CLS - Cumulative Layout Shift</h4>
            <p className="text-sm text-muted-foreground">
              Mesure la stabilité visuelle (éviter les déplacements inattendus).
              Bon : &lt;0.1, Moyen : 0.1-0.25, Mauvais : &gt;0.25
            </p>
          </div>
          <div>
            <h4 className="font-semibold">INP - Interaction to Next Paint</h4>
            <p className="text-sm text-muted-foreground">
              Temps de réponse aux interactions utilisateur sur toute la session.
              Bon : &lt;200ms, Moyen : 200-500ms, Mauvais : &gt;500ms
            </p>
          </div>
          <div>
            <h4 className="font-semibold">TTFB - Time to First Byte</h4>
            <p className="text-sm text-muted-foreground">
              Temps pour recevoir le premier octet du serveur.
              Bon : &lt;800ms, Moyen : 800-1800ms, Mauvais : &gt;1800ms
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions recommandées */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle>💡 Actions pour améliorer les scores</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            • <strong>LCP</strong> : Optimiser images (WebP, lazy loading ✅), utiliser CDN, réduire JS initial
          </p>
          <p className="text-sm">
            • <strong>FCP</strong> : Réduire temps d'exécution JS, code splitting ✅, optimiser CSS
          </p>
          <p className="text-sm">
            • <strong>CLS</strong> : Définir dimensions images/vidéos, éviter insertion dynamique contenu
          </p>
          <p className="text-sm">
            • <strong>INP</strong> : Optimiser event handlers, utiliser requestIdleCallback
          </p>
          <p className="text-sm">
            • <strong>TTFB</strong> : Optimiser backend, utiliser cache, CDN ✅
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

// Ajout du useMemo pour le score global
import { useMemo } from 'react';

export default CoreWebVitalsMonitor;
