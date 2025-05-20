
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Sparkles, Users, Wine, Check, FileText, DollarSign, Heart, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ProgressBar from './ProgressBar';
import TasksList from './TasksList';
import BudgetSummary from './BudgetSummary';
import DrinksCalculatorWidget from './DrinksCalculatorWidget';
import { Input } from '@/components/ui/input';

const ProjectSummary = () => {
  const today = new Date();
  const formattedDate = format(today, "EEEE d MMMM yyyy", { locale: fr });
  const [weddingDate, setWeddingDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState<string>("100");
  
  // Calculer le nombre de jours restants jusqu'au mariage
  const daysUntilWedding = weddingDate ? Math.ceil((weddingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null;
  
  // Progression fictive pour la démonstration
  const progress = 75;
  
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
          Bienvenue dans votre espace personnel Mariable ! Voici comment profiter pleinement de votre tableau de bord :
        </p>
        <ul className="mt-3 space-y-2">
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-wedding-olive" />
            <span>Suivez l'avancement de votre projet de mariage</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-wedding-olive" />
            <span>Gérez vos tâches, votre budget et vos prestataires</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="h-5 w-5 text-wedding-olive" />
            <span>Consultez notre assistant virtuel pour des conseils personnalisés</span>
          </li>
        </ul>
      </section>
      
      {/* Zone gamifiée avec progression */}
      <section className="bg-gradient-to-r from-wedding-cream/30 to-white p-6 rounded-xl border border-wedding-cream/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-medium mb-2 text-wedding-olive">Votre progression</h2>
            <p className="text-lg font-medium mb-3">
              Vous êtes à <span className="text-wedding-olive font-bold">{progress}%</span> – bientôt prêt...
            </p>
          </div>
          <div className="w-full md:w-1/2">
            <ProgressBar progress={progress} maxValue={100} />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4 italic">
          Continuez sur cette lancée ! Complétez vos tâches prioritaires pour avancer dans votre préparation.
        </p>
      </section>
      
      {/* Grille de cartes */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Prochain rendez-vous */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Prochain rendez-vous
            </CardTitle>
            <CardDescription>Assistant virtuel</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Besoin de conseils pour votre projet de mariage ? Discutez avec notre assistant virtuel intelligent.
            </p>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Personnalisé pour vous</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/assistant-v2" className="flex items-center">
                Consulter <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Top 3 tâches avec cases à cocher */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Check className="h-5 w-5 text-wedding-olive" />
              Top 3 tâches prioritaires
            </CardTitle>
            <CardDescription>À faire prochainement</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-4">
              <TasksList />
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Prochaines étapes</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/tasks" className="flex items-center">
                Toutes les tâches <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Suivi budget */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-wedding-olive" />
              Aperçu budget
            </CardTitle>
            <CardDescription>Suivi des dépenses</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <BudgetSummary />
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Votre situation financière</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/budget" className="flex items-center">
                Détails <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Wishlist prestataires */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Heart className="h-5 w-5 text-wedding-olive" />
              Wishlist prestataires
            </CardTitle>
            <CardDescription>Vos favoris</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Retrouvez tous les prestataires que vous avez sauvegardés pour votre événement.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Photographe</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Traiteur</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">DJ</span>
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">Fleuriste</span>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">{Math.floor(Math.random() * 6) + 3} prestataires favoris</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/wishlist" className="flex items-center">
                Voir la liste <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Documents récents */}
        <Card className="overflow-hidden border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="bg-wedding-olive/10 pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-wedding-olive" />
              Documents récents
            </CardTitle>
            <CardDescription>Contrats et devis</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              <li className="flex justify-between items-center">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Devis_Photographe.pdf
                </span>
                <span className="text-xs text-gray-500">Il y a 2j</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Contrat_Salle.pdf
                </span>
                <span className="text-xs text-gray-500">Il y a 5j</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter className="bg-gray-50 flex justify-between items-center">
            <span className="text-sm text-gray-500">Gérez vos documents</span>
            <Button asChild variant="ghost" size="sm" className="text-wedding-olive">
              <Link to="/dashboard/prestataires" className="flex items-center">
                Tous les documents <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Assistant virtuel */}
        <Card className="overflow-hidden bg-gradient-to-br from-wedding-olive/10 to-wedding-cream/20 border-wedding-olive/20 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-wedding-olive" />
              Assistant Virtuel
            </CardTitle>
            <CardDescription>Conseils personnalisés</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Besoin d'aide pour planifier votre mariage ? Notre assistant virtuel peut vous guider pas à pas.
            </p>
          </CardContent>
          <CardFooter className="bg-white/50 flex justify-center">
            <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
              <Link to="/assistant-v2" className="flex items-center justify-center">
                Parler à l'assistant <MessageCircle className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Communauté - Groupe WhatsApp */}
        <Card className="overflow-hidden bg-gradient-to-br from-green-50 to-white border-green-100 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Communauté
            </CardTitle>
            <CardDescription>Entraide entre futurs mariés</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Rejoignez notre groupe WhatsApp pour échanger avec d'autres couples et trouver de l'inspiration.
            </p>
          </CardContent>
          <CardFooter className="bg-white/50 flex justify-center">
            <Button 
              asChild
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <a href="https://chat.whatsapp.com/FXWrEnOVBxz7xz2yMPnuVo" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                Rejoindre la communauté <ChevronRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Coordination Jour J */}
        <Card className="overflow-hidden bg-gradient-to-br from-wedding-cream/30 to-white border-wedding-cream/40 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Coordination Jour J
            </CardTitle>
            <CardDescription>Planning détaillé</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="mb-4">
              Planifiez votre journée de mariage heure par heure et assurez-vous que tout se déroule comme prévu.
            </p>
          </CardContent>
          <CardFooter className="bg-white/50 flex justify-center">
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
