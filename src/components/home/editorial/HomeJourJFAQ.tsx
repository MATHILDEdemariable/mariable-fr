import React from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export type HomeFaqItem = { q: string; a: string };

const HomeJourJFAQ: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const faqItems = t('faq.items', { returnObjects: true }) as HomeFaqItem[];

  return (
    <section className="bg-editorial-beige py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-8">
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-editorial-noir/60">{t('faq.eyebrow')}</p>
          <h2 className="font-serif text-3xl leading-tight text-editorial-noir md:text-5xl">{t('faq.title')}</h2>
        </header>
        <div className="mx-auto grid max-w-5xl gap-x-12 md:grid-cols-2">
          {faqItems.map((faqItem) => (
            <Collapsible key={faqItem.q} className="group border-b border-editorial-noir/15 py-5">
              <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 text-left">
                <span className="font-serif text-lg text-editorial-noir">{faqItem.q}</span>
                <Plus className="h-4 w-4 flex-none text-editorial-olive transition-transform group-data-[state=open]:rotate-45" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pr-8 pt-4 text-sm leading-relaxed text-editorial-noir/65">
                {faqItem.a}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeJourJFAQ;