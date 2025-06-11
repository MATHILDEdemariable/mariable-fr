
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Brain, Handshake, MessageCircle, Smartphone, Mail, Phone, Settings, Lightbulb, Users, Calendar } from 'lucide-react';
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
                  Une application en ligne pensée pour les couples qui veulent tout organiser eux-mêmes – sans stress, sans perte de temps, sans galère.
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

        {/* Services Section - Redesigned */}
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
              {/* Card 1 - Le Planner Mariable */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex flex-col h-full">
                  {/* Title/Subtitle Section - Fixed Height */}
                  <div className="min-h-[120px] flex flex-col justify-start text-center p-6 pb-0">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Smartphone className="h-6 w-6 text-wedding-olive" />
                      <CardTitle className="text-2xl font-bold">
                        Le Planner Mariable
                      </CardTitle>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Un tableau de bord pour bien démarrer
                    </p>
                  </div>
                  
                  {/* Features Section - Flexible Height */}
                  <div className="flex-grow px-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Accès à votre espace personnel</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Accès à la sélection de prestataire Mariable</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Check list & Calculatrice de budget</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Modèle de suivi budgétaire en ligne & téléchargeable</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Générateur de planning Jour J</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Compilation de conseils opérationnels</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">ChatGPT Mariable</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price/CTA Section - Fixed at Bottom */}
                  <div className="mt-auto p-6 pt-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-4 text-center">
                      Gratuit
                    </div>
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/register">
                        S'inscrire gratuitement
                      </Link>
                    </Button>
                    <p className="text-sm text-gray-600 italic text-center mt-4">
                      Planifiez sans engagement, à votre rythme.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Card 2 - Accompagnement Mariable */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <div className="flex flex-col h-full">
                  {/* Title/Subtitle Section - Fixed Height */}
                  <div className="min-h-[120px] flex flex-col justify-start text-center p-6 pb-0">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <MessageCircle className="h-6 w-6 text-wedding-olive" />
                      <CardTitle className="text-2xl font-bold">
                        Accompagnement Mariable
                      </CardTitle>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Une ligne directe avec une experte mariage
                    </p>
                  </div>
                  
                  {/* Features Section - Flexible Height */}
                  <div className="flex-grow px-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Messages illimités avec Mathilde sur WhatsApp</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Disponible 7j/7 de 9h à 22h</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Conseils personnalisés à chaque étape</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Soutien émotionnel & prise de recul</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Relecture de vos plannings & documents</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Aide à la prise de décision & arbitrage</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Une vraie personne, votre alliée experte</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price/CTA Section - Fixed at Bottom */}
                  <div className="mt-auto p-6 pt-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-4 text-center">
                      9,90€/mois TTC
                    </div>
                    <Button asChild className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300">
                      <Link to="/paiement">
                        Bénéficier de conseils illimités
                      </Link>
                    </Button>
                    <p className="text-sm text-gray-600 italic text-center mt-4">
                      Vous n'organisez plus seuls. On avance ensemble.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Card 3 - Le Jour M */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-wedding-olive flex flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
                    PREMIUM
                  </span>
                </div>
                <div className="flex flex-col h-full">
                  {/* Title/Subtitle Section - Fixed Height */}
                  <div className="min-h-[120px] flex flex-col justify-start text-center p-6 pb-0 pt-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <Calendar className="h-6 w-6 text-wedding-olive" />
                      <CardTitle className="text-2xl font-bold">
                        Le Jour M
                      </CardTitle>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Une application collaborative pour coordonner votre grand jour
                    </p>
                  </div>
                  
                  {/* Features Section - Flexible Height */}
                  <div className="flex-grow px-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Application personnalisée à partager</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Accessible par toute votre équipe</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Planning intelligent</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Rôles et tâches à déléguer</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Espace documents : plans, moodboard</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Carnet de contacts intégré</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Notifications & rappels automatiques (selon formule)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Vos proches reçoivent leurs instructions directement</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Support en option : hotline ou présence terrain</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Price/CTA Section - Fixed at Bottom */}
                  <div className="mt-auto p-6 pt-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-4 text-center">
                      Dès 49€ TTC
                    </div>
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/pricing">
                        Choisir ma formule Jour M
                      </Link>
                    </Button>
                    <p className="text-sm text-gray-600 italic text-center mt-4">
                      Vous pilotez avec votre équipe pour mieux profiter de votre journée.
                    </p>
                  </div>
                </div>
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
