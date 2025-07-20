import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileText, Plus, Download, Trash2, FolderOpen, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useProjectCoordination } from '@/hooks/useProjectCoordination';
import { usePremiumAction } from '@/hooks/usePremiumAction';
import PremiumModal from '@/components/premium/PremiumModal';

interface ProjectDocument {
  id: string;
  title: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  description?: string;
  created_at: string;
}

const DOCUMENT_CATEGORIES = [
  'Budgets et devis',
  'Contrats',
  'Listes et plannings',
  'Inspiration et références',
  'Documents administratifs',
  'Correspondances',
  'Autre'
];

const ProjectDocuments: React.FC = () => {
  const { toast } = useToast();
  const { coordination } = useProjectCoordination();
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  
  // Premium action hook
  const addDocumentAction = usePremiumAction({
    feature: "Ajout de documents",
    description: "Pour ajouter des documents à votre projet de mariage, vous devez être abonné à notre version premium."
  });

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'Autre',
    description: '',
    file: null as File | null
  });

  // Charger les documents
  const loadDocuments = async () => {
    if (!coordination?.id) return;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('coordination_documents')
        .select('*')
        .eq('coordination_id', coordination.id)
        .eq('category', 'project')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData: ProjectDocument[] = (data || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        file_url: item.file_url,
        file_type: item.file_type,
        file_size: item.file_size,
        category: item.category,
        description: item.description,
        created_at: item.created_at
      }));

      setDocuments(mappedData);
    } catch (error) {
      console.error('Erreur chargement documents projet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les documents",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (coordination?.id) {
      loadDocuments();
    }
  }, [coordination?.id]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      category: 'Autre',
      description: '',
      file: null
    });
  };

  // Gérer l'upload de fichier
  const handleFileUpload = async () => {
    if (!formData.file || !formData.title.trim() || !coordination?.id) {
      toast({
        title: "Erreur",
        description: "Le titre et le fichier sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    // Intercepter l'action avec le hook premium
    addDocumentAction.executeAction(async () => {
      setUploadingFile(true);

      try {
        const fileExt = formData.file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `project-documents/${coordination.user_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('coordination-files')
          .upload(filePath, formData.file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('coordination-files')
          .getPublicUrl(filePath);

        const { error: dbError } = await supabase
          .from('coordination_documents')
          .insert({
            coordination_id: coordination.id,
            title: formData.title,
            description: formData.description || null,
            category: 'project',
            file_url: publicUrl,
            file_path: filePath,
            file_type: formData.file.type,
            file_size: formData.file.size,
            mime_type: formData.file.type
          });

        if (dbError) throw dbError;

        toast({
          title: "Succès",
          description: "Document ajouté avec succès"
        });

        resetForm();
        setShowAddModal(false);
        await loadDocuments();
      } catch (error) {
        console.error('Erreur upload document:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter le document",
          variant: "destructive"
        });
      } finally {
        setUploadingFile(false);
      }
    });
  };

  // Supprimer un document
  const handleDeleteDocument = async (documentId: string, filePath?: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      // Supprimer le fichier du storage si le path existe
      if (filePath) {
        await supabase.storage
          .from('coordination-files')
          .remove([filePath]);
      }

      // Supprimer l'entrée de la base
      const { error } = await supabase
        .from('coordination_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Document supprimé avec succès"
      });

      await loadDocuments();
    } catch (error) {
      console.error('Erreur suppression document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  // Formater la taille du fichier
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Documents Mission Mariage</h3>
            <p className="text-sm text-muted-foreground">
              Centralisez tous vos documents de préparation
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </div>

        {/* Liste des documents */}
        {documents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Aucun document</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par ajouter vos premiers documents de préparation
              </p>
              <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {documents.map((document) => (
              <Card key={document.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-grow">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-blue-600" />
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {document.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {document.category}
                          </Badge>
                          
                          {document.file_size && (
                            <span className="text-sm text-gray-500">
                              {formatFileSize(document.file_size)}
                            </span>
                          )}
                          
                          <span className="text-sm text-gray-500">
                            {new Date(document.created_at).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        
                        {document.description && (
                          <p className="text-sm text-gray-600">
                            {document.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(document.file_url, '_blank')}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal d'ajout */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Nouveau document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Devis traiteur"
                />
              </div>

              <div>
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {DOCUMENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Description optionnelle..."
                />
              </div>

              <div>
                <Label htmlFor="file">Fichier *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    file: e.target.files?.[0] || null 
                  })}
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés : PDF, Word, Excel, images, texte
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleFileUpload} 
                  disabled={uploadingFile || !formData.title.trim() || !formData.file}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {uploadingFile ? (
                    <>
                      <Upload className="h-4 w-4 mr-2 animate-spin" />
                      Upload...
                    </>
                  ) : (
                    'Ajouter'
                  )}
                </Button>
                <Button variant="outline" onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal Premium */}
      <PremiumModal
        isOpen={addDocumentAction.showPremiumModal}
        onClose={addDocumentAction.closePremiumModal}
        feature={addDocumentAction.feature}
        description={addDocumentAction.description}
      />
    </>
  );
};

export default ProjectDocuments;
