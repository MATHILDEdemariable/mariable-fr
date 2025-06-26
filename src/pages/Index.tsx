
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Users, MessageSquare, Heart, Star, ArrowRight, Sparkles, Shield, Clock, Coins } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import WeddingToolsSection from '@/components/home/WeddingToolsSection';
import ToolsSection from '@/components/home/ToolsSection';
import CallToAction from '@/components/home/CallToAction';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white">
      <Helmet>
        <title>Mariable - Le site de mariage moderne et élégant</title>
        <meta name="description" content="Planifiez votre mariage de rêve avec Mariable. Trouvez des prestataires, des outils de planification et des conseils pour un mariage inoubliable." />
      </Helmet>

      <Header />

      <main>
        <HeroSection />
        <FeaturesSection />
        <WeddingToolsSection />
        <ToolsSection />

        <section className="py-12 md:py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-8">
              Nos outils préférés
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Card Check-list */}
              <Card className="border-2 border-gray-200 hover:border-wedding-olive transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-wedding-olive/10 rounded-full w-fit">
                    <CheckCircle className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <CardTitle className="text-xl font-serif">Check-list Mariage</CardTitle>
                  <p className="text-gray-600 text-sm">Ne rien oublier, étape par étape</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>+ de 200 tâches pré-remplies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>100% personnalisable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Suivez votre avancement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Notifications & rappels</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Travaillez à plusieurs</span>
                    </li>
                  </ul>
                  <div className="border-t pt-4 mt-6">
                    <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                      <Link to="/checklist-mariage">
                        Accéder à ma check-list
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-gray-500 italic">
                    La base d'un mariage réussi
                  </p>
                </CardContent>
              </Card>

              {/* Card Budget */}
              <Card className="border-2 border-gray-200 hover:border-wedding-olive transition-all duration-300 hover:shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-wedding-olive/10 rounded-full w-fit">
                    <Coins className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <CardTitle className="text-xl font-serif">Budget</CardTitle>
                  <p className="text-gray-600 text-sm">Maîtrisez vos dépenses</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Estimation automatique</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Suivi en temps réel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Alertes intelligentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Répartition par poste</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Export PDF</span>
                    </li>
                  </ul>
                  <div className="border-t pt-4 mt-6">
                    <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                      <Link to="/services/budget">
                        Gérer mon budget
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <p className="text-center text-sm text-gray-500 italic">
                    Le nerf de la guerre
                  </p>
                </CardContent>
              </Card>

              {/* Card Le Jour M */}
              <Card className="relative border-2 border-gray-200 hover:border-wedding-olive transition-all duration-300 hover:shadow-lg">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
                    PREMIUM
                  </span>
                </div>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-wedding-olive/10 rounded-full w-fit">
                    <Calendar className="h-8 w-8 text-wedding-olive" />
                  </div>
                  <CardTitle className="text-xl font-serif">Le Jour M</CardTitle>
                  <p className="text-gray-600 text-sm">Une application en ligne collaborative</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Application personnalise à partager</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Accessible par toute votre équipe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Planning intelligent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Rôles et tâches à déléguer</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Espace documents : plans, moodboard</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Carnet de contacts intégré</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Notifications & rappels automatiques (selon formule)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Vos proches reçoivent leurs instructions directement</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-wedding-olive mt-0.5 flex-shrink-0" />
                      <span>Support en option : hotline ou présence terrain</span>
                    </li>
                  </ul>

                  <div className="border-t pt-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-wedding-olive mb-2">
                        Prix selon formules
                      </div>
                      <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                        <Link to="/reservation-jour-m">
                          Choisir ma formule Jour M
                        </Link>
                      </Button>
                    </div>
                  </div>

                  <p className="text-center text-sm text-gray-500 italic">
                    Coordonner votre grand jour pour mieux profiter
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <CallToAction />
      </main>

      <Footer />
    </div>
  );
};

export default Index;
