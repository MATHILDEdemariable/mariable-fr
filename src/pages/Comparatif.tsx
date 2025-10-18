import React from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Check, X, Crown, Users, Clock, Heart, Shield, Sparkles } from 'lucide-react';

const Comparatif = () => {
  const comparisons = [
    {
      category: "Prix total",
      icon: <Crown className="w-5 h-5" />,
      seul: { value: "0€", description: "Gratuit mais chronophage", status: "ok" },
      weddingPlanner: { value: "2000-10000€", description: "Coût élevé selon prestataire", status: "warning" },
      mariable: { value: "0-900€", description: "Accessible à tous les budgets", status: "best" }
    },
    {
      category: "Autonomie",
      icon: <Users className="w-5 h-5" />,
      seul: { value: "Totale", description: "Vous gérez tout seul", status: "warning" },
      weddingPlanner: { value: "Déléguée", description: "Perte de contrôle", status: "ok" },
      mariable: { value: "Guidée", description: "Accompagnement sans dépendance", status: "best" }
    },
    {
      category: "Transparence",
      icon: <Shield className="w-5 h-5" />,
      seul: { value: "Variable", description: "Dépend de vos recherches", status: "warning" },
      weddingPlanner: { value: "Limitée", description: "Accès restreint aux informations", status: "warning" },
      mariable: { value: "100%", description: "Accès complet aux données", status: "best" }
    },
    {
      category: "Gestion du temps",
      icon: <Clock className="w-5 h-5" />,
      seul: { value: "À vous", description: "Des centaines d'heures", status: "bad" },
      weddingPlanner: { value: "Entièrement gérée", description: "Mais à prix élevé", status: "ok" },
      mariable: { value: "Optimisée", description: "Outils pour gagner du temps", status: "best" }
    },
    {
      category: "Support disponible",
      icon: <Heart className="w-5 h-5" />,
      seul: { value: "Aucun", description: "Vous êtes seul(e)", status: "bad" },
      weddingPlanner: { value: "Personnalisé", description: "Mais coûteux", status: "ok" },
      mariable: { value: "Outils + conseils", description: "Support optimal", status: "best" }
    },
    {
      category: "Accès prestataires",
      icon: <Sparkles className="w-5 h-5" />,
      seul: { value: "Recherche manuelle", description: "Chronophage et incertain", status: "warning" },
      weddingPlanner: { value: "Réseau fermé", description: "Limité aux partenaires", status: "ok" },
      mariable: { value: "Base complète", description: "Tous les prestataires référencés", status: "best" }
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "best":
        return <Check className="w-5 h-5 text-green-600" />;
      case "ok":
        return <Check className="w-5 h-5 text-yellow-600" />;
      case "warning":
        return <X className="w-5 h-5 text-orange-500" />;
      case "bad":
        return <X className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "best":
        return "border-green-200 bg-green-50";
      case "ok":
        return "border-yellow-200 bg-yellow-50";
      case "warning":
        return "border-orange-200 bg-orange-50";
      case "bad":
        return "border-red-200 bg-red-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

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

      <div className="min-h-screen bg-gradient-to-br from-premium-light via-white to-premium-cream">
        <PremiumHeader />
        
        <main className="pb-16 page-content-premium">
          <div className="container mx-auto px-4">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-premium-black mb-6">
                Comment organiser votre mariage ?
              </h1>
              <p className="text-xl text-premium-charcoal max-w-3xl mx-auto">
                Découvrez les avantages et inconvénients de chaque approche pour faire le meilleur choix selon vos besoins et votre budget.
              </p>
            </div>

            {/* Comparison Table */}
            <div className="max-w-6xl mx-auto">
              {/* Headers */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="hidden md:block"></div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-premium-black mb-2">Organiser seul</h3>
                  <p className="text-sm text-premium-charcoal">Autonomie totale</p>
                </div>
                <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold text-premium-black mb-2">Wedding Planner</h3>
                  <p className="text-sm text-premium-charcoal">Service traditionnel</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-premium-sage to-premium-sage/80 rounded-2xl shadow-lg border border-premium-sage/20 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-premium-sage text-white px-4 py-1 rounded-full text-sm font-medium">
                      Recommandé
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">Mariable</h3>
                  <p className="text-sm text-white/90">Solution moderne</p>
                </div>
              </div>

              {/* Comparison Rows */}
              <div className="space-y-4">
                {comparisons.map((comparison, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Category */}
                    <div className="flex items-center p-4 bg-white rounded-2xl shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-premium-light rounded-lg">
                          {comparison.icon}
                        </div>
                        <span className="font-medium text-premium-black">{comparison.category}</span>
                      </div>
                    </div>

                    {/* Seul */}
                    <div className={`p-4 rounded-2xl shadow-sm border-2 ${getStatusColor(comparison.seul.status)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-premium-black">{comparison.seul.value}</span>
                        {getStatusIcon(comparison.seul.status)}
                      </div>
                      <p className="text-sm text-premium-charcoal">{comparison.seul.description}</p>
                    </div>

                    {/* Wedding Planner */}
                    <div className={`p-4 rounded-2xl shadow-sm border-2 ${getStatusColor(comparison.weddingPlanner.status)}`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-premium-black">{comparison.weddingPlanner.value}</span>
                        {getStatusIcon(comparison.weddingPlanner.status)}
                      </div>
                      <p className="text-sm text-premium-charcoal">{comparison.weddingPlanner.description}</p>
                    </div>

                    {/* Mariable */}
                    <div className={`p-4 rounded-2xl shadow-lg border-2 ${getStatusColor(comparison.mariable.status)} relative`}>
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-semibold text-premium-black">{comparison.mariable.value}</span>
                        {getStatusIcon(comparison.mariable.status)}
                      </div>
                      <p className="text-sm text-premium-charcoal">{comparison.mariable.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Section */}
              <div className="text-center mt-16 p-8 bg-gradient-to-br from-premium-sage to-premium-sage/80 rounded-3xl shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Prêt(e) à organiser votre mariage intelligemment ?
                </h2>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Rejoignez les milliers de couples qui ont choisi Mariable pour organiser leur mariage de rêve sans stress ni budget excessif.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild className="btn-secondary bg-white text-premium-sage hover:bg-premium-light border-0 ripple">
                    <Link to="/register">Commencer gratuitement</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/10 ripple">
                    <Link to="/prix">Voir les tarifs</Link>
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