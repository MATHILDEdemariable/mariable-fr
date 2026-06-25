import React from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, BellOff, Smartphone, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { usePushNotifications } from '@/hooks/usePushNotifications';

/**
 * Toggle pour activer/désactiver les notifications push mobiles.
 * - Sur preview Lovable et iframes : affiche un message d'info (les SW n'y sont pas enregistrés).
 * - Sur iOS Safari non-installé : invite à installer la PWA d'abord.
 */
const PushNotificationToggle: React.FC = () => {
  const { t } = useTranslation('dashboard');
  const { status, loading, standalone, enable, disable } = usePushNotifications();
  const { toast } = useToast();

  const handleToggle = async (checked: boolean) => {
    if (checked) {
      const res = await enable();
      if (!res.ok) {
        const msg =
          res.error === 'denied'
            ? t('push.permissionDenied', 'Vous avez refusé les notifications. Réactivez-les dans les réglages du navigateur.')
            : res.error === 'unsupported'
            ? t('push.unsupported', 'Votre navigateur ne supporte pas les notifications push.')
            : t('push.error', 'Impossible d\'activer les notifications.');
        toast({ title: t('push.errorTitle', 'Notifications'), description: msg, variant: 'destructive' });
      } else {
        toast({ title: t('push.enabledTitle', 'Notifications activées'), description: t('push.enabledDesc', 'Vous recevrez les rappels Mariable sur cet appareil.') });
      }
    } else {
      const res = await disable();
      if (res.ok) {
        toast({ title: t('push.disabledTitle', 'Notifications désactivées') });
      }
    }
  };

  // iOS Safari : Apple impose l'installation PWA pour recevoir les push
  const isIos = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);
  const needsInstallOnIos = isIos && !standalone;

  return (
    <div className="border-t pt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
        <Bell className="w-4 h-4" />
        {t('push.title', 'Notifications mobiles')}
      </h3>

      {status === 'unsupported' && (
        <p className="text-sm text-gray-500">
          {t('push.unsupported', 'Votre navigateur ne supporte pas les notifications push.')}
        </p>
      )}

      {status === 'preview' && (
        <p className="text-sm text-gray-500">
          {t('push.previewOnly', 'Les notifications sont actives uniquement sur le site publié (mariable.fr).')}
        </p>
      )}

      {needsInstallOnIos && status !== 'unsupported' && (
        <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-sm text-amber-900 flex gap-2">
          <Smartphone className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {t('push.iosInstall', 'Sur iPhone, ajoutez Mariable à votre écran d\'accueil (Partager → Sur l\'écran d\'accueil) pour activer les notifications.')}
          </span>
        </div>
      )}

      {(status === 'default' || status === 'subscribed' || status === 'denied') && !needsInstallOnIos && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium">
              {status === 'subscribed'
                ? t('push.activeOnDevice', 'Activées sur cet appareil')
                : status === 'denied'
                ? t('push.blocked', 'Bloquées par le navigateur')
                : t('push.activate', 'Activer les notifications')}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {t('push.purpose', 'Rappels J-X, devis, RSVP et nouveautés.')}
            </p>
          </div>
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
          ) : (
            <Switch
              checked={status === 'subscribed'}
              onCheckedChange={handleToggle}
              disabled={status === 'denied'}
              aria-label={t('push.title', 'Notifications mobiles')}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PushNotificationToggle;
