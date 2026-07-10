import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchPrestataires from "./tools/search-prestataires";
import listBlogPosts from "./tools/list-blog-posts";
import getMyProfile from "./tools/get-my-profile";
import listMyWeddingProjects from "./tools/list-my-wedding-projects";

// The OAuth issuer MUST be the direct Supabase host (not a proxy). Built from
// the project ref which Vite inlines at build time — keeps this file import-safe.
const projectRef =
  import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mariable-mcp",
  title: "Mariable",
  version: "0.1.0",
  instructions:
    "Outils pour Mariable, plateforme d'organisation de mariage. Utilisez `search_prestataires` et `list_blog_posts` pour la recherche publique. `get_my_profile` et `list_my_wedding_projects` retournent les données du compte connecté.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchPrestataires, listBlogPosts, getMyProfile, listMyWeddingProjects],
});
