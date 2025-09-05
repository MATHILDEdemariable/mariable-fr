import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  MessageCircle, 
  Search,
  CheckCircle,
  Calendar,
  Users,
  Calculator,
  FileText,
  Share2,
  Target
} from 'lucide-react';
import { useOnboarding } from '@/components/onboarding/OnboardingProvider';

const HelpPage: React.FC = () => {
  const { startOnboarding, isCompleted } = useOnboarding();

  const features = [
    {
      title: "Check-list personnalisée",
      description: "Créez votre checklist personnalisée adaptée à vos besoins et préférences",
      section: "Préparation mariage"
    },
    {
      title: "Quiz & Checklist",
      description: "Découvrez votre style et suivez votre checklist de base",
      section: "Préparation mariage"
    },
    {
      icon: Calculator,
      title: "Budget",
      description: "Calculez et gérez votre budget mariage selon vos critères",
      section: "Avant votre mariage"
    },
    {
      icon: Target,
      title: "Mission Mariage",
      description: "Gérez vos tâches et coordonnez votre préparation",
      section: "Pendant la préparation"
    },
    {
      icon: Users,
      title: "Suivi Prestataires",
      description: "Centralisez les contacts et suivez vos prestataires",
      section: "Pendant la préparation"
    },
    {
      icon: Calendar,
      title: "Planning Jour-M",
      description: "Organisez votre journée mariage dans les moindres détails",
      section: "Jour-M"
    },
    {
      icon: FileText,
      title: "Conseils après mariage",
      description: "Conseils pour bien gérer l'après mariage : brunch, rangement, retours",
      section: "Après le jour-J"
    },
    {
      icon: FileText,
      title: "Documents",
      description: "Centralisez tous vos documents importants",
      section: "Jour-M"
    },
    {
      icon: Share2,
      title: "Partage",
      description: "Partagez votre planning avec famille et prestataires",
      section: "Collaboration"
    }
  ];

  const faq = [
    {
      question: "Comment utiliser la check-list personnalisée ?",
      answer: "Rendez-vous dans 'Check-list personnalisée' et décrivez votre situation pour générer une liste de tâches adaptée à votre mariage."
    },
    {
      question: "Quelle est la différence entre la check-list de base et personnalisée ?",
      answer: "La check-list de base contient les tâches essentielles universelles, tandis que la personnalisée s'adapte à vos spécificités (lieu, nombre d'invités, style, etc.)."
    },
    {
      question: "Comment commencer l'organisation de mon mariage ?",
      answer: "Commencez par le quiz de style pour définir vos préférences, puis utilisez la calculatrice budget pour estimer vos coûts."
    },
    {
      question: "Puis-je partager mon planning avec mes prestataires ?",
      answer: "Oui ! Utilisez le bouton 'Partager' pour créer un lien consultatif que vous pouvez envoyer à vos prestataires et votre famille."
    },
    {
      question: "Comment utiliser Mission Mariage ?",
      answer: "Mission Mariage vous permet de créer des tâches, les assigner à votre équipe et suivre l'avancement de votre préparation."
    },
    {
      question: "Que faire après mon mariage ?",
      answer: "Consultez la section 'Après le jour-J' pour des conseils sur le brunch du lendemain, le rangement, les retours de matériel et les remerciements."
    },
    {
      question: "Mes données sont-elles sauvegardées ?",
      answer: "Oui, toutes vos données sont automatiquement sauvegardées dans votre espace personnel sécurisé."
    }
  ];

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Mode d'emploi | Mariable</title>
        <meta name="description" content="Guide d'utilisation de votre espace mariage personnalisé" />
      </Helmet>

      {/* En-tête */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mode d'emploi</h1>
          <p className="text-muted-foreground mt-2">
            Découvrez toutes les fonctionnalités de votre espace mariage
          </p>
        </div>
      </div>

      {/* Tour guidé */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Play className="h-5 w-5 text-primary" />
            Tour guidé interactif
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">Visite guidée du dashboard</p>
              <p className="text-sm text-muted-foreground">
                {isCompleted 
                  ? "Vous avez terminé le tour guidé ! Vous pouvez le refaire à tout moment."
                  : "Découvrez toutes les fonctionnalités en 6 étapes simples"
                }
              </p>
            </div>
            <Button onClick={startOnboarding} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              {isCompleted ? 'Refaire le tour' : 'Commencer le tour'}
            </Button>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle className="h-4 w-4" />
              Tour guidé terminé
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fonctionnalités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-primary" />
            Fonctionnalités principales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3 p-3 rounded-lg border bg-card">
                <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{feature.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {feature.section}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <MessageCircle className="h-5 w-5 text-primary" />
            Questions fréquentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faq.map((item, index) => (
            <div key={index}>
              <h3 className="font-medium mb-2">{item.question}</h3>
              <p className="text-sm text-muted-foreground">{item.answer}</p>
              {index < faq.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Search className="h-5 w-5 text-primary" />
            Besoin d'aide supplémentaire ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Vous ne trouvez pas la réponse à votre question ? N'hésitez pas à nous contacter !
          </p>
          <Button variant="outline" className="w-full">
            <MessageCircle className="h-4 w-4 mr-2" />
            Nous contacter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpPage;