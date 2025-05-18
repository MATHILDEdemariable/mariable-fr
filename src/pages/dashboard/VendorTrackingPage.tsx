
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Mail, MessageSquare } from 'lucide-react';

const VendorTrackingPage: React.FC = () => {
  // Récupérer les données de suivi des prestataires
  const { data: trackingData, isLoading } = useQuery({
    queryKey: ['vendorTracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors_tracking')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'à contacter':
        return 'bg-yellow-100 text-yellow-800';
      case 'contacté':
        return 'bg-blue-100 text-blue-800';
      case 'rendez-vous fixé':
        return 'bg-purple-100 text-purple-800';
      case 'réservé':
        return 'bg-green-100 text-green-800';
      case 'annulé':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Helmet>
        <title>Suivi des Prestataires | Mariable</title>
        <meta name="description" content="Suivi des contacts avec les prestataires" />
      </Helmet>

      <div className="space-y-6">
        <h1 className="text-3xl font-serif mb-6 text-wedding-olive">Suivi des Prestataires</h1>

        {isLoading ? (
          <div className="py-12 text-center">
            <p>Chargement des données...</p>
          </div>
        ) : trackingData && trackingData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trackingData.map((vendor: any) => (
              <Card key={vendor.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 py-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">{vendor.vendor_name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{vendor.category}</p>
                    </div>
                    <Badge variant="outline" className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {vendor.contact_date && (
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>Contacté le: {new Date(vendor.contact_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  
                  {vendor.response_date && (
                    <div className="flex items-center gap-2 mb-2 text-sm">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span>Réponse le: {new Date(vendor.response_date).toLocaleDateString('fr-FR')}</span>
                    </div>
                  )}
                  
                  {vendor.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm">{vendor.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-gray-50 rounded-lg">
            <p>Aucun suivi de prestataire disponible.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default VendorTrackingPage;
