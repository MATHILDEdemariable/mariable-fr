import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import DocumentUploader from '@/components/documents/DocumentUploader';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentViewerModal from '@/components/documents/DocumentViewerModal';
import { FileText, Loader2 } from 'lucide-react';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

const DocumentsPage = () => {
  const { toast } = useToast();
  const { t } = useTranslation('weddingDay');
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<any>(null);


  const {
    executeAction,
    showPremiumModal,
    closePremiumModal
  } = usePremiumAction({
    feature: t('documents.premiumFeature'),
    description: t('documents.premiumDescription')
  });

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['wedding-documents'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const { data, error } = await supabase
        .from('wedding_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = (id: string) => {
    executeAction(async () => {
      try {
        const { error } = await supabase
          .from('wedding_documents')
          .delete()
          .eq('id', id);

        if (error) throw error;

        toast({
          title: t('documents.deletedTitle'),
          description: t('documents.deletedDesc')
        });

        refetch();
      } catch (error) {
        console.error("Erreur suppression:", error);
        toast({
          title: t('documents.errorTitle'),
          description: t('documents.deleteError'),
          variant: "destructive"
        });
      }
    });
  };

  const handleViewSummary = (_document: any) => {};

  const handleViewDocument = (document: any) => {
    setViewedDocument(document);
    setViewerOpen(true);
  };

  const filterByType = (type: string) => {
    return documents?.filter(doc => doc.document_type === type) || [];
  };

  return (
    <>
      <Helmet>
        <title>{t('documents.pageTitle')}</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-wedding-olive">{t('documents.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('documents.subtitle')}
          </p>
        </div>

        <DocumentUploader onUploadComplete={refetch} documentCount={documents?.length || 0} />

        <Tabs defaultValue="tous" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="tous">{t('documents.tabs.all')}</TabsTrigger>
            <TabsTrigger value="devis">{t('documents.tabs.devis')}</TabsTrigger>
            <TabsTrigger value="contrat">{t('documents.tabs.contrat')}</TabsTrigger>
            <TabsTrigger value="facture">{t('documents.tabs.facture')}</TabsTrigger>
            <TabsTrigger value="autre">{t('documents.tabs.autre')}</TabsTrigger>
          </TabsList>

          <TabsContent value="tous" className="space-y-4 mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
              </div>
            ) : documents && documents.length > 0 ? (
              documents.map(doc => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  onDelete={handleDelete}
                  onViewSummary={handleViewSummary}
                  onViewDocument={handleViewDocument}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <p className="text-muted-foreground">
                  {t('documents.empty')}
                </p>
              </div>
            )}
          </TabsContent>

          {['devis', 'contrat', 'facture', 'autre'].map(type => (
            <TabsContent key={type} value={type} className="space-y-4 mt-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-wedding-olive" />
                </div>
              ) : filterByType(type).length > 0 ? (
                filterByType(type).map(doc => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={handleDelete}
                    onViewSummary={handleViewSummary}
                    onViewDocument={handleViewDocument}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {t('documents.emptyType')}
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>


        <DocumentViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          document={viewedDocument}
        />
      </div>

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={closePremiumModal}
        feature={t('documents.premiumFeature')}
        description={t('documents.premiumDescription')}
      />
    </>
  );
};

export default DocumentsPage;
