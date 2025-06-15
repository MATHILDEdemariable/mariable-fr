import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout, Calendar, Calculator, Briefcase, Folder, ArrowRight, CheckCircle, XCircle, HelpCircle, Users, Clock, DollarSign, Wine, Calendar as CalendarIcon, Star, Shield, Award, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

// Composant pour l'effet machine à écrire du titre principal
const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text]);

  return (
    <span className={`${isComplete ? "" : "border-r-2 border-wedding-black"}`}>
      {displayText}
    </span>
  );
};

const BenefitCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow text-center">
    <div className="w-14 h-14 bg-wedding-olive/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-7 w-7 text-wedding-olive" />
    </div>
    <h3 className="font-serif text-xl font-medium mb-3">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, content, imageSrc }: { name: string, role: string, content: string, imageSrc?: string }) => (
  <Card className="overflow-hidden border-wedding-olive/10">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        {imageSrc && (
          <div className="flex-shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-wedding-light">
              <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div>
          <p className="text-sm italic mb-3">"{content}"</p>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const StatCard = ({ number, text, subtext }: { number: string, text: string, subtext?: string }) => (
  <div className="p-5 rounded-lg border border-gray-200 text-center">
    <p className="text-3xl sm:text-4xl font-serif text-wedding-olive mb-1">{number}</p>
    <p className="font-medium text-sm">{text}</p>
    {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showAnimation, setShowAnimation] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowAnimation(true);

    // Check authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleCTAClick = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  // Updated benefits for Mariable experience with icons
  const mariableExperience = [
    {
      title: "Personnalisé",
      description: "Une expérience sur mesure adaptée à vos besoins et vos préférences pour un mariage unique.",
      icon: Heart
    },
    {
      title: "Maîtrisé",
      description: "Des outils et une méthode éprouvée pour garder le contrôle de votre organisation.",
      icon: Shield
    },
    {
      title: "Premium",
      description: "Accès exclusif à une sélection de prestataires d'excellence rigoureusement choisis.",
      icon: Award
    },
    {
      title: "Simple",
      description: "Des outils intuitifs qui simplifient l'organisation et vous font gagner des heures précieuses.",
      icon: Zap
    },
    {
      title: "Au meilleur rapport qualité-prix",
      description: "Bénéficiez de tarifs préférentiels et d'un service complet sans frais cachés.",
      icon: Star
    }
  ];
  
  const features = [
    {
      name: "Tableau de bord",
      description: "Vue d'ensemble intuitive pour suivre les étapes de votre mariage",
      icon: Layout
    },
    {
      name: "Planning Personnalisé",
      description: "Calendrier sur-mesure adapté à votre style et vos besoins",
      icon: Calendar
    },
    {
      name: "Budget Estimatif",
      description: "Création et gestion facile de votre budget avec estimations précises",
      icon: Calculator
    },
    {
      name: "Sélection Prestataires",
      description: "Accès à des professionnels rigoureusement sélectionnés",
      icon: Briefcase
    },
    {
      name: "Gestion Centralisée",
      description: "Toutes vos informations regroupées en un seul endroit",
      icon: Folder
    },
    {
      name: "Calculatrice de Boissons",
      description: "Estimez facilement les quantités nécessaires pour votre réception",
      icon: Wine
    },
    {
      name: "Coordination Jour-J",
      description: "Organisation détaillée et timing précis pour le jour de votre mariage",
      icon: CalendarIcon
    }
  ];

  const testimonials = [
    {
      name: "Sophie & Thomas",
      role: "Mariés en Juin 2023",
      content: "Mariable a transformé notre expérience d'organisation. Fini le stress et les tableaux Excel interminables!",
      imageSrc: "/lovable-uploads/99fde439-7310-4090-9478-8c9244627554.png"
    },
    {
      name: "Marie & Jean",
      role: "Mariés en Septembre 2023",
      content: "Nous avons trouvé des prestataires extraordinaires qui correspondaient parfaitement à nos attentes et notre budget.",
      imageSrc: "/lovable-uploads/977ff726-5f78-4cbc-bf10-dbf0bbd10ab7.png"
    },
    {
      name: "Lucie & David",
      role: "Mariés en Mai 2024",
      content: "Le planning personnalisé nous a guidés pas à pas. Je ne sais pas comment nous aurions fait sans Mariable.",
      imageSrc: "/lovable-uploads/9f8c319a-9a98-4d4c-a886-79f9986a7dcd.png"
    }
  ];

  const faqItems = [
    {
      question: "Comment fonctionne le dashboard utilisateur?",
      answer: "Notre tableau de bord centralise toutes les informations essentielles pour votre mariage : planning personnalisé, budget, liste de tâches, et préstataires sélectionnés. Il est intuitif et accessible 24/7 depuis n'importe quel appareil."
    },
    {
      question: "Comment contacter un prestataire ?",
      answer: "Vous pouvez contacter directement les prestataires depuis votre tableau de bord ou via la page de recherche de prestataires. Un système de messagerie intégré vous permet d'échanger facilement avec eux et de conserver l'historique de vos conversations."
    },
    {
      question: "Comment obtenir de l'aide personnalisé ?",
      answer: "Notre équipe d'assistance est disponible par chat, email et téléphone pour répondre à toutes vos questions. Vous pouvez également accéder à nos guides détaillés et à notre assistant virtuel qui vous aidera à chaque étape de l'organisation de votre mariage."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEO
        title="Mariable - Assistant virtuel pour l'organisation de votre mariage"
        description="Organisez votre mariage sans stress avec Mariable, l'assistant virtuel qui s'occupe de tout."
      >
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </SEO>

      <Header />

      <main className="flex-grow">
        {/* Section 1: Hero Section */}
        <section className="relative py-16 md:py-20 bg-cover bg-center bg-no-repeat min-h-[60vh] md:min-h-[70vh] flex items-center" 
          style={{ backgroundImage: "url('/lovable-uploads/9b1d88ec-ed12-4818-ba94-bf11f036a875.png')" }}>
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-xl mx-auto md:mx-0">
              <div className="text-center md:text-left text-white">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 font-bold">
                  {showAnimation ? (
                    <TypewriterEffect text="Faciliter l'organisation de votre mariage" />
                  ) : (
                    "Faciliter l'organisation de votre mariage"
                  )}
                </h1>
                <p className="mb-8 text-lg text-white/90">
                  avec une solution complète
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                  <Button 
                    variant="wedding" 
                    size={isMobile ? "default" : "lg"}
                    onClick={handleCTAClick}
                    className="shadow-lg hover:shadow-xl transition-all"
                  >
                    Découvrir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Avec Mariable, l'organisation reste une joie - Fixed Layout */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-3 text-center">
              Avec Mariable, l'organisation reste une joie
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
              Vous êtes les mieux placés pour organiser votre mariage. Mais on ne s'improvise pas chef de projet événementiel du jour au lendemain. Avec Mariable, vous organisez votre mariage plus simplement. C'est votre première fois, mais pas la nôtre. Mariable simplifie tout, pour que vous profitiez de l'essentiel.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Aide à la planification - Fixed height and button alignment */}
              <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col min-h-[280px]">
                <h3 className="text-xl font-serif mb-4 text-wedding-olive">Aide à la planification</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Un accompagnement complet de la conception à la réalisation de votre mariage, avec des outils personnalisés et une méthode éprouvée.
                </p>
                <Button 
                  variant="wedding" 
                  className="w-full mt-auto"
                  onClick={() => navigate('/services/planification')}
                >
                  Découvrir nos outils de planification
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>

              {/* Le guide Mariable - Fixed height and button alignment */}
              <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col min-h-[280px]">
                <h3 className="text-xl font-serif mb-4 text-wedding-olive">Le guide Mariable</h3>
                <p className="text-muted-foreground mb-6 flex-grow">
                  Une sélection rigoureuse de prestataires premium, testés et approuvés pour garantir la qualité de votre mariage.
                </p>
                <Button 
                  variant="wedding" 
                  className="w-full mt-auto"
                  onClick={() => navigate('/guide-mariable')}
                >
                  Accéder au guide Mariable
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Ce que vous allez adorer - Table Layout */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Ce que vous allez adorer
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-lg p-6 border">
                <div className="grid grid-cols-1 gap-0">
                  {/* Header Row */}
                  <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-gray-200">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Expérience
                    </div>
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Avantage
                    </div>
                  </div>
                  
                  {/* Content Rows */}
                  {mariableExperience.map((item, index) => (
                    <div key={index} className="grid grid-cols-2 gap-4 py-4 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-wedding-olive/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-4 w-4 text-wedding-olive" />
                        </div>
                        <span className="font-medium text-wedding-olive">{item.title}</span>
                      </div>
                      <div className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Témoignages - Updated title */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Ils ont choisi Mariable
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard 
                  key={index} 
                  name={testimonial.name} 
                  role={testimonial.role} 
                  content={testimonial.content} 
                  imageSrc={testimonial.imageSrc} 
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 5: CTA - Changed to solid wedding-olive background without image */}
        <section className="py-16 bg-wedding-olive text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif mb-4">
              Organisez votre mariage facilement & sans stress
            </h2>
            <p className="mb-8 max-w-xl mx-auto">
              Accédez gratuitement à des outils puissants et une sélection de prestataires d'excellence.
            </p>
            <Button 
              className="bg-white text-wedding-olive hover:bg-white/90 shadow-lg hover:shadow-xl transition-all"
              size={isMobile ? "default" : "lg"}
              onClick={handleCTAClick}
            >
              {isLoggedIn ? "Accéder à mon tableau de bord" : "Créez un compte dès maintenant"}
            </Button>
          </div>
        </section>

        {/* Section 6: FAQ */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Vos questions, nos réponses
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent>{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
