import { useEffect, useState } from 'react';
import { Bell, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  isPushSupported,
  getCurrentPermission,
  getCurrentSubscription,
  subscribeToPush,
  isStandalone,
} from '@/lib/pushNotifications';

const DISMISS_KEY = 'push-banner-dismissed-at';
const DISMISS_DAYS = 2;

const PushNotificationBanner = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      if (!isPushSupported()) return;
      const perm = await getCurrentPermission();
      if (perm === 'granted') {
        // Vérifie qu'une souscription est bien active
        const sub = await getCurrentSubscription();
        if (sub) return;
      }
      if (perm === 'denied') return;

      const dismissedAt = localStorage.getItem(DISMISS_KEY);
      if (dismissedAt) {
        const days = (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
        if (days < DISMISS_DAYS) return;
      }
      setVisible(true);
    };
    check();
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    try {
      const res = await subscribeToPush();
      if (res.ok) {
        toast.success('Notifications activées 🔔');
        setVisible(false);
      } else if (res.error === 'preview') {
        toast.info('Les notifications fonctionnent uniquement sur l’app publiée / installée.');
        setVisible(false);
      } else if (res.error === 'denied') {
        toast.error('Autorisation refusée. Réactivez-la dans les réglages du navigateur.');
        setVisible(false);
      } else if (res.error === 'unsupported') {
        toast.error("Votre navigateur ne supporte pas les notifications push.");
        setVisible(false);
      } else {
        toast.error(res.error || "Impossible d'activer les notifications.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  if (!visible) return null;

  const standalone = isStandalone();

  return (
    <div className="relative bg-gradient-to-r from-editorial-beige to-white border border-wedding-olive/20 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="bg-wedding-olive/10 p-3 rounded-lg shrink-0">
        <Bell className="h-5 w-5 text-wedding-olive" />
      </div>
      <div className="flex-1 min-w-0 pr-6 sm:pr-0">
        <h3 className="text-sm sm:text-base font-serif text-editorial-noir">
          Activez les notifications
        </h3>
        <p className="text-xs sm:text-sm text-editorial-noir/70 mt-1 leading-relaxed">
          Recevez vos rappels rétroplanning, réponses RSVP et messages de prestataires en temps réel.
          {!standalone && (
            <span className="block mt-1 italic text-editorial-noir/50">
              Astuce : installez l’app sur votre écran d’accueil pour recevoir aussi les notifs en arrière-plan.
            </span>
          )}
        </p>
      </div>
      <Button
        onClick={handleEnable}
        disabled={loading}
        className="bg-wedding-olive hover:bg-wedding-olive/90 text-white shrink-0"
        size="sm"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Bell className="h-4 w-4 mr-2" />}
        Activer
      </Button>
      <button
        onClick={handleDismiss}
        aria-label="Ignorer"
        className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-1 text-editorial-noir/40 hover:text-editorial-noir"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default PushNotificationBanner;
