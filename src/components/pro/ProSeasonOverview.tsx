import React from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarDays, Heart, Users, Clock } from 'lucide-react';
import type { Wedding } from '@/contexts/WeddingContext';

interface SeasonWedding {
  title: string;
  date: Date | null;
  guests: number;
}

const DEMO_WEDDINGS = (year: number): SeasonWedding[] => [
  { title: 'Camille & Antoine', date: new Date(year, 4, 23), guests: 120 },
  { title: 'Léa & Hugo', date: new Date(year, 5, 13), guests: 160 },
  { title: 'Inès & Paul', date: new Date(year, 5, 27), guests: 90 },
  { title: 'Chloé & Max', date: new Date(year, 6, 11), guests: 180 },
  { title: 'Sarah & Tom', date: new Date(year, 7, 22), guests: 140 },
  { title: 'Emma & Louis', date: new Date(year, 8, 5), guests: 150 },
  { title: 'Julie & Marc', date: new Date(year, 8, 19), guests: 110 },
  { title: 'Alice & Noé', date: new Date(year, 9, 3), guests: 190 },
];

const HOURS_SAVED_PER_WEDDING = 15;

/** Vue saison de l'espace pro : vraies données si présentes, sinon aperçu d'exemple. */
const ProSeasonOverview: React.FC<{ weddings: Wedding[] }> = ({ weddings }) => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const locale = isEnglish ? 'en-GB' : 'fr-FR';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDemo = weddings.length === 0;
  const seasonWeddings: SeasonWedding[] = isDemo
    ? DEMO_WEDDINGS(today.getFullYear() + (today.getMonth() > 9 ? 1 : 0))
    : weddings.map((wedding) => ({
        title: wedding.title,
        date: wedding.wedding_date ? new Date(wedding.wedding_date) : null,
        guests: wedding.guest_count ?? 0,
      }));

  const totalGuests = seasonWeddings.reduce((sum, wedding) => sum + wedding.guests, 0);
  const upcoming = seasonWeddings
    .filter((wedding) => wedding.date && wedding.date >= today)
    .sort((a, b) => a.date!.getTime() - b.date!.getTime());
  const nextWedding = isDemo ? seasonWeddings[0] : upcoming[0];
  const daysToNext = nextWedding?.date
    ? Math.max(0, Math.ceil((nextWedding.date.getTime() - today.getTime()) / 86400000))
    : null;

  const seasonYear = isDemo
    ? seasonWeddings[0].date!.getFullYear()
    : (upcoming[0]?.date ?? today).getFullYear();
  const months = Array.from({ length: 12 }, (_, index) => index);

  const labels = {
    title: isEnglish ? 'My season' : 'Ma saison',
    demo: isEnglish
      ? 'Preview of your future season · These figures update automatically as you add your weddings.'
      : 'Aperçu de votre future saison · Ces indicateurs se mettent à jour automatiquement au fil de vos mariages.',
    weddings: isEnglish ? 'Weddings' : 'Mariages',
    guests: isEnglish ? 'Guests coordinated' : 'Invités coordonnés',
    next: isEnglish ? 'Next wedding day' : 'Prochain Jour J',
    saved: isEnglish ? 'Time saved (estimate)' : 'Temps gagné (estimation)',
    none: isEnglish ? 'None scheduled' : 'Aucun prévu',
    example: isEnglish ? 'Example' : 'Exemple',
  };

  const kpis = [
    { icon: Heart, label: labels.weddings, value: String(seasonWeddings.length) },
    { icon: Users, label: labels.guests, value: totalGuests.toLocaleString(locale) },
    {
      icon: CalendarDays,
      label: labels.next,
      value: daysToNext !== null && !isDemo ? `J-${daysToNext}` : isDemo ? 'J-18' : labels.none,
      hint: nextWedding?.title,
    },
    { icon: Clock, label: labels.saved, value: `~${seasonWeddings.length * HOURS_SAVED_PER_WEDDING} h` },
  ];

  return (
    <section aria-labelledby="pro-season-title" className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 id="pro-season-title" className="font-serif text-2xl text-foreground">
          {labels.title} {seasonYear}
        </h2>
        {isDemo && (
          <span className="border border-wedding-olive/40 px-2 py-0.5 text-xs uppercase tracking-wider text-wedding-olive">
            {labels.example}
          </span>
        )}
      </div>
      {isDemo && <p className="text-sm text-muted-foreground">{labels.demo}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="border border-border bg-editorial-beige p-4">
            <kpi.icon className="h-4 w-4 text-wedding-olive" aria-hidden="true" />
            <p className="mt-3 font-serif text-2xl text-foreground">{kpi.value}</p>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{kpi.label}</p>
            {kpi.hint && <p className="mt-1 truncate text-xs text-muted-foreground">{kpi.hint}</p>}
          </div>
        ))}
      </div>

      <div className="border border-border bg-background p-4">
        <div className="grid grid-cols-6 gap-2 sm:grid-cols-12">
          {months.map((month) => {
            const monthWeddings = seasonWeddings.filter(
              (wedding) => wedding.date && wedding.date.getMonth() === month && wedding.date.getFullYear() === seasonYear
            );
            return (
              <div key={month} className="flex flex-col items-center gap-1">
                <div className="flex min-h-[44px] flex-col-reverse items-center gap-1">
                  {monthWeddings.map((wedding) => (
                    <span
                      key={wedding.title}
                      title={`${wedding.title} — ${wedding.date!.toLocaleDateString(locale)}`}
                      className="block h-3 w-3 rounded-full bg-wedding-olive"
                    />
                  ))}
                </div>
                <span className="text-[11px] uppercase text-muted-foreground">
                  {new Date(seasonYear, month, 1).toLocaleDateString(locale, { month: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProSeasonOverview;
