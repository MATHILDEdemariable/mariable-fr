import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';

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

export default function RegionalLinksSection() {
  const { t, i18n } = useTranslation('common');
  const isEn = i18n.language?.startsWith('en');

  return (
    <section className="py-16 md:py-24 bg-editorial-cream" aria-labelledby="regions-heading">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-wedding-olive mb-3">
            {isEn ? 'Discover' : 'Découvrir'}
          </p>
          <h2 id="regions-heading" className="font-serif text-3xl md:text-4xl text-wedding-black mb-4">
            {isEn ? 'Get married across France' : 'Se marier partout en France'}
          </h2>
          <p className="text-wedding-black/70 max-w-2xl mx-auto">
            {isEn
              ? 'Hand-picked venues and vendors in every French region.'
              : 'Lieux et prestataires sélectionnés dans chaque région française.'}
          </p>
        </div>

        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-wedding-black/10 border border-wedding-black/10">
          {REGIONS.map(({ path, key }) => (
            <li key={path} className="bg-editorial-cream">
              <Link
                to={path}
                className="flex items-center gap-2 p-4 text-sm text-wedding-black hover:bg-wedding-olive hover:text-white transition-colors h-full"
              >
                <MapPin className="h-4 w-4 shrink-0 opacity-60" aria-hidden="true" />
                <span className="font-serif">{t(`footer.links.${key}`)}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="text-center mt-8">
          <Link
            to="/professionnelsmariable"
            className="inline-block text-sm text-wedding-olive hover:text-wedding-black underline underline-offset-4 transition-colors"
          >
            {t('footer.links.allRegions')}
          </Link>
        </div>
      </div>
    </section>
  );
}
