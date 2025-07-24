
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ImageUploader } from './ImageUploader';

interface BlogPost {
  id?: string;
  title: string;
  subtitle?: string;
  h1_title?: string;
  content?: string;
  meta_title?: string;
  meta_description?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published';
  featured: boolean;
  background_image_url?: string;
  slug: string;
  order_index: number;
}

interface BlogPostFormProps {
  post?: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

const BlogPostForm: React.FC<BlogPostFormProps> = ({ post, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BlogPost>({
    title: '',
    subtitle: '',
    h1_title: '',
    content: '',
    meta_title: '',
    meta_description: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    background_image_url: '',
    slug: '',
    order_index: 0
  });
  
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        ...post,
        tags: Array.isArray(post.tags) ? post.tags : []
      });
    }
  }, [post]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title),
      h1_title: prev.h1_title || title,
      meta_title: prev.meta_title || title
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({
      ...prev,
      background_image_url: imageUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        published_at: formData.status === 'published' ? new Date().toISOString() : null,
        tags: JSON.stringify(formData.tags)
      };

      let error;
      if (post?.id) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(dataToSubmit)
          .eq('id', post.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blog_posts')
          .insert([dataToSubmit]);
        error = insertError;
      }

      if (error) {
        console.error('Erreur lors de la sauvegarde:', error);
        toast.error('Erreur lors de la sauvegarde de l\'article');
        return;
      }

      toast.success(post?.id ? 'Article mis à jour avec succès' : 'Article créé avec succès');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {post?.id ? 'Modifier l\'article' : 'Nouvel article'}
        </h2>
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne principale */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contenu principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle">Sous-titre</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Sous-titre de l'article"
                  />
                </div>

                <div>
                  <Label htmlFor="content">Contenu</Label>
                  <Textarea
                    id="content"
                    value={formData.content || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Contenu de l'article"
                    rows={10}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image de couverture</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageUploader
                  onImageUpload={handleImageUpload}
                  currentImageUrl={formData.background_image_url}
                  bucketName="blog-images"
                />
              </CardContent>
            </Card>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'draft' | 'published') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="published">Publié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category">Catégorie</Label>
                  <Input
                    id="category"
                    value={formData.category || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="Catégorie de l'article"
                  />
                </div>

                <div>
                  <Label htmlFor="order_index">Ordre d'affichage</Label>
                  <Input
                    id="order_index"
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, featured: checked }))
                    }
                  />
                  <Label htmlFor="featured">Article mis en avant</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="slug">Slug URL</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="slug-de-l-article"
                  />
                </div>

                <div>
                  <Label htmlFor="h1_title">Titre H1</Label>
                  <Input
                    id="h1_title"
                    value={formData.h1_title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, h1_title: e.target.value }))}
                    placeholder="Titre H1 pour le SEO"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    placeholder="Titre pour les moteurs de recherche"
                  />
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    placeholder="Description pour les moteurs de recherche"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nouveau tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">
                    Ajouter
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sauvegarde...' : (post?.id ? 'Mettre à jour' : 'Créer')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogPostForm;
