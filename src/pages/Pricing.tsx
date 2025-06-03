
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Phone, Smartphone, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Tarifs | Mariable</title>
        <meta name="description" content="Découvrez nos tarifs et choisissez le service qui vous correspond" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                Les services
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Choisissez le niveau d'accompagnement qui vous correspond
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
              {/* Bloc 1 - Organisation & Coordination en autonomie */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-xl font-serif mb-4">
                    Organisation & Coordination en autonomie
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
                      <p className="text-sm text-gray-700">Accès à votre espace personnel (dashboard)</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Check list</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Calculatrice de budget & modèle de suivi du budget téléchargeable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Accès la sélection de prestataire</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Générateur de planning Jour J</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Outils d'aide à la coordination jour-j</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Export Pdf</p>
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
                        Créer un compte
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Bloc 2 - Le Point M */}
              <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                <CardHeader className="text-center pb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">💡</span>
                    <CardTitle className="text-xl font-serif">Le Point M : Consultation Jour J</CardTitle>
                  </div>
                  <div className="text-3xl font-bold text-wedding-olive mb-2">
                    30 € TTC
                  </div>
                  <p className="text-sm text-gray-600">Une session flash pour tout clarifier</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-xs text-gray-500">En visio ou téléphone (30 à 45 min)</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
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
                      <p className="text-sm text-gray-700">Relecture des documents techniques</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Recommandations de dernière minute</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Optimisation du planning jour J</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Aide pour structurer votre coordination</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Envoi d'un compte-rendu clair & actionnable</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Création d'un document PDF clair, modifiable, partageable & imprimable</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">💡</span>
                      <p className="text-sm font-medium text-gray-700">
                        Comme une consultation de médecin… mais pour votre mariage !
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">
                      Vous repartez rassurés, structurés, et prêts à briefer votre équipe.
                    </p>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button asChild className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300">
                      <Link to="/contact/nous-contacter">
                        Envoyer une demande
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
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-lg">💎</span>
                    <CardTitle className="text-xl font-serif">Le Jour M</CardTitle>
                  </div>
                  <p className="text-sm font-medium text-wedding-olive mb-3">
                    Pour vivre pleinement le jour qui compte le plus
                  </p>
                  <p className="text-sm text-gray-600 mb-3">coordination Jour J – Orchestré</p>
                  <div className="text-3xl font-bold text-wedding-olive mb-1">
                    750 € TTC
                  </div>
                  <p className="text-xs text-gray-500 line-through">au lieu de 1 000 €</p>
                  <p className="text-xs text-wedding-olive font-medium">offre de lancement</p>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Audit complet de votre organisation</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-gray-700">
                        <p className="font-medium mb-1">Création d'une application mobile personnalisée avec :</p>
                        <ul className="text-xs space-y-1 ml-4">
                          <li>→ Planning jour J interactif</li>
                          <li>→ Rôles & horaires des proches</li>
                          <li>→ Plan des lieux, trajets GPS, moodboard</li>
                        </ul>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Coordination en amont avec les prestataires</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Création d'un groupe WhatsApp avec vos parties prenantes - qui vous envoie des notifications</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Documents récapitulatifs prêts à diffuser</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">Présence physique sur place le jour J (en option)</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🕊️</span>
                      <p className="text-sm font-medium text-gray-700">
                        Arrivez comme un invité à votre mariage
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                      <Link to="/reservation-jour-m">
                        Réserver
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Comment ça marche */}
            <section className="py-16 bg-gray-50 rounded-xl">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Comment ça marche ?
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    Le processus de coordination "Le Jour M" en 5 étapes
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-wedding-olive/30 hidden md:block"></div>

                    <div className="space-y-12">
                      {/* Étape 1 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Mail className="h-5 w-5 text-wedding-olive" />
                              Transfert des infos par mail
                            </h3>
                            <p className="text-gray-600">
                              Vous nous envoyez tous vos documents, plannings et informations de mariage par email.
                            </p>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            1
                          </div>
                        </div>
                        <div className="md:w-1/2"></div>
                      </div>

                      {/* Étape 2 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2"></div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            2
                          </div>
                        </div>
                        <div className="md:w-1/2">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Phone className="h-5 w-5 text-wedding-olive" />
                              Rendez-vous téléphonique ou visio
                            </h3>
                            <p className="text-gray-600">
                              Échange personnalisé pour comprendre vos besoins et affiner l'organisation.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Étape 3 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Smartphone className="h-5 w-5 text-wedding-olive" />
                              Création de l'app & du WhatsApp
                            </h3>
                            <p className="text-gray-600">
                              Développement de votre application mobile personnalisée et création du groupe WhatsApp.
                            </p>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            3
                          </div>
                        </div>
                        <div className="md:w-1/2"></div>
                      </div>

                      {/* Étape 4 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2"></div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            4
                          </div>
                        </div>
                        <div className="md:w-1/2">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Users className="h-5 w-5 text-wedding-olive" />
                              Coordination
                            </h3>
                            <p className="text-gray-600">
                              Coordination avec tous vos prestataires et briefing de votre équipe.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Étape 5 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Calendar className="h-5 w-5 text-wedding-olive" />
                              Profitez
                            </h3>
                            <p className="text-gray-600">
                              Vivez votre mariage sereinement, tout est organisé et coordonné pour vous.
                            </p>
                          </div>
                        </div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            5
                          </div>
                        </div>
                        <div className="md:w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
