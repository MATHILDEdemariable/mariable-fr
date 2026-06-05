import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Plus } from 'lucide-react';

const faqs = [
  {
    q: 'Comment ça marche, concrètement&nbsp;?',
    a: 'Tu paies 29€ une fois. Tu accèdes immédiatement à ton espace Mariable depuis n\'importe quel navigateur. Tout est là, prêt à l\'emploi.',
  },
  {
    q: 'C\'est vraiment à vie&nbsp;?',
    a: 'Oui. Un paiement, accès illimité jusqu\'à ton mariage (et même après pour les souvenirs). Mises à jour incluses.',
  },
  {
    q: 'Et si je ne suis pas satisfait·e&nbsp;?',
    a: 'Remboursement sans condition pendant 14 jours. On veut que tu sois sereine, pas coincée.',
  },
  {
    q: 'Mon/ma partenaire peut aussi y accéder&nbsp;?',
    a: 'Bien sûr. Vous partagez le même espace, vous éditez à deux, en temps réel.',
  },
  {
    q: 'Je peux partager avec mes témoins ou ma famille&nbsp;?',
    a: 'Oui. Le planning Jour J et certaines vues sont partageables via un simple lien.',
  },
  {
    q: 'Il faut télécharger une app&nbsp;?',
    a: 'Non. Mariable fonctionne directement dans ton navigateur — ordinateur, tablette ou mobile. Aucun téléchargement.',
  },
];

export default function FAQSection() {
  return (
    <section className="bg-editorial-cream py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
            Questions fréquentes
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir">
            On répond à tout.
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
