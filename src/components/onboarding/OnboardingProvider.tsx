import React, { createContext, useContext, useState, useEffect } from 'react';

interface OnboardingContextType {
  isOnboardingActive: boolean;
  currentStep: number;
  totalSteps: number;
  startOnboarding: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  isCompleted: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: React.ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const totalSteps = 6;

  // Charger l'état depuis localStorage au montage
  useEffect(() => {
    const onboardingData = localStorage.getItem('dashboard_onboarding');
    if (onboardingData) {
      try {
        const parsed = JSON.parse(onboardingData);
        setIsCompleted(parsed.completed || false);
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);

  // Vérifier si c'est le premier login (utilisateur jamais vu l'onboarding)
  useEffect(() => {
    const onboardingData = localStorage.getItem('dashboard_onboarding');
    if (!onboardingData && !isOnboardingActive) {
      // Premier login détecté, démarrer l'onboarding après un court délai
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    const onboardingData = {
      completed: false,
      skipped: true,
      date: new Date().toISOString()
    };
    localStorage.setItem('dashboard_onboarding', JSON.stringify(onboardingData));
    setIsOnboardingActive(false);
    setIsCompleted(false);
  };

  const completeOnboarding = () => {
    const onboardingData = {
      completed: true,
      skipped: false,
      date: new Date().toISOString()
    };
    localStorage.setItem('dashboard_onboarding', JSON.stringify(onboardingData));
    setIsOnboardingActive(false);
    setIsCompleted(true);
  };

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingActive,
        currentStep,
        totalSteps,
        startOnboarding,
        nextStep,
        prevStep,
        skipOnboarding,
        completeOnboarding,
        isCompleted
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};