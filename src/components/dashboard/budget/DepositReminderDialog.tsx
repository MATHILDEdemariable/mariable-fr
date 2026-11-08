import React, { useEffect, useState } from 'react';
import { Loader2, Send, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import { toast } from 'sonner';

export const formatDueDate = (isoDate: string) => (isoDate ? isoDate.split('-').reverse().join('/') : '');

export const buildDepositReminderMessage = (isEnglish: boolean, index: number, itemName: string, amount: number, dueDate: string) => {
  const amountText = `${amount.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} €`;
  return isEnglish
    ? `Hello, a quick reminder about the wedding: deposit no. ${index + 1} for ${itemName} (${amountText}) is due on ${formatDueDate(dueDate)}. Please let us know as soon as the transfer has been made!`
    : `Bonjour, petit rappel concernant le mariage : l'acompte n°${index + 1} pour ${itemName} (${amountText}) arrive à échéance le ${formatDueDate(dueDate)}. Merci de nous confirmer dès que le virement est effectué !`;
};

interface Props { open: boolean; onOpenChange: (open: boolean) => void; isEnglish: boolean; index: number; itemName: string; amount: number; dueDate: string }

const DepositReminderDialog: React.FC<Props> = ({ open, onOpenChange, isEnglish, index, itemName, amount, dueDate }) => {
  const tr = (fr: string, en: string) => (isEnglish ? en : fr);
  const { currentWeddingId } = useWedding();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubject(tr(`Rappel acompte — ${itemName}`, `Deposit reminder — ${itemName}`));
    setMessage(buildDepositReminderMessage(!!isEnglish, index, itemName, amount, dueDate));
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSendViaMariable = async () => {
    if (!currentWeddingId) return;
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-deposit-reminder', { body: { weddingId: currentWeddingId, subject, message } });
      if (error || data?.error) {
        const code = data?.error;
        throw new Error(code === 'no_recipients' ? tr('Aucun marié invité sur ce mariage.', 'No couple invited on this wedding.') : tr('Envoi impossible.', 'Sending failed.'));
      }
      toast.success(tr('Relance envoyée', 'Reminder sent'));
      onOpenChange(false);
    } catch (error: any) {
      console.error('❌ handleSendViaMariable failed:', error);
      toast.error(error.message);
    } finally {
      setIsSending(false);
    }
  };

  const mailtoHref = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-none max-w-lg">
        <DialogHeader><DialogTitle className="font-serif">✉️ {tr('Relancer les mariés', 'Remind the couple')}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div><Label htmlFor="reminder-subject">{tr('Objet', 'Subject')}</Label>
            <Input id="reminder-subject" value={subject} maxLength={200} onChange={(e) => setSubject(e.target.value)} className="text-base" /></div>
          <div><Label htmlFor="reminder-message">{tr('Message', 'Message')}</Label>
            <Textarea id="reminder-message" value={message} maxLength={5000} rows={6} onChange={(e) => setMessage(e.target.value)} className="text-base" /></div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" className="rounded-none" asChild><a href={mailtoHref}><Mail className="h-4 w-4 mr-2" />{tr('Ouvrir dans ma messagerie', 'Open in my email app')}</a></Button>
          <Button className="rounded-none" onClick={handleSendViaMariable} disabled={isSending || !message.trim()}>
            {isSending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}{tr('Envoyer via Mariable', 'Send via Mariable')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepositReminderDialog;
