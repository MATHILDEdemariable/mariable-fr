
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout, Calendar, Calculator, Briefcase, Folder, ArrowRight, CheckCircle, XCircle, HelpCircle, Users, Clock, DollarSign } from 'lucide-react';
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
    <span className={`${isComplete ? "" : "border-r-2 border-white"}`}>
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

  useEffect(() => {
    window.scrollTo(0, 0);
    setShowAnimation(true);
  }, []);

  const handleCTAClick = () => {
    navigate('/register');
  };

  // Données pour les différentes sections
  const benefits = [
    {
      icon: Users,
      title: "Service Personnalisé & Premium",
      description: "Une expérience sur mesure adaptée à vos besoins et vos préférences pour un mariage unique."
    },
    {
      icon: Clock,
      title: "Simple: Gain de temps & Efficacité",
      description: "Des outils intuitifs qui simplifient l'organisation et vous font gagner des heures précieuses."
    },
    {
      icon: DollarSign,
      title: "Service 100% Gratuit",
      description: "Accédez à tous nos outils et notre réseau de prestataires sans aucun frais supplémentaire."
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Mariable - Assistant virtuel pour l'organisation de votre mariage</title>
        <meta name="description" content="Organisez votre mariage sans stress avec Mariable, l'assistant virtuel qui s'occupe de tout." />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Section 1: Hero Section - Simplified */}
        <section className="relative py-16 md:py-24 bg-wedding-black text-white">
          <div className="absolute inset-0 opacity-40 overflow-hidden">
            <img
              src="/lovable-uploads/9b1d88ec-ed12-4818-ba94-bf11f036a875.png"
              alt="Couple de mariés"
              className="absolute min-w-full min-h-full object-cover object-center"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-8 md:mb-10 font-bold">
              {showAnimation ? (
                <TypewriterEffect text="Faciliter l'organisation de votre mariage" />
              ) : (
                "Faciliter l'organisation de votre mariage"
              )}
            </h1>
            <Button 
              variant="wedding" 
              size={isMobile ? "default" : "lg"}
              onClick={handleCTAClick}
              className="shadow-lg hover:shadow-xl transition-all"
            >
              Je découvre Mariable
            </Button>
          </div>
        </section>

        {/* Section Nouvelle: Premier assistant virtuel */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-3 text-center">
              Le premier assistant virtuel à la planification de mariage
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Mariable révolutionne l'organisation de votre mariage avec des services pensés pour vous
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {benefits.map((benefit, index) => (
                <BenefitCard 
                  key={index}
                  icon={benefit.icon}
                  title={benefit.title}
                  description={benefit.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Pourquoi Mariable - Modified without green backgrounds */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Pourquoi Mariable ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
              <StatCard 
                number="200+" 
                text="heures nécessaires pour organiser un mariage" 
                subtext="C'est 14 aller-retours Paris-New York en avion"
              />
              <StatCard 
                number="77%" 
                text="des couples ont vécu des tensions liées à l'organisation"
              />
              <StatCard 
                number="1 sur 2" 
                text="couples trouve difficile de trouver les prestataires adéquats"
              />
            </div>
            <div className="text-center">
              <Button 
                variant="outline" 
                className="border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10"
                onClick={handleCTAClick}
              >
                Ne vous perdez plus dans un flot d'informations — Mariable centralise tout pour vous
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Section 3: Ce que vous allez adorer - Modified to table format */}
        <section className="py-16 bg-wedding-light">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Ce que vous allez adorer
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-medium">Fonctionnalité</TableHead>
                      <TableHead>Description</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {features.map((feature, index) => (
                      <TableRow key={index}>
                        <TableCell className="p-4">
                          <div className="w-10 h-10 bg-wedding-olive/10 rounded-full flex items-center justify-center">
                            <feature.icon className="h-5 w-5 text-wedding-olive" />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{feature.name}</TableCell>
                        <TableCell>{feature.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Témoignages */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-3 text-center">
              Pourquoi nos utilisateurs nous adorent
            </h2>
            <p className="text-center text-muted-foreground mb-10 max-w-xl mx-auto">
              Ils ont choisi Mariable pour organiser leur jour J
            </p>
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

        {/* Section 5: CTA */}
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
              Créez un compte dès maintenant
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
