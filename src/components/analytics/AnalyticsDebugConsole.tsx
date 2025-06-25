
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  sendGTMEvent, 
  sendGA4Event, 
  trackPageView, 
  trackUserLogin, 
  trackWeddingToolUsage 
} from '@/utils/analytics';

interface AnalyticsEvent {
  timestamp: number;
  type: 'GTM' | 'GA4';
  event: string;
  data: any;
}

const AnalyticsDebugConsole: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Only initialize if we're in the browser and debugging is needed
    if (typeof window === 'undefined') return;

    try {
      // Initialize dataLayer safely if it doesn't exist
      if (!window.dataLayer) {
        window.dataLayer = [];
      }

      // Intercepter les événements dataLayer pour le debug seulement si dataLayer existe
      if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        const originalPush = window.dataLayer.push;
        window.dataLayer.push = function(...args) {
          try {
            const eventData = args[0];
            if (eventData && typeof eventData === 'object') {
              setEvents(prev => [...prev, {
                timestamp: Date.now(),
                type: 'GTM',
                event: eventData.event || 'unknown',
                data: eventData
              }]);
            }
            return originalPush.apply(this, args);
          } catch (error) {
            console.warn('Error intercepting dataLayer push:', error);
            return originalPush.apply(this, args);
          }
        };
      }

      // Intercepter gtag pour le debug seulement s'il existe
      if (window.gtag && typeof window.gtag === 'function') {
        const originalGtag = window.gtag;
        window.gtag = function(...args) {
          try {
            if (args[0] === 'event') {
              setEvents(prev => [...prev, {
                timestamp: Date.now(),
                type: 'GA4',
                event: args[1] || 'unknown',
                data: args[2] || {}
              }]);
            }
            return originalGtag.apply(this, args);
          } catch (error) {
            console.warn('Error intercepting gtag:', error);
            return originalGtag.apply(this, args);
          }
        };
      }

      setIsInitialized(true);
    } catch (error) {
      console.warn('Error initializing analytics debug console:', error);
      setIsInitialized(false);
    }
  }, []);

  const testEvents = () => {
    try {
      // Test quelques événements
      trackPageView('/debug', 'Analytics Debug Console');
      trackUserLogin('test');
      trackWeddingToolUsage('debug_console', 'test');
      
      sendGTMEvent({
        event: 'test_event',
        test_parameter: 'test_value',
        timestamp: Date.now()
      });
      
      sendGA4Event('test_custom_event', {
        custom_parameter: 'test_value',
        event_category: 'debug'
      });
    } catch (error) {
      console.warn('Error testing analytics events:', error);
    }
  };

  const clearEvents = () => {
    setEvents([]);
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsVisible(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          Debug Analytics {isInitialized ? '✓' : '⚠️'}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Console Analytics Debug</CardTitle>
            <Button 
              onClick={() => setIsVisible(false)}
              variant="ghost" 
              size="sm"
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={testEvents} size="sm" variant="outline">
              Test Events
            </Button>
            <Button onClick={clearEvents} size="sm" variant="outline">
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {!isInitialized && (
            <div className="text-xs text-amber-600 mb-2 p-2 bg-amber-50 rounded">
              ⚠️ Analytics non initialisé - certaines fonctions peuvent ne pas fonctionner
            </div>
          )}
          
          <ScrollArea className="h-64">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucun événement détecté
              </p>
            ) : (
              <div className="space-y-2">
                {events.slice(-10).reverse().map((event, index) => (
                  <div key={`${event.timestamp}-${index}`} className="text-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={event.type === 'GTM' ? 'default' : 'secondary'}>
                        {event.type}
                      </Badge>
                      <span className="font-medium">{event.event}</span>
                      <span className="text-muted-foreground ml-auto">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <div className="bg-gray-50 p-2 rounded text-xs overflow-x-auto">
                      <pre>{JSON.stringify(event.data, null, 2)}</pre>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="mt-2 text-xs text-muted-foreground">
            <p>GTM ID: GTM-MDB72FP3</p>
            <p>GA4 ID: G-CDL9YV3ZNK</p>
            <p>Total événements: {events.length}</p>
            <p>Status: {isInitialized ? 'Initialisé' : 'Non initialisé'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDebugConsole;
