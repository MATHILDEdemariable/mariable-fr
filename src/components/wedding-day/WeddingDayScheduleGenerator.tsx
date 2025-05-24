import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { WeddingDayQuiz } from './WeddingDayQuiz';
import { WeddingDayTimeline } from './WeddingDayTimeline';
import { QuizData, QuizFormValues, WeddingSchedule } from './types/scheduleTypes';
import { exportDashboardToPDF } from '@/services/pdfExportService';

const quizData: QuizData = {
  "inputs_mariage": {
    "ceremonie_civile_le_meme_jour": {
      "label": "La cérémonie civile a-t-elle lieu le même jour que la fête et l'autre cérémonie ?",
      "type": "choix",
      "options": ["oui", "non"]
    },
    "horaire_ceremonie_civile": {
      "label": "Heure exacte de la cérémonie civile",
      "type": "time",
      "duree": 30,
      "visible_si": {
        "ceremonie_civile_le_meme_jour": "oui"
      }
    },
    "type_ceremonie_principale": {
      "label": "Type de cérémonie principale",
      "type": "choix",
      "options": [
        { "valeur": "religieuse", "duree": 90 },
        { "valeur": "laïque", "duree": 60 }
      ]
    },
    "horaire_ceremonie_principale": {
      "label": "Heure exacte de la cérémonie principale",
      "type": "time"
    },
    "lieux_differents": {
      "label": "Les cérémonies et la réception ont-elles lieu à des endroits différents ?",
      "type": "choix",
      "options": ["oui", "non"]
    },
    "temps_de_trajet": {
      "label": "Temps de trajet entre les lieux (si différents)",
      "type": "number",
      "unit": "minutes",
      "visible_si": {
        "lieux_differents": "oui"
      }
    },
    "preparatifs_mariee": {
      "label": "Préparatifs de la mariée",
      "coiffure": {
        "label": "Coiffure",
        "type": "section",
        "lieu": {
          "label": "Lieu de coiffure",
          "type": "choix",
          "options": ["domicile", "salon"]
        }
      },
      "maquillage": {
        "label": "Maquillage",
        "type": "time"
      },
      "habillage": {
        "label": "Habillage",
        "type": "time"
      }
    },
    "first_look": {
      "label": "Souhaitez-vous organiser un first look ?",
      "type": "choix",
      "options": ["oui", "non"]
    },
    "moment_photos": {
      "label": "Quand souhaitez-vous faire les photos de couple ?",
      "type": "choix",
      "options": ["avant_cérémonie", "après_cérémonie", "entre_les_deux"]
    },
    "format_cocktail": {
      "label": "Durée du cocktail",
      "type": "choix",
      "options": [
        { "valeur": "court", "duree": 60 },
        { "valeur": "long", "duree": 120 }
      ]
    },
    "type_repas": {
      "label": "Format du repas",
      "type": "choix",
      "options": ["assis", "cocktail_dinatoire"]
    },
    "duree_repas": {
      "label": "Durée estimée du repas",
      "type": "choix",
      "options": [
        { "valeur": "rapide", "duree": 90 },
        { "valeur": "normal", "duree": 120 },
        { "valeur": "long", "duree": 150 }
      ]
    },
    "soiree": {
      "label": "Durée de la soirée dansante",
      "type": "choix",
      "options": [
        { "valeur": "pas_de_soiree", "duree": 0 },
        { "valeur": "jusqu_a_2h", "duree": 120 },
        { "valeur": "jusqu_a_4h", "duree": 240 },
        { "valeur": "plus_de_4h", "duree": 300 }
      ]
    },
    "temps_forts": {
      "label": "Éléments clés à intégrer dans le planning",
      "type": "multi-choix",
      "options": [
        { "valeur": "photos_groupe", "duree": 20 },
        { "valeur": "entree_maries", "duree": 10 },
        { "valeur": "discours", "duree": 5 },
        { "valeur": "decoupe_dessert", "duree": 15 },
        { "valeur": "animation_supplementaire", "duree": 20 }
      ]
    }
  }
};

export const WeddingDayScheduleGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("form");
  const [formData, setFormData] = useState<QuizFormValues | null>(null);
  const [schedule, setSchedule] = useState<WeddingSchedule | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleFormSubmit = (data: QuizFormValues, generatedSchedule: WeddingSchedule) => {
    setFormData(data);
    setSchedule(generatedSchedule);
    setActiveTab("results");
  };
  
  const handleReset = () => {
    setFormData(null);
    setSchedule(null);
    setActiveTab("form");
  };
  
  const handleExportPDF = async () => {
    if (!schedule) return;
    
    setLoading(true);
    
    try {
      toast({
        title: "Export PDF en cours",
        description: "Préparation de votre planning..."
      });
      
      // Import the dedicated planning PDF export service
      const { exportPlanningJourJToPDF } = await import('@/services/planningExportService');
      
      // Convert schedule events to the expected format
      const planningEvents = schedule.events.map(event => ({
        id: event.id,
        titre: event.title,
        description: event.description || '',
        heure_debut: event.startTime,
        heure_fin: event.endTime,
        duree_minutes: event.duration,
        categorie: event.category || 'Autres',
        position: 0,
        type: 'generated'
      }));
      
      const success = await exportPlanningJourJToPDF({
        events: planningEvents,
        weddingDate: formData?.inputs_mariage?.horaire_ceremonie_principale 
          ? `Planning du ${new Date().toLocaleDateString('fr-FR')}`
          : undefined,
        coupleNames: "Votre mariage"
      });
      
      if (success) {
        toast({
          title: "Export réussi",
          description: "Votre planning a été exporté en PDF"
        });
      } else {
        toast({
          title: "Erreur d'export",
          description: "Une erreur s'est produite lors de l'export en PDF",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur d'export",
        description: "Une erreur s'est produite lors de l'export en PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = () => {
    // For now, just show a toast that this feature is coming soon
    toast({
      title: "Fonctionnalité à venir",
      description: "Le partage du planning sera bientôt disponible."
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-serif">Générateur de Planning Jour J</h1>
        
        {schedule && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Recommencer
            </Button>
            
            <Button
              variant="outline"
              className="bg-wedding-olive/10 hover:bg-wedding-olive/20 text-wedding-olive flex items-center gap-2"
              onClick={handleExportPDF}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-wedding-olive border-t-transparent rounded-full animate-spin"></div>
                  Export...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Exporter en PDF
                </>
              )}
            </Button>
            
            <Button
              className="bg-wedding-olive hover:bg-wedding-olive/80 flex items-center gap-2"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Partager
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="form" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="form" disabled={activeTab === "results" && !formData}>
            Formulaire
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!schedule}>
            Résultats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Configurez votre jour J</CardTitle>
              <CardDescription>
                Répondez aux questions suivantes pour générer automatiquement le planning optimisé de votre journée de mariage.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WeddingDayQuiz quizData={quizData} onSubmit={handleFormSubmit} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="results">
          {schedule ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Votre Planning Jour J</CardTitle>
                <CardDescription>
                  Voici le planning optimisé pour votre journée de mariage.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <WeddingDayTimeline schedule={schedule} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleReset}>
                  Modifier les informations
                </Button>
                <Button 
                  className="bg-wedding-olive hover:bg-wedding-olive/80"
                  onClick={handleExportPDF}
                  disabled={loading}
                >
                  {loading ? "Export en cours..." : "Télécharger en PDF"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p>Veuillez remplir le formulaire pour générer votre planning.</p>
                <Button 
                  className="mt-4 bg-wedding-olive hover:bg-wedding-olive/80"
                  onClick={() => setActiveTab("form")}
                >
                  Aller au formulaire
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
