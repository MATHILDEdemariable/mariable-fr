import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { CalendarCheck, Plus, Trash2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

type MeetingLog = {
  id: string;
  meeting_date: string;
  next_meeting_date: string | null;
  type: string;
  title: string | null;
  summary: string | null;
  next_actions: string | null;
};

const MEETING_TYPES: Record<string, { fr: string; en: string; badgeClass: string }> = {
  visio: { fr: 'Visio', en: 'Video call', badgeClass: 'bg-primary/10 text-primary' },
  appel: { fr: 'Appel', en: 'Call', badgeClass: 'bg-secondary text-secondary-foreground' },
  presentiel: { fr: 'Présentiel', en: 'In person', badgeClass: 'bg-accent text-accent-foreground' },
  email: { fr: 'Email', en: 'Email', badgeClass: 'bg-muted text-muted-foreground' },
};

const db = supabase as any;

const MeetingLogsPanel = ({ weddingId, isEnglish }: { weddingId: string; isEnglish: boolean }) => {
  const { toast } = useToast();
  const [meetingLogs, setMeetingLogs] = useState<MeetingLog[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formValues, setFormValues] = useState({ meeting_date: format(new Date(), 'yyyy-MM-dd'), type: 'visio', summary: '', next_actions: '', next_meeting_date: '' });
  const dateLocale = isEnglish ? enUS : fr;

  const loadMeetingLogs = async () => {
    const { data, error } = await db.from('wedding_meeting_logs')
      .select('id, meeting_date, next_meeting_date, type, title, summary, next_actions')
      .eq('wedding_id', weddingId).order('meeting_date', { ascending: false }).limit(20);
    if (error) { console.error('❌ loadMeetingLogs failed:', error); return; }
    setMeetingLogs(data || []);
  };

  useEffect(() => { loadMeetingLogs(); }, [weddingId]);

  const handleSaveMeetingLog = async () => {
    if (!formValues.summary.trim()) return;
    setIsSaving(true);
    const { error } = await db.from('wedding_meeting_logs').insert({
      wedding_id: weddingId,
      meeting_date: new Date(formValues.meeting_date).toISOString(),
      type: formValues.type,
      summary: formValues.summary.trim(),
      next_actions: formValues.next_actions.trim() || null,
      next_meeting_date: formValues.next_meeting_date ? new Date(formValues.next_meeting_date).toISOString() : null,
    });
    setIsSaving(false);
    if (error) {
      console.error('❌ saveMeetingLog failed:', error);
      toast({ title: isEnglish ? 'Error' : 'Erreur', description: isEnglish ? 'Could not save.' : "Impossible d'enregistrer l'échange.", variant: 'destructive' });
      return;
    }
    setIsDialogOpen(false);
    setFormValues({ meeting_date: format(new Date(), 'yyyy-MM-dd'), type: 'visio', summary: '', next_actions: '', next_meeting_date: '' });
    loadMeetingLogs();
  };

  const handleDeleteMeetingLog = async (logId: string) => {
    if (!window.confirm(isEnglish ? 'Delete this entry?' : 'Supprimer cet échange ?')) return;
    const { error } = await db.from('wedding_meeting_logs').delete().eq('id', logId);
    if (error) { console.error('❌ deleteMeetingLog failed:', error); return; }
    loadMeetingLogs();
  };

  const now = Date.now();
  const nextMeeting = meetingLogs
    .map((log) => log.next_meeting_date)
    .filter((d): d is string => !!d && new Date(d).getTime() >= now - 86400000)
    .sort()[0];

  return (
    <section className="border border-border bg-card p-5 md:p-6 rounded-none">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="font-serif text-xl flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          {isEnglish ? 'Meetings & exchanges log' : 'Journal des échanges & RDV'}
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          {nextMeeting && (
            <span className="inline-flex items-center gap-1.5 text-sm bg-primary/10 text-primary px-3 py-1.5">
              <CalendarCheck className="h-4 w-4" />
              {isEnglish ? 'Next meeting:' : 'Prochain RDV :'} {format(new Date(nextMeeting), 'd MMM yyyy', { locale: dateLocale })}
            </span>
          )}
          <Button size="sm" onClick={() => setIsDialogOpen(true)} className="rounded-none min-h-[40px]">
            <Plus className="h-4 w-4 mr-1" /> {isEnglish ? 'Log an exchange' : 'Noter un échange'}
          </Button>
        </div>
      </div>

      {meetingLogs.length === 0 ? (
        <p className="text-sm text-muted-foreground">{isEnglish ? 'No exchange logged yet.' : 'Aucun échange noté pour le moment.'}</p>
      ) : (
        <ol className="space-y-3 border-l border-border pl-4">
          {meetingLogs.map((log) => {
            const typeInfo = MEETING_TYPES[log.type] || MEETING_TYPES.visio;
            return (
              <li key={log.id} className="relative">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium">{format(new Date(log.meeting_date), 'd MMM yyyy', { locale: dateLocale })}</span>
                  <span className={`text-xs px-2 py-0.5 ${typeInfo.badgeClass}`}>{isEnglish ? typeInfo.en : typeInfo.fr}</span>
                  {log.next_meeting_date && (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <CalendarCheck className="h-3 w-3" /> {format(new Date(log.next_meeting_date), 'd MMM', { locale: dateLocale })}
                    </span>
                  )}
                  <button onClick={() => handleDeleteMeetingLog(log.id)} aria-label={isEnglish ? 'Delete' : 'Supprimer'} className="ml-auto text-muted-foreground hover:text-destructive p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                {log.summary && <p className="text-sm mt-1 whitespace-pre-line">{log.summary}</p>}
                {log.next_actions && (
                  <p className="text-sm mt-1 text-muted-foreground whitespace-pre-line">
                    <span className="font-medium text-foreground">{isEnglish ? 'Next steps: ' : 'Prochaines actions : '}</span>{log.next_actions}
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="rounded-none">
          <DialogHeader><DialogTitle>{isEnglish ? 'Log an exchange' : 'Noter un échange'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="text-sm space-y-1">
                <span>Date</span>
                <Input type="date" value={formValues.meeting_date} onChange={(e) => setFormValues({ ...formValues, meeting_date: e.target.value })} />
              </label>
              <label className="text-sm space-y-1">
                <span>Type</span>
                <select className="w-full h-10 border border-input bg-background px-2 text-base" value={formValues.type} onChange={(e) => setFormValues({ ...formValues, type: e.target.value })}>
                  {Object.entries(MEETING_TYPES).map(([key, info]) => <option key={key} value={key}>{isEnglish ? info.en : info.fr}</option>)}
                </select>
              </label>
            </div>
            <label className="text-sm space-y-1 block">
              <span>{isEnglish ? 'Key points discussed' : 'Points clés abordés'}</span>
              <Textarea rows={4} value={formValues.summary} onChange={(e) => setFormValues({ ...formValues, summary: e.target.value })} />
            </label>
            <label className="text-sm space-y-1 block">
              <span>{isEnglish ? 'Next steps' : 'Prochaines actions'}</span>
              <Textarea rows={3} value={formValues.next_actions} onChange={(e) => setFormValues({ ...formValues, next_actions: e.target.value })} />
            </label>
            <label className="text-sm space-y-1 block">
              <span className="inline-flex items-center gap-1"><CalendarCheck className="h-4 w-4" /> {isEnglish ? 'Next meeting (optional)' : 'Prochain RDV (optionnel)'}</span>
              <Input type="date" value={formValues.next_meeting_date} onChange={(e) => setFormValues({ ...formValues, next_meeting_date: e.target.value })} />
            </label>
            <Button onClick={handleSaveMeetingLog} disabled={isSaving || !formValues.summary.trim()} className="w-full rounded-none min-h-[44px]">
              {isEnglish ? 'Save' : 'Enregistrer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MeetingLogsPanel;
