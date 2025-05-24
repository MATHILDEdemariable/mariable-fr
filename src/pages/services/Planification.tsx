import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceTemplate from '../ServiceTemplate';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserPlus, Calendar, CheckCircle, MessageCircle, Mail, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

const PlanningStageCard = ({ 
  emoji, 
  title, 
  features,
  subtext,
  ctaText, 
  ctaAction, 
  variant = "default" 
}: { 
  emoji: string;
  title: string;
  features: string[];
  subtext: string;
  ctaText: string;
  ctaAction: () => void;
  variant?: "default" | "primary";
}) => (
  <div className="group bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:transform hover:scale-105 flex flex-col h-full">
    <div className="flex items-center mb-4">
      <span className="text-3xl mr-3">{emoji}</span>
      <div>
        <h3 className="text-xl font-serif font-medium text-black">{title}</h3>
      </div>
    </div>
    
    <div className="flex-1 mb-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {features.map((feature, index) => (
          <span key={index} className="text-sm text-wedding-olive font-medium">
            {feature}{index < features.length - 1 && ' · '}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-foreground italic">
        "{subtext}" – Mathilde
      </p>
    </div>
    
    <div className="mt-auto">
      <Button 
        variant={variant === "primary" ? "wedding" : "outline"}
        className={`w-full min-h-[48px] px-4 py-2 text-base font-medium inline-flex items-center justify-center rounded-lg group-hover:shadow-lg transition-all ${
          variant === "default" ? "border-wedding-olive text-wedding-olive hover:bg-wedding-olive/10" : ""
        }`}
        onClick={ctaAction}
      >
        {ctaText}
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  </div>
);

const PlanificationContent = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    
    checkAuth();
  }, []);
  
  const planningStages = [
    {
      emoji: "🌱",
      title: "Je démarre tout juste",
      features: ["Inspiration", "Étapes clés", "Budget"],
      subtext: "Pas d'inquiétude, je vous accompagne pas à pas.",
      ctaText: "Commencer mon organisation",
      ctaAction: () => navigate(isAuthenticated ? '/dashboard' : '/register')
    },
    {
      emoji: "📋",
      title: "Je suis en pleine organisation",
      features: ["Prestataires", "Suivi", "Conseils"],
      subtext: "Je vous aide à tout suivre, sans rien oublier.",
      ctaText: "Accéder à mon tableau de bord",
      ctaAction: () => navigate(isAuthenticated ? '/dashboard' : '/login')
    },
    {
      emoji: "🎉",
      title: "Le grand jour approche",
      features: ["Planning détaillé", "Coordination", "Communication facile"],
      subtext: "Les derniers préparatifs !",
      ctaText: "Coordination jour J",
      ctaAction: () => {
        const jourJSection = document.getElementById('jour-j-section');
        if (jourJSection) {
          jourJSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  ];

  return (
    <>
      {/* Hero Section - Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif mb-6 text-black leading-tight">
            Planifiez votre mariage à votre rythme, sans charge mentale
          </h1>
          <h2 className="text-xl text-muted-foreground mb-8">
            Votre tableau de bord intelligent, guidé par Mathilde, votre assistante Mariable.
          </h2>
          <Button 
            asChild
            size="lg"
            variant="wedding"
            className="gap-2"
          >
            <Link to="/planning-personnalise">
              Où en êtes vous ?
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
        <div className="flex justify-center">
          <img 
            src="/lovable-uploads/50002546-1593-48bc-8148-40fbea3cdab6.png" 
            alt="Couple heureux planifiant leur mariage"
            className="w-full max-w-md rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Three interactive blocks */}
      <div className="mb-16">
        <h2 className="text-2xl md:text-3xl font-serif text-center mb-4 text-black">
          À chaque étape, Mariable vous aide
        </h2>
        <p className="text-lg text-muted-foreground text-center mb-8">
          Une organisation fluide et intelligente, structurée autour de vous.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planningStages.map((stage, index) => (
            <PlanningStageCard
              key={index}
              emoji={stage.emoji}
              title={stage.title}
              features={stage.features}
              subtext={stage.subtext}
              ctaText={stage.ctaText}
              ctaAction={stage.ctaAction}
              variant={index === 1 ? "primary" : "default"}
            />
          ))}
        </div>
      </div>

      {/* Support section */}
      <div className="bg-wedding-cream/20 rounded-lg p-8 mb-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif mb-4 text-black">
            Besoin d'aide ? Contactez-moi.
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Posez-moi vos questions ou réservez un conseil personnalisé à tout moment. 
            Par chat, email ou RDV express.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-wedding-olive">
              <MessageCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Chat</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-wedding-olive">
              <Mail className="h-5 w-5" />
              <span className="text-sm font-medium">Email</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-wedding-olive">
              <Video className="h-5 w-5" />
              <span className="text-sm font-medium">RDV express</span>
            </div>
          </div>
          
          <Button 
            asChild
            variant="wedding"
            size="lg"
            className="gap-2"
          >
            <Link to="/contact/nous-contacter">
              Me contacter
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Offre Jour J Section */}
      <div id="jour-j-section" className="bg-gradient-to-r from-wedding-olive/5 to-wedding-cream/20 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block bg-wedding-olive/10 text-wedding-olive px-3 py-1 rounded-full text-sm font-medium mb-4">
            Coming soon
          </div>
          <h2 className="text-2xl md:text-3xl font-serif mb-4 text-black">
            Offre spéciale Jour J – Bientôt disponible
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Coordination, planning, hotline : une offre premium en préparation pour une journée vraiment sereine.
          </p>
          <Button 
            variant="outline"
            size="lg"
            disabled
            className="gap-2"
          >
            Prévenez-moi au lancement
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
};

const Planification = () => {
  return (
    <ServiceTemplate 
      title=""
      description="Organisez chaque étape de votre mariage sans charge mentale"
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
