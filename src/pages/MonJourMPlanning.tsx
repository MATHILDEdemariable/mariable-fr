import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import MonJourMLayout from '@/components/mon-jour-m/MonJourMLayout';
import MonJourMPlanningMVP from '@/components/mon-jour-m/MonJourMPlanningMVP';
import MonJourMConducteur from '@/pages/MonJourMConducteur';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

/** Planning unique : mode Préparation (édition) ou mode Live Jour J (étapes cochables). */
const MonJourMPlanningPage: React.FC = () => {
  const { coordination } = useMonJourMCoordination();
  const { t, i18n } = useTranslation('monJourM');
  const isEnglish = i18n.language?.startsWith('en');
  const [searchParams, setSearchParams] = useSearchParams();
  const isLiveMode = searchParams.get('mode') === 'live';

  const handleChangeMode = (live: boolean) => {
    const nextParams = new URLSearchParams(searchParams);
    if (live) nextParams.set('mode', 'live'); else nextParams.delete('mode');
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>{t('pages.planning.metaTitle')}</title>
        <meta name="description" content={t('pages.planning.metaDescription')} />
      </Helmet>

      <MonJourMLayout coordinationId={coordination?.id}>
        <div className="max-w-md mb-4 grid grid-cols-2 border border-wedding-olive/30" role="group" aria-label={isEnglish ? 'Planning mode' : 'Mode du planning'}>
          {[false, true].map((live) => (
            <button
              key={String(live)}
              type="button"
              aria-pressed={isLiveMode === live}
              onClick={() => handleChangeMode(live)}
              className={`min-h-[44px] px-3 text-sm font-medium transition-colors ${isLiveMode === live ? 'bg-wedding-olive text-white' : 'text-wedding-olive hover:bg-wedding-olive/10'}`}
            >
              {live ? (isEnglish ? 'Live wedding day' : 'Live Jour J') : (isEnglish ? 'Preparation' : 'Préparation')}
            </button>
          ))}
        </div>
        {isLiveMode ? <MonJourMConducteur embedded /> : <MonJourMPlanningMVP />}
      </MonJourMLayout>
    </>
  );
};

export default MonJourMPlanningPage;
