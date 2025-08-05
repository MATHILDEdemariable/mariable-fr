import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Trash2, Edit, Plus, ExternalLink, Copy, CheckCircle2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { generateUniqueCustomPageSlug, isSlugValid } from '@/utils/generateUniqueCustomPageSlug';
import { useDebounce } from 'use-debounce';

interface CustomPage {
  id: string;
  slug: string;
  iframe_code: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CustomPagesManager: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [formData, setFormData] = useState({
    slug: '',
    iframe_code: '',
    title: '',
    description: '',
    is_active: true
  });
  const [slugValidation, setSlugValidation] = useState<{
    isValid: boolean;
    message: string;
    isChecking: boolean;
  }>({ isValid: true, message: '', isChecking: false });
  const [manualSlugEdit, setManualSlugEdit] = useState(false);

  const [debouncedTitle] = useDebounce(formData.title, 500);
  const [debouncedSlug] = useDebounce(formData.slug, 300);

  const queryClient = useQueryClient();

  const { data: customPages, isLoading } = useQuery({
    queryKey: ['custom-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as CustomPage[];
    }
  });

  const createPageMutation = useMutation({
    mutationFn: async (pageData: typeof formData) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .insert([pageData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Page créée avec succès');
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la création: ${error.message}`);
    }
  });

  const updatePageMutation = useMutation({
    mutationFn: async ({ id, ...pageData }: { id: string } & typeof formData) => {
      const { data, error } = await supabase
        .from('custom_pages')
        .update(pageData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      setEditingPage(null);
      resetForm();
      toast.success('Page mise à jour avec succès');
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  });

  const deletePageMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('custom_pages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['custom-pages'] });
      toast.success('Page supprimée avec succès');
    },
    onError: (error: any) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      slug: '',
      iframe_code: '',
      title: '',
      description: '',
      is_active: true
    });
    setSlugValidation({ isValid: true, message: '', isChecking: false });
    setManualSlugEdit(false);
  };

  // Auto-génération du slug basé sur le titre
  useEffect(() => {
    if (debouncedTitle && !manualSlugEdit && !editingPage) {
      const generateSlug = async () => {
        setSlugValidation(prev => ({ ...prev, isChecking: true }));
        try {
          const newSlug = await generateUniqueCustomPageSlug(debouncedTitle);
          setFormData(prev => ({ ...prev, slug: newSlug }));
          setSlugValidation({ isValid: true, message: 'Slug généré automatiquement', isChecking: false });
        } catch (error) {
          setSlugValidation({ isValid: false, message: 'Erreur lors de la génération du slug', isChecking: false });
        }
      };
      generateSlug();
    }
  }, [debouncedTitle, manualSlugEdit, editingPage]);

  // Validation du slug saisi manuellement
  useEffect(() => {
    if (debouncedSlug && manualSlugEdit) {
      const validateSlug = async () => {
        setSlugValidation(prev => ({ ...prev, isChecking: true }));
        
        if (!isSlugValid(debouncedSlug)) {
          setSlugValidation({ 
            isValid: false, 
            message: 'Slug invalide (routes réservées ou trop court)', 
            isChecking: false 
          });
          return;
        }

        try {
          const { data } = await supabase
            .from('custom_pages')
            .select('id')
            .eq('slug', debouncedSlug);
          
          const exists = data && data.length > 0 && (!editingPage || data[0].id !== editingPage.id);
          setSlugValidation({
            isValid: !exists,
            message: exists ? 'Ce slug existe déjà' : 'Slug disponible',
            isChecking: false
          });
        } catch (error) {
          setSlugValidation({ isValid: false, message: 'Erreur de validation', isChecking: false });
        }
      };
      validateSlug();
    }
  }, [debouncedSlug, manualSlugEdit, editingPage]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('URL copiée dans le presse-papiers');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugValidation.isValid) {
      toast.error('Veuillez corriger les erreurs avant de soumettre');
      return;
    }
    if (editingPage) {
      updatePageMutation.mutate({ id: editingPage.id, ...formData });
    } else {
      createPageMutation.mutate(formData);
    }
  };

  const handleEdit = (page: CustomPage) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      iframe_code: page.iframe_code,
      title: page.title,
      description: page.description || '',
      is_active: page.is_active
    });
    setManualSlugEdit(true); // Considérer comme édition manuelle lors de la modification
    setSlugValidation({ isValid: true, message: '', isChecking: false });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) {
      deletePageMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Pages Personnalisées</h2>
        <Dialog open={isCreateDialogOpen || !!editingPage} onOpenChange={(open) => {
          if (!open) {
            setIsCreateDialogOpen(false);
            setEditingPage(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPage ? 'Modifier la page' : 'Créer une nouvelle page'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, slug: e.target.value }));
                    setManualSlugEdit(true);
                  }}
                  placeholder="mariage-chateau-2024"
                  required
                  className={!slugValidation.isValid ? 'border-destructive' : ''}
                />
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-sm font-medium text-primary">
                    URL finale: <span className="font-mono">mariable.fr/proposition/{formData.slug}</span>
                  </p>
                  {slugValidation.isChecking && (
                    <p className="text-sm text-muted-foreground">Vérification...</p>
                  )}
                  {!slugValidation.isChecking && slugValidation.message && (
                    <p className={`text-sm ${slugValidation.isValid ? 'text-success' : 'text-destructive'}`}>
                      {slugValidation.message}
                    </p>
                  )}
                  {!manualSlugEdit && !editingPage && (
                    <p className="text-sm text-muted-foreground">
                      Le slug est généré automatiquement. Modifiez-le pour le personnaliser.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="iframe_code">Code iframe complet</Label>
                <Textarea
                  id="iframe_code"
                  value={formData.iframe_code}
                  onChange={(e) => setFormData(prev => ({ ...prev, iframe_code: e.target.value }))}
                  placeholder='<iframe class="airtable-embed" src="https://airtable.com/embed/..." frameborder="0" width="100%" height="533"></iframe>'
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Page active</Label>
              </div>

                <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createPageMutation.isPending || updatePageMutation.isPending || !slugValidation.isValid || slugValidation.isChecking}
                >
                  {editingPage ? 'Mettre à jour' : 'Créer'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateDialogOpen(false);
                    setEditingPage(null);
                    resetForm();
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {customPages?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Aucune page personnalisée créée</p>
            </CardContent>
          </Card>
        ) : (
          customPages?.map((page) => (
            <Card key={page.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {page.title}
                      {!page.is_active && (
                        <span className="px-2 py-1 text-xs bg-muted rounded">Inactive</span>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        mariable.fr/proposition/{page.slug}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`${window.location.origin}/proposition/${page.slug}`)}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    {page.description && (
                      <p className="text-sm text-muted-foreground mt-2">{page.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`/proposition/${page.slug}`, '_blank')}
                      disabled={!page.is_active}
                      title="Ouvrir la page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground">
                  Créé le {new Date(page.created_at).toLocaleDateString('fr-FR')}
                  {page.updated_at !== page.created_at && (
                    <> • Modifié le {new Date(page.updated_at).toLocaleDateString('fr-FR')}</>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomPagesManager;