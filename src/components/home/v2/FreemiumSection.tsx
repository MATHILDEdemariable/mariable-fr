import { Link } from 'react-router-dom';
import { Check, Lock, ArrowRight, BookOpen } from 'lucide-react';

const freeFeatures = [
  'Tous les services en ligne (rétroplanning, budget, invités, plan de table, coordination, calculateur de boissons)',
  'Liste de prestataires recommandés Mariable',
  'Accès au blog & aux conseils',
];

const freeLimits = [
  'Génération planning IA limitée',
  'Stockage documents & informations limités',
  'Exports PDF des espaces & guides non inclus',
];

const premiumFeatures = [
  'Tous les services — sans limite',
  'Génération planning IA illimitée',
  'Exports PDF illimités (espaces + guides)',
  'Stockage documents illimité',
  'Accès à toute la bibliothèque de guides & ebooks (témoins, mariée, prestataires, organisation débutant…)',
  'Support prioritaire & mises à jour à vie',
];

export default function FreemiumSection() {
  return (
    <section className="bg-editorial-cream py-24 md:py-32">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
              Comment ça marche
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-editorial-noir leading-tight">
              Gratuit pour commencer.
              <br />
              <span className="italic">Premium pour aller plus loin.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Free */}
            <div className="bg-white border border-editorial-noir/10 p-8 md:p-10 flex flex-col">
              <div className="mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-gray mb-3">
                  Mariable Gratuit
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-5xl text-editorial-noir">0€</span>
                  <span className="text-editorial-gray text-sm">/ pour toujours</span>
                </div>
                <p className="text-sm text-editorial-noir/70">
                  Pour démarrer l'organisation de ton mariage sans engagement.
                </p>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                {freeFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-editorial-olive mt-1 flex-shrink-0" />
                    <span className="text-sm text-editorial-noir">{f}</span>
                  </div>
                ))}
                <div className="pt-3 mt-3 border-t border-editorial-noir/10">
                  <p className="text-xs text-editorial-noir/50 uppercase tracking-wide font-semibold mb-3">
                    Limites
                  </p>
                  {freeLimits.map((l) => (
                    <div key={l} className="flex items-start gap-3 mb-2">
                      <Lock className="w-3.5 h-3.5 text-editorial-noir/40 mt-1 flex-shrink-0" />
                      <span className="text-sm text-editorial-noir/60">{l}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 w-full border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3.5 rounded-none font-medium transition-colors"
              >
                Créer un compte gratuit
              </Link>
            </div>

            {/* Premium */}
            <div className="bg-editorial-noir text-white p-8 md:p-10 flex flex-col relative">
              <div className="absolute -top-3 left-8">
                <span className="bg-editorial-olive text-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium">
                  Recommandé
                </span>
              </div>

              <div className="mb-8">
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-cream/70 mb-3">
                  Mariable Premium
                </p>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-serif text-5xl">29€</span>
                  <span className="text-editorial-cream/50 line-through text-lg">59€</span>
                  <span className="text-editorial-cream/70 text-sm">· à vie</span>
                </div>
                <p className="text-sm text-editorial-cream/75">
                  Un seul paiement. Aucun abonnement. Mises à jour incluses.
                </p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {premiumFeatures.map((f) => (
                  <div key={f} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-editorial-olive-light mt-1 flex-shrink-0" />
                    <span className="text-sm text-white">{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 w-full bg-editorial-olive hover:bg-editorial-olive/90 text-white px-6 py-3.5 rounded-none font-medium transition-colors"
              >
                Passer Premium — 29€
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Carte e-shop guides à l'unité */}
          <div className="mt-8 bg-editorial-beige border border-editorial-noir/10 p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-4 flex-1">
              <div className="bg-white border border-editorial-noir/10 p-3 flex-shrink-0">
                <BookOpen className="w-6 h-6 text-editorial-olive" />
              </div>
              <div>
                <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-2">
                  À l'unité
                </p>
                <h3 className="font-serif text-2xl text-editorial-noir mb-1">
                  E-books & guides digitaux
                </h3>
                <p className="text-sm text-editorial-noir/70">
                  À imprimer ou pas — dès <strong>4€</strong>. Witness, mariée, prestataires, organisation débutant…
                  <span className="block text-xs italic mt-1 text-editorial-noir/55">
                    Tous inclus gratuitement dans Premium (29€) — plus rentable dès 4 guides achetés.
                  </span>
                </p>
              </div>
            </div>
            <Link
              to="/guides"
              className="inline-flex items-center justify-center gap-2 border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3 rounded-none font-medium transition-colors whitespace-nowrap"
            >
              Voir l'e-shop
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <p className="text-center text-xs text-editorial-noir/50 mt-10 italic">
            vs un wedding planner à partir de 2 000€ — ≈ 70× moins cher.
          </p>
        </div>
      </div>
    </section>
  );
}
