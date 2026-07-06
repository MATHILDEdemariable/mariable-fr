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
        <title>Guide mariage & checklist mariage gratuite | Mariable</title>
        <meta
          name="description"
          content="Le guide mariage complet pour tout organiser : checklist mariage 12 mois, rétroplanning, budget, prestataires vérifiés. Modèles gratuits + ebooks PDF dès 4€."
        />
        <link rel="canonical" href="https://www.mariable.fr/guides" />
        <meta property="og:title" content="Guide mariage & checklist mariage gratuite | Mariable" />
        <meta property="og:description" content="Checklist mariage 12 mois, rétroplanning, budget, jour J. Le guide complet Mariable pour organiser votre mariage." />
        <meta property="og:url" content="https://www.mariable.fr/guides" />
        <meta property="og:type" content="article" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Guide mariage complet : checklist, rétroplanning et conseils pour organiser votre mariage',
          description: "Le guide de référence Mariable : checklist mariage 12 mois, rétroplanning, budget, prestataires, jour J.",
          author: { '@type': 'Organization', name: 'Mariable' },
          publisher: { '@type': 'Organization', name: 'Mariable', url: 'https://www.mariable.fr' },
          mainEntityOfPage: 'https://www.mariable.fr/guides',
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.mariable.fr/' },
            { '@type': 'ListItem', position: 2, name: 'Guide mariage', item: 'https://www.mariable.fr/guides' },
          ],
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQ.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-editorial-cream flex flex-col">
        <PremiumHeader />

        <main className="flex-grow">
          {/* Hero éditorial SEO */}
          <section className="bg-white py-16 md:py-24 border-b border-editorial-noir/10">
            <div className="container mx-auto px-6 max-w-4xl">
              <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive text-center">
                Guide mariage · Ressources gratuites
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight mb-6 text-center">
                Guide de mariage complet :<br />
                <span className="italic">checklist, rétroplanning et conseils pour organiser votre mariage</span>
              </h1>
              <div className="prose prose-lg max-w-none text-editorial-noir/80 mt-8">
                <p>
                  Organiser un mariage, c'est prendre plus de 200 décisions en quelques mois. Ce <strong>guide mariage Mariable</strong>
                  {' '}rassemble tout ce dont vous avez besoin pour préparer sereinement le vôtre : <strong>checklist mariage 12 mois</strong>,
                  <strong> rétroplanning gratuit</strong>, <strong>guide budget mariage</strong>, sélection de <strong>prestataires vérifiés</strong>,
                  déroulé du jour J et modèles PDF téléchargeables.
                </p>
                <p>
                  Que vous en soyez au tout premier jour de vos préparatifs ou à J-30, vous trouverez ici les ressources adaptées à votre étape.
                  Tous les outils Mariable sont <strong>100 % gratuits</strong> pour démarrer ; les guides PDF téléchargeables (dès 4 €) et les
                  fonctionnalités avancées sont regroupés dans l'offre Premium à <strong>29 € à vie</strong>.
                </p>
              </div>

              {/* Sommaire ancré */}
              <nav aria-label="Sommaire" className="mt-10 bg-editorial-beige/50 border border-editorial-noir/10 rounded p-6">
                <p className="uppercase tracking-[0.2em] text-[11px] text-editorial-olive mb-4">Sommaire du guide</p>
                <ul className="space-y-2">
                  {GUIDE_SECTIONS.map((s) => (
                    <li key={s.id}>
                      <a href={`#${s.id}`} className="inline-flex items-center gap-2 text-editorial-noir hover:text-editorial-olive text-sm">
                        <ChevronRight className="w-3 h-3" />
                        {s.h2}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="#faq" className="inline-flex items-center gap-2 text-editorial-noir hover:text-editorial-olive text-sm">
                      <ChevronRight className="w-3 h-3" />
                      FAQ mariage
                    </a>
                  </li>
                  <li>
                    <a href="#ebooks" className="inline-flex items-center gap-2 text-editorial-noir hover:text-editorial-olive text-sm">
                      <ChevronRight className="w-3 h-3" />
                      E-books PDF à télécharger
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </section>

          {/* Sections éditoriales SEO */}
          <section className="py-16 md:py-20 bg-editorial-cream">
            <div className="container mx-auto px-6 max-w-4xl space-y-14">
              {GUIDE_SECTIONS.map((s) => (
                <article key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-4">{s.h2}</h2>
                  <p className="text-editorial-noir/80 leading-relaxed">{s.intro}</p>
                  <Link
                    to={s.cta.href}
                    className="inline-flex items-center gap-2 mt-4 text-editorial-olive hover:underline text-sm font-medium"
                  >
                    {s.cta.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          {/* FAQ SEO */}
          <section id="faq" className="py-16 md:py-20 bg-white border-t border-editorial-noir/10 scroll-mt-24">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-8 text-center">
                FAQ mariage
              </h2>
              <div className="space-y-6">
                {FAQ.map((f) => (
                  <details key={f.q} className="border-b border-editorial-noir/10 pb-4 group">
                    <summary className="font-serif text-lg text-editorial-noir cursor-pointer list-none flex justify-between items-center">
                      {f.q}
                      <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                    </summary>
                    <p className="text-sm text-editorial-noir/75 mt-3 leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Banner Premium */}
          <section id="ebooks" className="bg-editorial-beige py-6 border-y border-editorial-noir/10 scroll-mt-24">
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
