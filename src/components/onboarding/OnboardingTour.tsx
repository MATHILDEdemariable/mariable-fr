import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';
import { useOnboarding } from './OnboardingProvider';
import { motion, AnimatePresence } from 'framer-motion';

const onboardingSteps = [
  {
    id: 1,
    title: "Bienvenue sur votre espace mariage personnalisé",
    description: "Découvrez votre tableau de bord complet pour organiser votre mariage de A à Z. Chaque section vous accompagne dans une étape différente de votre préparation.",
    icon: Sparkles,
    highlight: "#dashboard-welcome",
    position: "center"
  },
  {
    id: 2,
    title: "Navigation principale",
    description: "Cette barre latérale vous donne accès à tous vos outils. Naviguez facilement entre les différentes sections de votre préparation mariage.",
    icon: ChevronRight,
    highlight: "#dashboard-sidebar",
    position: "right"
  },
  {
    id: 3,
    title: "Avant votre mariage",
    description: "Commencez ici : quiz de style, checklist personnalisée et calculatrice budget pour estimer vos coûts selon vos critères.",
    icon: ChevronRight,
    highlight: "#dashboard-before",
    position: "center"
  },
  {
    id: 4,
    title: "Mission Mariage - Nouveau !",
    description: "Gérez vos tâches de préparation et suivez vos prestataires. Un espace dédié pour coordonner tous les aspects de votre organisation.",
    icon: Sparkles,
    highlight: "#dashboard-mission",
    position: "center"
  },
  {
    id: 5,
    title: "Jour-M",
    description: "Préparez votre journée parfaite : planning détaillé, attribution des tâches à votre équipe et centralisation de tous vos documents.",
    icon: ChevronRight,
    highlight: "#dashboard-day",
    position: "center"
  },
  {
    id: 6,
    title: "Partage & Collaboration",
    description: "Partagez votre planning avec vos proches ! Créez un lien consultatif pour que votre famille et vos prestataires restent informés.",
    icon: ChevronRight,
    highlight: "#dashboard-share",
    position: "right"
  }
];

export const OnboardingTour: React.FC = () => {
  const { 
    isOnboardingActive, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep, 
    skipOnboarding 
  } = useOnboarding();

  if (!isOnboardingActive) return null;

  const currentStepData = onboardingSteps.find(step => step.id === currentStep);
  
  if (!currentStepData) return null;

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <AnimatePresence>
      <Dialog open={isOnboardingActive} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-lg">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="w-fit">
                  Étape {currentStep} sur {totalSteps}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={skipOnboarding}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <DialogTitle className="flex items-center gap-3 text-left">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <currentStepData.icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-semibold">
                  {currentStepData.title}
                </span>
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              <p className="text-muted-foreground leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                {!isFirstStep && (
                  <Button 
                    variant="outline" 
                    onClick={prevStep}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  onClick={skipOnboarding}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Ignorer le tour
                </Button>
                <Button 
                  onClick={nextStep}
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                >
                  {isLastStep ? 'Terminer' : 'Suivant'}
                  {!isLastStep && <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Indicateur de progression */}
            <div className="mt-4">
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }, (_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full ${
                      i < currentStep 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  );
};