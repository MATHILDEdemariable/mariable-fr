import { useEffect, useRef, useState } from 'react';

const pains = [
  'Tu te réveilles la nuit avec une checklist mentale qui ne s\'arrête plus.',
  'Tu jongles entre Excel, Pinterest, Notes iPhone et WhatsApp — et tu perds le fil.',
  'Tu as peur d\'oublier un détail le jour J et que ça gâche tout.',
  'Tes prestataires t\'envoient 12 mails par jour, tu ne sais plus où donner de la tête.',
  'Tu voudrais quelqu\'un pour t\'aider, mais 2 000€ pour un wedding planner, non merci.',
];

export default function PainPointsSection() {
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
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-terracotta">
              Tu te reconnais&nbsp;?
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir leading-tight mb-6">
              Organiser un mariage,
              <br />
              c'est un second job.
            </h2>
            <p className="text-editorial-gray leading-relaxed">
              Tu n'as pas signé pour ça. Tu voulais juste te marier — sereinement,
              avec celles et ceux que tu aimes. Pas devenir cheffe de projet à
              temps plein.
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
                <span className="w-2.5 h-2.5 rounded-full bg-editorial-terracotta flex-shrink-0 mt-2" />
                <p className="text-editorial-noir text-lg leading-relaxed">{p}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
