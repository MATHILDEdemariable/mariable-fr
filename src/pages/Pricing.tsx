
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Phone, Smartphone, Users, Calendar, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToCommentCaMarche = () => {
    const commentSection = document.getElementById('comment-ca-marche');
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: 'smooth' });
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
                Formules Jour-M
              </h1>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Choisissez le niveau d'accompagnement qui vous correspond
              </p>
            </div>

            {/* Section Formules Jour-M */}
            <section className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto mb-8">
                  {/* Tableau comparatif */}
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-wedding-olive text-white">
                            <th className="px-6 py-4 text-left font-semibold">Fonctionnalité</th>
                            <th className="px-6 py-4 text-center font-semibold">Libre</th>
                            <th className="px-6 py-4 text-center font-semibold bg-wedding-olive/90">Sereine</th>
                            <th className="px-6 py-4 text-center font-semibold">Privilège</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">Prix (TTC)</td>
                            <td className="px-6 py-4 text-center font-bold text-wedding-olive">49€</td>
                            <td className="px-6 py-4 text-center font-bold text-wedding-olive bg-gray-100">149€</td>
                            <td className="px-6 py-4 text-center font-bold text-wedding-olive">799€</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">App personnalisée</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <X className="h-5 w-5 text-red-500 mb-1" />
                                <span className="text-sm text-gray-600">(vierge)</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">Pré-remplie</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">Pré-remplie</span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">Checklists & planning</td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">Modifiable</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">Modifiable</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">Modifiable</span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">Notifications et rappels en temps réel de J-3 à J+1</td>
                            <td className="px-6 py-4 text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">Support client via une hotline Mariable dédiée 7J/7 jusqu'au Jour-J</td>
                            <td className="px-6 py-4 text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">(option +50€)</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex flex-col items-center">
                                <CheckCircle className="h-5 w-5 text-green-500 mb-1" />
                                <span className="text-sm text-gray-600">incluse</span>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">Coordination prestataires en amont (J-15)</td>
                            <td className="px-6 py-4 text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-6 py-4 font-medium text-gray-900">Présence physique le jour J</td>
                            <td className="px-6 py-4 text-center">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center bg-gray-100">
                              <X className="h-5 w-5 text-red-500 mx-auto" />
                            </td>
                            <td className="px-6 py-4 text-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Boutons simplifiés */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 p-6">
                      <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                        <Link to="/demo-jour-m">
                          Voir une démo
                        </Link>
                      </Button>
                      <Button 
                        onClick={scrollToCommentCaMarche}
                        className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
                      >
                        En savoir plus
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Comment ça marche */}
            <section id="comment-ca-marche" className="py-16 bg-gray-50 rounded-xl mb-16">
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
