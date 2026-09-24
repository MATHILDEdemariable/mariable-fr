import React, { useState } from 'react';
import { MoreVertical, Plus, Share, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export type HomeFaqItem = { q: string; a: string; install?: boolean };

const HomeJourJFAQ: React.FC = () => {
  const { t } = useTranslation('refonteJuillet');
  const faqItems = t('faq.items', { returnObjects: true }) as HomeFaqItem[];
  const [isInstallTutorialOpen, setIsInstallTutorialOpen] = useState(false);
  const installSteps = t('faq.installModal.steps', { returnObjects: true }) as Array<{ title: string; body: string }>;

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
                <p>{faqItem.a}</p>
                {faqItem.install && (
                  <Button type="button" variant="outline" onClick={() => setIsInstallTutorialOpen(true)} className="mt-4 h-11 rounded-none border-editorial-noir bg-transparent text-xs uppercase tracking-widest text-editorial-noir hover:bg-editorial-olive hover:text-primary-foreground">
                    <Smartphone className="mr-2 h-4 w-4" />
                    {t('faq.installModal.open')}
                  </Button>
                )}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      <Dialog open={isInstallTutorialOpen} onOpenChange={setIsInstallTutorialOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto rounded-none border-editorial-noir/15 bg-editorial-beige">
          <DialogHeader>
            <DialogTitle className="pr-8 font-serif text-2xl text-editorial-noir md:text-3xl">{t('faq.installModal.title')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-relaxed text-editorial-noir/70">{t('faq.installModal.intro')}</p>
          <div className="mt-3 grid gap-6 md:grid-cols-2">
            {installSteps.map((step, index) => {
              const Icon = index === 0 ? Share : MoreVertical;
              return (
                <div key={step.title} className="border-t border-editorial-noir/15 pt-4">
                  <Icon className="h-5 w-5 text-editorial-olive" />
                  <h3 className="mt-3 font-serif text-xl text-editorial-noir">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-editorial-noir/65">{step.body}</p>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default HomeJourJFAQ;