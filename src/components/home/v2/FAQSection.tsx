import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type FaqItem = { q: string; a: string };

export default function FAQSection() {
  const { t } = useTranslation('homeV2');
  const faqs = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <section className="bg-[#F8F5EF] py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">
            {t('faq.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight">
            {t('faq.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 max-w-5xl mx-auto">
          {faqs.map((f, i) => (
            <Collapsible
              key={i}
              className="border-b border-editorial-noir/15 py-5 group"
            >
              <CollapsibleTrigger className="w-full flex items-center justify-between text-left gap-4">
                <span
                  className="font-serif text-lg text-editorial-noir"
                  dangerouslySetInnerHTML={{ __html: f.q }}
                />
                <Plus className="w-4 h-4 text-editorial-olive flex-shrink-0 transition-transform group-data-[state=open]:rotate-45" />
              </CollapsibleTrigger>
              <CollapsibleContent className="text-editorial-gray text-sm leading-relaxed pt-4 pr-8">
                {f.a}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </section>
  );
}
