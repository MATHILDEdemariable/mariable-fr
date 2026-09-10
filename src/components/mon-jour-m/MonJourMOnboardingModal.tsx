import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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

  const { t } = useTranslation('monJourM');

  const stepIcons = [
    <Sparkles className="h-6 w-6 text-wedding-olive" />,
    <Users className="h-6 w-6 text-blue-600" />,
    <Calendar className="h-6 w-6 text-wedding-olive" />,
    <UserCheck className="h-6 w-6 text-green-600" />,
    <FileText className="h-6 w-6 text-purple-600" />,
    <Share2 className="h-6 w-6 text-amber-600" />,
  ];

  const translatedSteps = (t('onboarding.steps', { returnObjects: true }) as Array<{ title: string; content: string; highlight?: string }>) || [];

  const steps: OnboardingStep[] = (Array.isArray(translatedSteps) ? translatedSteps : []).map((step, index) => ({
    id: index,
    title: step.title,
    content: step.content,
    icon: stepIcons[index],
    highlight: step.highlight,
  }));

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

  if (!currentStepData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-[#FAF9F6] to-white border-none shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-wedding-olive/10 rounded-full">
                {currentStepData.icon}
              </div>
              <DialogTitle className="text-xl font-serif font-semibold text-wedding-olive">
                {currentStepData.title}
              </DialogTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleSkip}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Indicateur de progression */}
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 w-10 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'bg-wedding-olive scale-110'
                      : index < currentStep
                      ? 'bg-wedding-olive/50'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </DialogHeader>

        <DialogDescription asChild>
          <div className="space-y-6 mt-4">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed text-base">
                {currentStepData.content}
              </p>
              
              {currentStepData.highlight && (
                <div className="mt-4">
                  <Badge variant="outline" className="bg-wedding-olive/10 text-wedding-olive border-wedding-olive/30 px-3 py-1">
                    💡 {t('onboarding.focus')} {currentStepData.highlight}
                  </Badge>
                </div>
              )}
            </div>

            {/* Message spécial pour l'étape de partage */}
            {currentStep === 5 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-amber-800 text-sm font-medium flex items-center gap-2">
                  📱 <span dangerouslySetInnerHTML={{ __html: t('onboarding.mobileNote') }} />
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2 border-gray-200"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('onboarding.previous')}
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={handleSkip}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {t('onboarding.skip')}
                </Button>
                
                <Button
                  onClick={nextStep}
                  className="bg-wedding-olive hover:bg-wedding-olive/90 flex items-center gap-2 px-6"
                >
                  {currentStep === steps.length - 1 ? t('onboarding.start') : t('onboarding.next')}
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