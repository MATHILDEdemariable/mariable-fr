import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import QRCode from 'qrcode';
import { Download, RefreshCw, ScanLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

type QrStat = { slug: string; label: string; target_url: string; scan_count: number; last_scanned_at: string | null };

const PIN_STORAGE_KEY = 'immersion_admin_pin';
const PUBLIC_BASE_URL = 'https://mariable.fr';

const downloadFile = (href: string, fileName: string) => {
  const link = document.createElement('a');
  link.href = href;
  link.download = fileName;
  link.click();
};

const QrCard = ({ qrStat, pin, onSaved }: { qrStat: QrStat; pin: string; onSaved: () => void }) => {
  const scanUrl = `${PUBLIC_BASE_URL}/qr/${qrStat.slug}`;
  const [previewUrl, setPreviewUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState(qrStat.target_url);

  useEffect(() => {
    QRCode.toDataURL(scanUrl, { width: 400, margin: 2, errorCorrectionLevel: 'H' }).then(setPreviewUrl);
  }, [scanUrl]);

  const handleDownloadPng = async () => {
    const pngUrl = await QRCode.toDataURL(scanUrl, { width: 2000, margin: 4, errorCorrectionLevel: 'H' });
    downloadFile(pngUrl, `QR_${qrStat.slug}_HD.png`);
  };

  const handleDownloadSvg = async () => {
    const svgText = await QRCode.toString(scanUrl, { type: 'svg', margin: 4, errorCorrectionLevel: 'H' });
    const blobUrl = URL.createObjectURL(new Blob([svgText], { type: 'image/svg+xml' }));
    downloadFile(blobUrl, `QR_${qrStat.slug}.svg`);
    URL.revokeObjectURL(blobUrl);
  };

  const handleSaveTarget = async () => {
    const { error } = await supabase.rpc('update_immersion_qr_target' as never, { pin_value: pin, slug_value: qrStat.slug, target_value: targetUrl } as never);
    if (error) {
      console.error('❌ update_immersion_qr_target failed:', error);
      toast({ variant: 'destructive', description: "Impossible d'enregistrer la page d'arrivée." });
      return;
    }
    toast({ description: "Page d'arrivée mise à jour, sans réimpression." });
    onSaved();
  };

  return (
    <article className="border border-border bg-card p-5 md:p-6 grid gap-6 md:grid-cols-[220px_1fr]">
      <div className="flex flex-col items-center gap-3">
        {previewUrl && <img src={previewUrl} alt={`QR code ${qrStat.label}`} className="w-48 h-48" />}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleDownloadPng}><Download className="h-4 w-4 mr-1" />PNG HD</Button>
          <Button size="sm" variant="outline" onClick={handleDownloadSvg}><Download className="h-4 w-4 mr-1" />SVG</Button>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="font-serif text-xl text-foreground">{qrStat.label}</h2>
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-5xl text-primary">{qrStat.scan_count}</span>
          <span className="text-muted-foreground">scans</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Dernier scan : {qrStat.last_scanned_at ? new Date(qrStat.last_scanned_at).toLocaleString('fr-FR') : 'aucun pour le moment'}
        </p>
        <p className="text-sm text-muted-foreground break-all">Lien imprimé : <span className="text-foreground">{scanUrl}</span></p>
        <div className="space-y-2">
          <Label htmlFor={`target-${qrStat.slug}`}>Page d'arrivée (modifiable après impression)</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input id={`target-${qrStat.slug}`} value={targetUrl} onChange={(event) => setTargetUrl(event.target.value)} />
            <Button onClick={handleSaveTarget} disabled={targetUrl === qrStat.target_url}>Enregistrer</Button>
          </div>
        </div>
      </div>
    </article>
  );
};

const ImmersionMariageAdmin = () => {
  const [pin, setPin] = useState(() => localStorage.getItem(PIN_STORAGE_KEY) || '');
  const [pinInput, setPinInput] = useState('');
  const [qrStats, setQrStats] = useState<QrStat[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadStats = async (pinValue: string) => {
    setIsLoading(true);
    const { data, error } = await supabase.rpc('get_immersion_qr_stats' as never, { pin_value: pinValue } as never);
    setIsLoading(false);
    if (error) {
      console.error('❌ get_immersion_qr_stats failed:', error);
      localStorage.removeItem(PIN_STORAGE_KEY);
      setPin('');
      setQrStats(null);
      toast({ variant: 'destructive', description: 'Code PIN incorrect.' });
      return;
    }
    localStorage.setItem(PIN_STORAGE_KEY, pinValue);
    setPin(pinValue);
    setQrStats((data as QrStat[]) || []);
  };

  useEffect(() => {
    if (!pin) return;
    loadStats(pin);
    const intervalId = window.setInterval(() => loadStats(pin), 30000);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  const handlePinSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    loadStats(pinInput.trim());
  };

  const totalScans = (qrStats || []).reduce((total, qrStat) => total + qrStat.scan_count, 0);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Immersion Mariage – Tableau de bord</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Immersion Mariage · Propulsé par Mariable</p>
        <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-8">Tableau de bord</h1>

        {!qrStats ? (
          <form onSubmit={handlePinSubmit} className="max-w-xs space-y-3 border border-border bg-card p-6">
            <Label htmlFor="adminPin">Code PIN</Label>
            <Input id="adminPin" type="password" inputMode="numeric" autoComplete="off" value={pinInput} onChange={(event) => setPinInput(event.target.value)} />
            <Button type="submit" className="w-full" disabled={isLoading || !pinInput}>Accéder</Button>
          </form>
        ) : (
          <section className="space-y-6">
            <div className="flex items-center justify-between border border-border bg-card p-5">
              <div className="flex items-center gap-3">
                <ScanLine className="h-6 w-6 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-sm text-muted-foreground">Total des scans</h2>
                  <p className="font-serif text-3xl text-foreground">{totalScans}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={() => loadStats(pin)} aria-label="Actualiser">
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
            {qrStats.map((qrStat) => (
              <QrCard key={qrStat.slug + qrStat.target_url} qrStat={qrStat} pin={pin} onSaved={() => loadStats(pin)} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default ImmersionMariageAdmin;
