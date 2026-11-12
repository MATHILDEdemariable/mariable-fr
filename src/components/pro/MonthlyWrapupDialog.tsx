import React, { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { FunctionsHttpError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';

const MODULE_TITLES: Record<string, string> = { vendors: 'Prestataires', guests: 'Invités & RSVP', seating: 'Plan de table', budget: 'Budget' };

/** Bilan du mois : brouillon généré depuis les 30 derniers jours, relu par le pro puis envoyé aux mariés. */
const MonthlyWrapupDialog: React.FC<{ weddingId: string; weddingTitle: string }> = ({ weddingId, weddingTitle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const buildDraft = async () => {
    setIsOpen(true); setIsLoading(true);
    try {
      const since = new Date(Date.now() - 30 * 86400000).toISOString();
      const db = supabase as any;
      const [{ data: logs }, { data: guests }, { data: budget }, { data: vendors }] = await Promise.all([
        db.from('wedding_activity_logs').select('module, summary, actor_role').eq('wedding_id', weddingId).gt('created_at', since).order('created_at').limit(200),
        db.from('wedding_guest_list').select('rsvp_status').eq('wedding_id', weddingId),
        db.from('budgets_detail').select('estimated, actual, deposit').eq('wedding_id', weddingId),
        db.from('vendors_tracking_preprod').select('vendor_name, status').eq('wedding_id', weddingId),
      ]);
      const proLogs = (logs ?? []).filter((l: any) => l.actor_role === 'pro');
      const grouped: Record<string, string[]> = {};
      proLogs.forEach((l: any) => { (grouped[l.module] ||= []).push(l.summary); });
      const doneLines = Object.entries(grouped).map(([module, items]) => `• ${MODULE_TITLES[module] ?? module} : ${items.slice(-5).join(' ; ')}${items.length > 5 ? ` (+${items.length - 5} autres)` : ''}`);
      const guestList = guests ?? [];
      const confirmedCount = guestList.filter((g: any) => /confirm|oui|present|yes/i.test(g.rsvp_status ?? '')).length;
      const sum = (key: string) => (budget ?? []).reduce((total: number, row: any) => total + (Number(row[key]) || 0), 0);
      const validatedVendors = (vendors ?? []).filter((v: any) => v.status === 'validé').map((v: any) => v.vendor_name);
      const pendingVendors = (vendors ?? []).filter((v: any) => !['validé', 'annuler'].includes(v.status)).map((v: any) => v.vendor_name);
      const euro = (n: number) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

      setSubject(`Bilan du mois — ${weddingTitle}`);
      setMessage([
        'Bonjour à vous deux,',
        '',
        'Voici le point sur l\'avancée de votre mariage ce mois-ci.',
        '',
        'Ce qui a été fait :',
        ...(doneLines.length ? doneLines : ['• (ajoutez ici les avancées du mois)']),
        ...(validatedVendors.length ? [`• Prestataires validés : ${validatedVendors.join(', ')}`] : []),
        '',
        'Les chiffres clés :',
        `• Invités : ${guestList.length} sur la liste, ${confirmedCount} réponses positives`,
        `• Budget engagé : ${euro(sum('actual'))} sur ${euro(sum('estimated'))} prévus, ${euro(sum('deposit'))} d'acomptes versés`,
        '',
        'Les priorités du mois prochain :',
        ...(pendingVendors.length ? [`• Finaliser : ${pendingVendors.slice(0, 5).join(', ')}`] : []),
        '• (ajoutez vos prochaines étapes)',
        '',
        'N\'hésitez pas à revenir vers moi pour toute question.',
        'Belle journée,',
      ].join('\n'));
    } catch (error) {
      console.error('❌ buildDraft failed:', error);
      toast.error('Impossible de préparer le bilan');
    } finally { setIsLoading(false); }
  };

  const handleSend = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-wedding-wrapup', { body: { weddingId, subject, message } });
      if (error) {
        const details = error instanceof FunctionsHttpError ? await error.context.text() : error.message;
        console.error('❌ send-wedding-wrapup failed:', details);
        toast.error(details.includes('no_recipients') ? 'Aucun marié invité sur ce mariage' : "L'envoi a échoué");
        return;
      }
      toast.success(`Bilan envoyé (${data?.sent ?? 0} destinataire(s))`);
      setIsOpen(false);
    } finally { setIsSending(false); }
  };

  return (
    <>
      <Button variant="outline" onClick={buildDraft} className="min-h-[44px]">
        <FileText className="h-4 w-4 mr-2" /> Préparer le bilan du mois
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Bilan du mois</DialogTitle>
            <DialogDescription>Relisez et personnalisez le texte avant de l'envoyer aux mariés (copie pour vous).</DialogDescription>
          </DialogHeader>
          {isLoading ? <div className="py-10 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
            <div className="space-y-3">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Objet" maxLength={200} />
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={18} maxLength={5000} aria-label="Message" />
              <Button onClick={handleSend} disabled={isSending || !message.trim()} className="w-full min-h-[44px]">
                {isSending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Envoyer le bilan aux mariés
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MonthlyWrapupDialog;
