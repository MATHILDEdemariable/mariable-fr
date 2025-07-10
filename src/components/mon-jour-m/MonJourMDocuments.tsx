import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, Download, Eye, Edit, Trash2, Upload, File, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import SharePublicButton from './SharePublicButton';

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

interface PinterestLink {
  id: string;
  title: string;
  pinterest_url: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

const MonJourMDocuments: React.FC = () => {
  const { toast } = useToast();
  const [coordination, setCoordination] = useState<WeddingCoordination | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pinterestLinks, setPinterestLinks] = useState<PinterestLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDocument, setShowAddDocument] = useState(false);
  const [showAddPinterest, setShowAddPinterest] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [editingPinterest, setEditingPinterest] = useState<PinterestLink | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'general',
    assigned_to: '',
    file: null as File | null
  });
  const [pinterestFormData, setPinterestFormData] = useState({
    title: '',
    pinterest_url: '',
    description: ''
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

      // Charger les documents, Pinterest et l'équipe
      await Promise.all([
        loadDocuments(activeCoordination.id),
        loadPinterestLinks(activeCoordination.id),
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
        .eq('category', 'jour-m')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Erreur chargement documents:', error);
    }
  };

  const loadPinterestLinks = async (coordId: string) => {
    try {
      const { data, error } = await supabase
        .from('coordination_pinterest')
        .select('*')
        .eq('coordination_id', coordId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPinterestLinks(data || []);
    } catch (error) {
      console.error('Erreur chargement Pinterest:', error);
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

  const resetPinterestForm = () => {
    setPinterestFormData({
      title: '',
      pinterest_url: '',
      description: ''
    });
  };

  const extractPinterestEmbedUrl = (url: string) => {
    try {
      // Convertir l'URL Pinterest en URL d'embed pour les pins
      const pinRegex = /pinterest\.com\/pin\/(\d+)/;
      const pinMatch = url.match(pinRegex);
      
      if (pinMatch) {
        const pinId = pinMatch[1];
        return `https://www.pinterest.com/pin/${pinId}/`;
      }
      
      // Si c'est un board
      const boardRegex = /pinterest\.com\/([^\/]+)\/([^\/]+)/;
      const boardMatch = url.match(boardRegex);
      
      if (boardMatch) {
        return url;
      }
      
      return url;
    } catch (error) {
      console.error('Erreur parsing URL Pinterest:', error);
      return url;
    }
  };

  const renderPinterestPreview = (link: PinterestLink) => {
    const embedUrl = extractPinterestEmbedUrl(link.pinterest_url);
    
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="aspect-video relative">
          <iframe
            src={`https://assets.pinterest.com/ext/embed.html?id=${link.pinterest_url.match(/pin\/(\d+)/)?.[1] || ''}`}
            className="w-full h-full border-0"
            scrolling="no"
            onError={(e) => {
              // Fallback si l'iframe ne fonctionne pas
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = `
                  <div class="flex items-center justify-center h-full bg-gray-100 text-gray-500">
                    <div class="text-center">
                      <div class="text-2xl mb-2">📌</div>
                      <p class="text-sm">Aperçu Pinterest non disponible</p>
                      <a href="${link.pinterest_url}" target="_blank" rel="noopener noreferrer" 
                         class="text-blue-600 hover:underline text-xs">
                        Voir sur Pinterest
                      </a>
                    </div>
                  </div>
                `;
              }
            }}
          />
        </div>
        <div className="p-3">
          <h4 className="font-medium text-sm">{link.title}</h4>
          {link.description && (
            <p className="text-xs text-gray-600 mt-1">{link.description}</p>
          )}
          <a 
            href={link.pinterest_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xs mt-2 inline-flex items-center gap-1"
          >
            <ExternalLink className="h-3 w-3" />
            Voir sur Pinterest
          </a>
        </div>
      </div>
    );
  };

  const handleAddPinterest = async () => {
    if (!pinterestFormData.title.trim() || !pinterestFormData.pinterest_url.trim() || !coordination?.id) return;

    try {
      const { data, error } = await supabase
        .from('coordination_pinterest')
        .insert({
          coordination_id: coordination.id,
          title: pinterestFormData.title,
          pinterest_url: pinterestFormData.pinterest_url,
          description: pinterestFormData.description || null
        })
        .select()
        .single();

      if (error) throw error;

      setPinterestLinks(prev => [data, ...prev]);
      resetPinterestForm();
      setShowAddPinterest(false);
      
      toast({
        title: "Lien Pinterest ajouté",
        description: "Le lien a été ajouté avec succès"
      });

    } catch (error) {
      console.error('Erreur ajout Pinterest:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le lien Pinterest",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePinterest = async () => {
    if (!editingPinterest) return;

    try {
      const { error } = await supabase
        .from('coordination_pinterest')
        .update({
          title: editingPinterest.title,
          pinterest_url: editingPinterest.pinterest_url,
          description: editingPinterest.description || null
        })
        .eq('id', editingPinterest.id);

      if (error) throw error;

      setPinterestLinks(prev => prev.map(p => p.id === editingPinterest.id ? editingPinterest : p));
      setEditingPinterest(null);
      
      toast({
        title: "Lien Pinterest modifié",
        description: "Les informations ont été mises à jour"
      });

    } catch (error) {
      console.error('Erreur modification Pinterest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le lien Pinterest",
        variant: "destructive"
      });
    }
  };

  const handleDeletePinterest = async (pinterestId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lien Pinterest ?')) return;

    try {
      const { error } = await supabase
        .from('coordination_pinterest')
        .delete()
        .eq('id', pinterestId);

      if (error) throw error;
      
      setPinterestLinks(prev => prev.filter(p => p.id !== pinterestId));
      
      toast({
        title: "Lien Pinterest supprimé",
        description: "Le lien a été supprimé"
      });

    } catch (error) {
      console.error('Erreur suppression Pinterest:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le lien Pinterest",
        variant: "destructive"
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!coordination?.id) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${coordination.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('coordination-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Erreur upload vers Supabase Storage:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('coordination-files')
        .getPublicUrl(fileName);
      
      return {
        file_url: publicUrl,
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

      const insertData: any = {
        coordination_id: coordination.id,
        title: formData.title,
        description: formData.description || null,
        category: 'jour-m',
        assigned_to: formData.assigned_to === 'none' ? null : formData.assigned_to || null,
      };

      if (fileData && Object.keys(fileData).length > 0) {
        Object.assign(insertData, fileData);
      } else {
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
            assigned_to: editingDocument.assigned_to === 'none' ? null : editingDocument.assigned_to || null
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
          <p className="text-sm text-muted-foreground mb-3">
            Créez votre équipe, faites votre planning, enregistrez les documents et partagez.
          </p>
          <p className="text-gray-600">Centralisez tous vos documents importants et inspirations</p>
        </div>
        
        <div className="flex gap-2">
          {coordination && <SharePublicButton coordinationId={coordination.id} />}
        </div>
      </div>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="pinterest">Pinterest (Beta)</TabsTrigger>
        </TabsList>

        {/* Onglet Documents */}
        <TabsContent value="documents" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Mes Documents</h3>
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

          <Card>
            <CardContent className="pt-6">
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
                              onClick={() => {
                                try {
                                  window.open(document.file_url, '_blank');
                                } catch (error) {
                                  console.error('Erreur ouverture document:', error);
                                  toast({
                                    title: "Erreur",
                                    description: "Impossible d'ouvrir le document",
                                    variant: "destructive"
                                  });
                                }
                              }}
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
        </TabsContent>

        {/* Onglet Pinterest */}
        <TabsContent value="pinterest" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium">Liens Pinterest</h3>
              <p className="text-sm text-gray-600">Ajoutez vos inspirations Pinterest pour votre mariage</p>
            </div>
            <Dialog open={showAddPinterest} onOpenChange={setShowAddPinterest}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un lien Pinterest
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Ajouter un lien Pinterest</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Titre *</label>
                    <Input
                      value={pinterestFormData.title}
                      onChange={(e) => setPinterestFormData({ ...pinterestFormData, title: e.target.value })}
                      placeholder="Ex: Inspiration décoration"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">URL Pinterest *</label>
                    <Input
                      value={pinterestFormData.pinterest_url}
                      onChange={(e) => setPinterestFormData({ ...pinterestFormData, pinterest_url: e.target.value })}
                      placeholder="https://www.pinterest.com/pin/..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Textarea
                      value={pinterestFormData.description}
                      onChange={(e) => setPinterestFormData({ ...pinterestFormData, description: e.target.value })}
                      placeholder="Description de cette inspiration"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleAddPinterest} 
                      disabled={!pinterestFormData.title.trim() || !pinterestFormData.pinterest_url.trim()}
                    >
                      Ajouter le lien
                    </Button>
                    <Button variant="outline" onClick={() => {
                      resetPinterestForm();
                      setShowAddPinterest(false);
                    }}>
                      Annuler
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent className="pt-6">
              {pinterestLinks.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {pinterestLinks.map((link) => (
                    <Card key={link.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-5 w-5 text-pink-500" />
                          <h3 className="font-medium">{link.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(link.pinterest_url, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingPinterest(link)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePinterest(link.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {link.description && (
                        <p className="text-sm text-gray-600 mb-3">{link.description}</p>
                      )}

                      {renderPinterestPreview(link)}

                      <div className="text-xs text-gray-400 mt-2">
                        Ajouté le {new Date(link.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ExternalLink className="h-12 w-12 mx-auto mb-4 opacity-50 text-pink-400" />
                  <p className="text-lg mb-2">Aucun lien Pinterest</p>
                  <p className="text-sm">Ajoutez vos inspirations Pinterest pour votre mariage</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals d'édition */}
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
                  <Select value={editingDocument.assigned_to || 'none'} onValueChange={(value) => setEditingDocument({ ...editingDocument, assigned_to: value })}>
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

      {editingPinterest && (
        <Dialog open={!!editingPinterest} onOpenChange={() => setEditingPinterest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Modifier le lien Pinterest</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre *</label>
                <Input
                  value={editingPinterest.title}
                  onChange={(e) => setEditingPinterest({ ...editingPinterest, title: e.target.value })}
                  placeholder="Ex: Inspiration décoration"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">URL Pinterest *</label>
                <Input
                  value={editingPinterest.pinterest_url}
                  onChange={(e) => setEditingPinterest({ ...editingPinterest, pinterest_url: e.target.value })}
                  placeholder="https://www.pinterest.com/pin/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  value={editingPinterest.description || ''}
                  onChange={(e) => setEditingPinterest({ ...editingPinterest, description: e.target.value })}
                  placeholder="Description de cette inspiration"
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpdatePinterest}>
                  Sauvegarder
                </Button>
                <Button variant="outline" onClick={() => setEditingPinterest(null)}>
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
