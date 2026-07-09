import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, X, ChevronRight, Loader2, Check } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { GUIDES, GUIDE_THEMES, Guide, GuideTheme } from '@/data/guides';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GUIDE_SECTIONS = [
  {
    id: 'organisation-mariage',
    h2: 'Organiser son mariage quand on débute',
    intro:
      "Vous ne savez pas par où commencer ? Le guide « Débutants Mariage » balaie les priorités mois par mois : lieu, budget, prestataires clés, invités, papeterie. Un point de départ clair pour ne rien oublier.",
    cta: { label: 'Acheter le Guide Débutants', slug: 'guide-debutants-mariage' },
  },
  {
    id: 'budget-mariage',
    h2: 'Budget mariage : combien prévoir en 2026 ?',
    intro:
      "Le budget mariage moyen en France pour 100 invités se situe entre 15 000 € et 30 000 €. Notre « Catalogue Prix Mariage 2026 » détaille les fourchettes réelles par poste (lieu, traiteur, photographe, DJ, fleuriste…) pour anticiper les vrais coûts et éviter les mauvaises surprises.",
    cta: { label: 'Voir le Catalogue Prix 2026', slug: 'catalogue-prix-mariage-2026' },
  },
  {
    id: 'prestataires-mariage',
    h2: 'Choisir ses prestataires : les bonnes questions',
    intro:
      "Les prestataires représentent 70 à 80 % de votre budget. La checklist des questions à poser vous évite les mauvaises surprises : contrats, disponibilité, options, annulation, plan B…",
    cta: { label: 'Acheter la Checklist prestataires', slug: 'checklist-questions-prestataires' },
  },
  {
    id: 'ceremonie-mariage',
    h2: 'Cérémonie laïque : le déroulé complet',
    intro:
      "Une cérémonie laïque personnalisée demande une vraie préparation. Rôles, rituels, textes, timing : le guide couvre tout ce qu'il faut pour un moment fort et fluide.",
    cta: { label: 'Voir le Guide Cérémonie Laïque', slug: 'guide-ceremonie-laique' },
  },
  {
    id: 'temoins-mariage',
    h2: 'Témoins & discours : réussir son rôle',
    intro:
      "Être témoin, c'est un rôle qui se prépare. Nos deux guides — la « Checklist Témoins » et le « Do & Don't du Discours » — couvrent missions, timing et bonnes pratiques pour un rôle réussi sans stress.",
    cta: { label: 'Voir la Checklist Témoins', slug: 'checklist-temoins' },
  },
  {
    id: 'checklist-mariee',
    h2: 'Préparatifs de la mariée : la checklist essentielle',
    intro:
      "Robe, essayages, beauté, accessoires, kit d'urgence du jour J : la checklist mariée regroupe tout ce qu'il ne faut pas oublier pour un jour J serein côté mariée.",
    cta: { label: 'Acheter la Checklist Mariée', slug: 'checklist-mariee' },
  },
];

const FAQ = [
  {
    q: 'Quand commencer à organiser son mariage ?',
    a: "Idéalement 12 à 18 mois avant le jour J, surtout si vous visez un lieu de réception prisé ou une date en haute saison (mai à septembre). Certains lieux et prestataires sont réservés jusqu'à 2 ans à l'avance.",
  },
  {
    q: 'Quel est le budget moyen d\u2019un mariage en France ?',
    a: "Le budget moyen d'un mariage en France oscille entre 15 000 € et 30 000 € pour 100 invités, soit environ 150 à 300 € par convive tout compris (lieu, traiteur, boissons, prestataires, tenues).",
  },
  {
    q: 'Les e-books Mariable sont-ils imprimables ?',
    a: "Oui. Tous nos guides et checklists sont livrés au format PDF haute qualité, imprimables en A4 et utilisables sur mobile, tablette ou ordinateur.",
  },
  {
    q: 'Puis-je acheter un seul guide ou dois-je prendre Premium ?',
    a: "Les deux sont possibles. Chaque e-book est vendu à l'unité dès 4 €. Si vous voulez toute la bibliothèque + les outils Mariable sans limite, l'offre Premium à 29 € à vie devient plus rentable dès 4 guides achetés.",
  },
  {
    q: 'Combien de temps avant le mariage envoyer les faire-part ?',
    a: "3 à 4 mois avant pour un mariage en France, 6 mois pour un mariage à l'étranger. Envoyez un save-the-date 8 à 12 mois à l'avance pour permettre à vos invités de réserver leurs congés.",
  },
];

const findGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);

const formatPrice = (n: number) =>
  n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function GuidesShop() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [modalStep, setModalStep] = useState<'preview' | 'checkout'>('preview');
  const [activeTheme, setActiveTheme] = useState<GuideTheme | 'all'>('all');
  const [email, setEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const { toast } = useToast();

  const openGuide = (g: Guide) => {
    setSelectedGuide(g);
    setModalStep('preview');
  };

  const closeModal = () => {
    if (checkoutLoading) return;
    setSelectedGuide(null);
    setModalStep('preview');
  };

  const filteredGuides = useMemo(
    () => (activeTheme === 'all' ? GUIDES : GUIDES.filter((g) => g.theme === activeTheme)),
    [activeTheme]
  );

  const handleBuy = async () => {
    if (!selectedGuide) return;
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: 'Email invalide', description: 'Merci de saisir un email valide.', variant: 'destructive' });
      return;
    }
    setCheckoutLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-ebook-checkout', {
        body: { guideSlug: selectedGuide.slug, email: trimmed },
      });
      if (error || !data?.url) throw new Error(error?.message || 'Session Stripe indisponible');
      window.location.href = data.url;
    } catch (e) {
      toast({ title: 'Erreur', description: (e as Error).message, variant: 'destructive' });
      setCheckoutLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>E-books & guides mariage à télécharger dès 4€ | Mariable</title>
        <meta
          name="description"
          content="Marketplace d'e-books mariage : checklists, rétroplanning, guide prestataires, jour J. PDF haute qualité dès 4€ ou toute la bibliothèque avec Premium 29€ à vie."
        />
        <link rel="canonical" href="https://www.mariable.fr/guides" />
        <meta property="og:title" content="E-books & guides mariage à télécharger | Mariable" />
        <meta property="og:description" content="Checklists, rétroplanning, guide prestataires et jour J en PDF. Dès 4€ ou tout inclus avec Premium 29€ à vie." />
        <meta property="og:url" content="https://www.mariable.fr/guides" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'E-books mariage Mariable',
          itemListElement: GUIDES.map((g, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Product',
              name: g.title,
              description: g.description,
              brand: { '@type': 'Brand', name: 'Mariable' },
              category: 'Guide mariage PDF',
              offers: {
                '@type': 'Offer',
                price: g.price,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                url: `https://www.mariable.fr/guides#ebook-${g.slug}`,
              },
            },
          })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.mariable.fr/' },
            { '@type': 'ListItem', position: 2, name: 'Guides & e-books mariage', item: 'https://www.mariable.fr/guides' },
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
          {/* 1. HERO court, conversion first */}
          <section className="bg-white pt-14 pb-10 md:pt-20 md:pb-12 border-b border-editorial-noir/10">
            <div className="container mx-auto px-6 max-w-4xl text-center">
              <p className="uppercase tracking-[0.3em] text-xs mb-6 text-editorial-olive">
                GUIDES MARIAGE · E-BOOKS
              </p>
              <h1 className="font-serif text-3xl md:text-5xl text-editorial-noir leading-tight mb-6">
                Guides & e-books mariage <span className="italic">à télécharger</span>
              </h1>
              <p className="text-editorial-noir/80 text-base md:text-lg max-w-2xl mx-auto mb-8">
                Checklists, rétroplannings, guides prestataires et jour J.
                Des PDF prêts à imprimer, écrits par une wedding planner — <strong>dès 4 €</strong>.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="#ebooks"
                  className="inline-flex items-center gap-2 bg-editorial-olive hover:bg-editorial-olive/90 text-white px-6 py-3 text-sm font-medium transition-colors"
                >
                  Voir les e-books
                  <ArrowRight className="w-4 h-4" />
                </a>
                <Link
                  to="/paiement"
                  className="inline-flex items-center gap-2 border border-editorial-noir text-editorial-noir hover:bg-editorial-noir hover:text-white px-6 py-3 text-sm font-medium transition-colors"
                >
                  Tout débloquer — Premium 29€
                </Link>
              </div>
              <p className="mt-6 text-xs text-editorial-noir/50">
                Vous cherchez plutôt les outils d'organisation gratuits ?{' '}
                <Link to="/outils-planning-mariage" className="underline hover:text-editorial-olive">
                  Découvrir l'appli Mariable →
                </Link>
              </p>
            </div>
          </section>

          {/* 2. MARKETPLACE - filtres + grille */}
          <section id="ebooks" className="py-14 md:py-20 scroll-mt-24">
            <div className="container mx-auto px-6">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                  <div>
                    <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir">
                      La bibliothèque
                    </h2>
                    <p className="text-sm text-editorial-noir/60 mt-1">
                      {filteredGuides.length} e-book{filteredGuides.length > 1 ? 's' : ''}
                      {activeTheme !== 'all' && ` · ${GUIDE_THEMES.find((t) => t.value === activeTheme)?.label}`}
                    </p>
                  </div>
                </div>

                {/* Filtres */}
                <div className="flex flex-wrap gap-2 mb-10">
                  <button
                    type="button"
                    onClick={() => setActiveTheme('all')}
                    className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
                      activeTheme === 'all'
                        ? 'bg-editorial-noir text-white border-editorial-noir'
                        : 'bg-white text-editorial-noir border-editorial-noir/20 hover:border-editorial-noir'
                    }`}
                  >
                    Tous
                  </button>
                  {GUIDE_THEMES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setActiveTheme(t.value)}
                      className={`px-4 py-2 text-xs uppercase tracking-[0.15em] border transition-colors ${
                        activeTheme === t.value
                          ? 'bg-editorial-noir text-white border-editorial-noir'
                          : 'bg-white text-editorial-noir border-editorial-noir/20 hover:border-editorial-noir'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Grille */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {filteredGuides.map((g) => (
                    <article
                      key={g.slug}
                      id={`ebook-${g.slug}`}
                      className="bg-white border border-editorial-noir/10 flex flex-col group hover:shadow-lg transition-shadow scroll-mt-24"
                    >
                      <div className="aspect-[4/5] bg-gradient-to-br from-editorial-beige to-editorial-cream border-b border-editorial-noir/10 flex flex-col items-center justify-center p-6 text-center relative">
                        <BookOpen className="w-8 h-8 text-editorial-olive mb-4 opacity-60" />
                        <p className="uppercase tracking-[0.25em] text-[10px] text-editorial-olive mb-3">
                          Mariable · PDF
                        </p>
                        <h3 className="font-serif text-xl text-editorial-noir leading-tight">
                          {g.title}
                        </h3>
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

                {filteredGuides.length === 0 && (
                  <p className="text-center text-editorial-noir/60 py-16">
                    Aucun e-book dans cette catégorie pour le moment.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 3. Bloc conversion Premium */}
          <section className="pb-20">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center bg-editorial-noir text-white p-10 md:p-12">
                <p className="uppercase tracking-[0.3em] text-xs text-editorial-olive-light mb-4">
                  PLUS RENTABLE&nbsp;
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

          {/* 4. Contenu SEO condensé — chaque CTA renvoie vers l'e-book */}
          <section className="py-16 md:py-20 bg-white border-t border-editorial-noir/10">
            <div className="container mx-auto px-6 max-w-4xl">
              <div className="text-center mb-14">
                <p className="uppercase tracking-[0.3em] text-xs mb-4 text-editorial-olive">
                  Guide mariage
                </p>
                <h2 className="font-serif text-2xl md:text-4xl text-editorial-noir">
                  Tout ce qu'il faut savoir pour préparer son mariage
                </h2>
              </div>

              <nav aria-label="Sommaire" className="mb-14 bg-editorial-beige/50 border border-editorial-noir/10 rounded p-6">
                <p className="uppercase tracking-[0.2em] text-[11px] text-editorial-olive mb-4">Sommaire</p>
                <ul className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
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
                </ul>
              </nav>

              <div className="space-y-14">
                {GUIDE_SECTIONS.map((s) => {
                  const g = findGuide(s.cta.slug);
                  return (
                    <article key={s.id} id={s.id} className="scroll-mt-24">
                      <h3 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-4">{s.h2}</h3>
                      <p className="text-editorial-noir/80 leading-relaxed">{s.intro}</p>
                      {g && (
                        <a
                          href={`#ebook-${g.slug}`}
                          className="inline-flex items-center gap-2 mt-4 text-editorial-olive hover:underline text-sm font-medium"
                        >
                          {s.cta.label} — {g.price}€
                          <ArrowRight className="w-4 h-4" />
                        </a>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 5. FAQ */}
          <section id="faq" className="py-16 md:py-20 bg-editorial-cream border-t border-editorial-noir/10 scroll-mt-24">
            <div className="container mx-auto px-6 max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl text-editorial-noir mb-8 text-center">
                FAQ mariage & e-books
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

              <p className="text-center text-sm text-editorial-noir/60 mt-12">
                Besoin d'outils d'organisation en ligne (checklist, budget, RSVP, plan de table) ?{' '}
                <Link to="/outils-planning-mariage" className="underline hover:text-editorial-olive">
                  Voir l'appli Mariable →
                </Link>
              </p>
            </div>
          </section>
        </main>

        <Footer />
      </div>

      {/* Modal achat */}
      {selectedGuide && (
        <div
          className="fixed inset-0 z-50 bg-editorial-noir/70 flex items-center justify-center p-4"
          onClick={() => !checkoutLoading && setSelectedGuide(null)}
        >
          <div
            className="bg-white max-w-md w-full p-8 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedGuide(null)}
              disabled={checkoutLoading}
              className="absolute top-4 right-4 text-editorial-noir/50 hover:text-editorial-noir disabled:opacity-40"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
            <p className="uppercase tracking-[0.2em] text-xs text-editorial-olive mb-3">
              Acheter ce guide
            </p>
            <h3 className="font-serif text-2xl text-editorial-noir mb-2">
              {selectedGuide.title}
            </h3>
            <p className="font-serif text-3xl text-editorial-noir mb-4">{selectedGuide.price}€</p>
            <p className="text-sm text-editorial-noir/70 mb-5">
              Recevez le PDF par email + accès permanent depuis un lien personnel.
            </p>
            <label className="block text-xs uppercase tracking-[0.15em] text-editorial-noir/60 mb-2">
              Votre email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@email.com"
              className="w-full border border-editorial-noir/20 px-4 py-3 mb-4 focus:outline-none focus:border-editorial-olive"
              disabled={checkoutLoading}
            />
            <button
              onClick={handleBuy}
              disabled={checkoutLoading}
              className="inline-flex items-center justify-center gap-2 w-full bg-editorial-olive hover:bg-editorial-olive/90 text-white px-6 py-3 font-medium transition-colors disabled:opacity-70"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirection vers Stripe…
                </>
              ) : (
                <>
                  Payer {selectedGuide.price}€
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] text-editorial-noir/50 mt-3 text-center">
              Paiement sécurisé Stripe · Aucune création de compte requise
            </p>
          </div>
        </div>
      )}
    </>
  );
}
