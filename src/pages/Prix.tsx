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
                  
                  {/* Information box pour clarification paiement */}
                  <div className="mb-4 p-4 bg-wedding-cream/30 rounded-lg border border-wedding-olive/20">
                    <div className="flex items-start gap-2">
                      <div className="text-wedding-olive text-lg">💡</div>
                      <div className="text-xs text-wedding-olive">
                        <strong>Testez avant de payer :</strong> Découvrez tous les outils gratuitement. 
                        Le paiement se déclenche uniquement quand vous créez votre première étape de coordination.
                      </div>
                    </div>
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
                  
                  <div className="mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/register">Découvrir l'outil - Payer plus tard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
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


            <div className="max-w-6xl mx-auto mb-8">
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {/* Ligne directe */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Ligne directe</CardTitle>
                    <div className="text-2xl font-bold">9,9€/mois</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
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
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                        <Link to="/contact">Faire une demande</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Appli avec notification */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Appli avec notification</CardTitle>
                    <div className="text-2xl font-bold">24,9€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Notification en temps réel sur WhatsApp</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Hotline 7J/7J</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <FormulaCTAButton formula="sereine" />
                    </div>
                  </CardContent>
                </Card>

                {/* Présence d'un Coordinateur.rice */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Présence d'un Coordinateur.rice le jour-j</CardTitle>
                    <div className="text-2xl font-bold">899€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Audit de votre organisation via l'appli</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">2h de rdv téléphonique visio</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">14H de présence le jour-j</p>
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