import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Camera, 
  Video, 
  Heart, 
  Clock, 
  Sparkles, 
  Instagram, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  Star,
  Gift
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const ContentCreatorMariage = () => {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-section');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const benefits = [
    {
      icon: Camera,
      title: 'Captation photo & vidéo instantanée',
      description: 'Photos et vidéos professionnelles en temps réel pendant votre mariage'
    },
    {
      icon: Instagram,
      title: 'Stories & reels en direct',
      description: 'Partagez les meilleurs moments avec vos proches instantanément'
    },
    {
      icon: Video,
      title: 'Aftermovie souvenir',
      description: 'Recevez votre film de mariage édité en quelques jours'
    },
    {
      icon: Sparkles,
      title: '100% adapté à votre mariage',
      description: 'Un service simple à réserver, totalement personnalisé'
    }
  ];

  const packs = [
    {
      id: 'essentiel',
      name: 'Pack Essentiel',
      price: '490€',
      description: 'L\'essentiel pour capturer votre journée',
      features: [
        'Stories Instagram en temps réel',
        'Reels dynamiques de vos moments forts',
        '4h de présence',
        'Livraison sous 48h',
        'Musique & transitions professionnelles'
      ],
      popular: false
    },
    {
      id: 'complet',
      name: 'Pack Complet',
      price: '890€',
      description: 'La solution complète pour revivre votre mariage',
      features: [
        'Tout du Pack Essentiel',
        'Aftermovie cinématographique (3-5 min)',
        'Photos haute qualité (200+ clichés)',
        '8h de présence',
        'Livraison sous 5 jours',
        'Galerie privée en ligne',
        'Vidéos téléchargeables HD'
      ],
      popular: true
    },
    {
      id: 'premium',
      name: 'Pack Premium',
      price: '1490€',
      description: 'L\'expérience ultime pour un souvenir inoubliable',
      features: [
        'Tout du Pack Complet',
        'Aftermovie long format (8-12 min)',
        'Photos illimitées',
        'Journée complète (12h)',
        'Drone cinématique',
        'Interview des mariés',
        'Album photo numérique premium',
        'Support prioritaire'
      ],
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Marie & Thomas',
      location: 'Paris',
      text: 'On a pu revivre notre mariage dès le lendemain grâce aux stories ! Nos invités ont adoré découvrir les coulisses en direct.',
      rating: 5
    },
    {
      name: 'Sophie & Alexandre',
      location: 'Lyon',
      text: 'L\'aftermovie est magnifique, on pleure à chaque visionnage. Le content creator a su capter l\'essence de notre journée.',
      rating: 5
    },
    {
      name: 'Julie & Pierre',
      location: 'Bordeaux',
      text: 'Service impeccable et discret. Les reels étaient prêts avant même la fin du repas ! Un cadeau parfait pour nous.',
      rating: 5
    }
  ];

  const steps = [
    {
      number: '1',
      title: 'Vous réservez',
      description: 'Choisissez votre pack et réservez en quelques clics'
    },
    {
      number: '2',
      title: 'On planifie ensemble',
      description: 'Un échange téléphonique pour comprendre vos attentes'
    },
    {
      number: '3',
      title: 'On capture & livre',
      description: 'Votre content creator capture tout, vous recevez vos contenus rapidement'
    }
  ];

  const faqs = [
    {
      question: 'Quelle est la différence avec un photographe ou vidéaste traditionnel ?',
      answer: 'Notre content creator se concentre sur la création de contenus modernes et partageables (stories, reels, aftermovies courts) en plus des photos classiques. C\'est un format adapté aux réseaux sociaux, livré rapidement, et à un tarif plus accessible.'
    },
    {
      question: 'Quand recevons-nous nos contenus ?',
      answer: 'Les stories et reels sont disponibles sous 48h. L\'aftermovie est livré sous 5 jours pour le Pack Complet et sous 7 jours pour le Pack Premium. Les photos sont accessibles via une galerie en ligne privée.'
    },
    {
      question: 'Peut-on offrir ce service en cadeau de mariage ?',
      answer: 'Absolument ! Nous proposons des bons cadeaux personnalisables. C\'est un cadeau original et mémorable pour les futurs mariés. Contactez-nous pour plus d\'informations.'
    },
    {
      question: 'Le content creator est-il discret pendant la cérémonie ?',
      answer: 'Oui, nos content creators sont formés pour être totalement discrets tout en capturant les meilleurs moments. Ils travaillent en harmonie avec vos autres prestataires (photographe, vidéaste).'
    },
    {
      question: 'Que se passe-t-il si nous voulons modifier notre réservation ?',
      answer: 'Vous pouvez modifier votre réservation jusqu\'à 30 jours avant la date du mariage sans frais. Au-delà, des conditions s\'appliquent selon nos CGV.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Content Creator Mariage - Captation Photo, Vidéo & Reels dès 490€ | Mariable</title>
        <meta name="description" content="Un content creator dédié à votre mariage pour des stories, reels et aftermovies mémorables. Packs à partir de 490€. Livraison rapide et service clé en main." />
        <meta name="keywords" content="content creator mariage, vidéo mariage, stories mariage, reels mariage, aftermovie, photographe mariage moderne" />
      </Helmet>

      <PremiumHeader />

      {/* Hero Section */}
      <section className="relative pb-20 px-4 bg-gradient-to-br from-premium-warm via-white to-premium-sage-very-light overflow-hidden page-content-premium">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-72 h-72 bg-premium-sage rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-wedding-gold rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-premium-sage-very-light px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-premium-sage" />
              <span className="text-sm font-medium text-premium-sage">Nouveau service exclusif</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-premium-black mb-6 leading-tight">
              Un Content Creator dédié<br />à votre mariage, dès 490€
            </h1>
            
            <p className="text-xl text-premium-charcoal/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Capturez et partagez les moments magiques de votre journée en temps réel.<br />
              Stories, reels, aftermovies : des souvenirs uniques livrés en quelques jours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                onClick={scrollToContact}
                className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Réserver maintenant
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => {
                  const packsSection = document.getElementById('packs-section');
                  packsSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="border-2 border-premium-sage text-premium-sage hover:bg-premium-sage-very-light px-8 py-6 text-lg font-semibold"
              >
                Découvrir les packs
              </Button>
            </div>

            <p className="text-sm text-premium-charcoal/60 mt-6">
              ✓ Livraison rapide • ✓ Service clé en main • ✓ Qualité professionnelle
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-premium-black mb-4">
              Pourquoi choisir un Content Creator ?
            </h2>
            <p className="text-lg text-premium-charcoal/70 max-w-2xl mx-auto">
              Une approche moderne pour immortaliser votre mariage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-premium-warm">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-premium-sage-very-light rounded-2xl flex items-center justify-center">
                    <benefit.icon className="w-8 h-8 text-premium-sage" />
                  </div>
                  <CardTitle className="text-xl font-serif text-premium-black">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-premium-charcoal/70 text-center text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Packs Section */}
      <section id="packs-section" className="py-20 px-4 bg-gradient-to-b from-premium-warm to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-premium-black mb-4">
              Nos Packs Content Creator
            </h2>
            <p className="text-lg text-premium-charcoal/70 max-w-2xl mx-auto">
              Choisissez la formule qui correspond à vos besoins
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <Card 
                key={pack.id}
                className={`relative border-2 transition-all hover:shadow-2xl ${
                  pack.popular 
                    ? 'border-premium-sage shadow-xl scale-105' 
                    : 'border-gray-200 hover:border-premium-sage-light'
                }`}
              >
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-premium-sage text-white px-6 py-1 rounded-full text-sm font-semibold">
                    Le plus populaire
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-serif text-premium-black mb-2">
                    {pack.name}
                  </CardTitle>
                  <div className="text-4xl font-bold text-premium-sage mb-3">
                    {pack.price}
                  </div>
                  <CardDescription className="text-premium-charcoal/70">
                    {pack.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pack.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-premium-sage flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-premium-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    onClick={scrollToContact}
                    className={`w-full mt-6 ${
                      pack.popular
                        ? 'bg-premium-sage hover:bg-premium-sage-dark text-white'
                        : 'bg-white border-2 border-premium-sage text-premium-sage hover:bg-premium-sage-very-light'
                    }`}
                  >
                    Réserver ce pack
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-premium-charcoal/70 mb-4">
              💝 Possibilité d'offrir en cadeau de mariage
            </p>
            <Button 
              variant="outline" 
              onClick={scrollToContact}
              className="border-premium-sage text-premium-sage hover:bg-premium-sage-very-light"
            >
              <Gift className="mr-2 w-4 h-4" />
              Offrir un bon cadeau
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-premium-black mb-4">
              Ils ont adoré leur Content Creator
            </h2>
            <p className="text-lg text-premium-charcoal/70">
              Témoignages de couples qui ont fait confiance à Mariable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-premium-warm to-white">
                <CardHeader>
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-wedding-gold text-wedding-gold" />
                    ))}
                  </div>
                  <CardDescription className="text-premium-charcoal leading-relaxed text-base italic">
                    "{testimonial.text}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-premium-sage-light rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-premium-sage" />
                    </div>
                    <div>
                      <p className="font-semibold text-premium-black">{testimonial.name}</p>
                      <p className="text-sm text-premium-charcoal/60">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-premium-warm to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-premium-black mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-premium-charcoal/70">
              Un processus simple en 3 étapes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-premium-sage to-premium-sage-dark rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-premium-sage-light" />
                  )}
                </div>
                <h3 className="text-2xl font-serif font-bold text-premium-black mb-3">
                  {step.title}
                </h3>
                <p className="text-premium-charcoal/70 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg"
              onClick={scrollToContact}
              className="bg-premium-sage hover:bg-premium-sage-dark text-white px-8 py-6 text-lg font-semibold shadow-lg"
            >
              Commencer maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-premium-black mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-premium-charcoal/70">
              Tout ce que vous devez savoir sur notre service
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 hover:border-premium-sage transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold text-premium-black hover:text-premium-sage">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-premium-charcoal/70 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact-section" className="py-20 px-4 bg-gradient-to-br from-premium-sage to-premium-sage-dark text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Prêts à capturer les moments magiques<br />de votre mariage ?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Réservez votre Content Creator dès maintenant et recevez vos contenus en quelques jours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/contact'}
              className="bg-white text-premium-sage hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
            >
              Réserver maintenant
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/contact'}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-semibold"
            >
              <Calendar className="mr-2 w-5 h-5" />
              Demander un devis
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Réponse sous 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Sans engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContentCreatorMariage;
