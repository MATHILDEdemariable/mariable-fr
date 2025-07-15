import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Users,
  Calendar,
  UserCheck,
  FileText,
  Share2,
  Sparkles
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  content: string;
  icon: React.ReactNode;
  highlight?: string;
}

interface MonJourMOnboardingModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  hasExistingEvents?: boolean;
}

const MonJourMOnboardingModal: React.FC<MonJourMOnboardingModalProps> = ({
  isOpen,
  onOpenChange,
  hasExistingEvents = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Vue d'ensemble",
      content: "Bienvenue dans votre outil de coordination ! 5 étapes simples pour organiser votre journée parfaite avec votre équipe.",
      icon: <Sparkles className="h-6 w-6 text-wedding-olive" />,
    },
    {
      id: 1,
      title: "Étape 1 : Créer son équipe",
      content: "Ajoutez vos proches et prestataires avec leurs coordonnées dans l'onglet 'Équipe'. Ils pourront être assignés aux différentes tâches.",
      icon: <Users className="h-6 w-6 text-blue-600" />,
      highlight: "Onglet 'Équipe'"
    },
    {
      id: 2,
      title: "Étape 2 : Créez votre planning",
      content: "• Ajoutez des étapes avec 'Ajouter une étape'\n• Utilisez l'IA pour générer un planning automatique\n• Glissez-déposez pour réorganiser",
      icon: <Calendar className="h-6 w-6 text-wedding-olive" />,
      highlight: "Bouton 'Ajouter une étape'"
    },
    {
      id: 3,
      title: "Étape 3 : Assignez les tâches",
      content: "• Cliquez sur 'Assigné à:' pour attribuer chaque tâche\n• Assurez-vous d'avoir créé votre équipe au préalable",
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      highlight: "Bouton 'Assigné à:'"
    },
    {
      id: 4,
      title: "Étape 4 : Gérer documents",
      content: "Uploadez vos documents importants si besoin (moodboard, devis, planning détaillé) dans l'onglet 'Documents'.",
      icon: <FileText className="h-6 w-6 text-purple-600" />,
      highlight: "Onglet 'Documents'"
    },
    {
      id: 5,
      title: "Étape 5 : Partager avec votre équipe ⭐",
      content: "• Cliquez sur 'Partager' pour générer un lien\n• Envoyez le lien à votre équipe !\n• Elle pourra voir le planning en temps réel ainsi que les fiches contacts et les mises à jour automatiquement",
      icon: <Share2 className="h-6 w-6 text-amber-600" />,
      highlight: "Bouton 'Partager'"
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    // Marquer comme vu dans localStorage
    localStorage.setItem('mon-jour-m-onboarding-seen', 'true');
    onOpenChange(false);
  };

  const handleSkip = () => {
    localStorage.setItem('mon-jour-m-onboarding-seen', 'true');
    onOpenChange(false);
  };

  const currentStepData = steps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {currentStepData.icon}
              <DialogTitle className="text-lg font-semibold">
                {currentStepData.title}
              </DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Indicateur de progression */}
          <div className="flex justify-center mt-4">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-wedding-olive'
                      : index < currentStep
                      ? 'bg-wedding-olive/60'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentStepData.content}
              </p>
              
              {currentStepData.highlight && (
                <div className="mt-3">
                  <Badge variant="outline" className="bg-wedding-olive/10 text-wedding-olive border-wedding-olive/30">
                    💡 Focus: {currentStepData.highlight}
                  </Badge>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-500"
                >
                  Passer l'introduction
                </Button>
                
                <Button
                  onClick={nextStep}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2"
                >
                  {currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}
                  {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default MonJourMOnboardingModal;