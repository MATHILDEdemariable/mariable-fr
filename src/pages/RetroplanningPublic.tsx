import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { MANUAL_STATUS_LABELS, sortManualSteps, type ManualStep } from '@/components/retroplanning/RetroplanningManuel';

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

  return (
    <main className="min-h-screen bg-background px-4 py-10">
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
            <header className="text-center space-y-2">
              <p className="text-sm uppercase tracking-widest text-muted-foreground">{isEnglish ? 'Read-only view' : 'Consultation'}</p>
              <h1 className="text-3xl font-serif">{retroplanning.mode === 'manual' ? retroplanning.title : (isEnglish ? 'Wedding timeline' : 'Rétroplanning du mariage')}</h1>
              {retroplanning.mode !== 'manual' && retroplanning.wedding_date && (
                <p className="text-muted-foreground">{format(new Date(retroplanning.wedding_date), 'dd MMMM yyyy', { locale: dateLocale })}</p>
              )}
            </header>

            {retroplanning.mode === 'manual' ? (
              <section className="space-y-2">
                {sortManualSteps(timeline as ManualStep[]).map((step) => (
                  <article key={step.id} className="border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex-1">
                      <h2 className="font-medium">{step.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {[step.date && format(new Date(step.date), 'dd MMM yyyy', { locale: dateLocale }), step.period, step.category].filter(Boolean).join(' · ')}
                      </p>
                      {step.note && <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">{step.note}</p>}
                    </div>
                    <span className={`text-xs px-2 py-1 w-fit ${MANUAL_STATUS_LABELS[step.status]?.className ?? ''}`}>
                      {MANUAL_STATUS_LABELS[step.status]?.[isEnglish ? 'en' : 'fr']}
                    </span>
                  </article>
                ))}
              </section>
            ) : (
              <section className="space-y-4">
                {timeline.map((item: { period: string; tasks: string[] }, index: number) => (
                  <article key={index} className="border border-border bg-card p-4">
                    <h2 className="font-serif text-lg mb-2">{item.period}</h2>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {(item.tasks || []).map((task, taskIndex) => <li key={taskIndex}>{task}</li>)}
                    </ul>
                  </article>
                ))}
              </section>
            )}
            <p className="text-center text-xs text-muted-foreground">Mariable — mariable.fr</p>
          </>
        )}
      </div>
    </main>
  );
};

export default RetroplanningPublic;
