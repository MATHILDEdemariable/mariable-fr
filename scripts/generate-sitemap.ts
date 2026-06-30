/**
 * Génère public/sitemap.xml à partir des pages statiques + des contenus
 * dynamiques Supabase (prestataires visibles + articles de blog publiés).
 *
 * Exécuté automatiquement avant `vite dev` et `vite build` via les scripts
 * `predev` / `prebuild` de package.json.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE_URL = "https://www.mariable.fr";
const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL ?? "https://bgidfcqktsttzlwlumtz.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjM1MTYsImV4cCI6MjA1ODk5OTUxNn0.ij6dWi7LiWNk9mh3SknY1N8-upp9l20R7CZZDeAMEys";

const TODAY = new Date().toISOString().split("T")[0];

interface StaticPage {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
}

const staticPages: StaticPage[] = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/accueil", priority: "0.9", changefreq: "weekly" },
  { url: "/selection", priority: "1.0", changefreq: "daily" },
  { url: "/vibewedding", priority: "0.7", changefreq: "monthly" },
  { url: "/domainedelafontaine", priority: "0.6", changefreq: "monthly" },
  { url: "/services/budget", priority: "0.9", changefreq: "monthly" },
  { url: "/prix", priority: "0.9", changefreq: "monthly" },
  { url: "/comparatif", priority: "0.8", changefreq: "monthly" },
  { url: "/checklist-mariage", priority: "0.9", changefreq: "monthly" },
  { url: "/retroplanning", priority: "0.8", changefreq: "monthly" },
  { url: "/detail-coordination-jourm", priority: "0.9", changefreq: "monthly" },
  { url: "/conseilsmariage", priority: "0.9", changefreq: "weekly" },
  { url: "/fonctionnalites", priority: "0.7", changefreq: "monthly" },
  { url: "/professionnelsmariable", priority: "0.9", changefreq: "weekly" },
  { url: "/partenariat", priority: "0.7", changefreq: "monthly" },
  { url: "/guide-jour-j", priority: "0.7", changefreq: "monthly" },
  { url: "/guide-debutant", priority: "0.7", changefreq: "monthly" },
  { url: "/guidecoordinationjour-j", priority: "0.6", changefreq: "monthly" },
  { url: "/ceremonie-laique", priority: "0.7", changefreq: "monthly" },
  { url: "/mariage-civil", priority: "0.7", changefreq: "monthly" },
  { url: "/ceremonie-catholique", priority: "0.7", changefreq: "monthly" },
  { url: "/content-creator-mariage", priority: "0.6", changefreq: "monthly" },
  { url: "/mariage-provence", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-paris", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-auvergne-rhone-alpes", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-nouvelle-aquitaine", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-bretagne", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-normandie", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-occitanie", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-pays-de-la-loire", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-centre-val-de-loire", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-hauts-de-france", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-bourgogne-franche-comte", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-grand-est", priority: "0.8", changefreq: "monthly" },
  { url: "/mariage-corse", priority: "0.8", changefreq: "monthly" },
  { url: "/about/histoire", priority: "0.8", changefreq: "yearly" },
  { url: "/about/charte", priority: "0.8", changefreq: "yearly" },
  { url: "/about/approche", priority: "0.8", changefreq: "yearly" },
  { url: "/about/temoignages", priority: "0.8", changefreq: "yearly" },
  { url: "/contact", priority: "0.8", changefreq: "yearly" },
  { url: "/planning-personnalise", priority: "0.7", changefreq: "monthly" },
  { url: "/coordinateurs-mariage", priority: "0.7", changefreq: "monthly" },
  
  { url: "/coordination-jour-j", priority: "0.7", changefreq: "monthly" },
  { url: "/outils-planning-mariage", priority: "0.7", changefreq: "monthly" },
  { url: "/to-do-list-mariage", priority: "0.6", changefreq: "monthly" },
  { url: "/liste-preparatif-mariage", priority: "0.6", changefreq: "monthly" },
  { url: "/landing-generale", priority: "0.6", changefreq: "monthly" },
  { url: "/installer-app", priority: "0.5", changefreq: "yearly" },
  { url: "/cgv", priority: "0.5", changefreq: "yearly" },
  { url: "/cgv-couples", priority: "0.4", changefreq: "yearly" },
  { url: "/contact/faq", priority: "0.5", changefreq: "yearly" },
  { url: "/sitemap", priority: "0.4", changefreq: "monthly" },
];

interface Row {
  slug: string | null;
  updated_at: string | null;
}

async function fetchAll(table: string, query: string): Promise<Row[]> {
  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) {
    console.warn(`⚠️  Sitemap: ${table} fetch failed (${res.status})`);
    return [];
  }
  return (await res.json()) as Row[];
}

function formatDate(d: string | null): string {
  if (!d) return TODAY;
  try {
    return new Date(d).toISOString().split("T")[0];
  } catch {
    return TODAY;
  }
}

function buildXml(prestataires: Row[], blogPosts: Row[]): string {
  const urls = [
    ...staticPages.map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}${p.url}</loc>\n    <lastmod>${p.lastmod ?? TODAY}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
    ),
    ...prestataires.map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}/prestataire/${p.slug}</loc>\n    <lastmod>${formatDate(p.updated_at)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>`,
    ),
    ...blogPosts.map(
      (p) =>
        `  <url>\n    <loc>${BASE_URL}/conseilsmariage/${p.slug}</loc>\n    <lastmod>${formatDate(p.updated_at)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`,
    ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

async function main() {
  const [prestRaw, blogRaw] = await Promise.all([
    fetchAll(
      "prestataires_rows",
      "select=slug,updated_at&visible=eq.true&limit=10000",
    ),
    fetchAll(
      "blog_posts",
      "select=slug,updated_at&status=eq.published&limit=10000",
    ),
  ]);

  const prestataires = prestRaw.filter((p) => p.slug);
  const blogPosts = blogRaw.filter((p) => p.slug);

  const xml = buildXml(prestataires, blogPosts);
  const outPath = resolve("public/sitemap.xml");
  writeFileSync(outPath, xml);
  console.log(
    `✅ sitemap.xml written: ${staticPages.length} static + ${prestataires.length} prestataires + ${blogPosts.length} blog posts`,
  );
}

main().catch((err) => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(0); // ne bloque pas le build
});
