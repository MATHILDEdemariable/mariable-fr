import { Helmet } from 'react-helmet-async';
import { FileText, Download, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const GuidesPage = () => {
  const { toast } = useToast();
  const { executeAction, showPremiumModal, closePremiumModal, isPremium, feature, description } = usePremiumAction({
    feature: 'Guides PDF Premium',
    description: 'Téléchargez nos guides exclusifs pour organiser votre mariage parfait.'
  });

  const guides = [
    {
      id: 'jour-j',
      title: 'Guide Jour-J',
      description: 'Tous les conseils pour gérer le jour de votre mariage',
      icon: FileText,
      pdfUrl: '/guide-jour-j',
      available: true
    },
    {
      id: 'debut-organisation',
      title: 'Guide Organisation Débutants',
      description: 'Les premières étapes pour bien démarrer votre organisation',
      icon: FileText,
      pdfUrl: '/guide-debutant',
      available: true
    },
    {
      id: 'prestataires',
      title: 'Guide Prestataires',
      description: 'Comment choisir et gérer vos prestataires',
      icon: FileText,
      pdfUrl: '/guide-prestataires.pdf',
      available: true
    },
    {
      id: 'checklist-mariee',
      title: 'Checklist Mariée',
      description: 'La liste complète des préparatifs pour la mariée',
      icon: FileText,
      pdfUrl: '/guide-checklist-mariee.pdf',
      available: true
    },
    {
      id: 'checklist-proche',
      title: 'Checklist Proche',
      description: 'Guide pour les témoins et proches aidants',
      icon: FileText,
      pdfUrl: '/guide-checklist-proche.pdf',
      available: true
    }
  ];

  const handleDownload = (guide: typeof guides[0]) => {
    if (!guide.available) {
      toast({
        title: "Document à venir",
        description: "Ce guide PDF sera bientôt disponible au téléchargement.",
      });
      return;
    }

    executeAction(() => {
      window.open(guide.pdfUrl, '_blank');
    });
  };

  return (
    <>
      <Helmet>
        <title>Guides PDF - Mon Mariage</title>
        <meta 
          name="description" 
          content="Téléchargez nos guides pratiques pour votre mariage : Jour-J, Organisation, Prestataires et Checklists." 
        />
      </Helmet>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
            Nos Guides PDF
          </h1>
          <p className="text-muted-foreground">
            Téléchargez nos guides pratiques pour vous accompagner dans l'organisation de votre mariage
          </p>
          {!isPremium && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg text-sm text-primary">
              <Lock className="h-4 w-4" />
              Fonctionnalité Premium - Abonnez-vous pour télécharger
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-lg transition-shadow border border-border">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-muted text-foreground flex items-center justify-center mx-auto mb-3">
                  <guide.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg font-serif">{guide.title}</CardTitle>
                <CardDescription>{guide.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button 
                  onClick={() => handleDownload(guide)}
                  className="w-full bg-primary hover:bg-primary/90 rounded-none"
                  disabled={!guide.available}
                >
                  {!isPremium && <Lock className="h-4 w-4 mr-2" />}
                  <Download className="h-4 w-4 mr-2" />
                  {guide.available ? 'Télécharger' : 'Bientôt disponible'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted border border-border text-center">
          <p className="text-sm text-foreground">
            <strong>Note :</strong> Les guides s'ouvriront dans un nouvel onglet pour consultation et téléchargement.
          </p>
        </div>
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={feature}
        description={description}
      />
    </>
  );
};

export default GuidesPage;
