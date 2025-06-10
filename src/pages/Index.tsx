
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Brain, Heart, MessageCircle, Smartphone, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const [displayedText, setDisplayedText] = useState('');
  const staticText = 'Organisez votre mariage facilement. ';
  const typedText = 'Profitez-en pleinement.';
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Typing animation effect for "Profitez-en pleinement"
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
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-6">
                {staticText}
                <span className="inline-block min-h-[1.2em]">
                  {displayedText}
                  {displayedText.length < typedText.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white font-semibold mb-8">
                Grâce au premier wedding planner de poche
              </p>
              
              <div className="mb-8">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  <Link to="/register">
                    Découvrir <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Reassurance Badge */}
              <div className="inline-block bg-white/20 px-6 py-3 rounded-full border border-white/30 backdrop-blur-sm">
                <p className="text-sm font-bold text-white">
                  Mieux qu'un wedding planner : c'est vous, avec les bons outils.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-6 max-w-4xl mx-auto">
                MARIABLE TRANSFORME L'ORGANISATION DE VOTRE MARIAGE EN UNE ORGANISATION SIMPLE & AGRÉABLE
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-lg text-gray-700 mb-6">
                  Vivez une expérience unique
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex items-start gap-3">
                    <Brain className="h-6 w-6 text-wedding-olive mt-1 flex-shrink-0" />
                    <p className="text-gray-700">
                      L'expertise, les outils et les bonnes adresses d'un professionnel de l'événementiel
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart className="h-6 w-6 text-wedding-olive mt-1 flex-shrink-0" />
                    <p className="text-gray-700">
                      La liberté de gérer vous-même
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MessageCircle className="h-6 w-6 text-wedding-olive mt-1 flex-shrink-0" />
                    <p className="text-gray-700">
                      Un service client si vous en avez besoin
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                <Link to="/pricing">
                  Organisez mieux, dépensez moins <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section - Moved from Pricing */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-6">
                Les services
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Choisissez le niveau d'accompagnement qui vous correspond
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {/* Bloc 1 - Le Planner Mariable */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-serif mb-4">
                    📱Le Planner Mariable
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
                      <span className="text-lg">🖥️</span>
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
                  <CardTitle className="text-xl font-serif mb-4">
                    💬 Mariable ++
                  </CardTitle>
                  <div className="text-3xl font-bold text-wedding-olive mb-2">
                    9,90€ / mois TTC
                  </div>
                  <p className="text-sm text-gray-600">(offre de lancement, puis 14,90€)</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Smartphone className="h-4 w-4 text-gray-500" />
                    <p className="text-xs text-gray-500">📱 Disponible avec WhatsApp</p>
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
                      <span className="text-lg">💡</span>
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
                  <CardTitle className="text-xl font-serif mb-4">
                    📅 Le Jour M
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
                      <p className="text-sm text-gray-700">App personnalisée avec planning intelligent</p>
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
                      <span className="text-lg">🎯</span>
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
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
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
