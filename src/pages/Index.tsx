
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Brain, Heart, MessageCircle } from 'lucide-react';
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
          className="relative py-20 md:py-28 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('/lovable-uploads/16238829-fdfc-4fe2-ade8-9c49d79851b4.png')"
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-neutral-900/20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-6">
                {staticText}
                <span className="inline-block min-h-[1.2em]">
                  {displayedText}
                  {displayedText.length < typedText.length && (
                    <span className="animate-pulse">|</span>
                  )}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white mb-8">
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
                <p className="text-sm font-medium text-white">
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
                Vivez une expérience unique du premier jour de vos fiançailles jusqu'au jour J
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-lg text-gray-700 mb-6">
                  Mariable transforme l'organisation de votre mariage en une expérience simple et agréable. C'est la <strong>seule solution</strong> qui combine :
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
                <Link to="/register">
                  Organisez mieux, dépensez moins <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Breakdown */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-serif text-black mb-8 text-center">
                Les services disponibles
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Après la demande en mariage :
                    </h3>
                    <p className="text-gray-700">
                      Création d'un planning personnalisé & d'un estimatif de votre budget, des réponses à vos questions
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Pendant l'organisation :
                    </h3>
                    <p className="text-gray-700">
                      Une sélection de prestataires triés sur le volet, le suivi des demandes de contacts, la gestion du budget
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      Pour le jour J :
                    </h3>
                    <p className="text-gray-700">
                      Un service de coordination sur-mesure
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-12">
                <p className="text-lg text-gray-700 mb-2">
                  Toutes vos démarches sont centralisées & simplifiées à chaque étape.
                </p>
                <p className="text-xl font-medium text-wedding-olive mb-8">
                  Résultat : Vous gardez le contrôle, sans la charge mentale. L'organisation reste une joie.
                </p>
                
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  <Link to="/pricing">
                    Consultez les tarifs <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
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
