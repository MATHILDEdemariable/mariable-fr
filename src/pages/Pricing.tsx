
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

  const scrollToFormules = () => {
    const formulesSection = document.getElementById('formules-jour-m');
    if (formulesSection) {
      formulesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
                  <CardTitle className="text-xl font-serif mb-4">
                    🎯 Le Jour M
                  </CardTitle>
                  <div className="text-3xl font-bold text-wedding-olive mb-1">
                    Dès 50€ TTC
                  </div>
                  <p className="text-sm text-gray-600">Une app pour orchestrer votre Jour J</p>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow flex flex-col">
                  <div className="space-y-3 flex-grow">
                    <div className="flex items-start gap-3">
                      <span className="text-wedding-olive text-lg">→</span>
                      <p className="text-sm text-gray-700">Planning Jour-J</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-wedding-olive text-lg">→</span>
                      <p className="text-sm text-gray-700">Rôles et gestion des proches</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-wedding-olive text-lg">→</span>
                      <p className="text-sm text-gray-700">Espace document : fiche logistique, plans des lieux, moodboard</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-wedding-olive text-lg">→</span>
                      <p className="text-sm text-gray-700">Espace contact prestataires</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🎯</span>
                      <p className="text-sm font-medium text-gray-700">
                        Déléguez facilement & profitez pleinement de votre journée.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-auto">
                    <Button 
                      onClick={scrollToFormules}
                      className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90"
                    >
                      Découvrir les formules
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Nouvelle section Les formules du Jour-M */}
            <section id="formules-jour-m" className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Les formules du Jour-J
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    Choisissez le niveau d'accompagnement qui vous correspond
                  </p>
                </div>

                <div className="max-w-6xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Formule Libre */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
                      <CardHeader className="text-center pb-4">
                        <div className="text-2xl font-bold text-wedding-olive mb-2">50€</div>
                        <CardTitle className="text-lg font-serif mb-2">Formule Libre</CardTitle>
                        <p className="text-sm font-medium text-gray-800">Votre mariage, vos règles</p>
                        <p className="text-xs text-gray-600 italic">Pour les couples autonomes</p>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-gray-700">
                          Application vierge - Vous pilotez tout
                        </p>
                      </CardContent>
                    </Card>

                    {/* Formule Sereine */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-white border-2 border-wedding-olive relative">
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-wedding-olive text-white px-3 py-1 rounded-full text-xs font-medium">
                          POPULAIRE
                        </span>
                      </div>
                      <CardHeader className="text-center pb-4 pt-6">
                        <div className="text-2xl font-bold text-wedding-olive mb-2">149€</div>
                        <CardTitle className="text-lg font-serif mb-2">Formule Sereine</CardTitle>
                        <p className="text-sm font-medium text-gray-800">Guidés sans être dirigés</p>
                        <p className="text-xs text-gray-600 italic">Pour la tranquillité d'esprit</p>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-gray-700">
                          Application guidée + système de notification - Vous gardez le contrôle sans charge mentale
                        </p>
                      </CardContent>
                    </Card>

                    {/* Formule Privilège */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow bg-white">
                      <CardHeader className="text-center pb-4">
                        <div className="text-2xl font-bold text-wedding-olive mb-2">799€</div>
                        <CardTitle className="text-lg font-serif mb-2">Formule Privilège</CardTitle>
                        <p className="text-sm font-medium text-gray-800">Les mariés sont des invités</p>
                        <p className="text-xs text-gray-600 italic">Pour l'expérience premium</p>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-sm text-gray-700">
                          Application + présence terrain - Vous déléguez le jour J
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center">
                    <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-3">
                      <Link to="/reservation-jour-m">
                        Faire une demande de réservation
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Comment ça marche */}
            <section className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Comment ça marche ?
                  </h2>
                  <p className="text-lg text-gray-700 mb-2">
                    Le processus de coordination "Le Jour M" en 8 étapes
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
                              📧 Transfert des infos via le formulaire
                            </h3>
                            <p className="text-gray-600">
                              Vous nous envoyez tous vos documents, plannings et informations de mariage via le formulaire.
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
                              📞 Rendez-vous téléphonique ou visio
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
                              📱 Création de l'app & du WhatsApp
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
                              👥 Partagez les accès à vos proches et laissez-vous guider par l'app
                            </h3>
                            <p className="text-gray-600">
                              Vos proches reçoivent l'accès à l'application et peuvent suivre le planning et leurs tâches.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Étape 5 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Phone className="h-5 w-5 text-wedding-olive" />
                              📞 Utilisez la hotline si besoin jusqu'au jour J pour toutes questions
                            </h3>
                            <p className="text-gray-600">
                              Support client dédié disponible 7J/7 pour répondre à toutes vos questions.
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

                      {/* Étape 6 */}
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2"></div>
                        <div className="relative z-10">
                          <div className="w-12 h-12 bg-wedding-olive rounded-full flex items-center justify-center text-white font-bold text-lg">
                            6
                          </div>
                        </div>
                        <div className="md:w-1/2">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                              <Calendar className="h-5 w-5 text-wedding-olive" />
                              👰🤵 Laissez le manager Mariable gérer pour vous & profitez
                            </h3>
                            <p className="text-gray-600">
                              Vivez votre mariage sereinement, tout est organisé et coordonné pour vous.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Nouvelle section Options supplémentaires */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Options supplémentaires
                  </h2>
                  <p className="text-lg text-gray-700">
                    Personnalisez votre service "Le Jour M" avec nos options à la carte
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">⏰</span>
                            <h3 className="text-lg font-semibold">Heure supplémentaire</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+30€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Extension de la présence du coordinateur pour les mariages nécessitant plus de temps
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🎨</span>
                            <h3 className="text-lg font-semibold">Installation décoration</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Installation et mise en place de votre décoration selon vos souhaits
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏛️</span>
                            <h3 className="text-lg font-semibold">RDV visite technique</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Visite sur site avec vous pour optimiser l'organisation spatiale et anticiper les défis logistiques
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📅</span>
                            <h3 className="text-lg font-semibold">Présence J-1 ou J+1</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Accompagnement supplémentaire la veille ou le lendemain pour la mise en place ou le rangement
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">📄</span>
                            <h3 className="text-lg font-semibold">Documentation imprimée</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+20€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Version papier haute qualité de tous vos documents de coordination (planning, contacts, etc.)
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">👥</span>
                            <h3 className="text-lg font-semibold">Mariage +180 personnes</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Supplément pour la coordination de mariages de plus de 180 invités nécessitant une logistique renforcée
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-sm text-gray-600">
                      Ces options peuvent être ajoutées lors de votre réservation ou discutées pendant l'audit initial.
                    </p>
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
