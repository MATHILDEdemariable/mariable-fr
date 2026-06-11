import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const BASE_URL = "https://www.mariable.fr";

const staticPages = [
  { url: "/", lastmod: "2026-02-16", priority: "1.0", changefreq: "daily" },
  { url: "/accueil", lastmod: "2026-02-16", priority: "0.9", changefreq: "weekly" },
  { url: "/selection", lastmod: "2026-02-16", priority: "1.0", changefreq: "daily" },
  { url: "/vibewedding", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/domainedelafontaine", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/services/budget", lastmod: "2026-02-16", priority: "0.9", changefreq: "monthly" },
  { url: "/prix", lastmod: "2026-02-16", priority: "0.9", changefreq: "monthly" },
  { url: "/comparatif", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/checklist-mariage", lastmod: "2026-02-16", priority: "0.9", changefreq: "monthly" },
  { url: "/retroplanning", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/detail-coordination-jourm", lastmod: "2026-02-16", priority: "0.9", changefreq: "monthly" },
  { url: "/conseilsmariage", lastmod: "2026-02-16", priority: "0.9", changefreq: "weekly" },
  { url: "/fonctionnalites", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/professionnelsmariable", lastmod: "2026-02-16", priority: "0.9", changefreq: "weekly" },
  { url: "/partenariat", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/guide-jour-j", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/guide-debutant", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/guidecoordinationjour-j", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/ceremonie-laique", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/mariage-civil", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/ceremonie-catholique", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/content-creator-mariage", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/mariage-provence", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-paris", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-auvergne-rhone-alpes", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-nouvelle-aquitaine", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-bretagne", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-normandie", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-occitanie", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-pays-de-la-loire", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-centre-val-de-loire", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-hauts-de-france", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-bourgogne-franche-comte", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-grand-est", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-corse", lastmod: "2026-02-16", priority: "0.8", changefreq: "monthly" },
  { url: "/about/histoire", lastmod: "2026-02-16", priority: "0.8", changefreq: "yearly" },
  { url: "/about/charte", lastmod: "2026-02-16", priority: "0.8", changefreq: "yearly" },
  { url: "/about/approche", lastmod: "2026-02-16", priority: "0.8", changefreq: "yearly" },
  { url: "/about/temoignages", lastmod: "2026-02-16", priority: "0.8", changefreq: "yearly" },
  { url: "/contact", lastmod: "2026-02-16", priority: "0.8", changefreq: "yearly" },
  { url: "/planning-personnalise", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/coordinateurs-mariage", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/jeunes-maries", lastmod: "2026-02-16", priority: "0.7", changefreq: "weekly" },
  { url: "/coordination-jour-j", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/outils-planning-mariage", lastmod: "2026-02-16", priority: "0.7", changefreq: "monthly" },
  { url: "/to-do-list-mariage", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/liste-preparatif-mariage", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/landing-generale", lastmod: "2026-02-16", priority: "0.6", changefreq: "monthly" },
  { url: "/installer-app", lastmod: "2026-02-16", priority: "0.5", changefreq: "yearly" },
  { url: "/cgv", lastmod: "2026-02-16", priority: "0.5", changefreq: "yearly" },
  { url: "/cgv-couples", lastmod: "2026-02-16", priority: "0.4", changefreq: "yearly" },
  { url: "/contact/faq", lastmod: "2026-02-16", priority: "0.5", changefreq: "yearly" },
  { url: "/sitemap", lastmod: "2026-02-16", priority: "0.4", changefreq: "monthly" },
];

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch {
    return "2026-02-16";
  }
}

function generateXml(
  prestataires: { slug: string; updated_at: string }[],
  blogPosts: { slug: string; updated_at: string }[]
): string {
  const urls = staticPages
    .map(
      (p) => `  <url>
    <loc>${BASE_URL}${p.url}</loc>
    <lastmod>${p.lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    )
    .concat(
      prestataires.map(
        (p) => `  <url>
    <loc>${BASE_URL}/prestataire/${p.slug}</loc>
    <lastmod>${formatDate(p.updated_at)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`
      )
    )
    .concat(
      blogPosts.map(
        (p) => `  <url>
    <loc>${BASE_URL}/conseilsmariage/${p.slug}</loc>
    <lastmod>${formatDate(p.updated_at)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
      )
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

Deno.serve(async () => {
  const headers = {
    "Content-Type": "application/xml; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
  };

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const [prestRes, blogRes] = await Promise.all([
      supabase
        .from("prestataires_rows")
        .select("slug, updated_at")
        .eq("visible", true),
      supabase
        .from("blog_posts")
        .select("slug, updated_at")
        .eq("status", "published"),
    ]);

    const prestataires = prestRes.data?.filter((p) => p.slug) || [];
    const blogPosts = blogRes.data?.filter((p) => p.slug) || [];

    console.log(`✅ Sitemap generated: ${staticPages.length} static + ${prestataires.length} prestataires + ${blogPosts.length} blog posts`);

    return new Response(generateXml(prestataires, blogPosts), { headers });
  } catch (error) {
    console.error("❌ Sitemap generation error:", error);
    return new Response(generateXml([], []), { headers });
  }
});
