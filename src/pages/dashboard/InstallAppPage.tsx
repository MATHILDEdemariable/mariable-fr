import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Share, PlusSquare, MoreVertical, Check, Apple, Chrome, Copy, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown';

const InstallAppPage = () => {
  const { t } = useTranslation('weddingDay');
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
    toast({ title: t('installApp.copied'), description: t('installApp.copiedDesc') });
  };

  const IOSInstructions = () => (
    <Card className="border-2 border-wedding-olive/20">
      <CardHeader className="flex flex-row items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Apple className="h-6 w-6" />
        </div>
        <CardTitle>{t('installApp.iosTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
                {n}
              </div>
              <div>
                <p className="font-medium">{t(`installApp.iosStep${n}Title`)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {n === 2 && <Share className="inline h-4 w-4 mr-1" />}
                  {n === 3 && <PlusSquare className="inline h-4 w-4 mr-1" />}
                  {t(`installApp.iosStep${n}Desc`)}
                </p>
              </div>
            </div>
          ))}
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
        <CardTitle>{t('installApp.androidTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-start gap-4 p-4 bg-muted rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-wedding-olive text-white rounded-full flex items-center justify-center font-bold">
                {n}
              </div>
              <div>
                <p className="font-medium">{t(`installApp.androidStep${n}Title`)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {n === 2 && <MoreVertical className="inline h-4 w-4 mr-1" />}
                  {t(`installApp.androidStep${n}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const DesktopInstructions = () => (
    <Card className="border-2 border-wedding-olive/20">
      <CardHeader>
        <CardTitle>{t('installApp.desktopTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{t('installApp.desktopDesc')}</p>
        <div className="p-4 bg-muted rounded-lg space-y-1">
          <p className="font-medium text-sm">{t('installApp.desktopCouple')}</p>
          <p className="text-sm text-muted-foreground">{t('installApp.desktopCoupleDesc')}</p>
          <code className="text-sm text-wedding-olive break-all">mariable.fr/dashboard</code>
        </div>
        <div className="p-4 bg-muted rounded-lg space-y-1">
          <p className="font-medium text-sm">{t('installApp.desktopGuests')}</p>
          <p className="text-sm text-muted-foreground">{t('installApp.desktopGuestsDesc')}</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Helmet>
        <title>{t('installApp.pageTitle')}</title>
        <meta name="description" content={t('installApp.pageDescription')} />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Smartphone className="h-6 w-6 text-wedding-olive" />
            {t('installApp.title')}
          </h1>
          <p className="text-muted-foreground mt-2">{t('installApp.subtitle')}</p>
        </div>

        <Card className="bg-wedding-olive/5 border-wedding-olive/20">
          <CardContent className="p-4">
            <p className="font-medium text-sm mb-2 flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              {t('installApp.shareLabel')}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('installApp.whyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {['why1', 'why2', 'why3', 'why4'].map((k) => (
                <li key={k} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: t(`installApp.${k}`) }} />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {deviceType === 'ios' && (
          <>
            <Alert className="bg-blue-50 border-blue-200">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">{t('installApp.iosDetected')}</AlertDescription>
            </Alert>
            <IOSInstructions />
            <AndroidInstructions />
          </>
        )}

        {deviceType === 'android' && (
          <>
            <Alert className="bg-green-50 border-green-200">
              <Smartphone className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{t('installApp.androidDetected')}</AlertDescription>
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
