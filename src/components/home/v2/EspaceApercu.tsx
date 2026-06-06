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
        <div className="text-center max-w-2xl mx-auto mb-16">
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

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center max-w-5xl mx-auto">
          {/* Mockup mobile */}
          <div className="flex justify-center">
            <div className="relative w-[280px] rounded-[2.5rem] border-[10px] border-editorial-noir bg-white shadow-2xl overflow-hidden">
              {/* Status bar */}
              <div className="flex items-center justify-between px-6 py-3 text-xs text-editorial-noir">
                <span className="font-medium">9:41</span>
                <span className="flex items-center gap-1 text-editorial-olive">
                  <span className="inline-block w-5 h-2.5 border border-editorial-olive rounded-sm bg-editorial-olive/80" />
                  100%
                </span>
              </div>
              {/* Header sage */}
              <div className="bg-editorial-olive px-5 py-6">
                <h3 className="font-serif text-white text-xl leading-tight">
                  Coordination Jour J
                </h3>
                <p className="text-white/90 text-sm">Votre mariage</p>
              </div>
              {/* Timeline */}
              <div className="px-4 py-5 space-y-3">
                <div className="bg-green-50 border-l-4 border-editorial-olive px-4 py-3">
                  <p className="font-semibold text-editorial-noir text-sm">
                    14:00 - Arrivée invités
                  </p>
                  <p className="text-xs text-editorial-gray">En cours ✓</p>
                </div>
                <div className="bg-gray-50 border-l-4 border-gray-300 px-4 py-3">
                  <p className="font-semibold text-editorial-noir text-sm">
                    15:30 - Cérémonie
                  </p>
                  <p className="text-xs text-editorial-gray">Préparation</p>
                </div>
                <div className="bg-editorial-beige border-l-4 border-editorial-beige px-4 py-3">
                  <p className="font-semibold text-editorial-noir text-sm">
                    17:00 - Cocktail
                  </p>
                  <p className="text-xs text-editorial-gray">À venir</p>
                </div>
              </div>
              {/* Footer */}
              <div className="mx-4 mb-5 border border-gray-200 px-4 py-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <p className="text-xs text-editorial-noir">
                  <strong>Photographe:</strong> En position
                </p>
              </div>
            </div>
          </div>

          {/* Liste fonctionnalités */}
          <div>
            <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-6">
              Tout, dans un seul espace.
            </h3>
            <ul className="space-y-4">
              {tools.map((tool) => (
                <li
                  key={tool}
                  className="flex items-center gap-3 text-editorial-noir text-base"
                >
                  <Check className="w-5 h-5 text-editorial-olive flex-shrink-0" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
