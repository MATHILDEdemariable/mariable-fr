import React from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeForm } from '@/components/qrcode/QRCodeForm';
import { QRCodeList } from '@/components/qrcode/QRCodeList';
import { useQRCodes } from '@/hooks/useQRCodes';
import { Loader2, QrCode } from 'lucide-react';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const QRCodeGeneratorPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  const { qrCodes, isLoading, createQRCode, deleteQRCode } = useQRCodes();

  const {
    executeAction,
    showPremiumModal,
    closePremiumModal
  } = usePremiumAction({
    feature: t('qrcode.premiumFeature'),
    description: t('qrcode.premiumDescription')
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
        <title>{t('qrcode.pageTitle')}</title>
        <meta name="description" content={t('qrcode.pageDescription')} />
      </Helmet>

      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <QrCode className="h-8 w-8 text-wedding-olive" />
          <h1 className="text-3xl font-bold text-gray-900">{t('qrcode.title')}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('qrcode.howItWorks')}</CardTitle>
            <CardDescription>{t('qrcode.howItWorksDesc')}</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('qrcode.createTitle')}</CardTitle>
            <CardDescription>{t('qrcode.createDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeForm onSubmit={handleCreate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('qrcode.listTitle')}</CardTitle>
            <CardDescription>{t('qrcode.listDesc')}</CardDescription>
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
        feature={t('qrcode.premiumFeature')}
        description={t('qrcode.premiumDescription')}
      />
    </>
  );
};

export default QRCodeGeneratorPage;
