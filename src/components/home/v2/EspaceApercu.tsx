import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import carnetMockup from '@/assets/carnet-adresses-mockup.png.asset.json';

const REGIONS = [
  { path: '/mariage-provence', key: 'provence' },
  { path: '/mariage-paris', key: 'paris' },
  { path: '/mariage-auvergne-rhone-alpes', key: 'rhoneAlpes' },
  { path: '/mariage-nouvelle-aquitaine', key: 'aquitaine' },
  { path: '/mariage-bretagne', key: 'bretagne' },
  { path: '/mariage-normandie', key: 'normandie' },
  { path: '/mariage-occitanie', key: 'occitanie' },
  { path: '/mariage-pays-de-la-loire', key: 'paysLoire' },
  { path: '/mariage-centre-val-de-loire', key: 'centreValLoire' },
  { path: '/mariage-hauts-de-france', key: 'hautsFrance' },
  { path: '/mariage-bourgogne-franche-comte', key: 'bourgogne' },
  { path: '/mariage-grand-est', key: 'grandEst' },
  { path: '/mariage-corse', key: 'corse' },
] as const;

export default function EspaceApercu() {
  const { t, i18n } = useTranslation('homeV2');
  const tCommon = useTranslation('common').t;
  const tools = t('apercu.tools', { returnObjects: true }) as string[];
  const carnetItems = t('apercu.carnet.items', { returnObjects: true }) as string[];
  const sidebarItems = [
    { label: t('apercu.sidebar.dashboard'), active: true },
    { label: t('apercu.sidebar.checklist') },
    { label: t('apercu.sidebar.planning') },
    { label: t('apercu.sidebar.budget') },
    { label: t('apercu.sidebar.vendors') },
    { label: t('apercu.sidebar.dayPlanning'), badge: t('apercu.sidebar.exclusiveBadge') },
    { label: t('apercu.sidebar.rsvp') },
    { label: t('apercu.sidebar.seating') },
    { label: t('apercu.sidebar.moodboard') },
    { label: t('apercu.sidebar.ceremony') },
  ];

  return (
    <section id="espace-apercu" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            {t('apercu.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-4">
            {t('apercu.title')}
          </h2>
          <p className="text-editorial-gray">{t('apercu.subtitle')}</p>
        </div>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-12 items-center max-w-6xl mx-auto">
          {/* Mockup navigateur */}
          <div className="relative">
            <div className="origin-top-left scale-[0.72] w-[139%] -mb-[28%] md:scale-100 md:w-full md:mb-0">
            <div className="rounded-lg border border-editorial-noir/15 bg-white shadow-2xl overflow-hidden">

              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-editorial-cream border-b border-editorial-noir/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                <div className="flex-1 flex justify-center">
                  <div className="bg-white border border-editorial-noir/10 rounded px-3 py-0.5 text-[10px] text-editorial-noir/60">
                    mariable.fr/dashboard
                  </div>
                </div>
              </div>

              {/* App header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-editorial-noir/10 bg-white">
                <span className="font-serif text-base text-editorial-noir">M.</span>
                <div className="flex items-center gap-2">
                  <span className="bg-editorial-noir text-white text-[9px] px-2 py-1 uppercase tracking-wider">
                    {t('apercu.account')}
                  </span>
                </div>
              </div>

              {/* Body : sidebar + main */}
              <div className="grid grid-cols-[140px_1fr] min-h-[280px]">
                {/* Sidebar */}
                <aside className="bg-white border-r border-editorial-noir/10 py-3 hidden sm:block">
                  <p className="font-serif text-[11px] text-editorial-noir px-3 mb-2">
                    {t('apercu.sidebarTitle')}
                  </p>
                  <ul className="space-y-0.5">
                    {sidebarItems.map((item) => (
                      <li
                        key={item.label}
                        className={`flex items-center justify-between px-3 py-1.5 text-[10px] ${
                          item.active
                            ? 'bg-editorial-olive text-white'
                            : 'text-editorial-noir/70'
                        }`}
                      >
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="bg-editorial-olive/15 text-editorial-olive text-[8px] px-1 py-0.5 rounded-sm uppercase">
                            {item.badge}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </aside>

                {/* Main */}
                <div className="p-4 sm:p-5 bg-editorial-cream/40">
                  <h3 className="font-serif text-lg sm:text-xl text-editorial-noir mb-0.5">
                    {t('apercu.welcome')}
                  </h3>
                  <p className="text-[10px] text-editorial-gray mb-4">
                    {t('apercu.date')}
                  </p>

                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-white border border-editorial-noir/10 p-2.5">
                      <p className="text-[9px] uppercase tracking-wider text-editorial-gray mb-1">
                        {t('apercu.kpi.countdown')}
                      </p>
                      <p className="font-serif text-base text-editorial-noir">J-127</p>
                    </div>
                    <div className="bg-white border border-editorial-noir/10 p-2.5">
                      <p className="text-[9px] uppercase tracking-wider text-editorial-gray mb-1">
                        {t('apercu.kpi.guests')}
                      </p>
                      <p className="font-serif text-base text-editorial-noir">165</p>
                    </div>
                    <div className="bg-white border border-editorial-noir/10 p-2.5">
                      <p className="text-[9px] uppercase tracking-wider text-editorial-gray mb-1">
                        {t('apercu.kpi.progress')}
                      </p>
                      <p className="font-serif text-base text-editorial-noir mb-1">85%</p>
                      <div className="h-1 bg-editorial-noir/10">
                        <div className="h-full bg-editorial-olive" style={{ width: '85%' }} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="bg-white border border-editorial-noir/10 px-3 py-2 flex items-center gap-2">
                      <span className="text-sm">📖</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-medium text-editorial-noir">
                          {t('apercu.cards.startTitle')}
                        </p>
                        <p className="text-[9px] text-editorial-gray">
                          {t('apercu.cards.startDesc')}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-editorial-noir/10 px-3 py-2 flex items-center gap-2">
                      <span className="text-sm">▶</span>
                      <div className="flex-1">
                        <p className="text-[10px] font-medium text-editorial-noir">
                          {t('apercu.cards.videoTitle')}
                        </p>
                        <p className="text-[9px] text-editorial-gray">{t('apercu.cards.videoDesc')}</p>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
            </div>
          </div>

          </div>

          {/* Liste fonctionnalités */}
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-6">
              {t('apercu.toolsTitle')}
            </h3>
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-3 text-editorial-noir text-base"
                >
                  <Check className="w-5 h-5 text-editorial-olive flex-shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sous-section : Carnet d'adresses */}
        <div className="mt-24 md:mt-32 grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="order-2 lg:order-1">
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
              {t('apercu.carnet.eyebrow')}
            </p>
            <h3 className="font-serif text-3xl md:text-4xl text-editorial-noir mb-5 leading-tight">
              {t('apercu.carnet.title')}
            </h3>
            <p className="text-editorial-gray text-base leading-relaxed mb-6">
              {t('apercu.carnet.desc')}
            </p>
            <ul className="space-y-3">
              {carnetItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-editorial-noir text-sm">
                  <Check className="w-4 h-4 text-editorial-olive flex-shrink-0 mt-1" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Régions — liens compacts 3 colonnes */}
            <div className="mt-8 pt-6 border-t border-editorial-noir/10">
              <p className="uppercase tracking-[0.25em] text-[10px] mb-3 text-editorial-olive">
                {i18n.language?.startsWith('en') ? 'By region' : 'Par région'}
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                {REGIONS.map(({ path, key }) => (
                  <li key={path}>
                    <Link
                      to={path}
                      className="text-xs text-editorial-noir/70 hover:text-editorial-olive transition-colors"
                    >
                      {tCommon(`footer.links.${key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-lg border border-editorial-noir/15 bg-white shadow-2xl overflow-hidden">
              <img
                src={carnetMockup.url}
                alt={t('apercu.carnet.imageAlt')}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block"
              />
            </div>
          </div>
        </div>

        {/* Note multi-device */}
        <p className="text-center text-xs md:text-sm text-editorial-noir/55 italic mt-16 max-w-2xl mx-auto leading-relaxed">
          {t('apercu.note')}
        </p>
      </div>
    </section>
  );
}
