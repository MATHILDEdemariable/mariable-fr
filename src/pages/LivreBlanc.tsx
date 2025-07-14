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
      
      // Utiliser une URL publique directe pour éviter les problèmes de navigateur
      const publicUrl = `${supabase.storage.from('white-papers').getPublicUrl('guide-mariable.pdf').data.publicUrl}`;
      
      // Ouvrir dans un nouvel onglet pour déclencher le téléchargement
      window.open(publicUrl, '_blank');

      toast({
        title: "Téléchargement démarré",
        description: "Votre guide du jour J est en cours de téléchargement.",
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
              Guide de Coordination du Jour J
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              10 pages d'expertise pour une coordination parfaite de votre jour J avec rétro-planning M-1 et checklists
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
                    10 pages d'expertise concentrée sur la coordination parfaite de votre jour J
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Rétro-planning M-1 détaillé</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Checklists jour J essentielles</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Organisation minute par minute</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Coordination équipe et prestataires</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-primary" />
                      <span>Gestion des imprévus</span>
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
                  PDF • 10 pages • Gratuit
                </p>
              </div>
            </div>

            {/* Image/Aperçu */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
                <div className="bg-white rounded-lg shadow-lg p-8 mx-auto max-w-sm">
                  <FileText className="h-24 w-24 text-primary mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-primary mb-2">
                    Guide Coordination Jour J
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Par l'équipe Mariable
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      10 pages d'expertise
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
                <h3 className="font-semibold">Coordination Experte</h3>
                <p className="text-sm text-muted-foreground">
                  Méthodes éprouvées pour une coordination sans stress du jour J
                </p>
              </div>
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Checklists Pratiques</h3>
                <p className="text-sm text-muted-foreground">
                  Rétro-planning M-1 et checklists jour J immédiatement utilisables
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