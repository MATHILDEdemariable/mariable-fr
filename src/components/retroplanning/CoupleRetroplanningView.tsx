import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWedding } from '@/contexts/WeddingContext';
import RetroplanningFrise, { RetroplanningSummary } from './RetroplanningFrise';
import type { ManualStep } from './RetroplanningManuel';
import { COUPLE_SHARE_MODULE } from './CoupleShareButton';

/** Vue lecture seule des mariés invités : uniquement la copie validée par leur wedding planner. */
const CoupleRetroplanningView = ({ isEnglish }: { isEnglish: boolean }) => {
  const { currentWeddingId } = useWedding();
  const [shared, setShared] = useState<{ steps: ManualStep[]; wedding_date: string | null; validated_at: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentWeddingId) return;
    (supabase as any).from('wedding_jour_j_handoffs').select('validated_at, snapshot').eq('wedding_id', currentWeddingId).eq('module', COUPLE_SHARE_MODULE).maybeSingle()
      .then(({ data, error }: any) => {
        if (error) console.error('❌ loadCoupleRetroplanning failed:', error);
        setShared(data?.snapshot ? { steps: Array.isArray(data.snapshot.steps) ? data.snapshot.steps : [], wedding_date: data.snapshot.wedding_date ?? null, validated_at: data.validated_at } : null);
        setIsLoading(false);
      });
  }, [currentWeddingId]);

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin mx-auto my-12" />;
  if (!shared) return (
    <div className="border border-editorial-olive/30 bg-editorial-beige p-8 text-center space-y-3">
      <Clock className="h-8 w-8 mx-auto text-editorial-olive" />
      <h2 className="text-2xl font-serif">{isEnglish ? 'Your planning is being prepared' : 'Votre planning est en préparation'}</h2>
      <p className="text-muted-foreground">{isEnglish ? 'Your wedding planner will share it here as soon as it is validated.' : 'Votre wedding planner le partagera ici dès sa validation.'}</p>
    </div>
  );
  const dateLocale = isEnglish ? enUS : fr;
  return (
    <section className="bg-editorial-beige border border-editorial-olive/20 p-4 sm:p-8 space-y-6">
      <header className="text-center space-y-2 border-b border-editorial-olive/30 pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-editorial-olive">{isEnglish ? 'Read-only — shared by your wedding planner' : 'Lecture seule — partagé par votre wedding planner'}</p>
        <h1 className="text-3xl sm:text-4xl font-serif">{isEnglish ? 'Overall wedding planning' : 'Planning global du mariage'}</h1>
        {shared.wedding_date && <p className="font-serif italic text-editorial-olive">{format(new Date(shared.wedding_date), 'dd MMMM yyyy', { locale: dateLocale })}</p>}
        <p className="text-xs text-muted-foreground">{isEnglish ? 'Updated on ' : 'Mis à jour le '}{format(new Date(shared.validated_at), 'dd/MM/yyyy')}</p>
      </header>
      <RetroplanningSummary steps={shared.steps} weddingDate={shared.wedding_date} isEnglish={isEnglish} />
      <RetroplanningFrise steps={shared.steps} weddingDate={shared.wedding_date} isEnglish={isEnglish} />
    </section>
  );
};

export default CoupleRetroplanningView;
