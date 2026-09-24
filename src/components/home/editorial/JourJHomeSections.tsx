import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  CalendarDays,
  CheckSquare,
  FileText,
  LayoutGrid,
  MapPin,
  Users,
  Wallet,
  Wine,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import dashboardPlanning from '@/assets/dashboard-planning.jpg.asset.json';
import dashboardBudget from '@/assets/dashboard-budget.jpg.asset.json';
import dashboardSeating from '@/assets/dashboard-plan-de-table.jpg.asset.json';
import organizingWeddingImage from '@/assets/blog/comment-organiser-son-mariage.png.asset.json';
import budgetWeddingImage from '@/assets/blog/budget-mariage-20000-euros.png.asset.json';

const centralizedInformation = [
  'schedule',
  'roles',
  'contacts',
  'vendors',
  'briefs',
  'documents',
  'logistics',
  'updates',
] as const;

const toolIcons = {
  planning: CalendarDays,
  budget: Wallet,
  guests: Users,
  seating: LayoutGrid,
  vendors: MapPin,
  practical: Wine,
};

const professionalFeatures = ['schedule', 'contacts', 'documents', 'collaboration', 'sharing', 'projects'] as const;

export const JourJProductFocus: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');

  return (
    <section id="application-jour-j" className="bg-editorial-beige py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-editorial-noir/60">
              {t('jourJFocus.eyebrow')}
            </p>
            <h2 className="max-w-xl font-serif text-3xl leading-tight text-editorial-noir md:text-5xl">
              {t('jourJFocus.title')}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-editorial-noir/75 md:text-lg">
              {t('jourJFocus.intro')}
            </p>

            <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {centralizedInformation.map((item) => (
                <div key={item} className="flex items-center gap-3 border-b border-editorial-noir/10 pb-3 text-sm text-editorial-noir">
                  <CheckSquare className="h-4 w-4 flex-none text-editorial-olive" strokeWidth={1.5} />
                  <span>{t(`jourJFocus.items.${item}`)}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 border-l-2 border-editorial-olive pl-5 font-serif text-xl leading-relaxed text-editorial-noir">
              {t('jourJFocus.sharing')}
            </p>

            <Button asChild className="mt-8 h-12 rounded-none bg-editorial-olive px-7 text-xs uppercase tracking-widest text-primary-foreground hover:bg-editorial-noir">
              <Link to="/coordination-jour-j">
                {t('jourJFocus.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="relative mx-auto w-full max-w-3xl pb-12 pr-4 md:pb-16 md:pr-12">
            <div className="border border-editorial-noir/15 bg-background p-2 shadow-xl md:p-3">
              <div className="flex h-7 items-center gap-1.5 border-b border-editorial-noir/10 px-2">
                <span className="h-2 w-2 rounded-full bg-editorial-noir/20" />
                <span className="h-2 w-2 rounded-full bg-editorial-noir/20" />
                <span className="h-2 w-2 rounded-full bg-editorial-noir/20" />
              </div>
              <img
                src={dashboardPlanning.url}
                alt={t('jourJFocus.desktopAlt')}
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full object-cover object-top"
              />
            </div>

            <div className="absolute bottom-0 right-0 w-[35%] min-w-[130px] border-[5px] border-editorial-noir bg-background p-1 shadow-xl md:border-[7px]">
              <img
                src={dashboardPlanning.url}
                alt={t('jourJFocus.mobileAlt')}
                width={420}
                height={820}
                className="aspect-[9/16] w-full object-cover object-left-top"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-editorial-noir/15 pt-8 md:mt-24">
          <p className="text-center font-serif text-xl text-editorial-noir md:text-2xl">
            {t('jourJFocus.peopleIntro')}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-px bg-editorial-noir/10 md:grid-cols-5">
            {(['caterer', 'dj', 'witnesses', 'venue', 'couple'] as const).map((person) => (
              <div key={person} className="bg-editorial-beige px-4 py-5 text-center">
                <p className="text-xs uppercase tracking-widest text-editorial-noir/55">{t(`jourJFocus.people.${person}.name`)}</p>
                <p className="mt-2 text-sm text-editorial-noir">{t(`jourJFocus.people.${person}.need`)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const AudiencePaths: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-editorial-noir/60">{t('audiences.eyebrow')}</p>
          <h2 className="font-serif text-3xl leading-tight text-editorial-noir md:text-5xl">{t('audiences.title')}</h2>
        </header>

        <div className="grid gap-px bg-editorial-noir/15 lg:grid-cols-2">
          <article id="couple" className="grid bg-editorial-beige sm:grid-cols-[0.85fr_1.15fr]">
            <img
              src={organizingWeddingImage.url}
              alt={t('audiences.couple.imageAlt')}
              width={900}
              height={1100}
              className="h-full min-h-64 w-full object-cover"
            />
            <div className="flex flex-col p-7 md:p-10">
              <p className="text-xs uppercase tracking-[0.25em] text-editorial-olive">{t('audiences.couple.label')}</p>
              <h3 className="mt-3 font-serif text-3xl text-editorial-noir">{t('audiences.couple.title')}</h3>
              <p className="mt-5 flex-1 text-sm leading-relaxed text-editorial-noir/70 md:text-base">{t('audiences.couple.body')}</p>
              <p className="mt-5 font-serif text-lg text-editorial-noir">{t('audiences.couple.highlight')}</p>
              <Button asChild className="mt-7 h-12 rounded-none bg-editorial-olive px-6 text-xs uppercase tracking-widest text-primary-foreground hover:bg-editorial-noir">
                <Link to="/register-gratuit">{t('audiences.couple.cta')}</Link>
              </Button>
            </div>
          </article>

          <article id="professionnel" className="bg-editorial-noir p-7 text-primary-foreground md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-primary-foreground/70">{t('audiences.pro.label')}</p>
            <h3 className="mt-3 font-serif text-3xl">{t('audiences.pro.title')}</h3>
            <p className="mt-5 text-sm leading-relaxed text-primary-foreground/75 md:text-base">{t('audiences.pro.body')}</p>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {professionalFeatures.map((feature) => (
                <li key={feature} className="flex gap-3 border-t border-primary-foreground/20 pt-3 text-sm">
                  <span className="text-editorial-olive-light">+</span>
                  <span>{t(`audiences.pro.features.${feature}`)}</span>
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8 h-12 w-full rounded-none border-primary-foreground bg-transparent px-6 text-xs uppercase tracking-widest text-primary-foreground hover:bg-primary-foreground hover:text-editorial-noir">
              <Link to="/register-gratuit?type=pro">{t('audiences.pro.cta')}</Link>
            </Button>
          </article>
        </div>
      </div>
    </section>
  );
};

export const PreparationTools: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');

  return (
    <section className="bg-editorial-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
          <header>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-editorial-noir/60">{t('preparation.eyebrow')}</p>
            <h2 className="font-serif text-3xl leading-tight text-editorial-noir md:text-5xl">{t('preparation.title')}</h2>
            <p className="mt-6 text-base leading-relaxed text-editorial-noir/70">{t('preparation.intro')}</p>
            <p className="mt-6 font-serif text-xl text-editorial-noir">{t('preparation.promise')}</p>
            <Button asChild variant="outline" className="mt-8 h-12 rounded-none border-editorial-noir bg-transparent px-7 text-xs uppercase tracking-widest text-editorial-noir hover:bg-editorial-noir hover:text-primary-foreground">
              <Link to="/register-gratuit">
                {t('preparation.cta')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </header>

          <div className="grid grid-cols-2 gap-3 md:gap-5">
            <img src={dashboardBudget.url} alt={t('preparation.budgetAlt')} width={1000} height={750} loading="lazy" className="aspect-[4/3] w-full border border-editorial-noir/10 object-cover object-top" />
            <img src={dashboardSeating.url} alt={t('preparation.seatingAlt')} width={1000} height={750} loading="lazy" className="mt-8 aspect-[4/3] w-full border border-editorial-noir/10 object-cover object-top md:mt-14" />
          </div>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(toolIcons) as Array<keyof typeof toolIcons>).map((tool) => {
            const Icon = toolIcons[tool];
            return (
              <article key={tool} className="border-t border-editorial-noir/20 pt-5">
                <Icon className="h-5 w-5 text-editorial-olive" strokeWidth={1.4} />
                <h3 className="mt-4 font-serif text-xl text-editorial-noir">{t(`preparation.tools.${tool}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-editorial-noir/65">{t(`preparation.tools.${tool}.body`)}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-16 grid overflow-hidden bg-editorial-olive text-primary-foreground md:grid-cols-[0.7fr_1.3fr]">
          <img src={budgetWeddingImage.url} alt={t('preparation.editorialAlt')} width={900} height={650} loading="lazy" className="h-full min-h-64 w-full object-cover" />
          <div className="flex flex-col justify-center p-8 md:p-12">
            <FileText className="h-6 w-6" strokeWidth={1.3} />
            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-primary-foreground/70">{t('preparation.editorialEyebrow')}</p>
            <h3 className="mt-3 font-serif text-3xl md:text-4xl">{t('preparation.editorialTitle')}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/80 md:text-base">{t('preparation.editorialBody')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
