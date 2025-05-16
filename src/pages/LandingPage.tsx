
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Check, Layout, Calendar, DollarSign, Users, MessageCircle, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useIsMobile } from '@/hooks/use-mobile';

// Composant pour l'effet machine à écrire du CTA
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

const LandingPage = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showTypewriter, setShowTypewriter] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCTAClick = () => {
    navigate('/register');
  };

  // Effet pour démarrer l'animation du bouton lors du survol
  const handleButtonHover = () => {
    setShowTypewriter(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Helmet>
        <title>Mariable - Assistant virtuel pour l'organisation de votre mariage</title>
        <meta name="description" content="Organisez votre mariage sans stress avec Mariable, l'assistant virtuel qui s'occupe de tout." />
      </Helmet>

      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-14 md:py-20 bg-white">
          <div className="absolute inset-0 opacity-10 overflow-hidden z-0">
            <img
              src="/lovable-uploads/9b1d88ec-ed12-4818-ba94-bf11f036a875.png"
              alt="Couple de mariés"
              className="absolute min-w-full min-h-full object-cover object-center"
            />
          </div>
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-4 md:mb-6 text-wedding-black">
              Mariez-vous sans stress. <br className="hidden sm:block" />
              <span className="text-wedding-olive">Mariable s'occupe de tout.</span>
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 max-w-2xl mx-auto text-wedding-black/80">
              Le premier assistant virtuel pour planifier votre mariage et vivre une organisation simple, rapide et agréable
            </p>
            <p className="text-sm md:text-base mb-8 max-w-xl mx-auto text-wedding-black/70">
              Respirez. Mariable est là pour transformer votre to-do-list infinie en un plan clair et personnalisé.
              Adieu la complexité ou les conflits avec votre moitié.
            </p>
            <Button 
              variant="wedding" 
              size={isMobile ? "default" : "lg"}
              onClick={handleCTAClick}
              onMouseEnter={handleButtonHover}
              className="transition-all duration-300 hover:scale-105 shadow-lg"
            >
              {showTypewriter ? <TypewriterEffect text="Je découvre Mariable !" /> : "Je découvre Mariable !"}
            </Button>
          </div>
        </section>

        {/* Features Section - Changé en blanc */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-8 text-center text-wedding-black">
              Pourquoi choisir Mariable ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-3 p-4">
                <div className="mt-1 flex-shrink-0">
                  <Check className="h-5 w-5 text-wedding-olive" />
                </div>
                <div>
                  <p className="font-medium text-wedding-black">Gagnez du temps</p>
                  <p className="text-sm text-wedding-black/70">Planning intelligent, centralisation des démarches, tout en un seul clic.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4">
                <div className="mt-1 flex-shrink-0">
                  <Check className="h-5 w-5 text-wedding-olive" />
                </div>
                <div>
                  <p className="font-medium text-wedding-black">Simplifiez vos décisions</p>
                  <p className="text-sm text-wedding-black/70">Sélection rapide de prestataires fiables adaptés à VOTRE style.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4">
                <div className="mt-1 flex-shrink-0">
                  <Check className="h-5 w-5 text-wedding-olive" />
                </div>
                <div>
                  <p className="font-medium text-wedding-black">Soyez soutenus à chaque instant</p>
                  <p className="text-sm text-wedding-black/70">Dispo 24/7, même pour vos petites angoisses à 2h du mat.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4">
                <div className="mt-1 flex-shrink-0">
                  <Check className="h-5 w-5 text-wedding-olive" />
                </div>
                <div>
                  <p className="font-medium text-wedding-black">Économisez les services d'un wedding planner</p>
                  <p className="text-sm text-wedding-black/70">Tous les avantages sans le budget conséquent.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Application Overview Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-3 md:mb-5 text-center text-wedding-black">
              Votre tableau de bord, votre nouveau meilleur ami
            </h2>
            <p className="text-center text-wedding-black/80 mb-8 max-w-xl mx-auto">
              Tout ce dont vous rêviez, sans le savoir. Mariable est:
            </p>

            <div className="overflow-auto max-w-4xl mx-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3 font-serif text-wedding-black">Fonction</TableHead>
                    <TableHead className="font-serif text-wedding-black">Ce que ça vous apporte</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Layout size={16} className="text-wedding-olive" />
                        Tableau de bord
                      </div>
                    </TableCell>
                    <TableCell>Une vue claire de tout votre mariage, en un clin d'œil.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-wedding-olive" />
                        Planning dynamique
                      </div>
                    </TableCell>
                    <TableCell>Votre calendrier qui anticipe pour vous.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-wedding-olive" />
                        Suivi du budget
                      </div>
                    </TableCell>
                    <TableCell>Chaque dépense sous contrôle, sans effort.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-wedding-olive" />
                        Choix de prestataires
                      </div>
                    </TableCell>
                    <TableCell>Des recommandations fiables, testées et approuvées.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} className="text-wedding-olive" />
                        Outils collaboratifs
                      </div>
                    </TableCell>
                    <TableCell>Planifiez à deux (ou avec la belle-mère) sans crises de nerfs.</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Image size={16} className="text-wedding-olive" />
                        Visio & Moodboard
                      </div>
                    </TableCell>
                    <TableCell>Brainstormez, rêvez et choisissez visuellement.</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            
            <p className="text-center text-wedding-black/70 mt-6 max-w-xl mx-auto text-sm">
              Tout est pensé pour rendre l'organisation aussi fluide qu'un slow sur votre chanson préférée.
            </p>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="py-12 md:py-16 bg-wedding-light">
          <div className="container mx-auto px-4">
            <h3 className="text-lg md:text-xl lg:text-2xl font-serif mb-8 text-center text-wedding-black">
              Ce qu'en pensent ceux qui ont sauté le pas
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card className="border-wedding-olive/20 shadow-sm">
                <CardContent className="pt-6">
                  <p className="italic text-wedding-black/80 mb-4">
                    « On a planifié notre mariage sans stress et avec un mois d'avance ! »
                  </p>
                  <p className="font-medium text-right text-wedding-olive">— Léa & Victor</p>
                </CardContent>
              </Card>
              
              <Card className="border-wedding-olive/20 shadow-sm">
                <CardContent className="pt-6">
                  <p className="italic text-wedding-black/80 mb-4">
                    « Mariable a été notre filet de sécurité : zéro oubli, zéro prise de tête. »
                  </p>
                  <p className="font-medium text-right text-wedding-olive">— Camille & Hugo</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call To Action Section - Changé en blanc */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif mb-4 text-wedding-black">
              Lancez-vous aujourd'hui. Votre futur vous dira merci.
            </h2>
            
            <p className="text-wedding-black/80 font-medium mb-6 max-w-xl mx-auto">
              ✨ Inscription gratuite en 2 minutes pour 100% de sérénité.
            </p>
            
            <Button 
              variant="wedding" 
              size={isMobile ? "default" : "lg"}
              onClick={handleCTAClick}
              className="shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Organisez votre mariage facilement & sans stress
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
