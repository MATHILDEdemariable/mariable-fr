
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { Calendar, Phone, Mail, MessageSquare, Download, Lock, Loader2 } from 'lucide-react';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

const VendorTrackingPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  
  const { executeAction, showPremiumModal, closePremiumModal, isPremium } = usePremiumAction({
    feature: "Export PDF Suivi Prestataires",
    description: "Exportez votre suivi de prestataires en PDF"
  });

  // Récupérer les données de suivi des prestataires
  const { data: trackingData, isLoading } = useQuery({
    queryKey: ['vendorTracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors_tracking')
        .select('id, vendor_name, category, status, contact_date, response_date, notes, updated_at')
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

  const handleExportPDF = () => {
    if (!isPremium) {
      executeAction(() => {});
      return;
    }

    if (!trackingData || trackingData.length === 0) {
      toast({
        title: "Erreur",
        description: "Aucun prestataire à exporter",
        variant: "destructive"
      });
      return;
    }

    setIsExporting(true);

    try {
      const doc = new jsPDF();
      let yPos = 20;

      // Header avec branding
      doc.setFillColor(127, 148, 116); // wedding-olive
      doc.rect(0, 0, 210, 30, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont(undefined, 'bold');
      doc.text('Suivi des Prestataires', 105, 18, { align: 'center' });

      yPos = 45;
      doc.setTextColor(60, 60, 60);

      // Statistiques
      const statusCounts = {
        'à contacter': trackingData.filter(v => v.status === 'à contacter').length,
        'contactés': trackingData.filter(v => v.status === 'contactés').length,
        'réponse reçue': trackingData.filter(v => v.status === 'réponse reçue').length,
      };

      doc.setFontSize(10);
      doc.text(`Total: ${trackingData.length} prestataires`, 20, yPos);
      doc.text(`À contacter: ${statusCounts['à contacter']}`, 80, yPos);
      doc.text(`Contactés: ${statusCounts['contactés']}`, 130, yPos);
      doc.text(`Réponses: ${statusCounts['réponse reçue']}`, 170, yPos);
      
      yPos += 15;

      // Liste des prestataires
      trackingData.forEach((vendor: any) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        // Nom et catégorie
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(60, 60, 60);
        doc.text(vendor.vendor_name, 20, yPos);
        
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text(`${vendor.category} - ${vendor.status}`, 20, yPos + 5);

        if (vendor.contact_date) {
          doc.text(`Contacté le: ${new Date(vendor.contact_date).toLocaleDateString('fr-FR')}`, 20, yPos + 10);
        }

        if (vendor.notes) {
          const noteLines = doc.splitTextToSize(`Notes: ${vendor.notes}`, 170);
          doc.text(noteLines, 20, yPos + 15);
          yPos += noteLines.length * 4;
        }

        yPos += 25;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Généré par Mariable.fr - Page ${i}/${totalPages}`, 105, 290, { align: 'center' });
      }

      doc.save('suivi-prestataires.pdf');
      
      toast({
        title: "Export réussi",
        description: "Le suivi des prestataires a été exporté en PDF"
      });
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'exporter le PDF",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Suivi des Prestataires | Mariable</title>
        <meta name="description" content="Suivi des contacts avec les prestataires" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-serif text-wedding-olive">Suivi des Prestataires</h1>
          
          <Button
            onClick={handleExportPDF}
            variant="outline"
            disabled={isExporting || !trackingData?.length}
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <>
                {!isPremium && <Lock className="h-4 w-4 mr-2" />}
                <Download className="h-4 w-4 mr-2" />
              </>
            )}
            Export PDF
          </Button>
        </div>

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

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature="Export PDF Suivi Prestataires"
        description="Exportez votre suivi complet des prestataires en PDF"
      />
    </>
  );
};

export default VendorTrackingPage;
