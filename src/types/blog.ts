
import { Database } from "@/integrations/supabase/types";

export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];
