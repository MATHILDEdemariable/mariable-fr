// Post-build : génère un index.html par page publique avec title, description,
// canonical, og:* et un résumé texte lisible sans JavaScript (robots IA, réseaux sociaux).
import fs from "fs";
import path from "path";
import type { Plugin } from "vite";

const SITE_URL = "https://mariable.fr";

type PageHead = { path: string; title: string; description: string; h1: string; links?: [string, string][] };

const PAGES: PageHead[] = [
  { path: "/", title: "Mariable — L'application du jour J pour couples et wedding planners", description: "Mariable centralise et coordonne le déroulé du mariage : horaires, rôles, prestataires et documents, partagés par un simple lien. Budget, plan de table, RSVP.", h1: "Célébrer l'amour. Sublimer le Jour J.", links: [["/logiciel-wedding-planner", "Logiciel wedding planner"], ["/partenariat", "Mariable Pro"], ["/budget-mariage", "Budget mariage"], ["/blog", "Blog"]] },
  { path: "/logiciel-wedding-planner", title: "Application & logiciel wedding planner – Mariable Pro", description: "L'application des wedding planners et coordinatrices jour J : un déroulé unique partagé avec couples et prestataires, boosté par l'IA. 149 €/an, essai gratuit.", h1: "L'application des wedding planners qui fait tenir le jour J dans un seul document", links: [["/pro/feuille-de-route-jour-j", "Feuille de route jour J"], ["/register-gratuit?type=pro", "Essayer gratuitement"], ["/partenariat", "Mariable Pro & Studio"]] },
  { path: "/partenariat", title: "Mariable Pro & Studio – App jour J pour wedding planners", description: "Mariable Pro : l'app de coordination jour J pour wedding planners et coordinateurs, 149 €/an, projets illimités, essai gratuit. Mariable Studio : communication digitale.", h1: "La solution pour les wedding planners et coordinateurs de Jour-J", links: [["/logiciel-wedding-planner", "Logiciel wedding planner"], ["/pro/feuille-de-route-jour-j", "Feuille de route jour J"]] },
  { path: "/pro/feuille-de-route-jour-j", title: "Feuille de route mariage prestataires à partager | Mariable Pro", description: "Partagez le conducteur du mariage à tous les prestataires avec un seul lien, sans compte. Planning filtrable et toujours à jour avec Mariable Pro.", h1: "Un seul lien pour partager votre feuille de route mariage", links: [["/logiciel-wedding-planner", "Logiciel wedding planner"]] },
  { path: "/conseils-professionnels", title: "Conseils pour professionnels du mariage – Mariable Pro", description: "Guides pour wedding planners, coordinateurs et lieux de réception : coordination jour J, outils, visibilité et organisation.", h1: "Conseils pour les professionnels du mariage", links: [["/logiciel-wedding-planner", "Logiciel wedding planner"]] },
  { path: "/fonctionnalites", title: "Fonctionnalités de l'app Mariable – budget, plan de table, jour J", description: "Toutes les fonctionnalités de Mariable : budget détaillé, checklist, plan de table, RSVP en ligne, album photo invités et coordination du jour J.", h1: "Les fonctionnalités de Mariable" },
  { path: "/installer-app", title: "Installer l'application Mariable sur iPhone et Android", description: "Installez Mariable en quelques secondes depuis votre navigateur, sans App Store ni Google Play, sur iPhone, Android ou tablette.", h1: "Installer l'application Mariable" },
  { path: "/prix", title: "Tarifs Mariable – gratuit, 29 € par mariage, Pro 149 €/an", description: "Outils gratuits pour les couples, Premium à 29 € par mariage, Mariable Pro à 149 €/an pour les professionnels avec projets illimités.", h1: "Les tarifs Mariable" },
  { path: "/budget-mariage", title: "Combien coûte vraiment votre mariage ? Simulateur – Mariable", description: "Estimez le budget de votre mariage poste par poste avec le simulateur Mariable et comparez vos devis.", h1: "Combien coûte vraiment votre mariage ?" },
  { path: "/contact", title: "Contact & histoire de Mariable", description: "Mariable est née de l'expérience d'une jeune mariée. Contactez Mathilde et découvrez la mission : sublimer le jour J.", h1: "Contactez Mariable" },
  { path: "/guides", title: "Guides mariage à télécharger – Mariable", description: "Guides PDF pour organiser votre mariage : jour J, checklist, témoins, cérémonie laïque et catalogue de prix.", h1: "Les guides Mariable" },
  { path: "/blog", title: "Blog mariage – conseils d'organisation | Mariable", description: "Conseils pour organiser votre mariage : budget, prestataires, cérémonie, jour J et idées.", h1: "Le blog Mariable" },
  { path: "/demo-pro", title: "Démo live Mariable Pro – inscription", description: "Inscrivez-vous à la démo live de Mariable Pro : 20 minutes de démonstration et 20 minutes de questions entre professionnels.", h1: "Démo live Mariable Pro" },
];

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const buildHead = (page: PageHead) => {
  const url = `${SITE_URL}${page.path === "/" ? "/" : page.path}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ].join("\n    ");
};

const buildBody = (page: PageHead) => {
  const links = (page.links ?? []).map(([href, label]) => `<li><a href="${href}">${escapeHtml(label)}</a></li>`).join("");
  // Contenu remplacé par React au montage ; visible par les robots qui n'exécutent pas le JS.
  return `<div id="root"><main><h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(page.description)}</p>${links ? `<ul>${links}</ul>` : ""}</main></div>`;
};

export const prerenderHeadsPlugin = (): Plugin => ({
  name: "mariable-prerender-heads",
  apply: "build",
  closeBundle() {
    const distDir = path.resolve(process.cwd(), "dist");
    const templatePath = path.join(distDir, "index.html");
    if (!fs.existsSync(templatePath)) return;
    const template = fs.readFileSync(templatePath, "utf-8");
    const stripped = template
      .replace(/<title>[\s\S]*?<\/title>/, "")
      .replace(/<meta name="description"[^>]*>/, "")
      .replace(/<meta property="og:(title|description|url)"[^>]*>/g, "")
      .replace(/<meta name="twitter:(title|description)"[^>]*>/g, "");
    for (const page of PAGES) {
      try {
        const html = stripped
          .replace("</head>", `    ${buildHead(page)}\n  </head>`)
          .replace('<div id="root"></div>', buildBody(page));
        const outDir = page.path === "/" ? distDir : path.join(distDir, page.path);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), html);
      } catch (error) {
        console.error("❌ prerender failed for", page.path, error);
      }
    }
    console.log(`✅ prerender: ${PAGES.length} pages`);
  },
});
