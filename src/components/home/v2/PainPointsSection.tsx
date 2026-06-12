import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PainPointsSection() {
  const { t } = useTranslation('homeV2');
  const pains = t('painPoints.items', { returnObjects: true }) as string[];
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="bg-editorial-cream py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div ref={ref} className="grid md:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
              {t('painPoints.eyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir leading-tight mb-6">
              {t('painPoints.titleLine1')}
              <br />
              {t('painPoints.titleLine2')}
            </h2>
            <p className="text-editorial-gray leading-relaxed">
              {t('painPoints.subtitle')}
            </p>
          </div>
          <ul className="space-y-6">
            {pains.map((p, i) => (
              <li
                key={i}
                className="flex gap-4 transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-editorial-olive flex-shrink-0 mt-2" />
                <p className="text-editorial-noir text-lg leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
