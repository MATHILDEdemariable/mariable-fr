
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Smartphone, Users, Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoJourM = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Démo Formule Libre - Le Jour M | Mariable</title>
        <meta name="description" content="Découvrez la formule Libre pour orchestrer votre mariage avec notre application personnalisée" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-8">
                <Button asChild variant="outline" size="sm">
                  <Link to="/detail-coordination-jourm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour aux tarifs
                  </Link>
                </Button>
              </div>

              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                  Démo - Formule Libre
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Découvrez comment notre application vous aide à orchestrer votre mariage en toute autonomie
                </p>
                <div className="text-3xl font-bold text-wedding-olive mt-4">
                  49€ TTC
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Smartphone className="h-6 w-6 text-wedding-olive" />
                      Application personnalisée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Vous recevez une application vierge que vous pouvez personnaliser selon vos besoins. 
                      Vous gardez le contrôle total de votre organisation.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Interface simple et intuitive</li>
                      <li>• Personnalisation complète</li>
                      <li>• Accès depuis tous vos appareils</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Users className="h-6 w-6 text-wedding-olive" />
                      Gestion des proches
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Créez et attribuez des rôles à vos proches. Chacun sait exactement ce qu'il doit faire 
                      et quand le faire.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Attribution de tâches spécifiques</li>
                      <li>• Suivi en temps réel</li>
                      <li>• Communication facilitée</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Calendar className="h-6 w-6 text-wedding-olive" />
                      Planning personnalisable
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Créez votre planning sur mesure avec tous les détails de votre journée. 
                      Modifiez et ajustez selon vos besoins.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Timeline complètement modifiable</li>
                      <li>• Ajout d'événements personnalisés</li>
                      <li>• Synchronisation avec vos proches</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Clock className="h-6 w-6 text-wedding-olive" />
                      Coordination simplifiée
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">
                      Tous vos documents, contacts et informations centralisés au même endroit 
                      pour une coordination optimale.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Carnet de contacts prestataires</li>
                      <li>• Espace documents centralisé</li>
                      <li>• Fiche logistique intégrée</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-serif mb-4">Parfait pour vous si :</h2>
                <div className="text-lg text-gray-700 italic mb-6">
                  "Je fais tout moi-même, mais je veux faciliter la coordination"
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
                  <div>✓ Vous aimez avoir le contrôle</div>
                  <div>✓ Vous êtes organisé(e)</div>
                  <div>✓ Vous voulez simplifier la logistique</div>
                </div>
                <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3">
                  <Link to="/reservation-jour-m">
                    Réserver cette formule
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DemoJourM;
