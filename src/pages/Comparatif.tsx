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
        <title>Comparatif : Organiser seul vs Wedding Planner vs Mariable</title>
        <meta 
          name="description" 
          content="Comparez les avantages d'organiser votre mariage seul, avec un wedding planner ou avec Mariable. Prix, autonomie, transparence : faites le bon choix." 
        />
        <meta name="keywords" content="comparatif mariage, wedding planner, organisation mariage, mariable, prix wedding planner" />
        <link rel="canonical" href="https://mariable.fr/comparatif" />
      </Helmet>

      <SEOSchemaEnhanced schemas={[{
        type: 'FAQ',
        data: { questions: comparatifFaqData }
      }]} />

      <div className="min-h-screen bg-white">
        <PremiumHeader />
        
        <main className="pb-16 page-content">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="font-serif text-4xl md:text-5xl text-editorial-noir mb-6">
                Comment organiser votre mariage ?
              </h1>
              <p className="text-xl text-editorial-noir/70 max-w-3xl mx-auto">
                Découvrez les avantages et inconvénients de chaque approche pour faire le meilleur choix selon vos besoins et votre budget.
              </p>
            </div>

            {/* Comparison Table */}
            <ComparatifTable />

            <div className="max-w-6xl mx-auto">
              {/* CTA Section */}
              <div className="text-center mt-16 p-8 bg-wedding-olive">
                <h2 className="font-serif text-2xl text-white mb-4">
                  Prêt(e) à organiser votre mariage intelligemment ?
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Rejoignez les milliers de couples qui ont choisi Mariable pour organiser leur mariage de rêve sans stress ni budget excessif.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="bg-white text-wedding-olive hover:bg-white/90 rounded-none">
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
