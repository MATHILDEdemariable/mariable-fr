import { Check, X } from 'lucide-react';

const others = [
  'Tableur Excel rigide et impersonnel',
  'Pinterest infini, zéro structure',
  'Notes éparpillées sur 5 apps',
  'Wedding planner à 2 000€ qui décide pour toi',
];
const mariable = [
  'Service web pensé pour les mariages',
  'IA qui répond à tes questions',
  'Tout centralisé, partout, tout le temps',
  '29€, une fois, à vie — tu gardes le contrôle',
];

export default function DifferentiatorSection() {
  return (
    <section className="bg-editorial-noir text-editorial-cream py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive-light">
            La différence
          </p>
          <h2 className="font-serif text-4xl md:text-5xl leading-tight">
            Pas un tableur Excel.
            <br />
            Un service pensé pour ton mariage.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-editorial-cream/15 max-w-4xl mx-auto">
          <div className="bg-editorial-noir p-8 md:p-10">
            <h3 className="font-serif text-xl mb-6 text-editorial-cream/60">
              Les autres
            </h3>
            <ul className="space-y-4">
              {others.map((o) => (
                <li
                  key={o}
                  className="flex items-start gap-3 text-editorial-cream/70"
                >
                  <X className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-editorial-noir p-8 md:p-10">
            <h3 className="font-serif text-xl mb-6 text-editorial-olive-light">
              Mariable
            </h3>
            <ul className="space-y-4">
              {mariable.map((m) => (
                <li key={m} className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-1 flex-shrink-0 text-editorial-olive-light" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center italic text-editorial-cream/60 mt-12 max-w-xl mx-auto">
          Pas une app à télécharger. Pas un PDF figé. Un service vivant, partout
          avec toi — ordinateur, tablette, mobile. Pour celles et ceux qui
          organisent eux-mêmes leur mariage.
        </p>
      </div>
    </section>
  );
}
