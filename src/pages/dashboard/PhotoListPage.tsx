import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import PhotoListTemplate from '@/components/mon-jour-m/PhotoListTemplate';
import { useMonJourMCoordination } from '@/hooks/useMonJourMCoordination';

/** Liste de photos préparée dans le dashboard (planner + mariés), validée vers les documents du Jour J. */
const PhotoListPage: React.FC = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith('en');
  const { coordination, isLoading } = useMonJourMCoordination();

  return (
    <section className="space-y-4">
      <Helmet>
        <title>{isEnglish ? 'Wedding photo list | Mariable' : 'Liste de photos | Mariable'}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1 className="font-serif text-2xl sm:text-3xl">{isEnglish ? 'Photo list' : 'Liste de photos'}</h1>
      {coordination ? (
        <PhotoListTemplate coordinationId={coordination.id} />
      ) : isLoading ? (
        <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-wedding-olive" /></div>
      ) : null}
    </section>
  );
};

export default PhotoListPage;
