// Helper PWA + Push Notifications côté client
// Garde-fou Lovable : aucun service worker n'est enregistré en preview/dev.

import { supabase } from '@/integrations/supabase/client';

// Clé publique VAPID (publique = OK dans le bundle)
export const VAPID_PUBLIC_KEY =
  'BNOuFWqQS-7LoqF0H69VZ53PRKEeFnEwHTV2bAnvc4ai5K9g9fn8hRfRgqwI83Xgqv_us0Q30O8HxyIWN6l1c2Y';

const SW_PATH = '/push-sw.js';

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** Bloque l'enregistrement SW dans les contextes preview Lovable et iframes. */
function canRegisterServiceWorker(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    if (window.self !== window.top) return false;
  } catch {
    return false;
  }
  const h = window.location.hostname;
  const blockedPatterns = [
    'localhost',
    '127.0.0.1',
    '.lovableproject.com',
    '.lovableproject-dev.com',
    '.beta.lovable.dev',
  ];
  if (h.startsWith('id-preview--') || h.startsWith('preview--')) return false;
  if (blockedPatterns.some((p) => h === p.replace(/^\./, '') || h.endsWith(p))) return false;
  if (new URLSearchParams(window.location.search).get('sw') === 'off') return false;
  return true;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const arr = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) arr[i] = rawData.charCodeAt(i);
  return arr;
}

async function getRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported() || !canRegisterServiceWorker()) return null;
  const existing = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (existing) return existing;
  return navigator.serviceWorker.register(SW_PATH, { scope: '/' });
}

export async function getCurrentPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export async function subscribeToPush(): Promise<{ ok: boolean; error?: string }> {
  if (!isPushSupported()) return { ok: false, error: 'unsupported' };
  if (!canRegisterServiceWorker()) return { ok: false, error: 'preview' };

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return { ok: false, error: 'denied' };

  const reg = await getRegistration();
  if (!reg) return { ok: false, error: 'no-registration' };

  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  const { error } = await supabase.functions.invoke('push-subscribe', {
    body: { subscription: sub.toJSON() },
  });
  if (error) return { ok: false, error: error.message };

  return { ok: true };
}

export async function unsubscribeFromPush(): Promise<{ ok: boolean; error?: string }> {
  if (!isPushSupported() || !canRegisterServiceWorker()) return { ok: true };
  const reg = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (!reg) return { ok: true };
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return { ok: true };

  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  const { error } = await supabase.functions.invoke('push-unsubscribe', {
    body: { endpoint },
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function getCurrentSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported() || !canRegisterServiceWorker()) return null;
  const reg = await navigator.serviceWorker.getRegistration(SW_PATH);
  if (!reg) return null;
  return reg.pushManager.getSubscription();
}

/** Détecte si l'app tourne en mode "installée" (PWA / standalone). */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  // iOS
  // @ts-expect-error - standalone is iOS-specific
  if (window.navigator.standalone === true) return true;
  return window.matchMedia('(display-mode: standalone)').matches;
}
