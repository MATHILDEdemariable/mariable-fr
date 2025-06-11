
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Brain, Handshake, MessageCircle, Smartphone, Mail, Phone, Settings, Lightbulb, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [displayedText, setDisplayedText] = useState('');
  const staticText = 'Profitez pleinement de votre mariage. ';
  const typedText = 'Organisez-le facilement, vous-même.';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Typing animation effect for "Organisez-le facilement, vous-même."
    let index = 0;
    const timer = setInterval(() => {
      if (index < typedText.length) {
        setDisplayedText(typedText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services-section');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with dark overlay */}
        <section 
          className="relative py-20 md:py-28 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/lovable-uploads/16238829-fdfc-4fe2-ade8-9c49d79851b4.png')"
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-neutral-900/20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Profitez pleinement de votre mariage.
              </h1>
              
              <p className="text-xl sm:text-2xl font-serif text-white mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
                <span className="inline-block min-h-[1.2em]">
                  {displayedText}
                  {displayedText.length < typedText.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </p>
              
              <div className="mb-8 flex justify-center sm:justify-start">
                <Button 
                  onClick={scrollToServices}
                  size="lg" 
                  className="bg-wedding-olive hover:bg-wedding-olive/90 text-white 
                           w-full max-w-[280px] sm:w-auto sm:max-w-none
                           text-sm px-4 py-3 
                           sm:text-base sm:px-8 sm:py-4"
                >
                  <span className="truncate">Organisez mieux, profitez plus</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6 max-w-4xl mx-auto" style={{ fontFamily: 'Playfair Display, serif' }}>
                Le premier wedding planner de poche
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-lg text-gray-700 mb-6">
                  Un outil en ligne pensé pour les couples qui veulent tout organiser eux-mêmes – sans stress, sans perte de temps, sans galère.
                </p>
                
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

              <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                <Link to="/register">
                  Découvrir Mariable <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section - Moved from Pricing */}
        <section id="services-section" className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                Transformez l'organisation de votre mariage en une expérience simple & agréable.
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Choisissez le niveau d'accompagnement qui vous correspond
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {/* Bloc 1 - Le Planner Mariable */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-serif mb-4 flex items-center justify-center gap-2">
                    <Smartphone className="h-6 w-6 text-wedding-olive" />
                    Le Planner Mariable
                  </CardTitle>
                  <div className="text-3xl font-bold text-wedding-olive mb-2">
                    Gratuit
                  </div>
                  <p className="text-sm text-gray-600">Accessible après inscription</p>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Accès à votre espace personnel (tableau de bord)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Check list</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Calculatrice de budget</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Modèle de suivi budgétaire en ligne & téléchargeables</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Accès à la sélection de prestataire Mariable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Générateur de planning Jour J</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Outils d'aide à la coordination jour J</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Compilation de conseils opérationnels</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">ChatGPT Mariable</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="h-5 w-5 text-wedding-olive" />
                      <p className="text-sm font-medium text-gray-700">
                        Vous gérez votre mariage de A à Z avec des outils simples et efficaces.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/register">
                        S'inscrire
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bloc 2 - Mariable ++ */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-serif mb-4 flex items-center justify-center gap-2">
                    <MessageCircle className="h-6 w-6 text-wedding-olive" />
                    Mariable ++
                  </CardTitle>
                  <div className="text-3xl font-bold text-wedding-olive mb-2">
                    9,90€ / mois TTC
                  </div>
                  <p className="text-sm text-gray-600">(offre de lancement, puis 14,90€)</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <p className="text-xs text-gray-500">Disponible avec WhatsApp</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Support 7J/7J : Messages texte illimités + messages vocaux autorisés</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Réponse rapide &lt;24H</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Soutien émotionnel</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Analyse de votre organisation</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Relecture de votre planning & checklists</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Accompagnement pour votre planification</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Relecture des documents techniques</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Aide à la prise de décision</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="h-5 w-5 text-wedding-olive" />
                      <p className="text-sm font-medium text-gray-700">
                        Comme une consultation de médecin… mais pour votre mariage et en abonnement mensuel !
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 mb-4">
                      +10€ pour une consultation téléphone ou visio de 30min / mois.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button asChild className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300">
                      <Link to="/paiement">
                        Souscrire
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bloc 3 - Le Jour M */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-wedding-olive flex flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
                    PREMIUM
                  </span>
                </div>
                <CardHeader className="text-center pb-6 pt-8">
                  <CardTitle className="text-xl font-serif mb-4 flex items-center justify-center gap-2">
                    <Calendar className="h-6 w-6 text-wedding-olive" />
                    Le Jour M
                  </CardTitle>
                  <div className="text-3xl font-bold text-wedding-olive mb-1">
                    Dès 49€ TTC
                  </div>
                  <p className="text-sm text-gray-600">Le jour de votre mariage orchestré, sans friction</p>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Application personnalisée avec planning intelligent</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Rôles et tâches attribuées aux proches</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Espace document : fiche logistique, moodboard, plans</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Carnet de contacts prestataires intégré</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Notifications & rappels automatiques (selon formule choisie)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Support disponible selon votre formule (hotline téléphonique ou présence)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Option présence terrain – Formule Privilège</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5 text-wedding-olive" />
                      <p className="text-sm font-medium text-gray-700">
                        Profitez de votre journée en choisissant votre niveau de coordination - à vous de décider.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/pricing">
                        Choisir une formule
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-20 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Et si vous disiez "oui" à la simplicité ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Posez vos questions ou réservez un conseil personnalisé.
            </p>
            
            <Button asChild size="lg" className="bg-white text-wedding-olive hover:bg-white/90">
              <Link to="/contact/nous-contacter">
                Contactez Mathilde <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatbotButton />
    </div>
  );
};

export default Index;
