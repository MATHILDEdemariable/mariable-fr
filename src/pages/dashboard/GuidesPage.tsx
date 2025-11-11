import { Helmet } from 'react-helmet-async';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PremiumGate from '@/components/premium/PremiumGate';
import { useToast } from '@/hooks/use-toast';

const GuidesPage = () => {
  const { toast } = useToast();

  const guides = [
    {
      id: 'jour-j',
      title: 'Guide Jour-J',
      description: 'Tous les conseils pour gérer le jour de votre mariage',
      icon: FileText,
      color: 'bg-wedding-olive/10 text-wedding-olive',
      pdfUrl: '/guide-jour-j',
      available: true
    },
    {
      id: 'debut-organisation',
      title: 'Guide Organisation Débutants',
      description: 'Les premières étapes pour bien démarrer votre organisation',
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
      pdfUrl: '/guide-debutant',
      available: true
    },
    {
      id: 'prestataires',
      title: 'Guide Prestataires',
      description: 'Comment choisir et gérer vos prestataires',
      icon: FileText,
      color: 'bg-purple-100 text-purple-600',
      pdfUrl: null,
      available: false
    },
    {
      id: 'checklist-mariee',
      title: 'Checklist Mariée',
      description: 'La liste complète des préparatifs pour la mariée',
      icon: FileText,
      color: 'bg-pink-100 text-pink-600',
      pdfUrl: null,
      available: false
    },
    {
      id: 'checklist-proche',
      title: 'Checklist Proche',
      description: 'Guide pour les témoins et proches aidants',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600',
      pdfUrl: null,
      available: false
    }
  ];

  const handleDownload = (guide: typeof guides[0]) => {
    if (guide.available && guide.pdfUrl) {
      window.open(guide.pdfUrl, '_blank');
    } else {
      toast({
        title: "Document à venir",
        description: "Ce guide PDF sera bientôt disponible au téléchargement.",
      });
    }
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

      <PremiumGate 
        feature="Nos Guides PDF"
        description="Accédez à nos guides pratiques exclusifs avec l'abonnement Premium"
      >
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-wedding-olive mb-2">
              Nos Guides PDF
            </h1>
            <p className="text-muted-foreground">
              Téléchargez nos guides pratiques pour vous accompagner dans l'organisation de votre mariage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${guide.color} flex items-center justify-center mb-3`}>
                    <guide.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => handleDownload(guide)}
                    className="w-full bg-wedding-olive hover:bg-wedding-olive/90"
                    disabled={!guide.available}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {guide.available ? 'Télécharger' : 'Bientôt disponible'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Note :</strong> Certains guides PDF sont en cours de finalisation. 
              Les guides disponibles s'ouvriront dans un nouvel onglet pour consultation et téléchargement.
            </p>
          </div>
        </div>
      </PremiumGate>
    </>
  );
};

export default GuidesPage;
