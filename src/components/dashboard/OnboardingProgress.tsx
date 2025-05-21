
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  CalendarCheck, 
  FileText,
  CalendarDays,
  Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  completed?: boolean;
  current?: boolean;
  external?: boolean;
}

const OnboardingProgress: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Define the steps with appropriate icons from Lucide React
  const steps: OnboardingStep[] = [
    {
      icon: <LayoutDashboard className="h-8 w-8" />,
      title: "Accès au tableau de bord",
      description: "Personnalisez votre expérience",
      link: "/dashboard",
      completed: true,
      current: location.pathname === '/dashboard'
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Questionner l'assistant virtuel",
      description: "Conseils sur mesure",
      link: "/assistant-v2",
      completed: false,
    },
    {
      icon: <CalendarCheck className="h-8 w-8" />,
      title: "Obtenez un planning personnalisé",
      description: "Organisation complète",
      link: "/planning-personnalise",
      completed: false,
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Parcourir notre guide de prestataires",
      description: "Services vérifiés",
      link: "/recherche",
      completed: false,
    },
    {
      icon: <CalendarDays className="h-8 w-8" />,
      title: "Obtenez votre déroulé du jour-J",
      description: "Planning détaillé",
      link: "/dashboard/coordination",
      completed: false,
    },
    {
      icon: <Phone className="h-8 w-8" />,
      title: "Réjoignez la communauté WhatsApp",
      description: "Entraide entre futurs mariés",
      link: "https://chat.whatsapp.com/FXWrEnOVBxz7xz2yMPnuVo",
      completed: false,
      external: true
    },
  ];

  const handleStepClick = (step: OnboardingStep) => {
    if (step.external) {
      window.open(step.link, '_blank');
    } else {
      navigate(step.link);
    }
  };

  return (
    <div className="w-full">
      {/* Visual progression with icons and arrows */}
      <h2 className="text-2xl font-serif text-wedding-olive mb-6 text-center">Les étapes de l'onboarding</h2>
      
      <div className="relative mb-6 overflow-x-auto pb-2">
        <div className="flex items-center justify-between w-full min-w-max">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step icon with background */}
              <div 
                className={cn(
                  "relative z-10 flex flex-col items-center transition-all cursor-pointer group mx-1 sm:mx-0",
                  step.current ? "scale-110" : ""
                )}
                onClick={() => handleStepClick(step)}
              >
                <div className={cn(
                  "flex items-center justify-center rounded-full p-3 mb-2 transition-all",
                  step.current 
                    ? "bg-wedding-olive text-white shadow-lg" 
                    : step.completed 
                      ? "bg-wedding-olive/80 text-white" 
                      : "bg-gray-100 text-gray-400"
                )}>
                  {step.icon}
                </div>
                
                {/* Label - visible on desktop, hidden on mobile */}
                <span className={cn(
                  "text-xs font-medium text-center transition-all max-w-[90px]",
                  isMobile ? "hidden" : "block",
                  step.current ? "text-wedding-olive" : "text-gray-500"
                )}>
                  {step.title}
                </span>
              </div>
              
              {/* Connector line between steps (except after the last step) */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-grow mx-1 relative z-0",
                  step.completed ? "bg-wedding-olive" : "bg-gray-200"
                )} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Bottom claim banner - Changed from blue to wedding-olive color */}
      <div className="bg-wedding-olive text-white rounded-full py-4 px-6 text-center my-6">
        <p className="text-xl font-serif">Moins de stress, plus d'amour.</p>
      </div>
    </div>
  );
};

export default OnboardingProgress;
