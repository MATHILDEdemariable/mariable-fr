import { canTrack, onConsentChange, readChoice } from '@/lib/consent';

// Pixel du site historique + pixel du compte publicitaire MARIABLE.FR (campagne Essai Pro)
const META_PIXEL_IDS = ['1976814949641388', '2512188255941998'];
const HOTJAR_ID = 6424249;
const TRACKING_DELAY_MS = 3000;

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    _fbq?: MetaPixelFunction;
    hj?: ((...args: unknown[]) => void) & { q?: unknown[] };
    _hjSettings?: { hjid: number; hjsv: number };
  }
}

let isMetaLoaded = false;
let isHotjarLoaded = false;

const loadMetaPixel = () => {
  if (isMetaLoaded) {
    window.fbq?.('consent', 'grant');
    return;
  }
  isMetaLoaded = true;
  const fbqFunction: MetaPixelFunction = function (...args: unknown[]) {
    if (fbqFunction.callMethod) fbqFunction.callMethod.apply(fbqFunction, args);
    else fbqFunction.queue?.push(args);
  };
  if (!window._fbq) window._fbq = fbqFunction;
  fbqFunction.push = fbqFunction;
  fbqFunction.loaded = true;
  fbqFunction.version = '2.0';
  fbqFunction.queue = [];
  window.fbq = fbqFunction;
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  META_PIXEL_IDS.forEach((pixelId) => window.fbq('init', pixelId, {}, { agent: 'lovable' }));
  window.fbq('track', 'PageView');
  console.log('✅ Meta Pixel chargé après accord publicité');
};

const loadHotjar = () => {
  if (isHotjarLoaded) return;
  isHotjarLoaded = true;
  const hotjarFunction = ((...args: unknown[]) => {
    (hotjarFunction.q = hotjarFunction.q || []).push(args);
  }) as NonNullable<Window['hj']>;
  window.hj = window.hj || hotjarFunction;
  window._hjSettings = { hjid: HOTJAR_ID, hjsv: 6 };
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://static.hotjar.com/c/hotjar-${HOTJAR_ID}.js?sv=6`;
  document.head.appendChild(script);
};

const applyConsentedTracking = async () => {
  try {
    if (await canTrack('advertising')) loadMetaPixel();
    else if (isMetaLoaded) window.fbq?.('consent', 'revoke');

    if (await canTrack('analytics')) loadHotjar();
    else if (isHotjarLoaded && readChoice('analytics') === 'denied') window.location.reload();
  } catch (error) {
    console.error('❌ applyConsentedTracking failed:', error);
  }
};

/** Charge Meta Pixel et Hotjar uniquement si le visiteur l'autorise, et suit ses changements de choix. */
export const startConsentedTracking = () => {
  window.setTimeout(() => void applyConsentedTracking(), TRACKING_DELAY_MS);
  onConsentChange(() => void applyConsentedTracking());
};

/** Envoie un événement Meta seulement si l'accord publicité est donné. */
export const sendConsentedMetaEvent = async (
  eventName: string,
  parameters: Record<string, unknown>,
  eventId: string,
) => {
  try {
    if (!(await canTrack('advertising'))) return;
    loadMetaPixel();
    window.fbq('track', eventName, parameters, { eventID: eventId });
  } catch (error) {
    console.error('❌ sendConsentedMetaEvent failed:', error);
  }
};
