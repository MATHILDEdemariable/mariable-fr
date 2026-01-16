import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Share, PlusSquare, MoreVertical, Check, Apple, Chrome, Copy, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

const InstallAppPage = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>('unknown');
  const { toast } = useToast();
  const shareableUrl = 'https://mariable.fr/installer-app';

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setDeviceType('ios');
    } else if (/android/.test(userAgent)) {
      setDeviceType('android');
    } else {
      setDeviceType('desktop');
    }
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    toast({ title: "Lien copié !", description: "Partagez-le avec vos proches" });
  };

  const IOSInstructions = () => (
    <Card className="border-2 border-wedding-olive/20">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Apple className="h-6 w-6" />
        </div>
        <CardTitle>Installation sur iPhone / iPad (Safari)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Ouvrez Mariable dans Safari</p>
              <p className="text-sm text-muted-foreground mt-1">
                Assurez-vous d'utiliser le navigateur Safari (pas Chrome ou autre)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Appuyez sur le bouton "Partager"</p>
              <p className="text-sm text-muted-foreground mt-1">
                C'est l'icône <Share className="inline h-4 w-4" /> en bas de l'écran (carré avec une flèche vers le haut)
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Faites défiler et appuyez sur "Sur l'écran d'accueil"</p>
              <p className="text-sm text-muted-foreground mt-1">
                <PlusSquare className="inline h-4 w-4" /> Cette option peut nécessiter de faire défiler le menu vers le bas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-medium">Confirmez en appuyant sur "Ajouter"</p>
              <p className="text-sm text-muted-foreground mt-1">
                L'icône Mariable apparaîtra sur votre écran d'accueil !
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const AndroidInstructions = () => (
    <Card className="border-2 border-wedding-olive/20">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Chrome className="h-6 w-6" />
        </div>
        <CardTitle>Installation sur Android (Chrome)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Ouvrez Mariable dans Chrome</p>
              <p className="text-sm text-muted-foreground mt-1">
                Utilisez le navigateur Google Chrome pour de meilleurs résultats
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Appuyez sur le menu (3 points)</p>
              <p className="text-sm text-muted-foreground mt-1">
                <MoreVertical className="inline h-4 w-4" /> Les 3 points verticaux se trouvent en haut à droite de l'écran
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Appuyez sur "Ajouter à l'écran d'accueil"</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ou "Installer l'application" si cette option apparaît
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
              4
            </div>
            <div>
              <p className="font-medium">Confirmez l'installation</p>
              <p className="text-sm text-muted-foreground mt-1">
                L'icône Mariable sera ajoutée à votre écran d'accueil !
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const DesktopInstructions = () => (
    <Card className="border-2 border-wedding-olive/20">
      <CardHeader>
        <CardTitle>Accédez depuis votre mobile</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Pour installer Mariable comme une application, ouvrez cette page depuis votre smartphone ou tablette, 
          puis suivez les instructions qui s'afficheront automatiquement.
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-medium text-sm">URL à ouvrir sur mobile :</p>
          <code className="text-sm text-wedding-olive break-all">mariable.fr/dashboard</code>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>Installer l'application | Mariable</title>
        <meta name="description" content="Installez Mariable sur votre téléphone pour un accès rapide à vos outils de planification de mariage." />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-wedding-olive" />
            Installer Mariable sur votre mobile
          </h1>
          <p className="text-muted-foreground mt-2">
            Accédez rapidement à tous vos outils de planification de mariage depuis votre écran d'accueil.
          </p>
        </div>

        {/* Lien partageable */}
        <Card className="bg-wedding-olive/5 border-wedding-olive/20">
          <CardContent className="p-4">
            <p className="font-medium text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              Partagez ce tutoriel avec vos proches :
            </p>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-white px-3 py-2 rounded flex-1 text-wedding-olive break-all">
                {shareableUrl}
              </code>
              <Button size="sm" variant="outline" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Avantages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pourquoi installer l'application ?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span><strong>Accès instantané</strong> - Un tap et vous êtes connecté à vos outils</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span><strong>Mode plein écran</strong> - Interface plus agréable sans la barre du navigateur</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span><strong>Toujours à portée de main</strong> - L'icône sur votre écran d'accueil</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span><strong>100% gratuit</strong> - Pas de téléchargement depuis l'App Store</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Instructions selon l'appareil */}
        {deviceType === 'ios' && (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Nous avons détecté que vous utilisez un iPhone/iPad. Suivez les instructions ci-dessous pour Safari.
              </AlertDescription>
            </Alert>
            <IOSInstructions />
            <AndroidInstructions />
          </>
        )}

        {deviceType === 'android' && (
          <>
            <Alert className="bg-green-50 border-green-200">
              <Smartphone className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Nous avons détecté que vous utilisez Android. Suivez les instructions ci-dessous pour Chrome.
              </AlertDescription>
            </Alert>
            <AndroidInstructions />
            <IOSInstructions />
          </>
        )}

        {deviceType === 'desktop' && (
          <>
            <DesktopInstructions />
            <div className="grid md:grid-cols-2 gap-6">
              <IOSInstructions />
              <AndroidInstructions />
            </div>
          </>
        )}

        {deviceType === 'unknown' && (
          <div className="grid md:grid-cols-2 gap-6">
            <IOSInstructions />
            <AndroidInstructions />
          </div>
        )}
      </div>
    </>
  );
};

export default InstallAppPage;
