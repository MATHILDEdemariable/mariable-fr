
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Plus, Edit, Trash2, Eye, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import BlogPostForm from './BlogPostForm';
import BlogCSVImport from './BlogCSVImport';

interface BlogPost {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  status: 'draft' | 'published';
  featured: boolean;
  created_at: string;
  published_at?: string;
  order_index: number;
  slug: string;
  tags?: string[];
}

const BlogAdmin = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [showImport, setShowImport] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(post => post.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  }, [searchTerm, statusFilter, categoryFilter, posts]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('order_index', { ascending: false });

      if (error) {
        console.error('Erreur lors du chargement des articles:', error);
        toast.error('Erreur lors du chargement des articles');
        return;
      }

      if (data) {
        const postsWithParsedTags = data.map(post => ({
          ...post,
          tags: typeof post.tags === 'string' ? JSON.parse(post.tags || '[]') : (post.tags || [])
        }));
        setPosts(postsWithParsedTags);
        setFilteredPosts(postsWithParsedTags);
      }
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
        return;
      }

      toast.success('Article supprimé avec succès');
      fetchPosts();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Une erreur est survenue');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormOpen(true);
  };

  const handleNew = () => {
    setEditingPost(null);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchPosts();
    setFormOpen(false);
    setEditingPost(null);
  };

  const handleImportComplete = () => {
    fetchPosts();
    setShowImport(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non publié';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueCategories = [...new Set(posts.map(p => p.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      {!formOpen && !showImport ? (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Gestion des articles</h2>
              <p className="text-gray-600">Gérez le contenu de votre blog</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowImport(true)} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Import CSV
              </Button>
              <Button onClick={handleNew} className="bg-wedding-olive hover:bg-wedding-olive/80">
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    {uniqueCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Articles ({filteredPosts.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center items-center p-10">
                  <p>Chargement des articles...</p>
                </div>
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    {posts.length === 0 ? 'Aucun article créé.' : 'Aucun article ne correspond à vos critères.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Catégorie</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Mis en avant</TableHead>
                        <TableHead>Date de publication</TableHead>
                        <TableHead>Ordre</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{post.title}</div>
                              {post.subtitle && (
                                <div className="text-sm text-gray-500">{post.subtitle}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {post.category && (
                              <Badge variant="outline">{post.category}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(post.status)}>
                              {post.status === 'published' ? 'Publié' : 'Brouillon'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {post.featured && (
                              <Badge className="bg-purple-100 text-purple-800">
                                En avant
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{formatDate(post.published_at)}</TableCell>
                          <TableCell>{post.order_index}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {post.status === 'published' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`/conseilsmariage/${post.slug}`, '_blank')}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(post)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(post.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      ) : showImport ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setShowImport(false)}>
              ← Retour à la liste
            </Button>
            <h2 className="text-xl font-semibold">Import CSV des articles</h2>
          </div>
          <BlogCSVImport onImportComplete={handleImportComplete} />
        </div>
      ) : (
        <BlogPostForm
          post={editingPost}
          onClose={() => setFormOpen(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default BlogAdmin;
