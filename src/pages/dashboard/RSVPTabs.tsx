import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Mail } from 'lucide-react';
import GuestListManager from '@/components/rsvp/GuestListManager';
import RSVPManagement from './RSVPManagement';

const RSVPTabs: React.FC = () => {
  const { t } = useTranslation('dashboard');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('rsvpTabs.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('rsvpTabs.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="guests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-2xl">
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('rsvpTabs.manualTab')}
          </TabsTrigger>
          <TabsTrigger value="rsvp" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            {t('rsvpTabs.formTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="mt-6">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2">{t('rsvpTabs.manualTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('rsvpTabs.manualDesc')}
            </p>
          </div>
          <GuestListManager />
        </TabsContent>

        <TabsContent value="rsvp" className="mt-6">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2">{t('rsvpTabs.formTitle')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('rsvpTabs.formDesc')}
            </p>
          </div>
          <RSVPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSVPTabs;
