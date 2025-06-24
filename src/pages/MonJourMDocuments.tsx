
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Download, Trash2, Upload } from 'lucide-react';
import { useCoordination } from '@/hooks/useCoordination';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MonJourMDocuments = () => {
  const { coordination, documents } = useCoordination();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    category: 'general',
    description: ''
  });
  const { toast } = useToast();

  const categories = [
    { value: 'general', label: 'Général' },
    { value: 'contracts', label: 'Contrats' },
    { value: 'planning', label: 'Planning' },
    { value: 'photos', label: 'Photos' },
    { value: 'music', label: 'Musique' },
    { value: 'other', label: 'Autre' }
  ];

  const handleAddDocument = async () => {
    if (!coordination || !newDocument.title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour le document",
        variant: "destructive"
      });
      return;
    }

    try {
      // Pour cette démonstration, nous créons un document fictif
      // Dans un vrai cas, vous auriez un système d'upload de fichiers
      const { error } = await supabase
        .from('coordination_documents')
        .insert({
          coordination_id: coordination.id,
          title: newDocument.title,
          category: newDocument.category,
          description: newDocument.description || null,
          file_url: '#', // URL fictive pour la démonstration
          file_type: 'application/pdf',
          file_size: 1024000,
          assigned_to: null
        });

      if (error) throw error;

      setNewDocument({
        title: '',
        category: 'general',
        description: ''
      });
      setShowAddForm(false);

      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès"
      });

      // Recharger la page pour voir le nouveau document
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_documents')
        .delete()
        .eq('id', docId);

      if (error) throw error;

      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });

      // Recharger la page
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const handleDownload = (doc: any) => {
    // Simulation du téléchargement
    toast({
      title: "Téléchargement",
      description: `Téléchargement de ${doc.title} simulé`
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '';
    const sizes = ['o', 'Ko', 'Mo', 'Go'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string | null) => {
    return FileText;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Actions responsive */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-lg md:text-xl font-semibold">Documents du Jour-M</h2>
          <p className="text-sm text-gray-600">
            {documents.length} document{documents.length > 1 ? 's' : ''} partagé{documents.length > 1 ? 's' : ''}
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Plus className="h-4 w-4" />
          Ajouter un document
        </Button>
      </div>

      {/* Formulaire d'ajout responsive */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nouveau document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="Titre du document" 
              value={newDocument.title}
              onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
            />
            <Select 
              value={newDocument.category} 
              onValueChange={(value) => setNewDocument({...newDocument, category: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input 
              placeholder="Description (optionnelle)" 
              value={newDocument.description}
              onChange={(e) => setNewDocument({...newDocument, description: e.target.value})}
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 md:p-8 text-center">
              <Upload className="h-6 md:h-8 w-6 md:w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Fonctionnalité d'upload en développement
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Pour l'instant, ajoutez juste le titre et la catégorie
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowAddForm(false)}
                className="w-full sm:w-auto"
              >
                Annuler
              </Button>
              <Button onClick={handleAddDocument} className="w-full sm:w-auto">
                Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des documents responsive */}
      <div className="space-y-3">
        {documents.map((doc) => {
          const IconComponent = getFileIcon(doc.file_type);
          return (
            <Card key={doc.id}>
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <IconComponent className="h-5 w-5 text-wedding-olive flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium truncate">{doc.title}</h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs text-gray-500 mt-1">
                        <span>{categories.find(c => c.value === doc.category)?.label}</span>
                        {doc.file_size && <span className="hidden sm:inline">{formatFileSize(doc.file_size)}</span>}
                        <span>{new Date(doc.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {doc.description && (
                        <p className="text-sm text-gray-600 mt-1 break-words">{doc.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      className="w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4" />
                      <span className="ml-1 sm:hidden">Télécharger</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length === 0 && (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-base md:text-lg">Aucun document partagé</p>
          <p className="text-sm">Ajoutez des documents importants pour votre équipe</p>
        </div>
      )}
    </div>
  );
};

export default MonJourMDocuments;
