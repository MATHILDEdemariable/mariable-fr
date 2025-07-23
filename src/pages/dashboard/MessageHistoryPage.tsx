import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Calendar, Clock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface VendorContact {
  id: string;
  message: string;
  email_client: string;
  email_presta: string;
  created_at: string;
  // Informations du prestataire depuis la table vendors_tracking_preprod
  vendor_name?: string;
  category?: string;
  status?: string;
}

const MessageHistoryPage = () => {
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['user-contacts'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Non authentifié');

      // Récupérer les messages de contact de l'utilisateur
      const { data: contactsData, error: contactsError } = await supabase
        .from('vendors_contact_preprod')
        .select('*')
        .eq('email_client', user.user.email)
        .order('created_at', { ascending: false });

      if (contactsError) throw contactsError;

      // Pour chaque contact, récupérer les informations du prestataire depuis tracking
      const contactsWithVendorInfo = await Promise.all(
        contactsData.map(async (contact) => {
          const { data: trackingData } = await supabase
            .from('vendors_tracking_preprod')
            .select('vendor_name, category, status')
            .eq('email_presta', contact.email_presta)
            .eq('user_id', user.user.id)
            .single();

          return {
            ...contact,
            vendor_name: trackingData?.vendor_name || 'Prestataire inconnu',
            category: trackingData?.category || 'Non spécifié',
            status: trackingData?.status || 'contactés'
          };
        })
      );

      return contactsWithVendorInfo;
    }
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'contactés': { variant: 'secondary' as const, label: 'Contacté' },
      'répondu': { variant: 'default' as const, label: 'Répondu' },
      'rdv_planifié': { variant: 'default' as const, label: 'RDV planifié' },
      'devis_reçu': { variant: 'default' as const, label: 'Devis reçu' },
      'retenu': { variant: 'default' as const, label: 'Retenu' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['contactés'];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Historique des messages</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Historique des messages</h1>
      </div>

      {!contacts || contacts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun message envoyé
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas encore envoyé de message à des prestataires.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {contact.vendor_name}
                      {getStatusBadge(contact.status || 'contactés')}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {contact.category}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(contact.created_at), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {format(new Date(contact.created_at), 'HH:mm')}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <p className="text-sm leading-relaxed">
                    {contact.message}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>Envoyé à : {contact.email_presta}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageHistoryPage;