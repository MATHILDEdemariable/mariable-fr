
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  Wine, 
  Check, 
  DollarSign, 
  Heart, 
  ChevronRight, 
  Bot, 
  Briefcase,
  FileCheck,
  MessageSquare,
  FileText,
  Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import TasksList from './TasksList';
import BudgetSummary from './BudgetSummary';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';

const ProjectSummary = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const [weddingDate, setWeddingDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState<string>("100");
  const isMobile = useIsMobile();
  
  // Calculer le nombre de jours restants jusqu'au mariage
  const daysUntilWedding = weddingDate ? Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  // Étapes du parcours utilisateur
  const userJourneySteps = [
    {
      icon: <Calendar className="h-8 w-8 text-wedding-olive" />,
      title: "Accès au tableau de bord",
      description: "Personnalisez votre expérience",
      link: "/dashboard",
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-wedding-olive" />,
      title: "Questionner l'assistant virtuel",
      description: "Conseils sur mesure",
      link: "/assistant-v2",
    },
    {
      icon: <FileCheck className="h-8 w-8 text-wedding-olive" />,
      title: "Obtenez un planning personnalisé",
      description: "Organisation complète",
      link: "/planning-personnalise",
    },
    {
      icon: <FileText className="h-8 w-8 text-wedding-olive" />,
      title: "Parcourir notre guide de prestataires",
      description: "Services vérifiés",
      link: "/recherche",
    },
    {
      icon: <Calendar className="h-8 w-8 text-wedding-olive" />,
      title: "Obtenez votre déroulé du jour-J personnalisé",
      description: "Planning détaillé",
      link: "/dashboard/coordination",
    },
    {
      icon: <Phone className="h-8 w-8 text-wedding-olive" />,
      title: "Réjoignez la communauté WhatsApp",
      description: "Entraide entre futurs mariés",
      link: "https://chat.whatsapp.com/FXWrEnOVBxz7xz2yMPnuVo",
      external: true
    },
  ];
  
  return (
    <div className="space-y-8">
      {/* En-tête dynamique avec bienvenue et informations */}
      <div className="bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/30 p-6 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-serif text-wedding-olive">Bonjour & bienvenue dans l'univers Mariable</h1>
            <p className="text-gray-600 mt-1">{formattedDate}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-wedding-olive" />
                  {weddingDate ? format(weddingDate, 'dd/MM/yyyy') : 'Date du mariage'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={weddingDate}
                  onSelect={setWeddingDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-2 border rounded-md p-2">
              <Users className="h-4 w-4 text-wedding-olive" />
              <Input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                className="w-24 border-none p-0 focus-visible:ring-0"
                placeholder="Invités"
              />
              <span className="text-sm text-gray-500">invités</span>
            </div>
          </div>
        </div>
        
        {/* Affichage des jours restants si une date est sélectionnée */}
        {daysUntilWedding !== null && (
          <div className="mt-2 bg-white/60 p-3 rounded-md inline-block">
            <p className="font-medium">
              {daysUntilWedding > 0 ? (
                <span className="text-wedding-olive">Plus que <span className="text-xl">{daysUntilWedding}</span> jours avant votre grand jour !</span>
              ) : daysUntilWedding === 0 ? (
                <span className="text-pink-600 font-bold">C'est aujourd'hui ! Félicitations pour votre mariage !</span>
              ) : (
                <span className="text-wedding-olive">Félicitations pour votre mariage qui a eu lieu il y a {Math.abs(daysUntilWedding)} jours !</span>
              )}
            </p>
          </div>
        )}
      </div>
      
      {/* Section explicative du dashboard */}
      <section className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-medium mb-3 text-wedding-olive">Comment utiliser votre tableau de bord</h2>
        <p className="text-gray-600">
          Découvrez comment tirer le meilleur parti de votre tableau de bord Mariable. Suivez ces étapes pour planifier votre mariage sans stress et accéder à tous nos outils.
        </p>
      </section>
      
      {/* Parcours utilisateur - version mobile avec carousel */}
      {isMobile ? (
        <div className="relative">
          <h2 className="text-xl font-serif text-wedding-olive mb-4">Les étapes de l'onboarding</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {userJourneySteps.map((step, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 basis-4/5 md:basis-1/3">
                  <Card className="h-52">
                    <CardHeader className="pb-2">
                      <div className="flex justify-center mb-2">{step.icon}</div>
                      <CardTitle className="text-center text-base">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center text-sm text-muted-foreground">
                      {step.description}
                    </CardContent>
                    <CardFooter className="flex justify-center pt-0 mt-auto">
                      <Button 
                        asChild
                        variant="ghost" 
                        className="w-full text-wedding-olive hover:text-wedding-olive/90 hover:bg-wedding-olive/5"
                      >
                        {step.external ? (
                          <a href={step.link} target="_blank" rel="noopener noreferrer">
                            Découvrir <ChevronRight className="h-4 w-4 ml-1" />
                          </a>
                        ) : (
                          <Link to={step.link}>
                            Découvrir <ChevronRight className="h-4 w-4 ml-1" />
                          </Link>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      ) : (
        /* Parcours utilisateur - version desktop avec grid */
        <div>
          <h2 className="text-xl font-serif text-wedding-olive mb-4">Les étapes de l'onboarding</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-6xl mx-auto">
            {userJourneySteps.map((step, index) => (
              <Card key={index} className={`relative ${index < userJourneySteps.length - 1 ? "after:content-[''] after:hidden md:after:block after:absolute after:top-1/2 after:-right-4 after:w-4 after:h-0.5 after:bg-wedding-olive/30 after:-translate-y-1/2" : ""}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">{step.icon}</div>
                  <CardTitle className="text-center text-sm">{step.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-xs text-muted-foreground">
                  {step.description}
                </CardContent>
                <CardFooter className="flex justify-center pt-0">
                  <Button 
                    asChild
                    variant="ghost" 
                    size="sm"
                    className="w-full text-wedding-olive hover:text-wedding-olive/90 hover:bg-wedding-olive/5"
                  >
                    {step.external ? (
                      <a href={step.link} target="_blank" rel="noopener noreferrer">
                        Découvrir
                      </a>
                    ) : (
                      <Link to={step.link}>
                        Découvrir
                      </Link>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Bloc de rappel des autres fonctionnalités */}
      <section className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h2 className="text-lg font-medium mb-3 text-wedding-olive">D'autres fonctionnalités pour vous aider</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Wine className="h-5 w-5 text-wedding-olive" />
              <h3 className="font-medium">Calculatrice boissons</h3>
            </div>
            <p className="text-sm text-gray-600">Estimez les quantités nécessaires</p>
            <Button asChild variant="ghost" size="sm" className="mt-2 text-wedding-olive hover:bg-wedding-olive/10">
              <Link to="/dashboard/drinks">Explorer</Link>
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-wedding-olive" />
              <h3 className="font-medium">Budget prévisionnel</h3>
            </div>
            <p className="text-sm text-gray-600">Gérez vos dépenses</p>
            <Button asChild variant="ghost" size="sm" className="mt-2 text-wedding-olive hover:bg-wedding-olive/10">
              <Link to="/dashboard/budget">Explorer</Link>
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-5 w-5 text-wedding-olive" />
              <h3 className="font-medium">Liste de souhaits</h3>
            </div>
            <p className="text-sm text-gray-600">Sauvegardez vos prestataires favoris</p>
            <Button asChild variant="ghost" size="sm" className="mt-2 text-wedding-olive hover:bg-wedding-olive/10">
              <Link to="/dashboard/wishlist">Explorer</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Grille de cartes uniformes */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top 3 tâches avec cases à cocher */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-wedding-olive" />
              Top 3 tâches prioritaires
            </CardTitle>
            <CardDescription>À faire prochainement</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow overflow-auto">
            <div className="mb-4 max-h-[100px]">
              <TasksList />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center mt-auto">
            <span className="text-sm text-gray-500">Prochaines étapes</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/tasks" className="flex items-center">
                Toutes les tâches <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Suivi budget */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-wedding-olive" />
              Aperçu budget
            </CardTitle>
            <CardDescription>Suivi des dépenses</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow overflow-auto">
            <div className="max-h-[100px]">
              <BudgetSummary />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center mt-auto">
            <span className="text-sm text-gray-500">Votre situation financière</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/budget" className="flex items-center">
                Détails <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Coordination Jour J (prioritaire) */}
        <Card className="overflow-hidden bg-gradient-to-br from-wedding-cream/30 to-white border-wedding-cream/40 hover:shadow-md transition-shadow h-[280px] flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Coordination Jour J
            </CardTitle>
            <CardDescription>Planning détaillé</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 flex-grow">
            <p className="mb-4">
              Planifiez votre journée de mariage heure par heure et assurez-vous que tout se déroule comme prévu.
            </p>
          </CardContent>
          <CardFooter className="bg-white/50 flex justify-center mt-auto">
            <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
              <Link to="/dashboard/coordination" className="flex items-center justify-center">
                Planifier ma journée <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
};

export default ProjectSummary;
