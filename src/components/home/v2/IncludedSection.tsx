const cards = [
  {
    num: '01',
    tag: 'Planification',
    title: 'Rétroplanning intelligent',
    desc: 'Une timeline personnalisée selon ta date et ton style. Chaque tâche au bon moment, sans oubli.',
    value: 'Valeur 19€',
  },
  {
    num: '02',
    tag: 'Finances',
    title: 'Budget réel & alertes',
    desc: 'Suis tes dépenses prestataire par prestataire. Reçois une alerte avant de dépasser.',
    value: 'Valeur 15€',
  },
  {
    num: '03',
    tag: 'Invités',
    title: 'Liste invités & RSVP',
    desc: 'Gère 200 invités sans tableau Excel. Allergies, plus-ones, hébergement — tout est là.',
    value: 'Valeur 12€',
  },
  {
    num: '04',
    tag: 'Réception',
    title: 'Plan de table interactif',
    desc: 'Drag & drop pour placer tes invités. Imprime ton plan en un clic.',
    value: 'Valeur 19€',
  },
  {
    num: '05',
    tag: 'Jour J',
    title: 'Coordination minute par minute',
    desc: 'Le déroulé du jour J partagé avec ton équipe (témoins, famille, prestataires).',
    value: 'Valeur 25€',
  },
  {
    num: '06',
    tag: 'IA',
    title: 'Assistant IA personnalisé',
    desc: 'Pose toutes tes questions à Mariable. Réponses adaptées à ton mariage, 24/7.',
    value: 'Valeur 29€',
  },
];

export default function IncludedSection() {
  return (
    <section id="planner-included" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-terracotta">
            Ce qui est inclus
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir mb-6">
            Le planner dans le détail.
          </h2>
          <p className="text-editorial-gray">
            6 outils pensés ensemble pour t'accompagner du oui au jour J.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-editorial-border">
          {cards.map((c) => (
            <article
              key={c.num}
              className="group bg-white hover:bg-editorial-noir transition-colors duration-300 p-8 md:p-10"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="font-serif text-3xl text-editorial-terracotta">
                  {c.num}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-editorial-gray group-hover:text-editorial-cream/70 transition-colors">
                  {c.tag}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-editorial-noir group-hover:text-editorial-cream transition-colors mb-3">
                {c.title}
              </h3>
              <p className="text-sm leading-relaxed text-editorial-gray group-hover:text-editorial-cream/80 transition-colors mb-6">
                {c.desc}
              </p>
              <span className="text-xs uppercase tracking-wider text-editorial-noir/50 group-hover:text-editorial-terracotta transition-colors">
                {c.value}
              </span>
            </article>
          ))}
        </div>

        {/* Bonus row */}
        <div className="grid md:grid-cols-2 gap-px bg-editorial-border mt-px">
          <div className="bg-editorial-gold-light p-8 md:p-10">
            <span className="text-[10px] uppercase tracking-widest text-editorial-noir/60 block mb-3">
              Bonus 01
            </span>
            <h3 className="font-serif text-2xl text-editorial-noir mb-2">
              +10 mini-fiches PDF
            </h3>
            <p className="text-sm text-editorial-noir/70">
              Inspirations, modèles de mails prestataires, checklists d'urgence.
            </p>
          </div>
          <div className="bg-editorial-gold-light p-8 md:p-10">
            <span className="text-[10px] uppercase tracking-widest text-editorial-noir/60 block mb-3">
              Bonus 02
            </span>
            <h3 className="font-serif text-2xl text-editorial-noir mb-2">
              Mises à jour à vie
            </h3>
            <p className="text-sm text-editorial-noir/70">
              Toutes les nouvelles fonctionnalités, sans surcoût, tant que ton
              projet existe.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
