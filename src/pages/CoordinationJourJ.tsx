import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Calendar, Clock, Users, CheckCircle, Star, ArrowRight, Shield, Heart, Sparkles, FileText, Phone, MapPin, Target, DollarSign, Settings, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const CoordinationJourJ: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  const features = [{
    title: 'Planning détaillé heure par heure',
    description: 'Timeline précise de votre journée avec tous les moments clés',
    icon: <Clock className="h-6 w-6" />
  }, {
    title: 'Gestion de votre équipe',
    description: 'Coordonnez tous vos prestataires et témoins en un seul endroit',
    icon: <Users className="h-6 w-6" />
  }, {
    title: 'Documents centralisés',
    description: 'Tous vos contrats et informations importantes accessibles',
    icon: <FileText className="h-6 w-6" />
  }, {
    title: 'Communication simplifiée',
    description: 'Contact direct avec votre équipe et partage du planning',
    icon: <Phone className="h-6 w-6" />
  }, {
    title: 'Pense-bête personnel',
    description: 'Notez toutes vos idées et choses à ne pas oublier',
    icon: <CheckCircle className="h-6 w-6" />
  }, {
    title: 'Conseils d\'experts',
    description: 'Accès aux meilleures pratiques pour réussir votre jour J',
    icon: <Star className="h-6 w-6" />
  }];
  const benefits = [{
    title: 'Sérénité garantie',
    description: 'Plus de stress, tout est organisé et sous contrôle',
    icon: <Shield className="h-6 w-6" />,
    color: 'text-green-600'
  }, {
    title: 'Jour parfait',
    description: 'Chaque moment est pensé pour créer des souvenirs magiques',
    icon: <Heart className="h-6 w-6" />,
    color: 'text-pink-600'
  }, {
    title: 'Équipe synchronisée',
    description: 'Tous vos prestataires travaillent en harmonie',
    icon: <Users className="h-6 w-6" />,
    color: 'text-blue-600'
  }];
  const testimonials = [{
    text: "Grâce à Mon Jour J, notre mariage s'est déroulé comme dans un rêve. Tout était parfaitement orchestré !",
    author: "Claire & Thomas",
    location: "Mariage en Loire-Atlantique"
  }, {
    text: "L'outil de coordination nous a sauvé la vie. Plus aucun stress le jour J, tout était sous contrôle.",
    author: "Marie & Julien",
    location: "Mariage en Bretagne"
  }];

  // Schema.org structured data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Coordination Jour J - Mon Jour J Mariable",
    "description": "Service de coordination complète pour organiser votre jour de mariage parfait. Planning détaillé, gestion d'équipe et suivi personnalisé.",
    "provider": {
      "@type": "Organization",
      "name": "Mariable",
      "url": "https://www.mariable.fr",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "FR"
      }
    },
    "areaServed": "France",
    "serviceType": "Coordination de mariage",
    "offers": {
      "@type": "Offer",
      "description": "Service Mon Jour J - Coordination complète",
      "priceCurrency": "EUR"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Services Mon Jour J",
      "itemListElement": features.map((feature, index) => ({
        "@type": "Offer",
        "position": index + 1,
        "itemOffered": {
          "@type": "Service",
          "name": feature.title,
          "description": feature.description
        }
      }))
    }
  };
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Mariable",
    "description": "Plateforme de coordination de mariage en France",
    "url": "https://www.mariable.fr",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "FR"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "France"
    },
    "priceRange": "€€"
  };
  return <>
      <Helmet>
        <title>Coordination Jour J | Service Mon Jour J Mariable</title>
        <meta name="description" content="Service de coordination complète pour votre jour de mariage. Planning détaillé, gestion d'équipe, documents centralisés. Vivez votre mariage en toute sérénité avec Mon Jour J." />
        <meta name="keywords" content="coordination jour j, planning mariage, organisation jour mariage, coordination mariage france, mon jour j mariable, wedding planner jour j" />
        <meta property="og:title" content="Coordination Jour J | Service Mon Jour J Mariable" />
        <meta property="og:description" content="Vivez votre mariage en toute sérénité avec notre service de coordination complète Mon Jour J." />
        <link rel="canonical" href="https://www.mariable.fr/coordination-jour-j" />
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>

      <PremiumHeader />

      <main className="min-h-screen bg-gradient-to-b from-white to-wedding-cream/20 page-content-premium">
        {/* Back to home button and price badge */}
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-start mb-4">
              <Link to="/">
                <Button variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à l'accueil
                </Button>
              </Link>
              <Badge variant="secondary" className="bg-wedding-olive text-white text-lg px-4 py-2">
                39€
              </Badge>
            </div>
          </div>
        </section>

        {/* Differentiation Section */}
        <section className="py-8 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h1 style={{
              fontFamily: 'Playfair Display, serif'
            }} className="text-3xl md:text-4xl font-serif text-black mb-4 max-w-4xl mx-auto">
                La première appli de coordination jour-J
                <span className="block text-lg font-normal text-wedding-olive mt-2">
                  sans téléchargement - directement en ligne
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-wedding-olive font-medium mt-4">
                Plus rapide, plus simple, moins cher
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 md:py-16 bg-gray-50 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-black mb-6">
                Comment ça marche ?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-8">
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                <h3 className="font-medium mb-2">Créez votre équipe</h3>
                <p className="text-gray-700 text-sm">proches & prestataires</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                <h3 className="font-medium mb-2">Générez votre déroulé</h3>
                <p className="text-gray-700 text-sm">du Jour J</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                <h3 className="font-medium mb-2">Assignez des tâches</h3>
                <p className="text-gray-700 text-sm">à chaque membre</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                <h3 className="font-medium mb-2">Ajoutez vos documents</h3>
                <p className="text-gray-700 text-sm">plan de table, moodboard, etc.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-wedding-olive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">5</div>
                <h3 className="font-medium mb-2">Partagez le tout</h3>
                <p className="text-gray-700 text-sm">via un simple lien</p>
              </div>
            </div>

            <div className="text-center mb-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => document.getElementById('video-demo')?.scrollIntoView({ behavior: 'smooth' })} size="lg" variant="outline" className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10">
                Voir la démo
              </Button>
              <Button onClick={() => navigate(user ? '/dashboard' : '/auth')} size="lg" className="bg-wedding-olive hover:bg-wedding-olive/90 text-white">
                Utiliser l'appli
              </Button>
            </div>

            <p className="text-center text-lg italic text-gray-700 max-w-3xl mx-auto">
              Mariable, c'est l'outil unique qui permet à vos proches et prestataires de gérer le Jour J avec ou sans vous :-)
            </p>
          </div>
        </section>

        {/* Video Demo Section */}
        <section id="video-demo" className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-8 text-wedding-black">
              Découvrez Mon Jour J en action
            </h2>
            <div className="bg-gray-100 rounded-lg p-4 aspect-video mb-8">
              <iframe src="https://www.loom.com/embed/a0d0d52de99d4af59d67604f01c8af14?sid=a3c17f33-22ba-42a2-a046-8c73a657565f" frameBorder="0" allowFullScreen className="w-full h-full rounded-lg" title="Démonstration Mon Jour J"></iframe>
            </div>
            <div className="text-center">
              <Button onClick={() => navigate('/dashboard')} className="bg-wedding-olive text-white hover:bg-wedding-olive/90 px-8 py-3">
                Découvrir l'outil, payer plus tard
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 px-4 bg-wedding-olive/5">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-serif text-center mb-12 text-wedding-black">
              Ils nous font confiance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-2 mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
                    <div>
                      <p className="font-medium text-wedding-black">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {testimonial.location}
                      </p>
                    </div>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4 bg-wedding-olive text-white">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-6">
              Réservez votre coordination Mon Jour J
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Vivez votre mariage en toute sérénité. Notre équipe s'occupe de tout pour que vous puissiez profiter pleinement de votre jour parfait.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/reservation-jour-m')} className="bg-white text-wedding-olive hover:bg-gray-100 px-8 py-3">
                Réserver maintenant
              </Button>
              <Button onClick={() => navigate('/prix')} className="bg-wedding-olive/20 text-white hover:bg-wedding-olive/30 border border-white/20 px-8 py-3">
                Voir les tarifs
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>;
};
export default CoordinationJourJ;