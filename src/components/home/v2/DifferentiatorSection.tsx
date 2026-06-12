import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DifferentiatorSection() {
  const { t } = useTranslation('homeV2');
  const others = t('differentiator.others', { returnObjects: true }) as string[];
  const mariable = t('differentiator.mariable', { returnObjects: true }) as string[];

  return (
    <section className="bg-editorial-cream py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            {t('differentiator.eyebrow')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight text-editorial-noir">
            {t('differentiator.titleLine1')}
            <br />
            {t('differentiator.titleLine2')}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-editorial-noir/10 max-w-4xl mx-auto">
          <div className="bg-white p-8 md:p-10">
            <h3 className="font-serif text-xl mb-6 text-editorial-noir/50">
              {t('differentiator.othersTitle')}
            </h3>
            <ul className="space-y-4">
              {others.map((o) => (
                <li key={o} className="flex items-start gap-3 text-editorial-gray">
                  <X className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white p-8 md:p-10">
            <h3 className="font-serif text-xl mb-6 text-editorial-olive">
              {t('differentiator.mariableTitle')}
            </h3>
            <ul className="space-y-4">
              {mariable.map((m) => (
                <li key={m} className="flex items-start gap-3 text-editorial-noir">
                  <Check className="w-4 h-4 mt-1 flex-shrink-0 text-editorial-olive" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center italic text-editorial-noir/70 mt-12 max-w-2xl mx-auto leading-relaxed">
          {t('differentiator.footnote')}
        </p>
      </div>
    </section>
  );
}
