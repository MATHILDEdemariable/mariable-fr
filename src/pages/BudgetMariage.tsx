import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calculator, FileSearch, Users } from 'lucide-react';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import EditorialEShop from '@/components/home/editorial/EditorialEShop';
import BlogCarouselEditorial from '@/components/home/editorial/BlogCarouselEditorial';
import TestimonialsEditorial from '@/components/home/editorial/TestimonialsEditorial';
import FinalEditorialCTA from '@/components/home/editorial/FinalEditorialCTA';
import Footer from '@/components/Footer';
import BudgetSimulatorModal from '@/components/budget-landing/BudgetSimulatorModal';
import DevisAnalysisForm from '@/components/budget-landing/DevisAnalysisForm';

const VIDEO_URL =
  'https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/background-videos/freepik__wideangle-shot-a-joyful-couple-dances-at-their-wed__74093%20(1).mp4';

const FAQ_ITEMS = [
  {
    question: 'Combien coûte un mariage en France ?',
    answer:
      "Le coût d'un mariage dépend avant tout du nombre d'invités, de la région et du niveau de prestation choisi. Le lieu et le traiteur représentent à eux seuls la majorité de l'enveloppe. Le simulateur Mariable calcule une estimation personnalisée à partir de ces critères plutôt que d'une moyenne nationale peu utile.",
  },
  {
    question: 'Comment estimer le budget de son mariage ?',
    answer:
      "Partez du nombre d'invités et du niveau de prestation souhaité, puis répartissez l'enveloppe poste par poste : lieu, traiteur, photographe, DJ, fleurs, tenues, papeterie et divers. Notre simulateur de budget mariage fait ce calcul en quelques questions et vous donne une répartition détaillée.",
  },
  {
    question: 'Mon devis de mariage est-il au juste prix ?',
    answer:
      "Un devis se juge sur ce qu'il inclut réellement : heures de prestation, personnel, matériel, frais de déplacement, options facturées en supplément. Envoyez-nous votre devis : nous vous aidons à comprendre les prix pratiqués, à repérer les postes à challenger et à préparer vos questions au prestataire.",
  },
  {
    question: 'Quels postes pèsent le plus dans un budget mariage ?',
    answer:
      "Le lieu de réception et le traiteur concentrent l'essentiel de la dépense, suivis par la photographie, la décoration florale et les tenues. C'est sur ces premiers postes que se joue la maîtrise réelle du budget.",
  },
  {
    question: 'Comment réduire le budget de son mariage sans le déclasser ?',
    answer:
      "Ajuster le nombre d'invités reste le levier le plus puissant, car presque tous les postes sont proportionnels. Décaler la date en basse saison, choisir un lieu qui n'impose pas de prestataires et arbitrer entre les postes visibles et les postes invisibles permettent d'économiser sans sacrifier l'expérience.",
  },
  {
    question: "L'estimation de budget Mariable est-elle gratuite ?",
    answer:
      "Oui. Le simulateur de budget et l'analyse de devis sont gratuits. La création d'un compte Mariable, gratuite également, permet ensuite de suivre vos dépenses réelles et de recevoir une sélection de prestataires adaptée à votre budget.",
  },
];

const BudgetMariage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.mariable.fr/' },
      { '@type': 'ListItem', position: 2, name: 'CELEBRER VOTRE MARIAGE', item: 'https://www.mariable.fr/budget-mariage' },
    ],
  };

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Simulateur de budget mariage Mariable',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    url: 'https://www.mariable.fr/budget-mariage',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  };

  return (
    <>
      <SEO
        title="Budget mariage : combien coûte vraiment un mariage ?"
        description="Estimez le budget de votre mariage, faites analyser vos devis et trouvez des prestataires adaptés à votre enveloppe. Simulateur gratuit Mariable."
        canonical="/budget-mariage"
        keywords="budget mariage, combien coûte un mariage, prix mariage, coût moyen mariage France, simulateur budget mariage, analyse devis mariage, réduire budget mariage"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(appSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-[#F8F5EF] text-editorial-noir">
        <EditorialHeader transparent />

        <main>
          {/* Hero vidéo */}
          <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
            <div className="absolute inset-0">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover">
                <source src={VIDEO_URL} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/60" />
            </div>

            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
              <p className="text-xs md:text-sm tracking-[0.3em] uppercase text-white/85 mb-6">

              </p>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white leading-[1.1] max-w-4xl">
                Le mariage dont vous rêvez, {"\n"}
                au budget que vous choisissez.
              </h1>
              <p className="mt-6 md:mt-8 text-base md:text-lg text-white/85 max-w-2xl font-sans leading-relaxed">
                Passez de l'inspiration à la réalité : estimez votre budget, décryptez vos devis et
                découvrez des prestataires adaptés à votre projet.
              </p>

              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-3xl">
                <button
                  type="button"
                  onClick={() => setIsSimulatorOpen(true)}
                  className="w-full h-14 flex items-center justify-center text-center bg-white/10 backdrop-blur-sm border border-white/70 text-white hover:bg-white hover:text-editorial-noir px-4 uppercase tracking-widest text-xs rounded-none transition-colors"
                >
                  Estimer mon budget
                </button>
                <a
                  href="#analyser-mon-devis"
                  className="w-full h-14 flex items-center justify-center text-center bg-white/10 backdrop-blur-sm border border-white/70 text-white hover:bg-white hover:text-editorial-noir px-4 uppercase tracking-widest text-xs rounded-none transition-colors"
                >
                  Analyser mon devis
                </a>
                <a
                  href="#trouver-mes-prestataires"
                  className="w-full h-14 flex items-center justify-center text-center bg-white/10 backdrop-blur-sm border border-white/70 text-white hover:bg-white hover:text-editorial-noir px-4 uppercase tracking-widest text-xs rounded-none transition-colors"
                >
                  Trouver mes prestataires
                </a>
              </div>
            </div>
          </section>

          {/* Estimation */}
          <section id="estimer-mon-budget" className="bg-[#F8F5EF] py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">Estimation</p>
                  <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                    Estimer le budget de votre mariage
                  </h2>
                </div>
                <div className="space-y-5 text-editorial-noir/75 leading-relaxed">
                  <p>
                    Il n'existe pas de prix moyen d'un mariage qui vous soit utile. Ce qui compte,
                    c'est votre nombre d'invités, votre région, votre saison et le niveau de
                    prestation que vous visez. Notre simulateur de budget mariage part de ces
                    critères et vous rend une estimation personnalisée, répartie poste par poste :
                    lieu, traiteur, photographe, DJ, décoration, tenues, papeterie et divers.
                  </p>
                  <h3 className="font-serif text-2xl text-editorial-noir">Ce que vous obtenez</h3>
                  <ul className="space-y-2 list-disc pl-5">
                    <li>Une enveloppe globale réaliste pour votre projet</li>
                    <li>La répartition détaillée de votre budget par prestataire</li>
                    <li>Les postes sur lesquels vous avez réellement de la marge</li>
                  </ul>
                  <button
                    type="button"
                    onClick={() => setIsSimulatorOpen(true)}
                    className="inline-flex items-center gap-3 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 uppercase tracking-widest text-xs rounded-none transition-colors min-h-[44px]"
                  >
                    <Calculator className="w-4 h-4" aria-hidden="true" />
                    <span>Ouvrir le simulateur</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Analyse de devis */}
          <section id="analyser-mon-devis" className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                <div>
                  <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-3">Analyse de devis</p>
                  <h2 className="font-serif text-3xl md:text-5xl leading-tight">
                    Votre devis mariage est-il au juste prix ?
                  </h2>
                  <p className="mt-6 text-editorial-noir/75 leading-relaxed">
                    Envoyez-nous votre devis. Nous vous aidons à comprendre les prix, identifier les
                    postes à challenger et préparer vos questions au prestataire.
                  </p>
                  <h3 className="font-serif text-2xl mt-8 mb-3">Ce que nous regardons</h3>
                  <ul className="space-y-2 list-disc pl-5 text-editorial-noir/75 leading-relaxed">
                    <li>Ce qui est réellement inclus, et ce qui sera facturé en plus</li>
                    <li>Les repères de prix pratiqués sur votre région et votre saison</li>
                    <li>Les lignes négociables et les questions à poser avant de signer</li>
                  </ul>
                  <p className="mt-6 flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-wedding-olive">
                    <FileSearch className="w-4 h-4" aria-hidden="true" />
                    Réponse sous 48h
                  </p>
                </div>
                <DevisAnalysisForm />
              </div>
            </div>
          </section>

          {/* Sélection prestataires */}
          <section id="trouver-mes-prestataires" className="bg-wedding-olive py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-4xl text-center">
              <p className="text-xs tracking-[0.3em] uppercase text-white/70 mb-3">Sélection</p>
              <h2 className="font-serif text-3xl md:text-5xl text-white leading-tight">
                Trouver des prestataires adaptés à votre budget
              </h2>
              <p className="mt-6 text-white/85 leading-relaxed">
                Notre sélection est triée à la main, sans sponsoring : lieux de réception, traiteurs,
                photographes, DJ et fleuristes, avec des ordres de prix affichés pour que vous
                sachiez tout de suite si un prestataire entre dans votre enveloppe.
              </p>
              <div className="mt-10 flex justify-center">
                <Link
                  to={isAuthenticated ? '/professionnelsmariable' : '/register-gratuit?redirect=/professionnelsmariable'}
                  className="inline-flex items-center justify-center gap-3 bg-white text-editorial-noir border border-editorial-noir hover:bg-editorial-noir hover:text-white px-8 py-4 uppercase tracking-widest text-xs rounded-none transition-colors min-h-[44px]"
                >
                  <Users className="w-4 h-4" aria-hidden="true" />
                  <span>Voir la sélection</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Guides ultimes */}
          <EditorialEShop />

          {/* Conseils & inspirations */}
          <BlogCarouselEditorial />

          {/* Témoignages */}
          <TestimonialsEditorial />

          {/* FAQ */}
          <section className="bg-white py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8 max-w-3xl">
              <h2 className="font-serif text-3xl md:text-5xl leading-tight text-center mb-10 md:mb-14">
                Questions fréquentes sur le budget mariage
              </h2>
              <div className="space-y-8">
                {FAQ_ITEMS.map((item) => (
                  <article key={item.question} className="border-t border-editorial-noir/15 pt-6">
                    <h3 className="font-serif text-xl md:text-2xl text-editorial-noir">{item.question}</h3>
                    <p className="mt-3 text-editorial-noir/75 leading-relaxed">{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          {/* Créer votre espace Mariable */}
          <FinalEditorialCTA />
        </main>

        <Footer />
      </div>

      <BudgetSimulatorModal open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen} />
    </>
  );
};

export default BudgetMariage;
