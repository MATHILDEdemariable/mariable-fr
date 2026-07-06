import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, X, ChevronRight } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { GUIDES, Guide } from '@/data/guides';

const GUIDE_SECTIONS = [
  {
    id: 'checklist-mariage',
    h2: 'Checklist mariage : les 12 mois avant le jour J',
    intro:
      "La checklist mariage 12 mois est la colonne vertébrale de votre organisation. Elle liste, mois après mois, les décisions à prendre pour préparer votre mariage sereinement : réservation du lieu de réception, sélection du photographe, envoi des faire-part, essayages robe et costume, dégustation traiteur… Utilisez notre checklist mariage gratuite pour ne rien oublier et cocher vos avancées au fil des semaines.",
    cta: { label: 'Ouvrir la checklist mariage', href: '/checklistmariage' },
  },
  {
    id: 'retroplanning-mariage',
    h2: 'Rétroplanning mariage : les étapes clés mois par mois',
    intro:
      "Un bon rétroplanning mariage transforme un projet complexe en petites étapes réalisables. Nous détaillons chaque phase — 12 mois avant, 6 mois, 3 mois, 1 mois, la semaine, la veille — pour que vous sachiez exactement quoi faire à quel moment. Notre modèle de rétroplanning mariage gratuit est éditable et personnalisable selon votre date, votre nombre d'invités et votre budget.",
    cta: { label: 'Voir le rétroplanning', href: '/dashboard/planning' },
  },
  {
    id: 'budget-mariage',
    h2: 'Guide budget mariage : combien prévoir pour 100 invités ?',
    intro:
      "Le budget mariage moyen en France pour 100 invités se situe entre 15 000 € et 30 000 € selon la région, le lieu et vos choix de prestataires. Notre guide détaille la répartition poste par poste (lieu, traiteur, photographe, décoration, tenues, alliances, papeterie) et propose un simulateur pour ajuster en temps réel. Objectif : anticiper les vrais coûts et éviter les mauvaises surprises.",
    cta: { label: 'Simuler mon budget mariage', href: '/dashboard/budget' },
  },
  {
    id: 'prestataires-mariage',
    h2: 'Choisir ses prestataires : lieu, traiteur, photographe',
    intro:
      "Les prestataires de mariage représentent 70 à 80 % de votre budget total. Bien les choisir, c'est la garantie d'un mariage réussi. Notre guide vous explique comment briefer un lieu de réception, comparer plusieurs devis traiteur, sélectionner un photographe dont le style correspond au vôtre, et négocier sans y perdre en qualité. Accédez également à notre carnet d'adresses de prestataires vérifiés partout en France.",
    cta: { label: 'Découvrir les prestataires', href: '/professionnels' },
  },
  {
    id: 'invites-mariage',
    h2: 'Guide invités : liste, RSVP et plan de table',
    intro:
      "Gérer 80, 120 ou 200 invités demande méthode et outils. Ce guide couvre la constitution de la liste d'invités (règles familiales, plus-uns, enfants), l'envoi et le suivi RSVP en ligne, la gestion des allergies et régimes alimentaires, puis la création du plan de table. Notre application mariage centralise tout : les invités voient les infos pratiques, vous voyez les réponses en temps réel.",
    cta: { label: 'Créer mon RSVP', href: '/dashboard/rsvp' },
  },
  {
    id: 'jour-j',
    h2: 'Checklist jour J : le déroulé minute par minute',
    intro:
      "Le jour J passe très vite. Une checklist jour J et un déroulé minuté permettent à vos témoins, wedding planner ou proches d'orchestrer la journée sans vous solliciter. Notre modèle de planning minuté couvre la préparation, la cérémonie civile, la cérémonie laïque, le cocktail, le dîner, l'ouverture de bal, jusqu'au brunch du lendemain. Téléchargeable en PDF.",
    cta: { label: 'Générer mon planning jour J', href: '/dashboard/coordination' },
  },
];

const FAQ = [
  {
    q: 'Quand commencer à organiser son mariage ?',
    a: "Idéalement 12 à 18 mois avant le jour J, surtout si vous visez un lieu de réception prisé ou une date en haute saison (mai à septembre). Certains lieux et prestataires sont réservés jusqu'à 2 ans à l'avance.",
  },
  {
    q: 'Quel est le budget moyen d’un mariage en France ?',
    a: "Le budget moyen d'un mariage en France oscille entre 15 000 € et 30 000 € pour 100 invités, soit environ 150 à 300 € par convive tout compris (lieu, traiteur, boissons, prestataires, tenues).",
  },
  {
    q: 'La checklist mariage Mariable est-elle gratuite ?',
    a: "Oui. Notre checklist mariage 12 mois est 100 % gratuite et accessible depuis votre compte Mariable. Elle s'adapte à votre date, votre nombre d'invités et vos priorités.",
  },
  {
    q: 'Peut-on organiser son mariage sans wedding planner ?',
    a: "Absolument. C'est même la vocation de Mariable : vous donner les outils, checklists, rétroplannings, guides et carnet d'adresses pour organiser vous-même votre mariage, tout en gardant la possibilité de faire appel à un coordinateur uniquement pour le jour J.",
  },
  {
    q: 'Combien de temps avant le mariage envoyer les faire-part ?',
    a: "3 à 4 mois avant pour un mariage en France, 6 mois pour un mariage à l'étranger ou en destination. Envoyez un save-the-date 8 à 12 mois à l'avance pour permettre à vos invités de réserver leurs congés.",
  },
];


export default function GuidesShop() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  return (
    <>
      <Helmet>
        <title>E-shop guides mariage — PDF dès 4€ | Mariable</title>
        <meta
          name="description"
          content="Achetez à l'unité nos guides et ebooks de mariage en PDF : témoins, mariée, prestataires, planning Jour-J, cérémonie. Dès 4€."
        />
      </Helmet>

      <div className="min-h-screen bg-editorial-cream flex flex-col">
        <PremiumHeader />

        <main className="flex-grow">
          {/* Hero */}
          <section className="bg-white py-20 md:py-28 border-b border-editorial-noir/10">
            <div className="container mx-auto px-6 text-center max-w-3xl">
              <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
                E-shop · PDF à imprimer
              </p>
              <h1 className="font-serif text-4xl md:text-6xl text-editorial-noir leading-tight mb-6">
                Guides & ebooks
                <br />
                <span className="italic">à l'unité, dès 4€ (A VENIR)</span>
              </h1>
              <p className="text-editorial-noir/70 text-base md:text-lg leading-relaxed">
                Téléchargez un guide précis pour un sujet précis. À lire à l'écran ou à imprimer.
              </p>
            </div>
          </section>

          {/* Banner Premium */}
          <section className="bg-editorial-beige py-6 border-b border-editorial-noir/10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6 text-center md:text-left">
              <p className="text-sm text-editorial-noir">
                <strong>Tous ces guides sont inclus gratuitement</strong> dans Mariable Premium — 29€ à vie · plus rentable dès 4 guides.
              </p>
              <Link
                to="/paiement"
                className="inline-flex items-center gap-2 text-sm font-medium text-editorial-olive hover:underline whitespace-nowrap"
              >
                Voir Premium 29€
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>

          {/* Grid guides */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {GUIDES.map((g) => (
                  <article
                    key={g.slug}
                    className="bg-white border border-editorial-noir/10 flex flex-col group hover:shadow-lg transition-shadow"
                  >
                    {/* Cover placeholder editorial */}
                    <div className="aspect-[4/5] bg-gradient-to-br from-editorial-beige to-editorial-cream border-b border-editorial-noir/10 flex flex-col items-center justify-center p-6 text-center relative">
                      <BookOpen className="w-8 h-8 text-editorial-olive mb-4 opacity-60" />
                      <p className="uppercase tracking-[0.25em] text-[10px] text-editorial-olive mb-3">
                        Mariable · PDF
                      </p>
                      <h2 className="font-serif text-xl text-editorial-noir leading-tight">
                        {g.title}
                      </h2>
                      {g.pages && (
                        <p className="absolute bottom-3 right-3 text-[10px] text-editorial-noir/40">
                          {g.pages} pages
                        </p>
                      )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-sm text-editorial-noir/70 mb-6 flex-1">
                        {g.description}
                      </p>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-serif text-2xl text-editorial-noir">
                          {g.price}€
                        </span>
                        <button
                          onClick={() => setSelectedGuide(g)}
                          className="inline-flex items-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-4 py-2.5 text-sm font-medium transition-colors"
                        >
                          Acheter
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Premium reassurance bottom */}
              <div className="max-w-3xl mx-auto mt-20 text-center bg-editorial-noir text-white p-10 md:p-12">
                <p className="uppercase tracking-[0.3em] text-xs text-editorial-olive-light mb-4">
                  Plus rentable
                </p>
                <h2 className="font-serif text-3xl md:text-4xl mb-6">
                  Tout débloquer pour <span className="italic">29€</span>
                </h2>
                <p className="text-editorial-cream/80 text-sm md:text-base mb-8 max-w-xl mx-auto">
                  Avec Mariable Premium, vous accédez à <strong>toute la bibliothèque</strong> + tous les outils sans limite + exports PDF illimités. Un seul paiement, à vie.
                </p>
                <Link
                  to="/paiement"
                  className="inline-flex items-center justify-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-8 py-4 font-medium transition-colors"
                >
                  Passer Premium — 29€
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Modal "bientôt" */}
      {selectedGuide && (
        <div
          className="fixed inset-0 z-50 bg-editorial-noir/70 flex items-center justify-center p-4"
          onClick={() => setSelectedGuide(null)}
        >
          <div
            className="bg-white max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-editorial-noir/50 hover:text-editorial-noir"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-3">
              Bientôt disponible
            </p>
            <h3 className="font-serif text-2xl text-editorial-noir mb-3">
              {selectedGuide.title}
            </h3>
            <p className="text-sm text-editorial-noir/70 mb-6">
              L'achat à l'unité ({selectedGuide.price}€) sera disponible très prochainement.
              En attendant, débloquez <strong>tous les guides</strong> + l'ensemble des outils avec Mariable Premium.
            </p>
            <div className="space-y-3">
              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 w-full bg-editorial-olive hover:bg-editorial-olive/90 text-white px-6 py-3 font-medium transition-colors"
              >
                Passer Premium — 29€
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`mailto:contact@mariable.fr?subject=Pré-commande%20${encodeURIComponent(selectedGuide.title)}`}
                className="inline-flex items-center justify-center gap-2 w-full border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3 font-medium transition-colors"
              >
                <Check className="w-4 h-4" />
                Me prévenir par email
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
