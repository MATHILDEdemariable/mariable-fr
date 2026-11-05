import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import QRCode from 'qrcode';
import { Download, RefreshCw, ScanLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

type Lead = { id: string; vendor_slug: string; vendor_name: string; first_name: string; last_name: string; email: string; phone: string | null; wedding_date: string | null; wedding_location: string | null; message: string | null; wants_quote: boolean; created_at: string };
type Feedback = { id: string; rating_overall: number; rating_vendors: number; rating_ambiance: number; rating_welcome: number; rating_recommend: number; comment: string | null; created_at: string };

const FEEDBACK_LABELS: { key: keyof Feedback; label: string }[] = [
  { key: 'rating_overall', label: 'Expérience globale' },
  { key: 'rating_vendors', label: 'Prestataires' },
  { key: 'rating_ambiance', label: 'Ambiance & animations' },
  { key: 'rating_welcome', label: 'Accueil & organisation' },
  { key: 'rating_recommend', label: 'Recommandation' },
];

const usePinData = <T,>(rpcName: string, pin: string) => {
  const [rows, setRows] = useState<T[]>([]);
  useEffect(() => {
    supabase.rpc(rpcName as never, { pin_value: pin } as never).then(({ data, error }) => {
      if (error) { console.error(`❌ ${rpcName} failed:`, error); return; }
      setRows((data as T[]) || []);
    });
  }, [rpcName, pin]);
  return rows;
};

const LeadsTab = ({ pin }: { pin: string }) => {
  const leads = usePinData<Lead>('get_immersion_leads', pin);
  const [vendorFilter, setVendorFilter] = useState('all');
  const vendorNames = Array.from(new Set(leads.map((lead) => lead.vendor_name))).sort();
  const visibleLeads = vendorFilter === 'all' ? leads : leads.filter((lead) => lead.vendor_name === vendorFilter);

  const handleExportCsv = () => {
    const header = ['Date', 'Prestataire', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Date mariage', 'Lieu', 'Devis', 'Message'];
    const lines = visibleLeads.map((lead) => [new Date(lead.created_at).toLocaleString('fr-FR'), lead.vendor_name, lead.first_name, lead.last_name, lead.email, lead.phone || '', lead.wedding_date || '', lead.wedding_location || '', lead.wants_quote ? 'Oui' : 'Non', (lead.message || '').replace(/\n/g, ' ')]);
    const csv = [header, ...lines].map((line) => line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(';')).join('\n');
    const blobUrl = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    downloadFile(blobUrl, 'demandes_immersion_mariage.csv');
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <p className="text-sm text-muted-foreground"><span className="font-serif text-3xl text-foreground mr-2">{visibleLeads.length}</span>demande(s)</p>
        <div className="flex gap-2">
          <select value={vendorFilter} onChange={(event) => setVendorFilter(event.target.value)} className="border border-border bg-card px-3 min-h-[40px] text-sm" aria-label="Filtrer par prestataire">
            <option value="all">Tous les prestataires</option>
            {vendorNames.map((vendorName) => <option key={vendorName} value={vendorName}>{vendorName}</option>)}
          </select>
          <Button variant="outline" onClick={handleExportCsv} disabled={!visibleLeads.length}><Download className="h-4 w-4 mr-1" />CSV</Button>
        </div>
      </div>
      {!visibleLeads.length ? <p className="text-sm text-muted-foreground border border-border bg-card p-6">Aucune demande pour le moment.</p> : (
        <div className="overflow-x-auto border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr>{['Date', 'Prestataire', 'Visiteur', 'Contact', 'Mariage', 'Devis', 'Message'].map((title) => <th key={title} className="p-3 font-medium whitespace-nowrap">{title}</th>)}</tr></thead>
            <tbody>
              {visibleLeads.map((lead) => (
                <tr key={lead.id} className="border-t border-border align-top">
                  <td className="p-3 whitespace-nowrap">{new Date(lead.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className="p-3">{lead.vendor_name}</td>
                  <td className="p-3 whitespace-nowrap">{lead.first_name} {lead.last_name}</td>
                  <td className="p-3"><a href={`mailto:${lead.email}`} className="underline">{lead.email}</a>{lead.phone && <div>{lead.phone}</div>}</td>
                  <td className="p-3">{lead.wedding_date ? new Date(lead.wedding_date).toLocaleDateString('fr-FR') : '—'}{lead.wedding_location && <div className="text-muted-foreground">{lead.wedding_location}</div>}</td>
                  <td className="p-3">{lead.wants_quote ? 'Oui' : 'Non'}</td>
                  <td className="p-3 min-w-[200px] text-muted-foreground">{lead.message || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

const FeedbackTab = ({ pin }: { pin: string }) => {
  const feedbacks = usePinData<Feedback>('get_immersion_feedback', pin);
  if (!feedbacks.length) return <p className="text-sm text-muted-foreground border border-border bg-card p-6">Aucun avis pour le moment.</p>;
  const average = (key: keyof Feedback) => feedbacks.reduce((total, feedback) => total + Number(feedback[key]), 0) / feedbacks.length;
  const globalAverage = FEEDBACK_LABELS.reduce((total, item) => total + average(item.key), 0) / FEEDBACK_LABELS.length;
  const starCounts = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: feedbacks.filter((feedback) => feedback.rating_overall === stars).length }));
  const comments = feedbacks.filter((feedback) => feedback.comment);

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Satisfaction globale · {feedbacks.length} avis</p>
          <p className="font-serif text-5xl text-primary">{globalAverage.toFixed(1)}<span className="text-xl text-muted-foreground"> / 5</span></p>
          <div className="mt-4 space-y-1">
            {starCounts.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-2 text-xs">
                <span className="w-8">{stars} ★</span>
                <div className="flex-1 h-2 bg-muted"><div className="h-2 bg-primary" style={{ width: `${(count / feedbacks.length) * 100}%` }} /></div>
                <span className="w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">Répartition sur l'expérience globale</p>
        </div>
        <div className="border border-border bg-card p-5 space-y-3">
          {FEEDBACK_LABELS.map((item) => (
            <div key={item.key}>
              <div className="flex justify-between text-sm"><span>{item.label}</span><span className="font-medium">{average(item.key).toFixed(1)}</span></div>
              <div className="h-2 bg-muted mt-1"><div className="h-2 bg-primary" style={{ width: `${(average(item.key) / 5) * 100}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <h2 className="font-serif text-xl">Commentaires ({comments.length})</h2>
        {comments.map((feedback) => (
          <blockquote key={feedback.id} className="border-l-2 border-primary bg-card p-4 text-sm">
            <p>{feedback.comment}</p>
            <footer className="text-xs text-muted-foreground mt-2">{'★'.repeat(feedback.rating_overall)} · {new Date(feedback.created_at).toLocaleDateString('fr-FR')}</footer>
          </blockquote>
        ))}
      </div>
    </section>
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
          <Tabs defaultValue="qr">
            <TabsList className="w-full grid grid-cols-3 rounded-none mb-6">
              <TabsTrigger value="qr" className="rounded-none">QR code</TabsTrigger>
              <TabsTrigger value="leads" className="rounded-none">Demandes</TabsTrigger>
              <TabsTrigger value="avis" className="rounded-none">Avis</TabsTrigger>
            </TabsList>
            <TabsContent value="leads"><LeadsTab pin={pin} /></TabsContent>
            <TabsContent value="avis"><FeedbackTab pin={pin} /></TabsContent>
            <TabsContent value="qr">
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
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default ImmersionMariageAdmin;
