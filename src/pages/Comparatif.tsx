import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ComparatifTable } from '@/components/comparatif/ComparatifTable';
import SEOSchemaEnhanced from '@/components/SEOSchemaEnhanced';

const comparatifFaqData = [
  { question: "Quelle est la différence entre Mariable et un wedding planner ?", answer: "Mariable est un outil digital de planification qui vous donne l'autonomie d'un wedding planner à une fraction du prix. Un wedding planner coûte entre 2 000 € et 8 000 €, Mariable est gratuit (ou 29 € en Premium)." },
  { question: "Puis-je organiser mon mariage seul(e) sans wedding planner ?", answer: "Oui, c'est exactement ce que Mariable permet. L'application vous guide étape par étape avec checklist, budget, coordination jour-J et sélection de prestataires vérifiés." },
  { question: "Mariable remplace-t-il complètement un wedding planner ?", answer: "Mariable couvre 90 % des besoins d'organisation : planning, budget, prestataires, coordination jour-J. Pour les mariages très complexes (200+ invités, destination wedding), un wedding planner peut être complémentaire." },
  { question: "Combien coûte l'organisation d'un mariage en France ?", answer: "En moyenne, un mariage en France coûte entre 15 000 € et 30 000 € pour 100 invités. Mariable vous aide à optimiser chaque poste de dépense grâce à son calculateur de budget intelligent." },
];

const Comparatif = () => {
  return (
    <>
      <Helmet>
        <title>Organiser son mariage avec l'IA : wedding planner digital vs seul | Mariable</title>
        <meta
          name="description"
          content="Comparez organiser son mariage seul, avec un wedding planner ou avec Mariable, l'organisateur mariage en ligne. Outils d'organisation mariage, conseils et tuto mariage pas cher."
        />
        <meta name="keywords" content="organiser son mariage avec l'ia, wedding planning digital, wedding planner digital, organisateur mariage en ligne, outils d'organisation mariage, conseils mariage, organisation mariage pas cher, tuto mariage, comparatif mariage" />
        <link rel="canonical" href="https://mariable.fr/comparatif" />
      </Helmet>

      <SEOSchemaEnhanced schemas={[{
        type: 'FAQ',
        data: { questions: comparatifFaqData }
      }]} />

      <div className="min-h-screen bg-editorial-beige">
        <PremiumHeader />

        <main className="pb-16 page-content">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <p className="uppercase tracking-widest text-sm text-wedding-olive mb-4">Comparatif</p>
              <h1 className="font-serif text-4xl md:text-5xl text-editorial-noir mb-6">
                Organiser son mariage : seul, wedding planner ou wedding planner digital ?
              </h1>
              <p className="text-xl text-editorial-noir/70">
                Découvrez la meilleure approche pour <strong>organiser son mariage avec l'IA</strong> et
                des <strong>outils d'organisation mariage</strong> pensés pour les couples autonomes.
              </p>
            </div>

            {/* SEO intro block */}
            <section className="max-w-4xl mx-auto bg-white p-6 md:p-8 mb-12 border border-editorial-noir/10">
              <h2 className="font-serif text-2xl text-editorial-noir mb-4">
                Pourquoi choisir un organisateur de mariage en ligne ?
              </h2>
              <p className="text-editorial-noir/80 mb-3">
                Le <strong>wedding planning digital</strong> combine le meilleur de deux mondes : l'expertise
                d'un wedding planner et l'autonomie d'une plateforme accessible 24/7. Mariable est le
                <strong> wedding planner digital</strong> français qui accompagne les couples de la sélection
                des prestataires jusqu'à la coordination du jour J.
              </p>
              <p className="text-editorial-noir/80">
                Pour une <strong>organisation de mariage pas cher</strong> mais qualitative, un
                <strong> organisateur mariage en ligne</strong> comme Mariable propose checklist, budget,
                tuto mariage, plan de table et carnet d'adresses vérifiés — le tout à 70× moins cher
                qu'un wedding planner traditionnel.
              </p>
            </section>

            {/* Comparison Table */}
            <ComparatifTable />

            <div className="max-w-6xl mx-auto">
              {/* SEO content block */}
              <section className="mt-16 bg-white p-6 md:p-8 border border-editorial-noir/10">
                <h2 className="font-serif text-2xl text-editorial-noir mb-4">
                  Conseils mariage : nos tuto et outils pour tout organiser
                </h2>
                <p className="text-editorial-noir/80 mb-3">
                  Mariable centralise tous les <strong>conseils mariage</strong> essentiels : rétroplanning
                  intelligent, budget réel, liste d'invités & RSVP, plan de table interactif, coordination
                  du jour J et carnet d'adresses des meilleurs prestataires français.
                </p>
                <p className="text-editorial-noir/80">
                  Que vous cherchiez un <strong>tuto mariage</strong> complet ou un outil pour organiser
                  seul(e) un mariage à petit budget, Mariable s'adapte à votre projet — mariage intime,
                  cérémonie laïque, fête de PACS ou anniversaire de mariage.
                </p>
              </section>

              {/* CTA Section */}
              <div className="text-center mt-16 p-8 bg-wedding-olive">
                <h2 className="font-serif text-2xl text-white mb-4">
                  Prêt(e) à organiser votre mariage intelligemment ?
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Rejoignez les milliers de couples qui ont choisi Mariable pour organiser leur mariage de rêve sans stress ni budget excessif.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-white text-editorial-noir hover:bg-white/90 rounded-none uppercase tracking-wide border border-white">
                    <Link to="/register-gratuit">Créer mon compte gratuit</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Comparatif;

