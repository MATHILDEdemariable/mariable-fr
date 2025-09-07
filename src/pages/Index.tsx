import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChatbotButton from '@/components/ChatbotButton';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Check, Star } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section with Video Background */}
        <HeroSection />

        {/* Differentiation Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 style={{
                fontFamily: 'Playfair Display, serif'
              }} className="text-3xl md:text-4xl font-serif text-black mb-4 max-w-4xl mx-auto">
                La première appli de coordination jour-J
              </h2>
              <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto italic">
                Mariable, c'est la solution innovante qui vous permet de gérer la journée du mariage avec vos proches et prestataires.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-12">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">⏳</div>
                  <div>
                    <h3 className="font-medium mb-2">Plus rapide</h3>
                    <p className="text-gray-700 text-sm">
                      Planifiez votre Jour J en quelques clics grâce à un outil intuitif qui centralise toutes les infos utiles.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <h3 className="font-medium mb-2">Plus simple</h3>
                    <p className="text-gray-700 text-sm">
                      Partagez l'organisation avec vos proches & prestataires, consultable à tout moment depuis leur téléphone.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💎</div>
                  <div>
                    <h3 className="font-medium mb-2">Moins cher</h3>
                    <p className="text-gray-700 text-sm">
                      Une solution accessible, bien plus économique qu'un wedding planner ou qu'un modèle générique en ligne.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <h3 className="font-medium mb-2">100% personnalisable</h3>
                    <p className="text-gray-700 text-sm">
                      Grâce à l'IA, Mariable s'adapte à votre mariage, vos envies et vos contraintes.
                    </p>
                  </div>
                </div>
              </div>

              {/* App Mockup Section */}
              <div className="mb-8">
                <img 
                  src="/lovable-uploads/9d1a3c09-e66e-4e62-bb6f-e1d5fc2e3814.png" 
                  alt="Mockup de l'application Mariable" 
                  className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              <p className="text-lg text-gray-800 mb-6 max-w-3xl mx-auto font-medium">
                Sans Mariable, vos proches sont débordés et vous finissez par régler les imprévus.<br/>
                Avec Mariable, tout est planifié et partagé : chacun sait quoi faire, vous profitez.
              </p>

              <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                <Link to="/register">
                  Découvrir Mariable <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-12 md:py-16 bg-gray-50 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6">
                Comment ça marche ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-8">
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-medium mb-2">Créez votre équipe</h3>
                <p className="text-gray-700 text-sm">proches & prestataires</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-medium mb-2">Générez votre déroulé</h3>
                <p className="text-gray-700 text-sm">du Jour J</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-medium mb-2">Assignez des tâches</h3>
                <p className="text-gray-700 text-sm">à chaque membre</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-medium mb-2">Ajoutez vos documents</h3>
                <p className="text-gray-700 text-sm">plan de table, moodboard, etc.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">5</div>
                <h3 className="font-medium mb-2">Partagez le tout</h3>
                <p className="text-gray-700 text-sm">via un simple lien</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                <Link to="/demo-jour-m">
                  👉 Découvrir comment ça marche
                </Link>
              </Button>
            </div>

            <p className="text-center text-lg italic text-gray-700 max-w-3xl mx-auto">
              Mariable, c'est l'outil unique qui permet à vos proches et prestataires de gérer le Jour J avec ou sans vous :-)
            </p>
          </div>
        </section>

        {/* Complementary Services Section */}
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6">
                Plus qu'un outil Jour J, Mariable vous accompagne dès les préparatifs.
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Checklist intelligente</h3>
                    <p className="text-gray-700 text-sm">fini les oublis, tout est prévu.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Calculateur de budget</h3>
                    <p className="text-gray-700 text-sm">visualisez et suivez vos dépenses.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Suivi de prestataires</h3>
                    <p className="text-gray-700 text-sm">comparez facilement vos options.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-2">Sélection premium</h3>
                    <p className="text-gray-700 text-sm">des adresses validées pour leur qualité.</p>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 italic mb-8">
                Ces services sont inclus gratuitement pour tous les utilisateurs ayant un compte.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials Call to Action */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-serif mb-4">
                Prêt(e) à vivre une expérience unique pour votre mariage?
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Plusieurs couples nous ont déjà fait confiance
              </p>
              {/* Section Témoignages */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {/* Témoignage 1 */}
                

                {/* Témoignage 2 */}
                

                {/* Témoignage 3 */}
                <Card className="bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
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
                <Card className="bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 md:col-span-1 lg:col-span-1">
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
                <Card className="bg-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 md:col-span-1 lg:col-span-1">
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
                  <Link to="/register">
                    Créer mon compte gratuit <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
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
    </div>
  );
};

export default Index;