
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageCircle, Sparkles, Users, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressBar from './ProgressBar';
import TasksList from './TasksList';
import BudgetSummary from './BudgetSummary';
import DrinksCalculatorWidget from './DrinksCalculatorWidget';

const ProjectSummary = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-serif text-wedding-olive mb-6">Tableau de bord</h1>
      
      <section>
        <h2 className="text-xl font-medium mb-4">Avancement du projet</h2>
        <ProgressBar progress={35} maxValue={100} />
        <p className="text-sm text-gray-500 mt-2">
          Votre projet avance bien ! Continuez sur votre lancée.
        </p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tâches */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Tâches à faire
            </CardTitle>
            <CardDescription>Prochaines étapes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <TasksList />
            </div>
            <Button asChild className="w-full" variant="outline">
              <Link to="/dashboard/tasks">Voir toutes les tâches</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Budget */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-wedding-olive"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                <path d="M12 18V6" />
              </svg>
              Budget
            </CardTitle>
            <CardDescription>Aperçu financier</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetSummary />
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/dashboard/budget">Gérer le budget</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Assistant Virtuel */}
        <Card className="bg-gradient-to-br from-wedding-olive/10 to-wedding-cream/30 border-wedding-olive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-wedding-olive" />
              Assistant Virtuel
            </CardTitle>
            <CardDescription>Conseils personnalisés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Besoin d'aide pour planifier votre mariage ? Notre assistant virtuel peut vous guider pas à pas.
            </p>
            <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
              <Link to="/assistant-v2">Parler à l'assistant</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Coordination Jour J */}
        <Card className="bg-gradient-to-br from-wedding-cream/30 to-white border-wedding-cream/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-wedding-olive" />
              Coordination Jour J
            </CardTitle>
            <CardDescription>Planning détaillé</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Planifiez votre journée de mariage heure par heure et assurez-vous que tout se déroule comme prévu.
            </p>
            <Button asChild className="w-full bg-wedding-olive hover:bg-wedding-olive/80">
              <Link to="/dashboard/coordination">Planifier ma journée</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Calculatrice de boissons */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Wine className="h-5 w-5 text-wedding-olive" />
              Calculatrice de boissons
            </CardTitle>
            <CardDescription>Estimation des quantités</CardDescription>
          </CardHeader>
          <CardContent>
            <DrinksCalculatorWidget />
            <Button asChild className="w-full mt-4" variant="outline">
              <Link to="/dashboard/drinks">Calculer en détail</Link>
            </Button>
          </CardContent>
        </Card>
        
        {/* Communauté */}
        <Card className="bg-gradient-to-br from-yellow-50 to-white border-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-wedding-olive" />
              Communauté
            </CardTitle>
            <CardDescription>Entraide entre futurs mariés</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Rejoignez notre groupe WhatsApp pour échanger avec d'autres couples et trouver de l'inspiration.
            </p>
            <Button 
              asChild
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => window.open('https://chat.whatsapp.com/FXWrEnOVBxz7xz2yMPnuVo', '_blank')}
            >
              <a href="https://chat.whatsapp.com/FXWrEnOVBxz7xz2yMPnuVo" target="_blank" rel="noopener noreferrer">
                Rejoindre la communauté
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default ProjectSummary;
