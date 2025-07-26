import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Brain, Handshake, MessageCircle, Smartphone, Mail, Settings, Calendar, Users, Star } from 'lucide-react';
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
      servicesSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with dark overlay */}
        <section className="relative py-20 md:py-28 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: "url('/lovable-uploads/16238829-fdfc-4fe2-ade8-9c49d79851b4.png')"
      }}>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-neutral-900/20"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold mb-4" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                Profitez pleinement de votre mariage.
              </h1>
              
              <p className="text-xl sm:text-2xl font-serif text-white mb-8" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                <span className="inline-block min-h-[1.2em]">
                  {displayedText}
                  {displayedText.length < typedText.length && <span className="animate-pulse">|</span>}
                </span>
              </p>
              
              <div className="mb-8 flex justify-center sm:justify-start">
                <Button onClick={scrollToServices} size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white 
                           w-full max-w-[280px] sm:w-auto sm:max-w-none
                           text-sm px-4 py-3 
                           sm:text-base sm:px-8 sm:py-4">
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
              <h2 style={{
              fontFamily: 'Playfair Display, serif'
            }} className="sm:text-3xl md:text-4xl font-serif text-black mb-6 max-w-4xl mx-auto text-3xl font-medium">
                Le premier wedding planner de poche
              </h2>
              
              <div className="max-w-3xl mx-auto mb-8">
                <p className="text-lg text-gray-700 mb-6">Coordonner et vivre un mariage parfait. Crée pour les couples qui veulent organiser eux-mêmes.</p>
                
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

        {/* Services Section - Nouvelles formules pricing */}
        <section id="services-section" className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                Transformez l'organisation de votre mariage
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                en une expérience simple & agréable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
              {/* Position 1 - Le Planner Mariable (Gratuit) */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
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

              {/* Position 2 - L'accompagnement Mariable (9,90€/mois) */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <MessageCircle className="h-6 w-6 text-wedding-olive" />
                    <CardTitle className="text-xl font-bold">L'accompagnement</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">Ligne directe avec une experte</p>
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
                      <Link to="/reservation-jour-m">Envoyer une demande</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Position 3 - Libre (14,9€) */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Calendar className="h-6 w-6 text-wedding-olive" />
                    <CardTitle className="text-xl font-bold">Coordination Jour-J</CardTitle>
                  </div>
                  <p className="text-sm text-gray-600">avec l'appli en ligne Mariable dédiée</p>
                </CardHeader>
                
                <CardContent className="flex-grow flex flex-col">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-wedding-olive mb-2">à partir de 14,9€</div>
                    <div className="text-sm text-gray-600">selon formules</div>
                  </div>
                  
                  <div className="space-y-3 mb-6">
                    
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Planning intelligent et assignation des tâches</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Partage des informations avec les proches</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Coordinateur à la carte </p>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/detail-coordination-jourm">Voir une démo</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Call to Action */}
            <div className="text-center mt-16">
              <h3 className="text-2xl font-serif mb-4" style={{
              fontFamily: 'Playfair Display, serif'
            }}>
                Prêt(e) à vivre une expérience unique pour votre mariage?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Plusieurs couples nous on déjà fait confiance
              </p>
              {/* Section Témoignages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Témoignage 1 */}
                

                {/* Témoignage 2 */}
                

                {/* Témoignage 3 */}
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                      </div>
                      <p className="text-gray-700 italic text-sm">
                        "Grâce à Mariable, nous avons pu organiser notre mariage sans stress. Les outils sont géniaux 
                        et l'accompagnement personnalisé nous a beaucoup aidés."
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-900">Camille & Julien</p>
                      <p className="text-sm text-gray-600">Mariage en Bourgogne, Juin 2025</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Témoignage 4 */}
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-1 lg:col-span-1">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-lg">★</span>)}
                      </div>
                      <p className="text-gray-700 italic text-sm">
                        "L'application Jour-J de Mariable est un vrai game-changer ! Tous nos prestataires et témoins 
                        savaient exactement quoi faire et quand. Parfait !"
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-900">Laura & Maxime</p>
                      <p className="text-sm text-gray-600">Mariage à Marseille, Juillet 2025</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Témoignage 5 */}
                <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 md:col-span-1 lg:col-span-1">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                      </div>
                      <p className="text-gray-700 italic text-sm">
                        "Service client au top ! Mathilde répond rapidement et donne de précieux conseils. 
                        Notre budget a été maîtrisé grâce à leur suivi."
                      </p>
                    </div>
                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-900">Emma & Pierre</p>
                      <p className="text-sm text-gray-600">MARIAGE A VENIR - MAI 2026</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bouton CTA après les témoignages */}
              <div className="text-center mt-12">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-20 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4" style={{
            fontFamily: 'Playfair Display, serif'
          }}>
              Et si vous disiez "oui" à la simplicité ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Posez vos questions ou réservez un conseil personnalisé.
            </p>
            
            <Button asChild size="lg" className="bg-white text-wedding-olive hover:bg-white/90">
              <Link to="/contact">
                Contactez Mathilde <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
      <ChatbotButton />
    </div>;
};
export default Index;