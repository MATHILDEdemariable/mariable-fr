import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import DocumentUploader from '@/components/documents/DocumentUploader';
import DocumentCard from '@/components/documents/DocumentCard';
import DocumentViewerModal from '@/components/documents/DocumentViewerModal';
import { FileText, Loader2 } from 'lucide-react';

const DocumentsPage = () => {
  const { toast } = useToast();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<any>(null);

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

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('wedding_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });

      refetch();
    } catch (error) {
      console.error("Erreur suppression:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleViewSummary = (document: any) => {
    setSelectedDocument(document);
    setSummaryDialogOpen(true);
  };

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
        <title>Mes Documents | Dashboard Mariable</title>
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-wedding-olive">Mes Documents</h1>
          <p className="text-muted-foreground mt-2">
            Centralisez tous vos documents de mariage et bénéficiez de l'analyse IA (Premium)
          </p>
        </div>

        <DocumentUploader onUploadComplete={refetch} />

        <Tabs defaultValue="tous" className="w-full">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="tous">Tous</TabsTrigger>
            <TabsTrigger value="devis">Devis</TabsTrigger>
            <TabsTrigger value="contrat">Contrats</TabsTrigger>
            <TabsTrigger value="facture">Factures</TabsTrigger>
            <TabsTrigger value="autre">Autres</TabsTrigger>
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
                  Aucun document uploadé pour le moment
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
                    Aucun document de ce type
                  </p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={summaryDialogOpen} onOpenChange={setSummaryDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Résumé IA - {selectedDocument?.file_name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Résumé:</h3>
                  <p className="text-sm whitespace-pre-wrap">
                    {selectedDocument.ai_summary}
                  </p>
                </div>

                {selectedDocument.ai_key_points && (
                  <div>
                    <h3 className="font-semibold mb-2">Points clés:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {Object.entries(selectedDocument.ai_key_points).map(([key, value]: [string, any]) => (
                        <li key={key} className="text-sm">
                          <span className="font-medium">{key}:</span> {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        <DocumentViewerModal
          isOpen={viewerOpen}
          onClose={() => setViewerOpen(false)}
          document={viewedDocument}
        />
      </div>
    </>
  );
};

export default DocumentsPage;
