
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, CreditCard, Shield, Clock } from 'lucide-react';

const Paiement = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Paiement Mariable ++ | Mariable</title>
        <meta name="description" content="Souscrivez à Mariable ++ pour bénéficier d'un accompagnement personnalisé pour votre mariage" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                  Souscrire à Mariable ++
                </h1>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                  Bénéficiez d'un accompagnement personnalisé pour votre mariage avec notre service premium
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Récapitulatif de l'offre */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl font-serif text-center">
                      💬 Mariable ++
                    </CardTitle>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-wedding-olive mb-2">
                        9,90€ / mois TTC
                      </div>
                      <p className="text-sm text-gray-600">(offre de lancement, puis 14,90€)</p>
                      <p className="text-sm text-wedding-olive font-medium mt-2">📱 Disponible avec WhatsApp</p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <h3 className="font-semibold text-lg mb-4">Inclus dans votre abonnement :</h3>
                    <div className="space-y-3">
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
                      <p className="text-xs text-gray-600">
                        +10€ pour une consultation téléphone ou visio de 30min / mois.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Formulaire de paiement */}
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <CreditCard className="h-6 w-6" />
                      Informations de paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="votre@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="Votre nom complet"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro de téléphone WhatsApp
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          placeholder="+33 6 12 34 56 78"
                          required
                        />
                        <p className="text-xs text-gray-600 mt-1">
                          Ce numéro sera utilisé pour vous contacter via WhatsApp
                        </p>
                      </div>

                      <div>
                        <label htmlFor="wedding-date" className="block text-sm font-medium text-gray-700 mb-2">
                          Date de mariage prévue
                        </label>
                        <input
                          type="date"
                          id="wedding-date"
                          name="wedding-date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-wedding-olive focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold">Total mensuel</span>
                        <span className="text-2xl font-bold text-wedding-olive">9,90€ TTC</span>
                      </div>
                      
                      <Button className="w-full bg-wedding-olive hover:bg-wedding-olive/90 text-white py-3 text-lg">
                        Souscrire maintenant
                      </Button>
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield className="h-4 w-4" />
                        <span>Paiement sécurisé par Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Résiliation possible à tout moment</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        En souscrivant, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
                        Votre abonnement sera automatiquement renouvelé chaque mois.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Paiement;
