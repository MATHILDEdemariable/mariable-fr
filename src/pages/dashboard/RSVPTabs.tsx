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
        <TabsList className="grid w-full grid-cols-2 max-w-2xl">
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Liste Manuelle
          </TabsTrigger>
          <TabsTrigger value="rsvp" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Liste Avec l'envoi d'un Formulaire
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guests" className="mt-6">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2">Gestion manuelle de vos invités</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez et gérez vos invités directement dans l'application. Idéal pour suivre les confirmations, 
              notes personnelles et régimes alimentaires. Vous pouvez importer un fichier Excel ou ajouter les invités un par un.
            </p>
          </div>
          <GuestListManager />
        </TabsContent>

        <TabsContent value="rsvp" className="mt-6">
          <div className="mb-6 p-4 bg-muted/30 rounded-lg border">
            <h3 className="font-semibold mb-2">Collecte automatique des réponses</h3>
            <p className="text-sm text-muted-foreground">
              Créez un formulaire RSVP personnalisé et partagez-le avec vos invités par email ou lien. 
              Les réponses sont automatiquement collectées et centralisées ici pour un suivi en temps réel.
            </p>
          </div>
          <RSVPManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RSVPTabs;
