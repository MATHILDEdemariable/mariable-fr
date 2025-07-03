
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Download, Eye, Edit, Trash2, Upload, File } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  title: string;
  description?: string;
  file_url?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  category: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
}

interface WeddingCoordination {
  id: string;
  title: string;
  description?: string;
  wedding_date?: string;
  wedding_location?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  type: 'person' | 'vendor';
  prestataire_id?: string;
  notes?: string;
}

const MonJourMDocuments: React.FC = () => {
  const { toast } = useToast();
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    assigned_to: '',
    file: null as File | null
  });

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté",
          variant: "destructive"
        });
        return;
      }

      // Récupérer ou créer la coordination
      let { data: coordinations, error: coordError } = await supabase
        .from('wedding_coordination')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (coordError) throw coordError;

      let activeCoordination: WeddingCoordination;

      if (coordinations && coordinations.length > 0) {
        activeCoordination = coordinations[0];
      } else {
        const { data: newCoordination, error: createError } = await supabase
          .from('wedding_coordination')
          .insert({
            user_id: user.id,
            title: 'Mon Mariage',
            description: 'Organisation de mon mariage'
          })
          .select()
          .single();

        if (createError) throw createError;
        activeCoordination = newCoordination;
      }

      setCoordination(activeCoordination);

      // Charger les documents et l'équipe
      await Promise.all([
        loadDocuments(activeCoordination.id),
        loadTeamMembers(activeCoordination.id)
      ]);

    } catch (error) {
      console.error('Erreur initialisation:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async (coordId: string) => {
    try {
      const { data, error } = await supabase
        .from('coordination_documents')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    }
  };

  const loadTeamMembers = async (coordId: string) => {
    try {
      const { data, error } = await supabase
        .from('coordination_team')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at');

      if (error) throw error;

      const mappedData = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        role: item.role,
        email: item.email,
        phone: item.phone,
        type: (item.type === 'vendor' ? 'vendor' : 'person') as 'person' | 'vendor',
        prestataire_id: item.prestataire_id,
        notes: item.notes
      }));

      setTeamMembers(mappedData);
    } catch (error) {
      console.error('Erreur chargement équipe:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'general',
      assigned_to: '',
      file: null
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!coordination?.id) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${coordination.id}/${Date.now()}.${fileExt}`;
      
      // Pour l'instant, on simule l'upload sans stockage réel
      // Dans une vraie app, il faudrait configurer Supabase Storage
      const mockUrl = URL.createObjectURL(file);
      
      return {
        file_url: mockUrl,
        file_path: fileName,
        file_type: fileExt,
        file_size: file.size,
        mime_type: file.type
      };
    } catch (error) {
      console.error('Erreur upload:', error);
      throw error;
    }
  };

  const handleAddDocument = async () => {
    if (!formData.title.trim() || !coordination?.id) return;

    try {
      setUploadingFile(true);
      let fileData = {};

      if (formData.file) {
        fileData = await handleFileUpload(formData.file);
      }

      // Préparer les données pour l'insertion
      const insertData: any = {
        coordination_id: coordination.id,
        title: formData.title,
        description: formData.description || null,
        category: formData.category,
        assigned_to: formData.assigned_to === 'none' ? null : formData.assigned_to || null,
      };

      // Ajouter les données du fichier seulement si elles existent
      if (fileData && Object.keys(fileData).length > 0) {
        Object.assign(insertData, fileData);
      } else {
        // Si pas de fichier, on définit file_url comme une chaîne vide plutôt que null
        insertData.file_url = '';
      }

      const { data, error } = await supabase
        .from('coordination_documents')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur insertion document:', error);
        throw error;
      }

      setDocuments(prev => [data, ...prev]);
      resetForm();
      setShowAddDocument(false);
      
      toast({
        title: "Document ajouté",
        description: "Le document a été ajouté avec succès"
      });

    } catch (error) {
      console.error('Erreur ajout document:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le document",
        variant: "destructive"
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const handleUpdateDocument = async () => {
    if (!editingDocument) return;

    try {
      const { error } = await supabase
        .from('coordination_documents')
        .update({
          title: editingDocument.title,
          description: editingDocument.description || null,
          category: editingDocument.category,
          assigned_to: editingDocument.assigned_to || null
        })
        .eq('id', editingDocument.id);

      if (error) throw error;

      setDocuments(prev => prev.map(d => d.id === editingDocument.id ? editingDocument : d));
      setEditingDocument(null);
      
      toast({
        title: "Document modifié",
        description: "Les informations ont été mises à jour"
      });

    } catch (error) {
      console.error('Erreur modification document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le document",
        variant: "destructive"
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      setDocuments(prev => prev.filter(d => d.id !== documentId));
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé"
      });

    } catch (error) {
      console.error('Erreur suppression document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'invoice': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'photo': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-olive"></div>
        <span className="ml-3">Chargement...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec boutons */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Documents du jour J</h2>
          <p className="text-gray-600">Centralisez tous vos documents importants</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ajouter un document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Ajouter un document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Titre *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Titre du document"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Description du document"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Catégorie</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Général</SelectItem>
                        <SelectItem value="contract">Contrat</SelectItem>
                        <SelectItem value="invoice">Facture</SelectItem>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="legal">Légal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Assigné à</label>
                    <Select value={formData.assigned_to} onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un membre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name} ({member.role})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fichier</label>
                  <Input
                    type="file"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddDocument} 
                    disabled={!formData.title.trim() || uploadingFile}
                  >
                    {uploadingFile ? (
                      <>
                        <Upload className="mr-2 h-4 w-4 animate-spin" />
                        Ajout en cours...
                      </>
                    ) : (
                      'Ajouter le document'
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => {
                    resetForm();
                    setShowAddDocument(false);
                  }}>
                    Annuler
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((document) => (
                <Card key={document.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <h3 className="font-medium line-clamp-2">{document.title}</h3>
                    </div>
                    <div className="flex items-center gap-1">
                      {document.file_url && document.file_url !== '' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(document.file_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingDocument(document)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteDocument(document.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {document.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{document.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category === 'contract' ? 'Contrat' : 
                         document.category === 'invoice' ? 'Facture' :
                         document.category === 'planning' ? 'Planning' :
                         document.category === 'photo' ? 'Photo' :
                         document.category === 'legal' ? 'Légal' : 'Général'}
                      </Badge>
                      
                      {document.file_size && (
                        <Badge variant="secondary">
                          {formatFileSize(document.file_size)}
                        </Badge>
                      )}
                    </div>

                    {document.assigned_to && (
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <span>Assigné à:</span>
                        {(() => {
                          const member = teamMembers.find(m => m.id === document.assigned_to);
                          return member ? member.name : 'Membre inconnu';
                        })()}
                      </div>
                    )}

                    <div className="text-xs text-gray-400">
                      Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Aucun document enregistré</p>
              <p className="text-sm">Commencez par ajouter votre premier document</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition de document */}
      {editingDocument && (
        <Dialog open={!!editingDocument} onOpenChange={() => setEditingDocument(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <Input
                  value={editingDocument.title}
                  onChange={(e) => setEditingDocument({ ...editingDocument, title: e.target.value })}
                  placeholder="Titre du document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingDocument.description || ''}
                  onChange={(e) => setEditingDocument({ ...editingDocument, description: e.target.value })}
                  placeholder="Description du document"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <Select value={editingDocument.category} onValueChange={(value) => setEditingDocument({ ...editingDocument, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Général</SelectItem>
                      <SelectItem value="contract">Contrat</SelectItem>
                      <SelectItem value="invoice">Facture</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="photo">Photo</SelectItem>
                      <SelectItem value="legal">Légal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assigné à</label>
                  <Select value={editingDocument.assigned_to || ''} onValueChange={(value) => setEditingDocument({ ...editingDocument, assigned_to: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un membre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Aucun</SelectItem>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} ({member.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdateDocument}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setEditingDocument(null)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MonJourMDocuments;
