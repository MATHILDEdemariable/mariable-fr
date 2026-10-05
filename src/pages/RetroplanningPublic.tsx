import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { STAKEHOLDER_LABELS, type ManualStep } from '@/components/retroplanning/RetroplanningManuel';
import RetroplanningFrise, { RetroplanningSummary } from '@/components/retroplanning/RetroplanningFrise';

interface PublicRetroplanning {
  title: string;
  wedding_date: string | null;
  mode: string;
  timeline_data: any;
}

const RetroplanningPublic = () => {
  const { token } = useParams<{ token: string }>();
  const { i18n } = useTranslation();
  const isEnglish = i18n.language.startsWith('en');
  const dateLocale = isEnglish ? enUS : fr;
  const [retroplanning, setRetroplanning] = useState<PublicRetroplanning | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stakeholderFilter, setStakeholderFilter] = useState('all');

  useEffect(() => {
    const loadPublicRetroplanning = async () => {
      try {
        const { data, error } = await (supabase as any).rpc('get_public_retroplanning', { token_value: token });
        if (error) throw error;
        setRetroplanning(Array.isArray(data) && data.length ? data[0] : null);
      } catch (error) {
        console.error('❌ loadPublicRetroplanning failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadPublicRetroplanning();
  }, [token]);

  const timeline = Array.isArray(retroplanning?.timeline_data) ? retroplanning!.timeline_data : [];
  const usedStakeholders = useMemo(
    () => Object.keys(STAKEHOLDER_LABELS).filter((key) => (timeline as ManualStep[]).some((step) => step?.stakeholder === key)),
    [timeline]
  );
  const visibleSteps = stakeholderFilter === 'all' ? (timeline as ManualStep[]) : (timeline as ManualStep[]).filter((step) => step.stakeholder === stakeholderFilter);

  return (
    <main className="min-h-screen bg-editorial-beige text-editorial-noir px-4 py-10 sm:py-16">
      <Helmet>
        <title>{isEnglish ? 'Shared wedding timeline | Mariable' : 'Rétroplanning partagé | Mariable'}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="max-w-3xl mx-auto space-y-6">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        ) : !retroplanning ? (
          <p className="text-center text-muted-foreground">{isEnglish ? 'This link is invalid or has been disabled.' : 'Ce lien est invalide ou a été désactivé.'}</p>
        ) : (
          <>
            <header className="text-center space-y-3 border-b border-editorial-olive/30 pb-8">
              <img src="/cachet_M.webp" alt="Mariable" className="h-12 w-auto mx-auto" width={48} height={48} />
              <p className="text-xs uppercase tracking-[0.3em] text-editorial-olive">{isEnglish ? 'Read-only view' : 'Consultation'}</p>
              <h1 className="text-4xl sm:text-5xl font-serif">{retroplanning.mode === 'manual' ? retroplanning.title : (isEnglish ? 'Wedding timeline' : 'Rétroplanning du mariage')}</h1>
              {retroplanning.mode !== 'manual' && retroplanning.wedding_date && (
                <p className="text-muted-foreground">{format(new Date(retroplanning.wedding_date), 'dd MMMM yyyy', { locale: dateLocale })}</p>
              )}
            </header>

            {retroplanning.mode === 'manual' ? (
              <section className="space-y-6">
                {retroplanning.wedding_date && (
                  <p className="text-center font-serif italic text-lg text-editorial-olive -mt-2">{format(new Date(retroplanning.wedding_date), 'dd MMMM yyyy', { locale: dateLocale })}</p>
                )}
                <RetroplanningSummary steps={timeline as ManualStep[]} weddingDate={retroplanning.wedding_date} isEnglish={isEnglish} />
                {usedStakeholders.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center" role="group" aria-label={isEnglish ? 'Filter by stakeholder' : 'Filtrer par partie prenante'}>
                    {['all', ...usedStakeholders].map((key) => (
                      <button key={key} type="button" onClick={() => setStakeholderFilter(key)}
                        className={`min-h-11 px-4 text-xs uppercase tracking-wider border transition-colors ${stakeholderFilter === key ? 'bg-editorial-olive text-editorial-beige border-editorial-olive' : 'border-editorial-olive/40 text-editorial-olive hover:bg-editorial-olive/10'}`}>
                        {key === 'all' ? (isEnglish ? 'Everyone' : 'Tout le monde') : STAKEHOLDER_LABELS[key][isEnglish ? 'en' : 'fr']}
                      </button>
                    ))}
                  </div>
                )}
                <RetroplanningFrise steps={visibleSteps} weddingDate={retroplanning.wedding_date} isEnglish={isEnglish} />
              </section>
            ) : (
              <section className="space-y-4">
                {timeline.map((item: { period: string; tasks: string[] }, index: number) => (
                  <article key={index} className="border border-editorial-olive/20 bg-background p-5">
                    <h2 className="font-serif text-lg mb-2">{item.period}</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {(item.tasks || []).map((task, taskIndex) => <li key={taskIndex}>{task}</li>)}
                    </ul>
                  </article>
                ))}
              </section>
            )}
            <footer className="text-center pt-6 border-t border-editorial-olive/30 space-y-1">
              <p className="font-serif text-lg">Mariable</p>
              <a href="https://mariable.fr" className="text-xs uppercase tracking-widest text-editorial-olive hover:underline">mariable.fr</a>
            </footer>
          </>
        )}
      </div>
    </main>
  );
};

export default RetroplanningPublic;
