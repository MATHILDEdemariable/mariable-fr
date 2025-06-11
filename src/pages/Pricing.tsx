
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Calendar, Phone, Users, FileText, Clock, Shield, MessageCircle, HelpCircle } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Pricing = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const formulas = [
    {
      id: 'essential',
      name: 'Essential',
      price: '49€ TTC',
      popular: false,
      features: [
        'Application collaborative personnalisée',
        'Planning intelligent et timeline détaillée',
        'Gestion des tâches et rôles',
        'Espace documents centralisé',
        'Carnet de contacts intégré',
        'Partage avec votre équipe (illimité)',
        'Support par email'
      ],
      description: 'Pour une coordination simple et efficace',
      cta: 'Choisir Essential'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '99€ TTC',
      popular: true,
      features: [
        'Tout de la formule Essential',
        'Notifications automatiques par SMS/email',
        'Rappels personnalisés',
        'Hotline téléphonique J-7 et Jour J',
        'Templates de planning avancés',
        'Export PDF professionnel',
        'Accompagnement personnalisé',
        'Support prioritaire'
      ],
      description: 'Pour une organisation premium avec assistance',
      cta: 'Choisir Premium'
    },
    {
      id: 'prestige',
      name: 'Prestige',
      price: '199€ TTC',
      popular: false,
      features: [
        'Tout de la formule Premium',
        'Manager Mariable présent sur site',
        'Coordination complète le Jour J',
        'Gestion des imprévus en temps réel',
        'Briefing prestataires personnalisé',
        'Supervision installation/démontage',
        'Rapport de fin de journée',
        'Service conciergerie'
      ],
      description: 'Pour une tranquillité absolue avec présence terrain',
      cta: 'Choisir Prestige'
    }
  ];

  const additionalOptions = [
    {
      title: 'Répétition générale',
      description: 'Séance de coordination complète 1 semaine avant le mariage',
      price: '+49€'
    },
    {
      title: 'Briefing prestataires personnalisé',
      description: 'Réunion de coordination avec tous vos prestataires',
      price: '+39€'
    },
    {
      title: 'Extension famille/témoins',
      description: 'Accès étendu à l\'application pour plus de personnes',
      price: '+19€'
    }
  ];

  const faqData = [
    {
      id: 1,
      question: "Puis-je modifier la formule plus tard ?",
      answer: "Oui, vous pouvez upgrader votre formule jusqu'à J-30. Un ajustement tarifaire sera appliqué au prorata du temps restant jusqu'à votre mariage."
    },
    {
      id: 2,
      question: "La présence terrain, c'est quoi exactement ?",
      answer: "Un manager Mariable est physiquement présent le jour J pour superviser le déroulement, coordonner les prestataires et gérer les imprévus."
    },
    {
      id: 3,
      question: "Puis-je utiliser l'app avec ma famille ?",
      answer: "Oui justement, l'application est faite pour être collaborative - chacun peut accéder à son planning et aux informations importantes."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Formules Jour M | Mariable</title>
        <meta name="description" content="Découvrez nos formules pour organiser parfaitement votre Jour M avec notre application collaborative" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-serif text-black mb-6">
                Formules Jour M
              </h1>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Une application collaborative pour coordonner parfaitement votre grand jour. 
                Choisissez la formule qui correspond à vos besoins.
              </p>
              
              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                  <Link to="/demo-jour-m">
                    En savoir plus
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/reservation-jour-m">
                    Réserver
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {formulas.map((formula) => (
                <Card 
                  key={formula.id} 
                  className={`relative shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                    formula.popular ? 'border-2 border-wedding-olive' : ''
                  }`}
                >
                  {formula.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-wedding-olive text-white px-4 py-1 rounded-full text-sm font-medium">
                        POPULAIRE
                      </span>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-4">
                    <CardTitle className="text-2xl font-bold mb-2">{formula.name}</CardTitle>
                    <div className="text-3xl font-bold text-wedding-olive mb-2">{formula.price}</div>
                    <p className="text-gray-600">{formula.description}</p>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <ul className="space-y-3 mb-8">
                      {formula.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      asChild 
                      className={`w-full ${
                        formula.popular 
                          ? 'bg-wedding-olive text-white hover:bg-wedding-olive/90' 
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      <Link to="/reservation-jour-m">
                        {formula.cta}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Options supplémentaires */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-black mb-6">
                Options supplémentaires
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Personnalisez votre formule avec nos options premium
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {additionalOptions.map((option, index) => (
                <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-bold text-lg mb-3">{option.title}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="text-2xl font-bold text-wedding-olive">{option.price}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 rounded-xl mt-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif text-black mb-6">
                Questions fréquentes
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                Tout ce que vous devez savoir sur nos formules Jour-M
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqData.map((item) => (
                <Card key={item.id} className="bg-white shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-wedding-olive mt-0.5 flex-shrink-0" />
                    {item.question}
                  </h3>
                  <p className="text-gray-600 ml-8">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-serif mb-4">
              Prêt à organiser votre Jour M ?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Réservez dès maintenant votre formule et transformez l'organisation de votre mariage en expérience collaborative et sereine.
            </p>
            
            <Button asChild size="lg" className="bg-white text-wedding-olive hover:bg-white/90">
              <Link to="/reservation-jour-m">
                Réserver ma formule
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
