import { useTranslation } from 'react-i18next';

type Card = { tag: string; title: string; desc: string };

export default function IncludedSection() {
  const { t } = useTranslation('homeV2');
  const cards = t('included.cards', { returnObjects: true }) as Card[];

  return (
    <section id="planner-included" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            {t('included.eyebrow')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir mb-6">
            {t('included.title')}
          </h2>
          <p className="text-editorial-gray">{t('included.subtitle')}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-editorial-border">
          {cards.map((c, i) => (
            <article
              key={i}
              className="group bg-white hover:bg-editorial-noir transition-colors duration-300 p-8 md:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-3xl text-editorial-olive">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-editorial-gray group-hover:text-editorial-cream/70 transition-colors">
                  {c.tag}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-editorial-noir group-hover:text-editorial-cream transition-colors mb-3">
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed text-editorial-gray group-hover:text-editorial-cream/80 transition-colors">
                {c.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Bonus */}
        <div className="mt-px bg-editorial-olive/10 p-8 md:p-12 border-l-4 border-editorial-olive">
          <span className="text-[10px] uppercase tracking-widest text-editorial-olive block mb-3">
            {t('included.bonus.label')}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-3">
            {t('included.bonus.title')}
          </h3>
          <p className="text-editorial-noir/75 max-w-2xl">
            {t('included.bonus.desc')}
          </p>
        </div>
      </div>
    </section>
  );
}
