// Post-build : génère un index.html par page publique avec title, description,
// canonical, og:* et un résumé texte lisible sans JavaScript (robots IA, réseaux sociaux).
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";
import { BLOG_PUBLICATION_NOV_2026 } from '../src/data/blogPublicationNov2026';

const SITE_URL = "https://mariable.fr";

type PageHead = { path: string; title: string; description: string; h1: string; links?: [string, string][]; bodyHtml?: string; jsonLd?: object[]; ogType?: string };

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? "https://bgidfcqktsttzlwlumtz.supabase.co";
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnaWRmY3FrdHN0dHpsd2x1bXR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjM1MTYsImV4cCI6MjA1ODk5OTUxNn0.ij6dWi7LiWNk9mh3SknY1N8-upp9l20R7CZZDeAMEys";

const fetchRows = async (table: string, query: string): Promise<any[]> => {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
    if (!res.ok) { console.warn(`⚠️ prerender: ${table} fetch failed (${res.status})`); return []; }
    return (await res.json()) as any[];
  } catch (error) { console.error("❌ prerender fetch failed:", table, error); return []; }
};

const ORGANIZATION = { "@context": "https://schema.org", "@type": "Organization", name: "Mariable", url: SITE_URL, logo: `${SITE_URL}/og-image.jpg`, founder: { "@type": "Person", name: "Mathilde Lambert" }, email: "contact@mariable.fr" };
const SOFTWARE = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Mariable", applicationCategory: "LifestyleApplication", operatingSystem: "Web, iOS, Android", url: SITE_URL, offers: [{ "@type": "Offer", name: "Mariable Couple", price: "29", priceCurrency: "EUR" }, { "@type": "Offer", name: "Mariable Pro Coordination Jour J", price: "149", priceCurrency: "EUR" }] };

const breadcrumb = (items: [string, string][]) => ({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${p}` })) });

const stripTags = (html: string) => html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

// Extrait les vraies Q/R affichées : un h2/h3 terminé par "?" suivi de son paragraphe.
const extractFaq = (html: string) => {
  const faq: { q: string; a: string }[] = [];
  const re = /<h[23][^>]*>([\s\S]*?\?)\s*<\/h[23]>\s*((?:<p[^>]*>[\s\S]*?<\/p>\s*)+)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) faq.push({ q: stripTags(m[1]), a: stripTags(m[2]) });
  return faq;
};

const formatPrice = (value: unknown) => (value === null || value === undefined || value === "" ? null : `${value} €`);

const buildArticlePage = (post: any, nov: { slug: string; title: string; description: string; h1: string } | undefined): PageHead => {
  const base = post.audience === "pro" ? "/conseils-professionnels" : "/conseilsmariage";
  const pagePath = `${base}/${post.slug}`;
  const h1 = nov?.h1 ?? post.h1_title ?? post.title;
  let content: string = (post.content ?? "").replace(/<script[\s\S]*?<\/script>/gi, "");
  content = content.replace(/<\/?article[^>]*>/gi, "").replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, ""); // un seul H1
  const description = nov?.description ?? post.meta_description ?? stripTags(content).slice(0, 155);
  const title = nov?.title ?? post.meta_title ?? post.title;
  const faq = extractFaq(content);
  const jsonLd: object[] = [
    { "@context": "https://schema.org", "@type": "Article", headline: h1, description, inLanguage: post.language ?? "fr", datePublished: post.published_at ?? post.created_at, dateModified: post.updated_at ?? post.published_at ?? post.created_at, author: { "@type": "Person", name: "Mathilde Lambert" }, publisher: ORGANIZATION, mainEntityOfPage: `${SITE_URL}${pagePath}`, ...(post.background_image_url ? { image: post.background_image_url } : {}) },
    breadcrumb([["Accueil", "/"], [post.audience === "pro" ? "Conseils professionnels" : "Conseils mariage", base], [h1, pagePath]]),
  ];
  if (faq.length >= 2) jsonLd.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  const bodyHtml = `<nav><a href="/">Accueil</a> › <a href="${base}">${post.audience === "pro" ? "Conseils professionnels" : "Conseils mariage"}</a></nav><article><h1>${escapeHtml(h1)}</h1>${content}</article>`;
  return { path: pagePath, title, description, h1, bodyHtml, jsonLd, ogType: "article" };
};

const buildVendorPage = (v: any): PageHead => {
  const pagePath = `/prestataire/${v.slug}`;
  const place = v.ville ? ` à ${v.ville}` : "";
  const description = (v.description ? stripTags(v.description).slice(0, 155) : `${v.nom}, ${String(v.categorie ?? "prestataire").toLowerCase()} de mariage${place}, référencé sur Mariable.`);
  const packages = [1, 2, 3, 4].map((i) => {
    const key = ["first", "second", "third", "fourth"][i - 1];
    return { name: v[`${key}_price_package_name`], price: v[`${key}_price_package`], desc: v[`${key}_price_package_description`] };
  }).filter((p) => p.name || p.price);
  const showPrices = v.show_prices !== false;
  const priceLines: string[] = [];
  if (showPrices) {
    const from = formatPrice(v.prix_a_partir_de ?? v.prix_minimum);
    if (from) priceLines.push(`<li>À partir de ${escapeHtml(from)}</li>`);
    const perPerson = formatPrice(v.prix_par_personne);
    if (perPerson) priceLines.push(`<li>Prix par personne : ${escapeHtml(perPerson)}</li>`);
    packages.forEach((p) => priceLines.push(`<li>${escapeHtml(String(p.name ?? "Formule"))}${p.price ? ` : ${escapeHtml(String(p.price))} €` : ""}${p.desc ? ` — ${escapeHtml(stripTags(String(p.desc)))}` : ""}</li>`));
  }
  const facts = [
    v.categorie && `<li>Catégorie : ${escapeHtml(v.categorie)}</li>`,
    v.ville && `<li>Ville : ${escapeHtml(v.ville)}</li>`,
    Array.isArray(v.regions) && v.regions.length && `<li>Régions : ${escapeHtml(v.regions.join(", "))}</li>`,
    v.capacite_invites && `<li>Capacité : ${escapeHtml(String(v.capacite_invites))} invités</li>`,
    v.hebergement_inclus && `<li>Hébergement inclus${v.nombre_couchages ? ` (${escapeHtml(String(v.nombre_couchages))} couchages)` : ""}</li>`,
    Array.isArray(v.styles) && v.styles.length && `<li>Styles : ${escapeHtml(v.styles.join(", "))}</li>`,
  ].filter(Boolean).join("");
  const showDesc = v.show_description !== false;
  const bodyHtml = `<nav><a href="/">Accueil</a> › <a href="/selection">Prestataires</a></nav><main><h1>${escapeHtml(v.nom)}</h1>${facts ? `<ul>${facts}</ul>` : ""}${showDesc && v.description ? `<p>${escapeHtml(stripTags(v.description))}</p>` : ""}${showDesc && v.description_more ? `<p>${escapeHtml(stripTags(v.description_more))}</p>` : ""}${priceLines.length ? `<h2>Tarifs</h2><ul>${priceLines.join("")}</ul>` : ""}<p><a href="/selection">Voir d'autres prestataires de mariage</a></p></main>`;
  const business: any = { "@context": "https://schema.org", "@type": "LocalBusiness", name: v.nom, url: `${SITE_URL}${pagePath}`, description };
  if (v.ville) business.address = { "@type": "PostalAddress", addressLocality: v.ville, addressCountry: "FR" };
  if (v.latitude && v.longitude) business.geo = { "@type": "GeoCoordinates", latitude: v.latitude, longitude: v.longitude };
  if (showPrices && (v.prix_a_partir_de ?? v.prix_minimum)) business.priceRange = `À partir de ${v.prix_a_partir_de ?? v.prix_minimum} €`;
  return { path: pagePath, title: `${v.nom} – ${v.categorie ?? "Prestataire"} mariage${place} | Mariable`, description, h1: v.nom, bodyHtml, jsonLd: [business, breadcrumb([["Accueil", "/"], ["Prestataires", "/selection"], [v.nom, pagePath]])] };
};

const humanize = (p: string) => p.split("/").filter(Boolean).pop()!.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());

const PAGES: PageHead[] = [
  ...BLOG_PUBLICATION_NOV_2026.map((article) => ({ path: `/conseilsmariage/${article.slug}`, title: article.title, description: article.description, h1: article.h1 })),
  { path: "/", title: "Mariable — L'application du jour J pour couples et wedding planners", description: "Mariable centralise et coordonne le déroulé du mariage : horaires, rôles, prestataires et documents, partagés par un simple lien. Budget, plan de table, RSVP.", h1: "Célébrer l'amour. Sublimer le Jour J.", links: [["/pro-solutions", "Logiciel wedding planner"], ["/pro-solutions", "Pour les pros"], ["/budget-mariage", "Budget mariage"], ["/blog", "Blog"]] },
  { path: "/pro-solutions", title: "Mariable Pro – App wedding planner & agence IA événementiel", description: "L'app des wedding planners boostée à l'IA : déroulé jour J partagé, dès 149 €/an, essai gratuit. AI Studio : formation, conseil et apps IA sur mesure.", h1: "L'application des wedding planners qui fait tenir le jour J dans un seul document", links: [["/pro/feuille-de-route-jour-j", "Feuille de route jour J"], ["/register-gratuit?type=pro", "Essayer gratuitement"]] },
  { path: "/pro/feuille-de-route-jour-j", title: "Feuille de route mariage prestataires à partager | Mariable Pro", description: "Partagez le conducteur du mariage à tous les prestataires avec un seul lien, sans compte. Planning filtrable et toujours à jour avec Mariable Pro.", h1: "Un seul lien pour partager votre feuille de route mariage", links: [["/pro-solutions", "Logiciel wedding planner"]] },
  { path: "/comparatif", title: "Organiser son mariage avec ou sans wedding planner | Mariable", description: "Avec ou sans wedding planner, les mêmes outils : déroulé jour J, budget, plan de table. Mariable Couple 29 € au lieu de 59 €, paiement unique par mariage.", h1: "Organiser son mariage : seul, wedding planner ou wedding planner digital ?", links: [["/register-gratuit", "Créer mon compte gratuit"], ["/pro-solutions", "Mariable Pro pour les wedding planners"]] },
  { path: "/conseils-professionnels", title: "Conseils pour professionnels du mariage – Mariable Pro", description: "Guides pour wedding planners, coordinateurs et lieux de réception : coordination jour J, outils, visibilité et organisation.", h1: "Conseils pour les professionnels du mariage", links: [["/pro-solutions", "Logiciel wedding planner"]] },
  { path: "/fonctionnalites", title: "Fonctionnalités de l'app Mariable – budget, plan de table, jour J", description: "Toutes les fonctionnalités de Mariable : budget détaillé, checklist, plan de table, RSVP en ligne, album photo invités et coordination du jour J.", h1: "Les fonctionnalités de Mariable" },
  { path: "/installer-app", title: "Installer l'application Mariable sur iPhone et Android", description: "Installez Mariable en quelques secondes depuis votre navigateur, sans App Store ni Google Play, sur iPhone, Android ou tablette.", h1: "Installer l'application Mariable" },
  { path: "/prix", title: "Tarifs Mariable – gratuit, 29 € par mariage, Pro 149 €/an", description: "Outils gratuits pour les couples, Premium à 29 € par mariage, Mariable Pro à 149 €/an pour les professionnels avec projets illimités.", h1: "Les tarifs Mariable" },
  { path: "/budget-mariage", title: "Combien coûte vraiment votre mariage ? Simulateur – Mariable", description: "Estimez le budget de votre mariage poste par poste avec le simulateur Mariable et comparez vos devis.", h1: "Combien coûte vraiment votre mariage ?" },
  { path: "/contact", title: "Contact & histoire de Mariable", description: "Mariable est née de l'expérience d'une jeune mariée. Contactez Mathilde et découvrez la mission : sublimer le jour J.", h1: "Contactez Mariable" },
  { path: "/guides", title: "Guides mariage à télécharger – Mariable", description: "Guides PDF pour organiser votre mariage : jour J, checklist, témoins, cérémonie laïque et catalogue de prix.", h1: "Les guides Mariable" },
  { path: "/blog", title: "Blog mariage – conseils d'organisation | Mariable", description: "Conseils pour organiser votre mariage : budget, prestataires, cérémonie, jour J et idées.", h1: "Le blog Mariable" },
  { path: "/demo-pro", title: "Démo Mariable Pro – inscription", description: "Demandez une démo de Mariable Pro : 20 minutes de démonstration et 20 minutes de questions. Nous vous recontactons pour fixer une date qui vous convient.", h1: "Découvrez l'appli Jour J en direct", links: [["/pro-solutions", "Logiciel wedding planner"]] },
  { path: "/demo", title: "Démo vidéo Mariable – couples et wedding planners", description: "Découvrez Mariable en vidéo : une démo pour les couples en français et une démo pour les wedding planners en anglais.", h1: "Mariable en action", links: [["/pro-solutions", "Logiciel wedding planner"]] },
  { path: "/pro/alternative-mariages-net", title: "Alternative à Mariages.net pour wedding planners – Mariable Pro", description: "Une alternative à Mariages.net pour les pros du mariage : un outil de coordination jour J et une visibilité auprès de couples premium, dans une seule app.", h1: "L'alternative à Mariages.net pour les wedding planners", links: [["/pro-solutions", "Logiciel wedding planner"], ["/register-gratuit?type=pro", "Essayer gratuitement"]] },
  { path: "/contact/faq", title: "FAQ Mariable – questions fréquentes", description: "Réponses aux questions fréquentes sur Mariable : outils gratuits, Mariable Couple, Mariable Pro, partage du jour J et données.", h1: "Questions fréquentes" },
  { path: "/pro/ia-organisation-mariage", title: "IA organisation mariage : le Playbook IA du Wedding Planner", description: "Livre blanc gratuit : comment les wedding planners gagnent 2 à 4 h par semaine avec l'IA. Méthode en 4 étapes, 6 cas d'usage et 11 prompts offerts.", h1: "Le Playbook IA du Wedding Planner", links: [["/pro-solutions", "Logiciel wedding planner"]] },
];

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildHead = (page: PageHead) => {
  const url = `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" data-rh="true" />`,
    `<meta property="og:url" content="${url}" data-rh="true" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:image" content="${SITE_URL}/og-image.jpg" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:image" content="${SITE_URL}/og-image.jpg" />`,
    `<meta name="twitter:description" content="${description}" />`,
    ...(page.jsonLd ?? []).map((data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`),
  ].join("\n    ");
};

const buildBody = (page: PageHead) => {
  const links = (page.links ?? []).map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("");
  // Contenu remplacé par React au montage ; visible par les robots qui n'exécutent pas le JS.
  if (page.bodyHtml) return `<div id="root">${page.bodyHtml}</div>`;
  return `<div id="root"><main><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.description)}</p>${links ? `<ul>${links}</ul>` : ""}</main></div>`;
};

export const prerenderHeadsPlugin = (): Plugin => {
  let distDir = path.resolve(process.cwd(), "dist");
  return {
  name: "mariable-prerender-heads",
  apply: "build",
  configResolved(config) {
    distDir = path.resolve(config.root, config.build.outDir);
  },
  async closeBundle() {
    const templatePath = path.join(distDir, "index.html");
    if (!fs.existsSync(templatePath)) return;
    const template = fs.readFileSync(templatePath, "utf-8");
    const stripped = template
      .replace(/<title>[\s\S]*?<\/title>/, "")
      .replace(/<meta name="description"[^>]*>/, "")
      .replace(/<meta property="og:(title|description|url)"[^>]*>/g, "")
      .replace(/<meta name="twitter:(title|description)"[^>]*>/g, "");
    const [posts, vendors] = await Promise.all([
      fetchRows("blog_posts", "select=*&status=eq.published&limit=10000"),
      fetchRows("prestataires_rows", "select=*&visible=eq.true&limit=10000"),
    ]);
    const allPages: PageHead[] = PAGES.filter((p) => !p.path.startsWith("/conseilsmariage/")).map((p) => {
      const crumbs: object[] = p.path === "/" ? [] : [breadcrumb([["Accueil", "/"], [p.h1, p.path]])];
      const org = p.path === "/" || p.path === "/pro-solutions" ? [ORGANIZATION, SOFTWARE] : [];
      return { ...p, jsonLd: [...org, ...crumbs] };
    });
    posts.filter((post) => post.slug).forEach((post) => allPages.push(buildArticlePage(post, BLOG_PUBLICATION_NOV_2026.find((a) => a.slug === post.slug))));
    vendors.filter((v) => v.slug && v.nom).forEach((v) => allPages.push(buildVendorPage(v)));
    // Pages statiques du sitemap sans entrée dédiée : au minimum title et canonical propres.
    const sitemapPath = path.join(distDir, "sitemap.xml");
    if (fs.existsSync(sitemapPath)) {
      const known = new Set(allPages.map((p) => p.path));
      for (const m of fs.readFileSync(sitemapPath, "utf-8").matchAll(/<loc>https:\/\/mariable\.fr([^<]*)<\/loc>/g)) {
        const p = m[1] || "/";
        if (known.has(p) || p.startsWith("/prestataire/") || p.startsWith("/conseilsmariage/") || p.startsWith("/conseils-professionnels/")) continue;
        known.add(p);
        const label = humanize(p);
        allPages.push({ path: p, title: `${label} | Mariable`, description: `${label} – Mariable, la plateforme d'organisation et de coordination de mariage. Avec ou sans wedding planner, les mêmes outils.`, h1: label, jsonLd: [breadcrumb([["Accueil", "/"], [label, p]])] });
      }
    }
    for (const page of allPages) {
      try {
        // dist/index.html sert aussi de repli pour toutes les autres routes :
        // pas de contenu texte pour "/" afin d'éviter un flash de l'accueil ailleurs.
        let withHead = stripped.replace("</head>", `    ${buildHead(page)}\n  </head>`);
        if (page.path !== "/") {
          // Helmet owns these tags after mounting; mark only these new article fallbacks
          // so their metadata is not duplicated with the template's tags.
          withHead = withHead
            .replace(/<(meta|title)(?![^>]*data-rh=)([^>]*)>/g, '<$1 data-rh="true"$2>')
            .replace(/(property="og:type" content=")website"/, `$1${page.ogType ?? "website"}"`);
        }
        // Accueil : le template sert aussi de repli SPA, on n'y met que les méta + JSON-LD.
        const html = page.path === "/" ? withHead : withHead.replace('<div id="root"></div>', buildBody(page));
        const outDir = page.path === "/" ? distDir : path.join(distDir, page.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html);
      } catch (error) {
        console.error("❌ prerender failed for", page.path, error);
      }
    }
    console.log(`✅ prerender: ${allPages.length} pages`);
  },
  };
};
