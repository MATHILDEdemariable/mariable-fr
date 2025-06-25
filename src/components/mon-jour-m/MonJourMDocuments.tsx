
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Download, Eye, Trash2, Folder, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Document {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  category: string;
  assigned_to?: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

const MonJourMDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [coordinationId, setCoordinationId] = useState<string | null>(null);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newDocument, setNewDocument] = useState({
    title: '',
    description: '',
    category: 'general',
    assigned_to: ''
  });
  const [uploadingFile, setUploadingFile] = useState(false);
  const { toast } = useToast();

  const categories = [
    { value: 'general', label: 'Général', icon: '📄' },
    { value: 'contracts', label: 'Contrats', icon: '📝' },
    { value: 'invoices', label: 'Factures', icon: '💰' },
    { value: 'photos', label: 'Photos', icon: '📸' },
    { value: 'planning', label: 'Planning', icon: '📅' },
    { value: 'venues', label: 'Lieux', icon: '🏛️' },
    { value: 'vendors', label: 'Prestataires', icon: '🤝' },
    { value: 'legal', label: 'Légal', icon: '⚖️' },
    { value: 'music', label: 'Musique', icon: '🎵' },
    { value: 'flowers', label: 'Fleurs', icon: '💐' }
  ];

  useEffect(() => {
    initializeData();
    setupRealtimeSubscription();
  }, []);

  const initializeData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Récupérer la coordination
      const { data: coordination } = await supabase
        .from('wedding_coordination')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (coordination) {
        setCoordinationId(coordination.id);
        await loadDocuments(coordination.id);
        await loadTeamMembers(coordination.id);
      }
    } catch (error) {
      console.error('Error initializing data:', error);
    }
  };

  const loadDocuments = async (coordId: string) => {
    const { data, error } = await supabase
      .from('coordination_documents')
      .select('*')
      .eq('coordination_id', coordId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading documents:', error);
      return;
    }

    setDocuments(data || []);
  };

  const loadTeamMembers = async (coordId: string) => {
    const { data, error } = await supabase
      .from('coordination_team')
      .select('id, name, role')
      .eq('coordination_id', coordId);

    if (error) {
      console.error('Error loading team members:', error);
      return;
    }

    setTeamMembers(data || []);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('coordination-documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coordination_documents'
        },
        () => {
          if (coordinationId) {
            loadDocuments(coordinationId);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !coordinationId) return;

    if (!newDocument.title.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un titre pour le document",
        variant: "destructive"
      });
      return;
    }

    setUploadingFile(true);

    try {
      // Simuler l'upload - en production, utiliser Supabase Storage
      const mockFileUrl = `https://example.com/files/${file.name}`;
      
      const { error } = await supabase
        .from('coordination_documents')
        .insert({
          coordination_id: coordinationId,
          title: newDocument.title,
          description: newDocument.description,
          file_url: mockFileUrl,
          file_type: file.type,
          file_size: file.size,
          category: newDocument.category,
          assigned_to: newDocument.assigned_to || null
        });

      if (error) throw error;

      setNewDocument({ title: '', description: '', category: 'general', assigned_to: '' });
      setShowAddDocument(false);
      
      toast({
        title: "Document ajouté",
        description: "Le document a été téléchargé avec succès"
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le document",
        variant: "destructive"
      });
    } finally {
      setUploadingFile(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('coordination_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès"
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le document",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Taille inconnue';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="h-5 w-5" />;
    
    if (fileType.includes('image')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('video')) return '🎥';
    if (fileType.includes('audio')) return '🎵';
    
    return <FileText className="h-5 w-5" />;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const documentsByCategory = categories.map(category => ({
    ...category,
    count: documents.filter(doc => doc.category === category.value).length
  }));

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Documents</h2>
          <p className="text-gray-600">Centralisez tous vos documents de mariage</p>
        </div>
        
        <Dialog open={showAddDocument} onOpenChange={setShowAddDocument}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Ajouter un document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <Input
                  value={newDocument.title}
                  onChange={(e) => setNewDocument({ ...newDocument, title: e.target.value })}
                  placeholder="Nom du document"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={newDocument.description}
                  onChange={(e) => setNewDocument({ ...newDocument, description: e.target.value })}
                  placeholder="Description du document"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Catégorie</label>
                  <Select value={newDocument.category} onValueChange={(value) => setNewDocument({ ...newDocument, category: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.icon} {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assigner à</label>
                  <Select value={newDocument.assigned_to} onValueChange={(value) => setNewDocument({ ...newDocument, assigned_to: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Optionnel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Non assigné</SelectItem>
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
                <label className="block text-sm font-medium mb-1">Fichier *</label>
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.xls,.xlsx"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput?.click();
                  }}
                  disabled={uploadingFile}
                >
                  {uploadingFile ? 'Téléchargement...' : 'Télécharger'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddDocument(false)}>
                  Annuler
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher dans les documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Toutes les catégories
              </div>
            </SelectItem>
            {documentsByCategory.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{category.icon} {category.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocuments.map((document) => (
          <Card key={document.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getFileIcon(document.file_type)}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{document.title}</h3>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(document.file_size)}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteDocument(document.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {document.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {document.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="outline">
                  {categories.find(c => c.value === document.category)?.icon}
                  {categories.find(c => c.value === document.category)?.label}
                </Badge>
                
                {document.assigned_to && (
                  <Badge variant="secondary">
                    {teamMembers.find(m => m.id === document.assigned_to)?.name}
                  </Badge>
                )}
              </div>

              <p className="text-xs text-gray-400">
                Ajouté le {new Date(document.created_at).toLocaleDateString('fr-FR')}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Aucun document trouvé' 
              : 'Aucun document ajouté'
            }
          </p>
          <p className="text-sm">
            {searchTerm || selectedCategory !== 'all'
              ? 'Essayez de modifier vos filtres de recherche'
              : 'Commencez par télécharger vos premiers documents'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default MonJourMDocuments;
