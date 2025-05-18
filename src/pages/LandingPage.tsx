
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Layout, Calendar, Calculator, Briefcase, Folder, ArrowRight, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
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

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md">
    <div className="w-12 h-12 bg-wedding-olive/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-6 w-6 text-wedding-olive" />
    </div>
    <h3 className="font-serif text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
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
  <div className="bg-wedding-light p-5 rounded-lg text-center">
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
  const features = [
    {
      icon: Layout,
      title: "Tableau de bord",
      description: "Une vue d'ensemble intuitive pour suivre toutes les étapes de votre mariage."
    },
    {
      icon: Calendar,
      title: "Planning personnalisé",
      description: "Un calendrier sur-mesure adapté à votre style, date et besoins spécifiques."
    },
    {
      icon: Calculator,
      title: "Budget estimatif en un clic",
      description: "Créez et gérez facilement votre budget avec des estimations précises."
    },
    {
      icon: Briefcase,
      title: "Choix de prestataires",
      description: "Accédez à une sélection rigoureuse de professionnels à votre écoute."
    },
    {
      icon: Folder,
      title: "Gestion Centralisée",
      description: "Toutes vos réservations et informations regroupées en un seul endroit."
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
        {/* Section 1: Hero Section */}
        <section className="relative py-16 md:py-24 bg-wedding-black text-white">
          <div className="absolute inset-0 opacity-40 overflow-hidden">
            <img
              src="/lovable-uploads/9b1d88ec-ed12-4818-ba94-bf11f036a875.png"
              alt="Couple de mariés"
              className="absolute min-w-full min-h-full object-cover object-center"
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-4 md:mb-6">
              {showAnimation ? (
                <TypewriterEffect text="Faciliter l'organisation de votre mariage" />
              ) : (
                "Faciliter l'organisation de votre mariage"
              )}
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-serif max-w-3xl mx-auto">
              Le premier assistant virtuel pour planifier votre mariage et vivre une organisation simple, rapide et agréable
            </p>
            <p className="mb-8 text-white/80 max-w-xl mx-auto">
              Gagnez du temps, économisez de l'énergie, profitez pleinement de vos préparatifs.
            </p>
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

        {/* Section 2: Pourquoi Mariable */}
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

        {/* Section 3: Ce que vous allez adorer */}
        <section className="py-16 bg-wedding-light">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-serif mb-10 text-center">
              Ce que vous allez adorer
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index} 
                  icon={feature.icon} 
                  title={feature.title} 
                  description={feature.description} 
                />
              ))}
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
