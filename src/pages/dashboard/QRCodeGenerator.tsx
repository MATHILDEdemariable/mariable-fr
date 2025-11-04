import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeForm } from '@/components/qrcode/QRCodeForm';
import { QRCodeList } from '@/components/qrcode/QRCodeList';
import { useQRCodes } from '@/hooks/useQRCodes';
import { Loader2, QrCode } from 'lucide-react';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const QRCodeGeneratorPage: React.FC = () => {
  const { qrCodes, isLoading, createQRCode, deleteQRCode } = useQRCodes();
  
  const { 
    executeAction, 
    showPremiumModal, 
    closePremiumModal 
  } = usePremiumAction({
    feature: "Générateur QR Code",
    description: "Créez et gérez des QR codes illimités pour votre cagnotte, site web et liens importants"
  });
  
  const handleCreate = async (title: string, url: string) => {
    executeAction(async () => {
      await createQRCode(title, url);
    });
  };
  
  const handleDelete = async (id: string) => {
    executeAction(async () => {
      await deleteQRCode(id);
    });
  };

  return (
    <>
      <Helmet>
        <title>Générateur QR Code | Mariable</title>
        <meta name="description" content="Créez des QR codes pour votre cagnotte de mariage et autres liens importants" />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <QrCode className="h-8 w-8 text-wedding-olive" />
          <h1 className="text-3xl font-bold text-gray-900">Générateur QR Code</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
            <CardDescription>
              Créez des QR codes personnalisés pour votre mariage. Parfait pour partager votre cagnotte en ligne, 
              votre site web, ou tout autre lien important. Vos invités pourront scanner le code avec leur smartphone 
              pour accéder directement au lien.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Créer un nouveau QR Code</CardTitle>
            <CardDescription>
              Entrez le lien de votre cagnotte ou tout autre URL que vous souhaitez partager
            </CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeForm onSubmit={handleCreate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mes QR Codes</CardTitle>
            <CardDescription>
              Gérez vos QR codes sauvegardés et téléchargez-les en PDF
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
              </div>
            ) : (
              <QRCodeList qrCodes={qrCodes} onDelete={handleDelete} />
            )}
          </CardContent>
        </Card>
      </div>
      
      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature="Générateur QR Code"
        description="Créez et gérez des QR codes illimités pour votre cagnotte, site web et liens importants"
      />
    </>
  );
};

export default QRCodeGeneratorPage;
