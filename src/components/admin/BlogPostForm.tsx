import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { BlogPost, BlogPostInsert, BlogPostUpdate } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import ImageUploader from "./ImageUploader";

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis."),
  subtitle: z.string().optional(),
  slug: z.string().min(1, "Le slug est requis."),
  content: z.string().optional(),
  background_image_url: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  h1_title: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type BlogPostFormValues = z.infer<typeof formSchema>;

const slugify = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const BlogPostForm: React.FC<{ post: BlogPost | null; onSuccess: () => void }> = ({ post, onSuccess }) => {
  const form = useForm<BlogPostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      slug: "",
      content: "",
      background_image_url: "",
      meta_title: "",
      meta_description: "",
      h1_title: "",
      status: "draft",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
    setValue,
    watch
  } = form;
  
  const titleValue = watch("title");

  useEffect(() => {
    if (titleValue && !post) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, post, setValue]);

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        subtitle: post.subtitle ?? "",
        slug: post.slug,
        content: post.content ?? "",
        background_image_url: post.background_image_url ?? "",
        meta_title: post.meta_title ?? "",
        meta_description: post.meta_description ?? "",
        h1_title: post.h1_title ?? "",
        status: post.status,
      });
    } else {
      reset({
        title: "",
        subtitle: "",
        slug: "",
        content: "",
        background_image_url: "",
        meta_title: "",
        meta_description: "",
        h1_title: "",
        status: "draft",
      });
    }
  }, [post, reset]);

  const mutation = useMutation({
    mutationFn: async (values: BlogPostFormValues) => {
      const dataToSubmit: BlogPostInsert | BlogPostUpdate = {
        ...values,
        published_at: values.status === "published" && (!post || !post.published_at)
            ? new Date().toISOString()
            : post?.published_at,
      };

      if (post) { // Update
        const { error } = await supabase.from("blog_posts").update(dataToSubmit).eq("id", post.id);
        if (error) throw error;
      } else { // Insert
        const { error } = await supabase.from("blog_posts").insert(dataToSubmit as BlogPostInsert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(`Article ${post ? 'modifié' : 'créé'} avec succès !`);
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Erreur : ${error.message}`);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
        <FormField
          control={control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input placeholder="Titre de l'article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="titre-de-l-article" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sous-titre</FormLabel>
              <FormControl>
                <Input placeholder="Sous-titre accrocheur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contenu</FormLabel>
              <FormControl>
                <Textarea placeholder="Contenu de l'article..." rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="background_image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image de fond</FormLabel>
              <FormControl>
                <ImageUploader 
                  onUpload={(url) => setValue("background_image_url", url, { shouldValidate: true })}
                  initialUrl={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <h3 className="text-lg font-semibold pt-4 border-t">SEO</h3>
        <FormField
          control={control}
          name="h1_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre H1</FormLabel>
              <FormControl>
                <Input placeholder="Titre H1 pour le SEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="meta_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Titre</FormLabel>
              <FormControl>
                <Input placeholder="Meta Titre (pour les moteurs de recherche)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="meta_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Meta Description pour le SEO" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
        </div>
      </form>
    </Form>
  );
};

export default BlogPostForm;
