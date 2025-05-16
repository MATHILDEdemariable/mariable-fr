
import React, { useState } from 'react';
import { WeddingBrief, WeddingPlan } from './BriefContext';
import { Button } from '@/components/ui/button';
import { useBriefContext } from './BriefContext';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  Clock, 
  Euro, 
  ThumbsUp, 
  Download, 
  Share2, 
  Edit, 
  Calendar, 
  Building,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  brief: WeddingBrief;
}

const PlanViewer: React.FC<Props> = ({ brief }) => {
  const { generatePlan } = useBriefContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const plan = brief.generatedPlan;

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      await generatePlan(brief.id);
      toast({
        title: "Plan généré avec succès",
        description: "Votre plan de mariage est prêt à consulter !",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la génération du plan.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Sparkles className="h-12 w-12 text-wedding-olive mb-4" />
        <h3 className="text-2xl font-serif mb-2">Générer un plan personnalisé</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Votre assistant virtuel de mariage peut créer un plan détaillé basé sur vos préférences.
        </p>
        <Button 
          onClick={handleGeneratePlan} 
          disabled={isGenerating}
          className="bg-wedding-olive hover:bg-wedding-olive/90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating ? "Génération en cours..." : "Générer mon plan de mariage"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif mb-1">{plan.title}</h2>
          <p className="text-muted-foreground">
            Créé le {format(new Date(plan.createdAt), 'dd MMMM yyyy')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Télécharger en PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Personnaliser
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-wedding-olive" />
              Date de mariage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {brief.timeline.weddingDate 
                ? format(new Date(brief.timeline.weddingDate), 'dd MMMM yyyy')
                : "À déterminer"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Building className="h-4 w-4 mr-2 text-wedding-olive" />
              Style
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium capitalize">
              {brief.preferences.style || "Non spécifié"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center">
              <Users className="h-4 w-4 mr-2 text-wedding-olive" />
              Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {brief.budget.total.toLocaleString('fr-FR')} €
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary">Résumé</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
          <TabsTrigger value="timeline">Planning</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Résumé du plan</CardTitle>
              <CardDescription>
                Un aperçu de votre projet de mariage personnalisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{plan.summary}</p>
              
              <h4 className="font-medium mt-4">Répartition du budget</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(plan.budget_allocation).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-2 border rounded-md">
                    <span>{category}</span>
                    <span className="font-medium">{amount.toLocaleString('fr-FR')} €</span>
                  </div>
                ))}
              </div>
              
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Ce plan me convient
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="mt-4 space-y-4">
          {plan.recommendations.map((category) => (
            <Card key={category.category}>
              <CardHeader>
                <CardTitle>{category.category}</CardTitle>
                <CardDescription>
                  Suggestions personnalisées pour votre mariage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.suggestions.map((suggestion) => (
                    <Card key={suggestion.name} className="overflow-hidden">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        <Building className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-1">{suggestion.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                        <div className="flex items-center text-sm">
                          <Euro className="h-4 w-4 mr-1" />
                          {suggestion.estimated_cost.toLocaleString('fr-FR')} €
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Votre planning de mariage</CardTitle>
              <CardDescription>
                Les étapes clés pour préparer votre mariage sereinement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-gray-200" />
                
                {plan.timeline.map((milestone, index) => (
                  <div key={index} className="relative pl-10 pb-8">
                    <div className="absolute left-0 rounded-full bg-wedding-olive p-1.5">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <h4 className="font-medium text-lg">{milestone.date}</h4>
                    <p className="font-medium text-wedding-olive">{milestone.milestone}</p>
                    <ul className="mt-2 space-y-1">
                      {milestone.tasks.map((task, taskIndex) => (
                        <li key={taskIndex} className="flex items-start">
                          <span className="rounded-full bg-gray-200 p-0.5 mr-2 mt-1">
                            <span className="block h-1.5 w-1.5 rounded-full bg-gray-600" />
                          </span>
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlanViewer;
