import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail, Phone, Smartphone, Users, Calendar, X, ArrowLeft, Clock, Palette, Building, FileText, CreditCard, ChevronDown, Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import FormulaCTAButton from '@/components/pricing/FormulaCTAButton';
import CoordinatorsPreview from '@/components/coordinators/CoordinatorsPreview';
const Pricing = () => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const scrollToCommentCaMarche = () => {
    const commentSection = document.getElementById('comment-ca-marche');
    if (commentSection) {
      commentSection.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  const faqData = [{
    id: 1,
    question: "Puis-je modifier la formule plus tard ?",
    answer: "Oui, vous pouvez upgrader votre formule jusqu'à J-30. Un ajustement tarifaire sera appliqué au prorata du temps restant jusqu'à votre mariage."
  }, {
    id: 2,
    question: "La présence terrain, c'est quoi exactement ?",
    answer: "Un manager Mariable est physiquement présent le jour J pour superviser le déroulement, coordonner les prestataires et gérer les imprévus."
  }, {
    id: 3,
    question: "Puis-je utiliser l'app avec ma famille ?",
    answer: "Oui justement, l'application est faite pour être collaborative - chacun peut accéder à son planning et aux informations importantes."
  }];
  return <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Détail - Coordination Jour M | Mariable</title>
        <meta name="description" content="Découvrez nos formules de coordination pour le jour J et choisissez le service qui vous correspond" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <section className="py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            {/* Back button */}
            <div className="mb-8">
              <Button asChild variant="ghost" className="text-wedding-olive hover:text-wedding-olive/80">
                <Link to="/" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Retour
                </Link>
              </Button>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mb-6">Détail - Coordination Jour J</h1>
            </div>

            {/* Section Démo */}
            <section id="demo-section" className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Démo
                  </h2>
                  <p className="text-lg text-gray-700">Découvrez comment fonctionne notre service Jour-J</p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="relative w-full" style={{
                  paddingBottom: '56.25%',
                  height: 0
                }}>
                    <iframe src="https://www.loom.com/embed/a0d0d52de99d4af59d67604f01c8af14?sid=72174f71-1964-4904-9f5a-c7d71faff046" frameBorder="0" allowFullScreen className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg" title="Démo Mariable Jour-M" />
                  </div>
                </div>
              </div>
            </section>

            {/* Section Formules Jour-M */}
            <section className="py-8 md:py-16 bg-white rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto mb-8">
                  <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                    {/* Formule Libre */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                      <CardHeader className="text-center bg-wedding-olive text-white">
                        <CardTitle className="text-xl">Libre</CardTitle>
                        <div className="text-2xl font-bold">14,9€</div>
                      </CardHeader>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="space-y-3 flex-1">
                          <div>
                            <span className="text-sm">Application personnalisée (à remplir vous-même)</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Checklists & planning (Modifiable)</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t mt-auto">
                          <FormulaCTAButton formula="libre" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Formule Sereine */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow border-2 border-wedding-olive flex flex-col h-full">
                      <CardHeader className="text-center bg-wedding-olive text-white relative">
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-wedding-olive text-white text-sm px-2 py-1 rounded-full">Recommandée</div>
                        <CardTitle className="text-xl">Sereine</CardTitle>
                        <div className="text-2xl font-bold">24,9€</div>
                      </CardHeader>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="space-y-3 flex-1">
                          <div>
                            <span className="text-sm">Application personnalisée (Pré-remplie)</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Checklists & planning (Modifiable)</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Notifications et rappels temps réel J-1 et J-J</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Support hotline 7J/7 jusqu'au Jour-J</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t mt-auto">
                          <FormulaCTAButton formula="sereine" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Formule Privilège */}
                    <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                      <CardHeader className="text-center bg-wedding-olive text-white">
                        <CardTitle className="text-xl">Privilège</CardTitle>
                        <div className="text-2xl font-bold">799€</div>
                      </CardHeader>
                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="space-y-3 flex-1">
                          <div>
                            <span className="text-sm">Application personnalisée (Pré-remplie)</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Checklists & planning (Modifiable)</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Notifications et rappels temps réel J-1 et J-J</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Support hotline 7J/7 jusqu'au Jour-J</span>
                          </div>
                          
                          <div>
                            <span className="text-sm">Présence physique le jour J</span>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t mt-auto">
                          <FormulaCTAButton formula="privilege" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Section En savoir plus sur la formule privilège */}
                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-serif text-center mb-4">
                      En savoir plus sur la formule privilège
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={scrollToCommentCaMarche} className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full sm:w-auto">
                        En savoir plus
                      </Button>
                      <Button asChild className="bg-wedding-olive hover:bg-wedding-olive/90 text-white w-full sm:w-auto">
                        <Link to="/coordinateurs-mariage">Voir les coordinateurs</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section Coordinateurs */}
            <section className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <CoordinatorsPreview />
              </div>
            </section>

            {/* Section Options supplémentaires */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Options supplémentaires
                  </h2>
                  <p className="text-lg text-gray-700">Personnalisez votre service "Le Jour J" avec nos options à la carte</p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Clock className="h-6 w-6 text-wedding-olive" />
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
                            <Palette className="h-6 w-6 text-wedding-olive" />
                            <h3 className="text-lg font-semibold">Installation décorations volumineuses</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">Mise en place de votre décoration selon vos souhaits (ex : mobilier : chaise, table, autres objets volumineux)
{'->'} petite décorations inclus (ex: bougies)</p>
                      </CardContent>
                    </Card>

                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Building className="h-6 w-6 text-wedding-olive" />
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
                            <Calendar className="h-6 w-6 text-wedding-olive" />
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
                            <FileText className="h-6 w-6 text-wedding-olive" />
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
                            <Users className="h-6 w-6 text-wedding-olive" />
                            <h3 className="text-lg font-semibold">Mariage +180 personnes</h3>
                          </div>
                          <span className="text-xl font-bold text-wedding-olive">+200€</span>
                        </div>
                        <p className="text-sm text-gray-600">Supplément pour la coordination de mariages de plus de 180 invités nécessitant une personne en plus</p>
                      </CardContent>
                    </Card>

                    <div className="text-center mt-8">
                      
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
                    Le processus de coordination <b>"Le Jour J"</b> en 5 étapes
                    <br />
                    <span className="inline-block mt-2 text-wedding-olive font-semibold">Applicable uniquement aux formules Sereine &amp; Privilège</span>
                  </p>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-wedding-olive/30 hidden md:block"></div>

                    <div className="space-y-12">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Mail className="h-5 w-5 text-wedding-olive" />
                              Transfert des informations clés
                            </h3>
                            <p className="text-gray-600">
                              Remplissez l'application vous-même avec vos informations mariage et vos envies de déroulé
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
                              <Smartphone className="h-5 w-5 text-wedding-olive" />
                              Création ligne directe WhatsApp
                            </h3>
                            <p className="text-gray-600">
                              Création de la ligne directe WhatsApp par l'équipe Mariable (selon formule)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Phone className="h-5 w-5 text-wedding-olive" />
                              Support disponible
                            </h3>
                            <p className="text-gray-600">
                              Contactez nous si besoin à tout moment
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
                              Partagez le lien de consultation
                            </h3>
                            <p className="text-gray-600">Quand votre module Jour-J est finalisé, transférez le lien à vos proches, prestataires et coordinateur</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="md:w-1/2 text-right">
                          <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-3 flex items-center justify-end gap-2">
                              <Calendar className="h-5 w-5 text-wedding-olive" />
                              Laissez-vous guider
                            </h3>
                            <p className="text-gray-600">Utilisez l'application comme feuille de route ou les notifications ou le coordinateur - selon la formule choisie</p>
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

            {/* Section FAQ */}
            <section className="py-16 bg-gray-50 rounded-xl mt-16">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                    Questions fréquentes
                  </h2>
                  <p className="text-lg text-gray-700">Tout ce que vous devez savoir sur nos formules Jour-J</p>
                </div>

                <div className="max-w-4xl mx-auto space-y-6">
                  {faqData.map(faq => <Card key={faq.id} className="bg-white shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive rounded-full flex items-center justify-center">
                            <ChevronDown className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-semibold mb-3 text-gray-900">
                              {faq.question}
                            </h3>
                            <p className="text-gray-600">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Pricing;