const cards = [
  {
    num: '01',
    tag: 'Planification',
    title: 'Rétroplanning intelligent',
    desc: 'Une timeline personnalisée selon ta date et ton style. Chaque tâche au bon moment, sans oubli.',
  },
  {
    num: '02',
    tag: 'Finances',
    title: 'Budget réel & alertes',
    desc: 'Suis tes dépenses prestataire par prestataire. Reçois une alerte avant de dépasser.',
  },
  {
    num: '03',
    tag: 'Invités',
    title: 'Liste invités & RSVP',
    desc: 'Gère 200 invités sans tableau Excel. Allergies, plus-ones, hébergement — tout est là.',
  },
  {
    num: '04',
    tag: 'Réception',
    title: 'Plan de table interactif',
    desc: 'Drag & drop pour placer tes invités. Imprime ton plan en un clic.',
  },
  {
    num: '05',
    tag: 'Jour J',
    title: 'Coordination minute par minute',
    desc: 'Le déroulé du jour J partagé avec ton équipe (témoins, famille, prestataires).',
  },
  {
    num: '06',
    tag: 'Boissons',
    title: 'Calculateur de boissons',
    desc: 'Calcule précisément les quantités d\'alcool et boissons selon ton nombre d\'invités, le format de réception et la durée.',
  },
];

export default function IncludedSection() {
  return (
    <section id="planner-included" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            Ce qui est inclus
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir mb-6">
            Le service en détail.
          </h2>
          <p className="text-editorial-gray">
            Un service de wedding planning en ligne avec IA — 6 fonctionnalités
            pensées ensemble pour t'accompagner du oui au jour J.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-editorial-border">
          {cards.map((c) => (
            <article
              key={c.num}
              className="group bg-white hover:bg-editorial-noir transition-colors duration-300 p-8 md:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-3xl text-editorial-olive">
                  {c.num}
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
            Bonus inclus
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-3">
            Le Carnet d'adresses Mariable
          </h3>
          <p className="text-editorial-noir/75 max-w-2xl">
            Notre sélection curée de prestataires haut de gamme (lieux,
            traiteurs, photographes, fleuristes, DJ…). Une short-list de
            confiance, sans démarchage.
          </p>
        </div>
      </div>
    </section>
  );
}
