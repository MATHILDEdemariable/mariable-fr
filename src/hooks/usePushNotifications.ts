import { useEffect, useState, useCallback } from 'react';
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  getCurrentSubscription,
  getCurrentPermission,
  isStandalone,
} from '@/lib/pushNotifications';

export type PushStatus = 'unsupported' | 'preview' | 'denied' | 'default' | 'subscribed';

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>('default');
  const [loading, setLoading] = useState(true);
  const [standalone, setStandalone] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStandalone(isStandalone());
      if (!isPushSupported()) {
        setStatus('unsupported');
        return;
      }
      const perm = await getCurrentPermission();
      if (perm === 'denied') {
        setStatus('denied');
        return;
      }
      const sub = await getCurrentSubscription();
      if (sub) {
        setStatus('subscribed');
      } else if (perm === 'default') {
        setStatus('default');
      } else {
        // granted mais pas abonné
        setStatus('default');
      }
    } catch (e) {
      console.error('usePushNotifications refresh', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enable = useCallback(async () => {
    setLoading(true);
    const res = await subscribeToPush();
    await refresh();
    setLoading(false);
    return res;
  }, [refresh]);

  const disable = useCallback(async () => {
    setLoading(true);
    const res = await unsubscribeFromPush();
    await refresh();
    setLoading(false);
    return res;
  }, [refresh]);

  return { status, loading, standalone, enable, disable, refresh };
}
