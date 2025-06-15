
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2 } from "lucide-react";
import BlogPostForm from "./BlogPostForm";

const fetchBlogPosts = async (): Promise<BlogPost[]> => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
    throw new Error(error.message);
  }

  return data || [];
};

const BlogAdmin = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data: posts, isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: fetchBlogPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article supprimé avec succès !");
      queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la suppression: ${error.message}`);
    },
  });

  const handleAddNew = () => {
    setSelectedPost(null);
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddNew}>
          <Plus className="mr-2" />
          Ajouter un article
        </Button>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      post.status === "published"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {post.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(post.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                    <Edit />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? "Modifier l'article" : "Nouvel article"}
            </DialogTitle>
          </DialogHeader>
          <BlogPostForm
            post={selectedPost}
            onSuccess={() => {
              setIsModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ["blog_posts"] });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogAdmin;
