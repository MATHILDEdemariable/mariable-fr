import { Check } from 'lucide-react';

const tools = [
  'Rétroplanning intelligent',
  'Budget réel & alertes',
  'Liste invités & RSVP',
  'Plan de table interactif',
  'Coordination Jour J',
  'Calculateur de boissons',
];

export default function EspaceApercu() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            Ton espace Mariable
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-4">
            Un aperçu de ce qui t'attend.
          </h2>
          <p className="text-editorial-gray">
            Toutes les fonctionnalités centralisées dans un seul espace,
            accessible où que tu sois.
          </p>
        </div>

        <div className="max-w-md mx-auto bg-editorial-beige p-8 md:p-10 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-editorial-noir/15">
            <span className="text-xs uppercase tracking-widest text-editorial-noir/60">
              Mon espace Mariable
            </span>
            <span className="w-2 h-2 rounded-full bg-editorial-olive" />
          </div>
          <ul className="space-y-3">
            {tools.map((tool) => (
              <li
                key={tool}
                className="flex items-center gap-3 text-editorial-noir text-sm"
              >
                <Check className="w-4 h-4 text-editorial-olive flex-shrink-0" />
                {tool}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
