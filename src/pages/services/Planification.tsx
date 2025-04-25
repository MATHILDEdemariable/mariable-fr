import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';

const weddingTasks = [
  { id: 1, title: "Posez les bases", description: "Définissez la vision de votre mariage : style, ambiance, type de cérémonie.", priority: "haute", category: "essentiel" },
  { id: 2, title: "Estimez le nombre d'invités", description: "Même approximatif, cela guidera vos choix logistiques et budgétaires.", priority: "haute", category: "organisation" },
  { id: 3, title: "Calibrez votre budget", description: "Évaluez vos moyens et priorisez les postes les plus importants selon vos envies.", priority: "haute", category: "essentiel" },
  { id: 4, title: "Choisissez une période ou une date cible", description: "Cela conditionne les disponibilités des lieux et prestataires.", priority: "haute", category: "essentiel" },
  { id: 5, title: "Réservez les prestataires clés", description: "Lieu, traiteur, photographe en priorité. Puis DJ, déco, animation, etc.", priority: "haute", category: "essentiel" },
  { id: 6, title: "Gérez les démarches officielles", description: "Mairie, cérémonies religieuses ou laïques, contrats, assurances, etc.", priority: "moyenne", category: "essentiel" },
  { id: 7, title: "Anticipez la coordination du jour J", description: "Prévoyez une coordinatrice (recommandée), les préparatifs beauté, la logistique (transport, hébergements) et les temps forts.", priority: "moyenne", category: "organisation" },
  { id: 8, title: "Préparez vos éléments personnels", description: "Tenues, alliances, accessoires, papeterie, DIY ou détails personnalisés.", priority: "moyenne", category: "personnel" },
  { id: 9, title: "Consolidez votre organisation", description: "Revoyez chaque point avec vos prestataires : timing, livraisons, besoins techniques, derniers ajustements.", priority: "haute", category: "organisation" },
  { id: 10, title: "Vivez pleinement votre journée", description: "Vous avez tout prévu : il ne reste plus qu'à profiter à 100% !", priority: "haute", category: "personnel" }
];

const PlanningChecklist = () => {
  const [tasksWithStatus, setTasksWithStatus] = useState(
    weddingTasks.map(task => ({ ...task, completed: false }))
  );
  
  const navigate = useNavigate();
  
  const toggleTaskCompletion = (taskId: number) => {
    setTasksWithStatus(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };
  
  const getProgressPercentage = () => {
    const completed = tasksWithStatus.filter(t => t.completed).length;
    return Math.round((completed / tasksWithStatus.length) * 100);
  };

  const handleSignUpClick = () => {
    navigate('/login-frame');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Félicitations et bienvenue dans l'univers du mariage</CardTitle>
          <CardDescription>
            Organisez votre mariage en 10 étapes clés (même sans rien y connaître)
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <span>Votre progression</span>
            <div className="ml-auto text-wedding-olive">{getProgressPercentage()}%</div>
          </CardTitle>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
            <div 
              className="h-full bg-wedding-olive rounded-full" 
              style={{ width: `${getProgressPercentage()}%` }} 
            />
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium text-lg mb-4">Organiser son mariage en 10 étapes clés</h3>
          <div className="space-y-4">
            {tasksWithStatus.map((task) => (
              <div key={task.id} className="border-l-2 border-wedding-olive/30 pl-4 ml-2">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <label 
                      htmlFor={`task-${task.id}`} 
                      className={`cursor-pointer font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.id}. {task.title}
                    </label>
                    <p className={`mt-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-muted-foreground'}`}>
                      {task.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 text-center">
        <Card className="bg-wedding-cream/20 border-wedding-olive/20">
          <CardContent className="pt-6 pb-6">
            <h3 className="text-2xl font-serif mb-4">Prêt à dire oui à la simplicité ?</h3>
            <p className="mb-6">
              Créez votre compte pour sauvegarder votre planning et accéder à toutes nos fonctionnalités.
            </p>
            <Button 
              size="lg"
              className="bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              onClick={handleSignUpClick}
            >
              S'inscrire <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>


const PlanificationContent = () => {
  const navigate = useNavigate();

  return (
    <>
      <p>
        La planification d'un mariage implique de nombreuses étapes et peut rapidement devenir 
        source de stress. Notre solution de planification vous guide à travers chaque étape avec 
        simplicité et efficacité.
      </p>
      
      <h2 className="text-2xl font-serif mt-8 mb-4">Votre checklist de mariage simplifiée</h2>
      
      <PlanningChecklist />
      
      <div className="mt-8 text-center">
        <Card className="bg-wedding-cream/20 border-wedding-olive/20">
          <CardContent className="pt-6 pb-6 text-center">
            <h3 className="text-2xl font-serif mb-4 text-center">Prêt à planifier votre jour ?</h3>
            <p className="mb-6 text-center">
              Notre outil de planning jour-J vous permet de visualiser et d'organiser le timing idéal, de la cérémonie jusqu'à la soirée dansante.
            </p>
            <Link to="/services/jour-j">
              <Button 
                size="lg"
                variant="wedding"
                className="w-full sm:w-auto bg-wedding-olive hover:bg-wedding-olive/90 text-white"
              >
                Créer mon planning jour-J <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const Planification = () => {
  return (
    <ServiceTemplate 
      title="Planification de mariage"
      description="Organisez chaque étape de votre mariage sans stress"
      content={<PlanificationContent />}
    >
      <SEO 
        title="Planification mariage étape par étape"
        description="Un rétroplanning mariage simple et personnalisé."
      />
    </ServiceTemplate>
  );
};

export default Planification;
