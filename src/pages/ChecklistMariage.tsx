
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChecklistMariage = () => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const checklistData = [
    {
      period: "12 mois avant",
      color: "bg-blue-100 text-blue-800",
      tasks: [
        "Fixer la date du mariage",
        "Établir le budget",
        "Choisir le style du mariage",
        "Commencer la liste des invités",
        "Rechercher et réserver le lieu de réception",
        "Engager un photographe",
        "Choisir les témoins"
      ]
    },
    {
      period: "9 mois avant",
      color: "bg-green-100 text-green-800",
      tasks: [
        "Envoyer les save-the-date",
        "Réserver le traiteur",
        "Choisir la robe de mariée",
        "Réserver le DJ/groupe de musique",
        "Organiser l'enterrement de vie de jeune fille/garçon",
        "Commencer à penser à la décoration"
      ]
    },
    {
      period: "6 mois avant",
      color: "bg-yellow-100 text-yellow-800",
      tasks: [
        "Envoyer les invitations",
        "Réserver le fleuriste",
        "Choisir les alliances",
        "Organiser la lune de miel",
        "Réserver coiffeur/maquilleur",
        "Planifier le repas de mariage"
      ]
    },
    {
      period: "3 mois avant",
      color: "bg-orange-100 text-orange-800",
      tasks: [
        "Essayage final de la robe",
        "Confirmer avec tous les prestataires",
        "Préparer le plan de table",
        "Organiser la répétition",
        "Finaliser le menu",
        "Préparer les discours"
      ]
    },
    {
      period: "1 mois avant",
      color: "bg-red-100 text-red-800",
      tasks: [
        "Derniers essayages",
        "Confirmer le nombre d'invités",
        "Préparer la décoration",
        "Faire le point avec le wedding planner",
        "Préparer la trousse de secours",
        "Se détendre et profiter !"
      ]
    }
  ];

  const handleTaskCheck = (taskId: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const getTotalTasks = () => {
    return checklistData.reduce((total, period) => total + period.tasks.length, 0);
  };

  const getCompletedTasks = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  const getProgressPercentage = () => {
    const total = getTotalTasks();
    const completed = getCompletedTasks();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <>
      <Helmet>
        <title>Checklist de mariage | Mariable</title>
        <meta name="description" content="Checklist complète pour organiser votre mariage étape par étape, de 12 mois avant le jour J jusqu'au grand jour." />
      </Helmet>

      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif mb-4">Checklist de mariage</h1>
          <p className="text-muted-foreground mb-6">
            Suivez votre progression et ne ratez aucune étape importante
          </p>
          
          {/* Barre de progression */}
          <Card className="max-w-md mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progression</span>
                <span className="text-sm text-muted-foreground">
                  {getCompletedTasks()}/{getTotalTasks()} tâches
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-wedding-olive h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <p className="text-2xl font-bold text-wedding-olive mt-2">
                {getProgressPercentage()}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {checklistData.map((period, periodIndex) => (
            <Card key={periodIndex}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CalendarDays className="h-5 w-5" />
                  <span>{period.period}</span>
                  <Badge className={period.color}>
                    {period.tasks.filter(task => 
                      checkedItems[`${periodIndex}-${period.tasks.indexOf(task)}`]
                    ).length}/{period.tasks.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {period.tasks.map((task, taskIndex) => {
                    const taskId = `${periodIndex}-${taskIndex}`;
                    const isChecked = checkedItems[taskId] || false;
                    
                    return (
                      <div key={taskIndex} className="flex items-center space-x-3">
                        <Checkbox
                          id={taskId}
                          checked={isChecked}
                          onCheckedChange={() => handleTaskCheck(taskId)}
                        />
                        <label
                          htmlFor={taskId}
                          className={`text-sm cursor-pointer flex-1 ${
                            isChecked ? 'line-through text-muted-foreground' : ''
                          }`}
                        >
                          {task}
                        </label>
                        {isChecked && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 p-6 bg-wedding-cream/20 rounded-lg">
          <h3 className="text-lg font-medium mb-2">Besoin d'aide pour organiser votre mariage ?</h3>
          <p className="text-muted-foreground mb-4">
            Créez votre compte pour sauvegarder votre progression et accéder à tous nos outils.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/register')}>
              Créer un compte
            </Button>
            <Button variant="outline" onClick={() => navigate('/services/planification')}>
              Voir nos services
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ChecklistMariage;
