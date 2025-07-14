import React, { useState } from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const LivreBlanc = () => {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Récupérer l'URL de téléchargement du fichier
      const { data, error } = await supabase.storage
        .from('white-papers')
        .createSignedUrl('guide-mariable.pdf', 3600); // URL valide 1 heure
      
      if (error) {
        toast({
          title: "Erreur de téléchargement",
          description: "Le fichier n'est pas encore disponible. Veuillez réessayer plus tard.",
          variant: "destructive",
        });
        return;
      }

      // Déclencher le téléchargement
      const link = document.createElement('a');
      link.href = data.signedUrl;
      link.download = 'Guide-Mariable-Livre-Blanc.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Téléchargement démarré",
        description: "Votre livre blanc est en cours de téléchargement.",
      });

    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Livre Blanc - Guide du Mariage Moderne | Mariable"
        description="Téléchargez gratuitement notre guide complet pour organiser votre mariage moderne et élégant. Conseils d'experts, checklist et astuces exclusives."
        keywords="livre blanc mariage, guide mariage gratuit, organisation mariage, conseils mariage"
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">
              Le Guide du Mariage Moderne
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Découvrez tous nos secrets pour organiser un mariage moderne, élégant et sans stress
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Présentation du livre blanc */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <FileText className="h-6 w-6 text-primary" />
                    Votre guide gratuit
                  </CardTitle>
                  <CardDescription>
                    Un livre blanc complet de 50+ pages rempli de conseils pratiques et d'expertise
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Planning détaillé mois par mois</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Budget optimisé et réaliste</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Sélection des prestataires</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Coordination du jour J</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Tendances et inspirations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de téléchargement */}
              <div className="text-center">
                <Button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  size="lg"
                  className="w-full md:w-auto px-8 py-6 text-lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  {isDownloading ? 'Téléchargement...' : 'Télécharger le guide gratuit'}
                </Button>
                <p className="text-sm text-muted-foreground mt-2">
                  PDF • 50+ pages • Gratuit
                </p>
              </div>
            </div>

            {/* Image/Aperçu */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-sm">
                  <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-primary mb-2">
                    Guide du Mariage Moderne
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Par l'équipe Mariable
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      50+ pages d'expertise
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section témoignages ou bénéfices */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-serif text-primary mb-8">
              Pourquoi télécharger ce guide ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Expertise Reconnue</h3>
                <p className="text-sm text-muted-foreground">
                  Conseils d'experts en organisation de mariages modernes
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Contenu Pratique</h3>
                <p className="text-sm text-muted-foreground">
                  Templates, checklists et outils prêts à utiliser
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <Download className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Accès Immédiat</h3>
                <p className="text-sm text-muted-foreground">
                  Téléchargement instantané et gratuit
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivreBlanc;