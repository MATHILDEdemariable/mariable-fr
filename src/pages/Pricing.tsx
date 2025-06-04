
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const scrollToHowItWorks = () => {
    document.getElementById('comment-ca-marche')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Tarifs | Mariable</title>
        <meta name="description" content="Découvrez nos tarifs transparents pour organiser votre mariage avec Mariable" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
              Des tarifs transparents pour votre mariage
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Choisissez la formule qui correspond à vos besoins et organisez votre mariage sereinement
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Formule Essentielle */}
            <Card className="relative border-2 hover:border-wedding-olive/30 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">🌿</div>
                <CardTitle className="text-2xl font-serif">Essentielle</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-wedding-olive">89 € TTC</span>
                </div>
                <p className="text-gray-600 mt-2">L'organisation simplifiée</p>
                <p className="text-sm text-gray-500 mt-2">
                  Accessible après inscription ou par téléphone
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Planning personnalisé et budget prévisionnel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Check-list interactive avec rappels automatiques</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Sélection de prestataires triés sur le volet</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Suivi des demandes de contact prestataires</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Gestion du budget en temps réel</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  <Link to="/register">
                    Choisir Essentielle
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Formule Complète */}
            <Card className="relative border-2 border-wedding-olive shadow-lg scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-wedding-olive text-white px-4 py-2 rounded-full text-sm font-medium">
                  Recommandée
                </span>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="text-4xl mb-2">✨</div>
                <CardTitle className="text-2xl font-serif">Complète</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-wedding-olive">189 € TTC</span>
                </div>
                <p className="text-gray-600 mt-2">L'accompagnement sur-mesure</p>
                <p className="text-sm text-gray-500 mt-2">
                  Accessible après inscription ou par téléphone
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tout de la formule Essentielle</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Accès à l'assistant virtuel spécialisé mariage</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Communauté privée WhatsApp des mariés</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Support par email prioritaire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Accès anticipé aux nouvelles fonctionnalités</span>
                  </li>
                </ul>
                <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  <Link to="/register">
                    Choisir Complète
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Le Jour M */}
            <Card className="relative border-2 hover:border-wedding-olive/30 transition-colors">
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">💎</div>
                <CardTitle className="text-2xl font-serif">Le Jour M</CardTitle>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-4xl font-bold text-wedding-olive">550 € TTC</span>
                  <span className="text-sm text-gray-600">(au lieu de 1000€ - offre de lancement)</span>
                </div>
                <p className="text-gray-600 mt-2">Un jour J orchestré</p>
                <p className="text-sm text-gray-500 mt-2">
                  Accessible après inscription ou par téléphone
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Coordination complète de votre jour J</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Planning détaillé minute par minute</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Gestion des prestataires le jour J</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Service client via la Hotline Mariable</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Suivi en temps réel de votre planning</span>
                  </li>
                </ul>
                <div className="space-y-3">
                  <Button 
                    onClick={scrollToHowItWorks}
                    variant="outline" 
                    className="w-full border-wedding-olive text-wedding-olive hover:bg-wedding-olive hover:text-white"
                  >
                    En savoir plus
                  </Button>
                  <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                    <Link to="/reservation-jour-m">
                      Réserver Le Jour M
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services complémentaires */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-serif text-center mb-8">Services complémentaires</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Présence physique jour J de 11h à 21h</h3>
                <p className="text-gray-600 mb-4">Coordination sur place (10h de présence)</p>
                <p className="text-2xl font-bold text-wedding-olive">+200€</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-semibold text-lg mb-2">Heure supplémentaire jour J</h3>
                <p className="text-gray-600 mb-4">Prolongation de la coordination</p>
                <p className="text-2xl font-bold text-wedding-olive">+30€</p>
              </div>
            </div>
          </div>

          {/* Comment ça marche */}
          <div id="comment-ca-marche" className="mb-16">
            <h2 className="text-3xl font-serif text-center mb-12">Comment ça marche</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-wedding-olive">1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Transfert des infos via le formulaire</h3>
                <p className="text-gray-600">Partagez vos informations et besoins via notre formulaire détaillé</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-wedding-olive">2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">RDV d'onboarding de 10min sur votre app</h3>
                <p className="text-gray-600">(optionnel) - Découverte personnalisée de votre espace</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-wedding-olive">3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Partagez les accès à vos proches</h3>
                <p className="text-gray-600">Laissez-vous guider par l'app et collaborez avec vos proches</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-wedding-olive">4</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Utilisez la hotline si besoin</h3>
                <p className="text-gray-600">Support disponible jusqu'au jour-j pour vous accompagner</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-wedding-olive">5</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">Profitez</h3>
                <p className="text-gray-600">Votre mariage arrive, tout est organisé, il ne reste qu'à en profiter !</p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-serif text-center mb-8">Questions fréquentes</h2>
            <div className="space-y-6 max-w-3xl mx-auto">
              <div>
                <h3 className="font-semibold text-lg mb-2">Puis-je changer de formule en cours de route ?</h3>
                <p className="text-gray-600">Oui, vous pouvez upgrader votre formule à tout moment. La différence de prix sera calculée au prorata.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Y a-t-il des frais cachés ?</h3>
                <p className="text-gray-600">Non, nos tarifs sont transparents. Les seuls frais supplémentaires sont les services complémentaires que vous choisissez.</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Combien de temps avant le mariage dois-je m'inscrire ?</h3>
                <p className="text-gray-600">Idéalement 6 à 12 mois avant, mais nous pouvons vous accompagner même pour des organisations de dernière minute.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
