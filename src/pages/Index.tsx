
import React, { useEffect } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Brain, Dumbbell, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 bg-gradient-to-br from-wedding-cream/30 to-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-wedding-olive mb-6 max-w-4xl mx-auto">
              Organisez votre mariage facilement. Profitez-en pleinement.
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
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
            <div className="inline-block bg-wedding-olive/10 px-6 py-3 rounded-full border border-wedding-olive/20">
              <p className="text-sm font-medium text-wedding-olive">
                Mieux qu'un wedding planner : c'est vous, avec les bons outils.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-wedding-olive mb-6 max-w-4xl mx-auto">
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
                    <Dumbbell className="h-6 w-6 text-wedding-olive mt-1 flex-shrink-0" />
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
                      Un service <strong>de coordination sur-mesure</strong>
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
                  <Link to="/register">
                    Mariable, la plateforme au bon rapport qualité / prix <ArrowRight className="ml-2 h-5 w-5" />
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
