import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle, Mail, Phone, Smartphone, Users, Calendar, X, 
  Check, Brain, Settings, Handshake, CheckSquare, Calculator, 
  Home, Download, LayoutGrid, Share2, User, FileText, Droplet,
  QrCode, Headphones, Clock
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import FormulaCTAButton from '@/components/pricing/FormulaCTAButton';
import CoordinatorsPreview from '@/components/coordinators/CoordinatorsPreview';
const Prix = () => {
  const isMobile = useIsMobile();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    { name: "Accès espace personnel", icon: User, gratuit: true, premium: true, coordinateur: true },
    { name: "Guide de prestataires", icon: Users, gratuit: true, premium: true, coordinateur: true },
    { name: "Modèle de check-list version post-it", icon: CheckSquare, gratuit: true, premium: true, coordinateur: true },
    { name: "Calculatrice budget", icon: Calculator, gratuit: true, premium: true, coordinateur: true },
    { name: "Modèle suivi budgétaire personnalisable", icon: FileText, gratuit: true, premium: true, coordinateur: true },
    { name: "Calculatrice boisson", icon: Droplet, gratuit: true, premium: true, coordinateur: true },
    { name: "RSVP invité en ligne", icon: Mail, gratuit: true, premium: true, coordinateur: true },
    { name: "Gestion hébergement", icon: Home, gratuit: true, premium: true, coordinateur: true },
    { name: "Génération rétroplanning & check-list IA", icon: Brain, gratuit: false, premium: true, coordinateur: true },
    { name: "Planning intelligent Jour-J", icon: Calendar, gratuit: false, premium: true, coordinateur: true },
    { name: "Assignation tâches équipe Jour-J", icon: Users, gratuit: false, premium: true, coordinateur: true },
    { name: "Partage temps réel infos Jour-J", icon: Share2, gratuit: false, premium: true, coordinateur: true },
    { name: "Stockage documents", icon: FileText, gratuit: false, premium: true, coordinateur: true },
    { name: "Génération illimitée QR code", icon: QrCode, gratuit: false, premium: true, coordinateur: true },
    { name: "Support téléphonique & Whatsapp", icon: Headphones, gratuit: false, premium: true, coordinateur: true },
    { name: "Audit organisation via l'appli", icon: Settings, gratuit: false, premium: false, coordinateur: true },
    { name: "2h rdv téléphonique/visio", icon: Phone, gratuit: false, premium: false, coordinateur: true },
    { name: "14h présence jour-J", icon: Clock, gratuit: false, premium: false, coordinateur: true },
    { name: "Coordination prestataires terrain", icon: Handshake, gratuit: false, premium: false, coordinateur: true },
    { name: "Gestion imprévus terrain", icon: Settings, gratuit: false, premium: false, coordinateur: true }
  ];

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
        <title>Tarifs - Services Mariable | Wedding Planner en ligne</title>
        <meta name="description" content="Découvrez nos tarifs transparents pour organiser votre mariage. Application autonome à 39€ et services premium sur demande." />
      </Helmet>
      
      <PremiumHeader />
      
      <main className="flex-grow page-content-premium">
        {/* Section 1 - Tableau comparatif des formules */}
        <section className="py-16 md:py-20 bg-gray-50 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-black mb-6">
                Choisissez la formule qui vous correspond
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                De l'autonomie totale à l'accompagnement complet, trouvez la solution idéale pour votre mariage
              </p>
            </div>

            {/* Tableau comparatif 3 colonnes */}
            <div className="max-w-7xl mx-auto mb-16">
              {/* En-têtes des colonnes */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="hidden md:block"></div>
                
                {/* Colonne Gratuit */}
                <Card className="text-center p-6 border-2 border-gray-200">
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl mb-2">Gratuit</CardTitle>
                    <div className="text-3xl font-bold text-wedding-olive mb-2">0€</div>
                    <p className="text-sm text-gray-600">Pour bien démarrer</p>
                  </CardHeader>
                </Card>
                
                {/* Colonne 39€ - Recommandé */}
                <Card className="text-center p-6 bg-gradient-to-br from-wedding-olive to-wedding-olive/90 border-2 border-wedding-olive relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-white text-wedding-olive px-4 py-1 rounded-full text-xs font-bold">
                      ⭐ RECOMMANDÉ
                    </span>
                  </div>
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl text-white mb-2">Application Premium</CardTitle>
                    <div className="text-3xl font-bold text-white mb-2">39€</div>
                    <p className="text-sm text-white/90">Paiement unique, à vie</p>
                  </CardHeader>
                </Card>
                
                {/* Colonne 1000€ */}
                <Card className="text-center p-6 border-2 border-gray-200">
                  <CardHeader className="p-0">
                    <CardTitle className="text-xl mb-2">Coordinateur.rice</CardTitle>
                    <div className="text-3xl font-bold text-wedding-olive mb-2">1000€</div>
                    <p className="text-sm text-gray-600">Avec présence jour-J</p>
                  </CardHeader>
                </Card>
              </div>

              {/* Lignes de fonctionnalités */}
              <div className="space-y-2">
                {features.map((feature, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Nom de la fonctionnalité */}
                    <div className="flex items-center p-4 bg-white rounded-lg border border-gray-200">
                      <feature.icon className="w-5 h-5 text-wedding-olive mr-3 flex-shrink-0" />
                      <span className="font-medium text-gray-900 text-sm">{feature.name}</span>
                    </div>
                    
                    {/* Disponibilité pour chaque formule */}
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                      {feature.gratuit ? <Check className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-gray-300" />}
                    </div>
                    
                    <div className="flex items-center justify-center p-4 bg-wedding-olive/5 rounded-lg border-2 border-wedding-olive/20">
                      {feature.premium ? <Check className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-gray-300" />}
                    </div>
                    
                    <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                      {feature.coordinateur ? <Check className="w-6 h-6 text-green-600" /> : <X className="w-6 h-6 text-gray-300" />}
                    </div>
                  </div>
                ))}
              </div>

              {/* Boutons CTA */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
                <div className="hidden md:block"></div>
                <Button asChild className="bg-wedding-olive text-white hover:bg-wedding-olive/90">
                  <Link to="/register">S'inscrire gratuitement</Link>
                </Button>
                <Button asChild className="bg-white text-wedding-olive border-2 border-wedding-olive hover:bg-wedding-olive hover:text-white">
                  <Link to="/register">Découvrir - Payer plus tard</Link>
                </Button>
                <Button asChild className="bg-wedding-olive text-white hover:bg-wedding-olive/90">
                  <Link to="/reservation-jour-m">Faire une demande</Link>
                </Button>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2 - Services d'accompagnement à la carte */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-black mb-4">
                Services d'accompagnement à la carte
              </h2>
              <p className="text-lg text-gray-700">Bénéficiez d'un accompagnement personnalisé pour votre mariage</p>
            </div>


            <div className="max-w-6xl mx-auto mb-8">
              <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
                {/* Ligne directe */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Ligne directe</CardTitle>
                    <div className="text-2xl font-bold">9,9€/mois</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
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
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                        <Link to="/reservation-jour-m">Faire une demande</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Wedding Content Creator */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Wedding Content Creator</CardTitle>
                    <div className="text-2xl font-bold">800€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">8h de présence le jour-J</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Envoi de tous les rush vidéo</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">2 montages réels</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <Button asChild className="w-full bg-wedding-olive text-white hover:bg-wedding-olive/90">
                        <Link to="/reservation-jour-m">Faire une demande</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Présence d'un Coordinateur.rice */}
                <Card className="shadow-md hover:shadow-lg transition-shadow flex flex-col h-full">
                  <CardHeader className="text-center bg-wedding-olive text-white">
                    <CardTitle className="text-xl">Coordinateur.rice JOUR-J</CardTitle>
                    <div className="text-2xl font-bold">1000€</div>
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">Audit de votre organisation via l'appli</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">2h de rdv téléphonique visio</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-700">14H de présence le jour-j</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t mt-auto">
                      <FormulaCTAButton formula="privilege" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Section Coordinateurs */}
            <section className="py-16 bg-gray-50 rounded-xl mb-16">
              <div className="container mx-auto px-4">
                <CoordinatorsPreview />
              </div>
            </section>
          </div>
        </section>


        {/* Final CTA Section */}
        <section className="py-16 md:py-20 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif mb-4">
              Prêt(e) à organiser votre mariage en toute sérénité ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Commencez gratuitement ou choisissez la formule qui vous correspond.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-wedding-olive hover:bg-white/90">
                <Link to="/register">
                  Commencer gratuitement
                </Link>
              </Button>
              <Button asChild size="lg" className="border-white text-white bg-transparent hover:bg-white hover:text-wedding-olive">
                <Link to="/contact">
                  Faire une demande
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>;
};
export default Prix;