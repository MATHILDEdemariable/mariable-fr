import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type ActivityLog = { id: string; actor_id: string | null; actor_name: string | null; actor_role: string | null; module: string; summary: string; created_at: string };

const MODULE_LABELS: Record<string, string> = { vendors: 'Prestataires', guests: 'Invités & RSVP', seating: 'Plan de table', budget: 'Budget' };

const formatGroup = (dateValue: Date) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const day = new Date(dateValue); day.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return 'Cette semaine';
  return 'Plus ancien';
};

/** Cloche « Activité » : ce que les autres membres du mariage ont modifié depuis la dernière visite. */
const WeddingActivityBell: React.FC = () => {
  const { currentWeddingId } = useWedding();
  const location = useLocation();
  const [userId, setUserId] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [lastSeenAt, setLastSeenAt] = useState<string | null>(null);

  useEffect(() => { supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);

  useEffect(() => {
    if (!userId || !currentWeddingId) return;
    const loadUnreadCount = async () => {
      try {
        const { data: readRow } = await (supabase as any).from('wedding_activity_reads').select('last_seen_at').eq('user_id', userId).eq('wedding_id', currentWeddingId).maybeSingle();
        const since = readRow?.last_seen_at ?? new Date(Date.now() - 7 * 86400000).toISOString();
        setLastSeenAt(since);
        const { count } = await (supabase as any).from('wedding_activity_logs').select('id', { count: 'exact', head: true })
          .eq('wedding_id', currentWeddingId).neq('actor_id', userId).gt('created_at', since);
        setUnreadCount(count ?? 0);
      } catch (error) { console.error('❌ loadUnreadCount failed:', error); }
    };
    loadUnreadCount();
  }, [userId, currentWeddingId, location.pathname]);

  const handleOpen = async () => {
    setIsOpen(true);
    if (!userId || !currentWeddingId) return;
    try {
      const { data } = await (supabase as any).from('wedding_activity_logs')
        .select('id, actor_id, actor_name, actor_role, module, summary, created_at')
        .eq('wedding_id', currentWeddingId).order('created_at', { ascending: false }).limit(50);
      setLogs(data ?? []);
      await (supabase as any).from('wedding_activity_reads').upsert({ user_id: userId, wedding_id: currentWeddingId, last_seen_at: new Date().toISOString() });
      setUnreadCount(0);
    } catch (error) { console.error('❌ load activity failed:', error); }
  };

  if (!currentWeddingId || !userId) return null;

  let previousGroup = '';
  return (
    <>
      <button type="button" onClick={handleOpen} aria-label={`Activité récente${unreadCount ? ` (${unreadCount} nouveautés)` : ''}`}
        className="relative inline-flex items-center gap-1.5 border border-border bg-background px-3 min-h-[40px] text-sm hover:border-wedding-olive">
        <Bell className="h-4 w-4 text-wedding-olive" />
        <span>Activité</span>
        {unreadCount > 0 && <span className="ml-1 bg-wedding-olive text-primary-foreground text-[11px] px-1.5 min-w-[20px] text-center">{unreadCount}</span>}
      </button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle className="font-serif">Activité récente</SheetTitle></SheetHeader>
          {logs.length === 0 && <p className="text-sm text-muted-foreground mt-6">Aucune modification pour le moment.</p>}
          <ul className="mt-4 space-y-3">
            {logs.map((log) => {
              const group = formatGroup(new Date(log.created_at));
              const showGroup = group !== previousGroup; previousGroup = group;
              const isNew = lastSeenAt && log.created_at > lastSeenAt && log.actor_id !== userId;
              const who = log.actor_id === userId ? 'Vous' : (log.actor_name || (log.actor_role === 'pro' ? 'Votre wedding planner' : 'Les mariés'));
              const roleLabel = log.actor_id === userId ? '' : log.actor_role === 'pro' ? ' (Wedding planner)' : ' (Mariés)';
              return (
                <li key={log.id}>
                  {showGroup && <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-4 mb-2">{group}</p>}
                  <div className={`border-l-2 pl-3 py-1 ${isNew ? 'border-wedding-olive' : 'border-border'}`}>
                    <p className="text-sm"><strong>{who}</strong>{roleLabel} {log.summary}</p>
                    <p className="text-xs text-muted-foreground">{MODULE_LABELS[log.module] ?? log.module} • {new Date(log.created_at).toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default WeddingActivityBell;
