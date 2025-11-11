import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Users, Mail } from 'lucide-react';
import GuestListManager from '@/components/rsvp/GuestListManager';
import RSVPManagement from './RSVPManagement';

const RSVPTabs: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">RSVP & Liste d'invités</h1>
        <p className="text-muted-foreground mt-2">
          Gérez votre liste d'invités et les confirmations de présence
        </p>
      </div>

      <Tabs defaultValue="guests" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Liste invités
          </TabsTrigger>
          <TabsTrigger value="rsvp" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Réponses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="mt-6">
          <GuestListManager />
        </TabsContent>

        <TabsContent value="rsvp" className="mt-6">
          <RSVPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSVPTabs;
