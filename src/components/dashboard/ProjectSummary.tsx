
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, Euro, Clock } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface ProjectSummaryProps {
  projectName?: string;
  weddingDate?: string;
  guestCount?: number;
  budget?: number;
  daysRemaining?: number;
  progress?: number;
}

const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  projectName = "Notre mariage",
  weddingDate = "Non définie",
  guestCount = 0,
  budget = 0,
  daysRemaining = 0,
  progress = 0
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif">{projectName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-wedding-olive/10 p-2 rounded-full">
              <Calendar className="h-5 w-5 text-wedding-olive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date</p>
              <p className="font-medium">{weddingDate}</p>
            </div>
          </div>
          
          <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-wedding-olive/10 p-2 rounded-full">
              <Users className="h-5 w-5 text-wedding-olive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Invités</p>
              <p className="font-medium">{guestCount > 0 ? guestCount : "Non défini"}</p>
            </div>
          </div>
          
          <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-wedding-olive/10 p-2 rounded-full">
              <Euro className="h-5 w-5 text-wedding-olive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="font-medium">{budget > 0 ? formatCurrency(budget) : "Non défini"}</p>
            </div>
          </div>
          
          <div className="bg-wedding-cream/20 p-4 rounded-lg flex items-center gap-3">
            <div className="bg-wedding-olive/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-wedding-olive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temps restant</p>
              <p className="font-medium">
                {daysRemaining > 0 ? `${daysRemaining} jours` : "Date non définie"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <ProgressBar 
            percentage={progress} 
            label="Progression globale" 
            className="mb-4" 
          />
          
          <p className="text-sm text-muted-foreground">
            {progress < 25 && "C'est le début de votre aventure ! Commencez par définir votre vision et votre budget."}
            {progress >= 25 && progress < 50 && "Vous êtes bien lancés ! Concentrez-vous maintenant sur les réservations clés."}
            {progress >= 50 && progress < 75 && "Plus de la moitié du chemin est fait ! Passez aux détails et à la décoration."}
            {progress >= 75 && "Vous y êtes presque ! Finalisez les derniers détails pour votre grand jour."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSummary;
