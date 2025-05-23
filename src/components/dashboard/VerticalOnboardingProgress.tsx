
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageCircle, 
  CalendarCheck, 
  FileText,
  CalendarDays,
  Phone,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OnboardingStep {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  completed?: boolean;
  current?: boolean;
  external?: boolean;
}

const VerticalOnboardingProgress: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const steps: OnboardingStep[] = [
    {
      icon: <LayoutDashboard className="h-6 w-6" />,
      title: "Accès au tableau de bord",
      description: "Personnalisez votre expérience",
      link: "/dashboard",
      completed: true,
      current: location.pathname === '/dashboard'
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Questionner l'assistant virtuel",
      description: "Conseils sur mesure",
      link: "/assistant-v2",
      completed: false,
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "Obtenez un planning personnalisé",
      description: "Organisation complète",
      link: "/planning-personnalise",
      completed: false,
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Parcourir notre guide de prestataires",
      description: "Services vérifiés",
      link: "/recherche",
      completed: false,
    },
    {
      icon: <CalendarDays className="h-6 w-6" />,
      title: "Obtenez votre déroulé du jour-J",
      description: "Planning détaillé",
      link: "/dashboard/coordination",
      completed: false,
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Rejoignez la communauté WhatsApp",
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
    <div className="w-full bg-gradient-to-r from-wedding-olive/10 to-wedding-cream/30 p-6 rounded-xl">
      <h2 className="text-2xl font-serif text-wedding-olive mb-6 text-center">Les étapes de l'onboarding</h2>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={cn(
              "flex items-center p-4 rounded-lg transition-all cursor-pointer group border",
              step.current 
                ? "bg-wedding-olive text-white border-wedding-olive shadow-lg" 
                : step.completed 
                  ? "bg-wedding-olive/10 border-wedding-olive/30 hover:bg-wedding-olive/20" 
                  : "bg-white border-gray-200 hover:border-wedding-olive/50 hover:bg-gray-50"
            )}
            onClick={() => handleStepClick(step)}
          >
            <div className={cn(
              "flex items-center justify-center rounded-full p-2 mr-4 transition-all",
              step.current 
                ? "bg-white text-wedding-olive" 
                : step.completed 
                  ? "bg-wedding-olive text-white" 
                  : "bg-gray-100 text-gray-400 group-hover:bg-wedding-olive group-hover:text-white"
            )}>
              {step.completed && !step.current ? <CheckCircle className="h-6 w-6" /> : step.icon}
            </div>
            
            <div className="flex-1">
              <h3 className={cn(
                "font-medium text-base",
                step.current ? "text-white" : "text-gray-900"
              )}>
                {step.title}
              </h3>
              <p className={cn(
                "text-sm",
                step.current ? "text-white/80" : "text-gray-600"
              )}>
                {step.description}
              </p>
            </div>
            
            {step.external && (
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Externe
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="bg-wedding-olive text-white rounded-full py-4 px-6 text-center mt-6">
        <p className="text-xl font-serif">Moins de stress, plus d'amour.</p>
      </div>
    </div>
  );
};

export default VerticalOnboardingProgress;
