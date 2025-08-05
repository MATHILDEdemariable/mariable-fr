import { supabase } from "@/integrations/supabase/client";
import slugify from "@/utils/slugify";

// Liste des routes réservées à éviter
const RESERVED_SLUGS = [
  'admin', 'dashboard', 'auth', 'login', 'register', 'blog', 'api',
  'pricing', 'contact', 'about', 'services', 'prestataires', 'vendors',
  'wedding', 'mariage', 'planning', 'coordination', 'sitemap', 'custom',
  'static', 'public', 'assets', 'favicon', 'robots', 'manifest'
];

/**
 * Génère un slug unique pour les pages personnalisées
 * Vérifie la table custom_pages et évite les routes réservées
 */
export async function generateUniqueCustomPageSlug(
  title: string, 
  excludeId?: string
): Promise<string> {
  let baseSlug = slugify(title) || "page-personnalisee";
  
  // Vérifier si c'est une route réservée
  if (RESERVED_SLUGS.includes(baseSlug)) {
    baseSlug = `page-${baseSlug}`;
  }
  
  let uniqueSlug = baseSlug;
  let i = 1;
  
  while (true) {
    // Vérifier l'unicité dans la base de données
    const { data, error } = await supabase
      .from("custom_pages")
      .select("id")
      .eq("slug", uniqueSlug);

    if (error) {
      console.error("Error checking slug uniqueness, using timestamp fallback", error);
      return `${baseSlug}-${Date.now()}`;
    }

    // Si aucun résultat ou uniquement la même page, c'est OK
    if (
      !data ||
      data.length === 0 ||
      (excludeId && data.length === 1 && data[0].id === excludeId)
    ) {
      return uniqueSlug;
    }
    
    i += 1;
    uniqueSlug = `${baseSlug}-${i}`;
  }
}

/**
 * Valide si un slug est autorisé (pas dans les routes réservées)
 */
export function isSlugValid(slug: string): boolean {
  const cleanSlug = slugify(slug);
  return !RESERVED_SLUGS.includes(cleanSlug) && cleanSlug.length >= 3;
}