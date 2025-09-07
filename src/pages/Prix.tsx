import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Phone, Smartphone, Users, Calendar, X, ArrowLeft, Clock, Palette, Building, FileText, CreditCard, ChevronDown, Play, Check, MessageCircle, Brain, Settings, Handshake } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import FormulaCTAButton from '@/components/pricing/FormulaCTAButton';
import CoordinatorsPreview from '@/components/coordinators/CoordinatorsPreview';

const Prix = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqData = [
    {
      id: 1,
      question: "Puis-je modifier la formule plus tard ?",
      answer: "Oui, vous pouvez upgrader votre formule jusqu'à J-30. Un ajustement tarifaire sera appliqué au prorata du temps restant jusqu'à votre mariage."
    },
    {
      id: 2,
      question: "La présence terrain, c'est quoi exactement ?",
      answer: "Un manager Mariable est physiquement présent le jour J pour superviser le déroulement, coordonner les prestataires et gérer les imprévus."
    },
    {
      id: 3,
      question: "Puis-je utiliser l'app avec ma famille ?",
      answer: "Oui justement, l'application est faite pour être collaborative - chacun peut accéder à son planning et aux informations importantes."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Tarifs - Services Mariable | Wedding Planner en ligne</title>
        <meta name="description" content="Découvrez nos tarifs transparents pour organiser votre mariage. Application autonome à 14,9€ et services premium sur demande." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        {/* Section 1 - Gérez votre mariage en autonomie */}
        <section className="py-16 md:py-20 bg-gray-50 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mb-6">
                Gérez votre mariage en autonomie
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Les outils professionnels pour organiser votre mariage en toute liberté
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
              {/* Le Planner Mariable (Gratuit) */}
              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Smartphone className="h-6 w-6 text-wedding-olive" />
                    <CardTitle className="text-xl font-bold">Le Planner Mariable</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">Tableau de bord pour bien démarrer</p>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-2">Gratuit</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Accès à votre espace personnel</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Sélection de prestataires Mariable</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Check-list & calculatrice budget</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Modèle de suivi budgétaire</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/register">S'inscrire gratuitement</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Application Coordination Jour-J (14,9€) - FOCUS */}
              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full border-2 border-wedding-olive bg-wedding-olive/5">
                <CardHeader className="text-center pb-4 bg-wedding-olive text-white">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white text-wedding-olive text-sm px-3 py-1 rounded-full font-semibold">
                    ⭐ Le plus populaire
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="h-6 w-6" />
                    <CardTitle className="text-xl font-bold">Application Coordination Jour-J</CardTitle>
                  </div>
                  <p className="text-sm text-white/90">Autonomie totale avec notre app en ligne</p>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-wedding-olive mb-2">14,9€</div>
                    <div className="text-sm text-gray-600 font-medium">Paiement unique</div>
                    <div className="text-xs text-wedding-olive font-semibold mt-1">Application à vie</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700 font-medium">Planning personnalisé intelligent</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Assignation des tâches à l'équipe</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Partage en temps réel avec les proches</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Coordinateur à la carte (en option)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Export PDF professionnel</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto space-y-3">
                    <FormulaCTAButton formula="libre" />
                    <Button asChild variant="outline" className="w-full border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white">
                      <Link to="/demo-jour-m">Voir la démo</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Avantages de l'autonomie */}
            <div className="max-w-3xl mx-auto">
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="flex items-start gap-3">
                  <Brain className="h-6 w-6 text-wedding-olive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Expertise incluse</h3>
                    <p className="text-gray-700">
                      Les bonnes adresses et les bons outils d'un professionnel.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Settings className="h-6 w-6 text-wedding-olive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Autonomie complète</h3>
                    <p className="text-gray-700">
                      Organisez tout à votre rythme, selon vos règles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Handshake className="h-6 w-6 text-wedding-olive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Assistance à la demande</h3>
                    <p className="text-gray-700">
                      Service client si vous en avez besoin. Pas de pression, pas de coût inutile.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 - Services d'accompagnement premium */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                Services d'accompagnement premium
              </h2>
              <p className="text-lg text-gray-700">Bénéficiez d'un accompagnement personnalisé pour votre mariage</p>
            </div>

            {/* Ligne directe (anciennement L'accompagnement) */}
            <div className="max-w-md mx-auto mb-12">
              <Card className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <MessageCircle className="h-6 w-6 text-wedding-olive" />
                    <CardTitle className="text-xl font-bold">Ligne directe</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">Communication privilégiée avec une experte</p>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-2">9,9€/mois</div>
                    <div className="text-sm text-gray-600">jusqu'à votre mariage</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Messages illimités WhatsApp</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Disponible 7j/7 de 9h à 22h</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Conseils personnalisés</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Soutien émotionnel & recul</p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/reservation-jour-m">Faire une demande</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formules Coordination avec EFMM */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <h3 className="text-2xl md:text-3xl font-serif text-black">
                  Coordination Jour-J
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>en partenariat avec</span>
                  <div className="bg-gray-100 px-2 py-1 rounded font-medium">EFMM</div>
                </div>
              </div>
              <p className="text-lg text-gray-700">Des formules adaptées à vos besoins</p>
            </div>

            <div className="max-w-5xl mx-auto mb-8">
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {/* Formule notification Jour-J (anciennement Sereine) */}
                <Card className="shadow-md hover:shadow-lg transition-shadow border-2 border-wedding-olive flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white relative">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-wedding-olive text-white text-sm px-2 py-1 rounded-full">Recommandée</div>
                    <CardTitle className="text-xl">Formule notification Jour-J</CardTitle>
                    <div className="text-2xl font-bold">24,9€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="text-sm">Application personnalisée (à remplir)</span>
                      </div>
                      <div>
                        <span className="text-sm">Checklists & planning partageables</span>
                      </div>
                      <div>
                        <span className="text-sm">Notifications en temps réel J-1 et J-J</span>
                      </div>
                      <div>
                        <span className="text-sm">Support hotline dédié 7J/7 jusqu'au Jour-J</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <FormulaCTAButton formula="sereine" />
                    </div>
                  </CardContent>
                </Card>

                {/* Formule Privilège */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Privilège</CardTitle>
                    <div className="text-2xl font-bold">799€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div>
                        <span className="text-sm">Application personnalisée (à remplir)</span>
                      </div>
                      <div>
                        <span className="text-sm">Checklists & planning à partager</span>
                      </div>
                      <div>
                        <span className="text-sm">Notifications en temps réel J-1 et J-J</span>
                      </div>
                      <div>
                        <span className="text-sm">Support hotline 7J/7 jusqu'au Jour-J</span>
                      </div>
                      <div>
                        <span className="text-sm">Présence d'un coordinateur le jour J</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <FormulaCTAButton formula="privilege" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section Coordinateurs */}
            <section className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <CoordinatorsPreview />
              </div>
            </section>
          </div>
        </section>

        {/* Options supplémentaires */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-serif text-black mb-4">
                Options supplémentaires
              </h3>
              <p className="text-lg text-gray-700">Personnalisez votre service avec nos options à la carte</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Clock className="h-6 w-6 text-wedding-olive" />
                        <h3 className="text-lg font-semibold">Heure supplémentaire</h3>
                      </div>
                      <span className="text-xl font-bold text-wedding-olive">+30€</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Extension de la présence du coordinateur pour les mariages nécessitant plus de temps
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Palette className="h-6 w-6 text-wedding-olive" />
                        <h3 className="text-lg font-semibold">Installation décorations</h3>
                      </div>
                      <span className="text-xl font-bold text-wedding-olive">+200€</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Mise en place de votre décoration selon vos souhaits (mobilier, objets volumineux)
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Building className="h-6 w-6 text-wedding-olive" />
                        <h3 className="text-lg font-semibold">RDV visite technique</h3>
                      </div>
                      <span className="text-xl font-bold text-wedding-olive">+200€</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Visite sur site pour optimiser l'organisation spatiale et anticiper les défis logistiques
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Users className="h-6 w-6 text-wedding-olive" />
                        <h3 className="text-lg font-semibold">Mariage +180 personnes</h3>
                      </div>
                      <span className="text-xl font-bold text-wedding-olive">+200€</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Supplément pour la coordination de mariages de plus de 180 invités nécessitant une personne en plus
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-20 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4">
              Prêt(e) à organiser votre mariage en toute sérénité ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Commencez gratuitement ou choisissez la formule qui vous correspond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-wedding-olive hover:bg-white/90">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
              <Button asChild size="lg" className="border-white text-white bg-transparent hover:bg-white hover:text-wedding-olive">
                <Link to="/contact">
                  Faire une demande
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Prix;