import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowRight, Play } from "lucide-react";
import proVideoFr from "@/assets/mariable-pro-9x16-FR-mathilde.mp4.asset.json";
import proVideoEn from "@/assets/mariable-pro-9x16-EN-mathilde.mp4.asset.json";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import ProPricingPlans from "@/components/pro/ProPricingPlans";
import heroPlannerPhoto from "@/assets/editorial/wedding-planner-chateau.png.asset.json";

const PAGE_PATH = "/pro-solutions";
const SITE_URL = "https://mariable.fr";

const CONTENT = {
  fr: {
    seoTitle: "Application & logiciel wedding planner – Mariable Pro",
    seoDescription: "L'application des wedding planners et coordinatrices jour J : un déroulé unique partagé avec couples et prestataires, boosté par l'IA. Dès 149 €/an, essai gratuit 2 mois.",
    eyebrow: "Mariable Pro · Logiciel wedding planner",
    h1: "La solution d'organisation de mariage boostée à l'IA pour les professionnels",
    answer: "L'outil et l'écosystème des wedding planners et organisateurs d'événements : pilotez vos mariages de A à Z, centralisez toutes vos informations et bénéficiez de solutions IA sur mesure pour votre activité.",
    ctaPrices: "Voir les prix",
    ctaTry: "Essayer gratuitement",
    ctaTalk: "Échanger avec Mathilde",
    painTitle: "Ce que les wedding planners nous disent le plus souvent",
    pains: [
      "« Quelle est la dernière version du déroulé ? » Le PDF V7 envoyé au traiteur n'est pas celui que le photographe a reçu.",
      "Les questions de dernière minute, par SMS, WhatsApp et mail, souvent la veille à 23 h.",
      "Des heures de mise en forme passées sur Word, Canva ou Excel, pour chaque mariage.",
      "Le jour J : tout est dans votre tête et dans un classeur. Si vous êtes indisponible, personne ne reprend la main.",
    ],
    painOutro: "Est-ce que ça vous parle ? Mariable Pro est né de ces retours.",
    featuresTitle: "Une application wedding planner pensée pour le jour J",
    features: [
      ["Un planning unique, toujours à jour", "Une seule source de vérité, partagée par lien avec chaque prestataire, sans compte à créer."],
      ["Multi-projets", "Tous vos mariages de la saison dans un tableau de bord."],
      ["Coordination jour J en temps réel", "Le déroulé minute par minute, les contacts et les consignes accessibles sur mobile."],
      ["Contacts & prestataires", "Un carnet réutilisable d'un mariage à l'autre."],
      ["Collaboration avec vos couples", "Ils voient l'avancement et renseignent eux-mêmes invités, discours et préférences."],
    ],
    aiTitle: "\n",
    aiText: "\n",
    aiQuote: "« L'IA ne remplace pas une wedding planner. Elle lui rend les soirées qu'elle passait sur Word. »",
    visTitle: "Un outil de travail, et une vitrine auprès des couples premium",
    visIntro: "On ne vous propose pas d'outil d'un côté et de visibilité de l'autre : avec Mariable Pro, vous avez les deux.",
    vis: [
      ["Référencé sur une plateforme mariage premium", "Votre profil apparaît sur mariable.fr, dans la sélection de prestataires et les pages régionales (Provence, Paris, Bretagne…)."],
      ["Mis en avant sur Instagram", "Mariable parle à des couples 25-40 ans, urbains et exigeants. Vos réalisations peuvent y être partagées."],
      ["Une sélection, pas un annuaire", "Être dans la sélection est un gage de qualité pour les couples et un positionnement premium pour vous."],
      ["Des couples déjà engagés", "Ils utilisent l'app Mariable pour leur budget, leur checklist et leur jour J. Quand ils vous contactent, ils savent ce qu'ils veulent."],
    ],
    compareTitle: "Visibilité seule ou outil + visibilité ? Mariable Pro vs Mariages.net",
    compareIntro: "Beaucoup de pros nous racontent la même chose à propos des grands annuaires : ils paient pour être visibles, reçoivent beaucoup de demandes, mais peu correspondent à leur gamme de prix ou à leur style. Est-ce votre cas aussi ?",
    compareHead: ["", "Mariable Pro", "Mariages.net"],
    compareRows: [
      ["Modèle", "Outil de travail + visibilité", "Visibilité (annuaire + demandes de contact)"],
      ["Positionnement", "Sélection mariage premium", "Annuaire généraliste, tous budgets"],
      ["Type de demandes", "Couples qui préparent déjà leur mariage sur Mariable", "Volume de demandes, à trier soi-même"],
      ["Coordination jour J", true, false],
      ["Collaboration avec vos couples", true, false],
    ],
    compareQuote: "« Recevoir 50 demandes par mois, ce n'est pas utile si 45 ne correspondent pas à votre gamme. Mieux vaut moins de demandes, mais de couples qui vous ressemblent. »",
    whoTitle: "Pour qui ?",
    who: [
      ["Wedding planners", "Pilotez tous vos mariages de la saison depuis un seul espace."],
      ["Coordinatrices jour J", "Un déroulé minute par minute, partagé et toujours à jour."],
      ["Lieux de réception", "Donnez à chaque couple et prestataire les informations logistiques du lieu."],
      ["Officiants de cérémonie laïque", "Préparez la cérémonie avec les mariés et partagez le timing avec l'équipe."],
    ],
    usesTitle: "Deux façons d'utiliser Mariable Pro",
    uses: ["Vous gérez vos projets mariage dans votre espace pro.", "Vous offrez Mariable à vos couples : ils ont l'app, vous gardez la main."],
    priceTitle: "Combien coûte un logiciel de wedding planner ?",
    priceHead: ["", "Mariable Pro", "Offre « tout-en-un » type"],
    priceRows: [
      ["Prix", "149 €/an, tous vos mariages", "58 à 70 €/mois (≈ 700 €/an), avant les modules"],
      ["Engagement", "Annuel, essai gratuit", "Variable"],
      ["Prestataires", "Accès par lien, sans compte", "Souvent un compte à créer"],
      ["Jour J en temps réel", "Cœur du produit", "Module « programme »"],
      ["IA", true, false],
      ["Visibilité auprès des couples", "Plateforme premium + Instagram", "Annuaire interne entre prestataires"],
    ],
    altTitle: "Mariable Pro remplace-t-il Excel, Notion ou Google Sheets ?",
    altText: "Les tableurs et outils généralistes dépannent, mais chaque mariage se transforme en fichiers dupliqués, envoyés en pièce jointe et vite obsolètes. Mariable Pro garde la structure d'un tableur (heure, tâche, personne assignée) — vous pouvez d'ailleurs importer votre fichier Excel — et y ajoute le partage par lien, la mise à jour en temps réel et la lecture mobile le jour J.",
    altLink: "Voir la feuille de route jour J partagée",
    faqTitle: "Questions fréquentes",
    faq: [
      ["Combien coûte Mariable Pro ?", "Coordination Jour J : 149 €/an. Organisation complète (inclut la Coordination Jour J) : 259 €/an. Paiement annuel, ou en 3 fois : 200 € (3 × 66,67 €) pour le Jour J et 310 € (3 × 103,33 €) pour l'Organisation complète. Renouvellement à date anniversaire de la souscription."],
      ["Que comprend exactement la solution Mariable Pro ?", "Un outil de coordination et d'organisation de mariage (planning jour J, rétroplanning IA, budget, plan de table, RSVP, multi-mariages, collaboration couples), un référencement et une mise en avant sur Mariable et son Instagram, et, sur devis, des services IA sur mesure : formation, agents et process, applications dédiées."],
      ["À qui s'adresse Mariable Pro ?", "Aux wedding planners, coordinatrices jour J, lieux de réception, officiants de cérémonie laïque, ainsi qu'aux agences et écoles de wedding planners."],
      ["Existe-t-il un essai gratuit ?", "Oui : un mariage offert pendant 2 mois, sans engagement, pour tester l'application."],
      ["Quel est le meilleur outil IA pour wedding planner en 2026 ?", "Mariable Pro est pensé pour les wedding planners et coordinatrices : un déroulé du jour J partagé en temps réel par lien avec les mariés et les prestataires, un rétroplanning généré par l'IA, le budget, le plan de table et les RSVP réunis dans une seule app. Dès 149 €/an, avec 2 mois d'essai gratuit."],
      ["Comment une coordinatrice de mariage peut-elle utiliser l'IA pour construire son déroulé ?", "Importez votre fichier Excel ou partez d'un modèle : l'IA génère le rétroplanning et vous aide à structurer les étapes, puis vous ajustez les horaires et assignez chaque tâche à un membre de l'équipe. Le déroulé se met à jour en direct pour les mariés et les prestataires, qui le consultent par un simple lien, sans créer de compte."],
      ["Que comprennent toutes les formules ?", "Multi-mariages, collaboration avec vos couples et référencement sur Mariable."],
      ["Mariable Pro gère-t-il la facturation et la prospection ?", "Non. Mariable Pro est un outil de gestion d'événement : déroulé du jour J, prestataires, couples, rétroplanning et logistique."],
      ["Mes prestataires doivent-ils créer un compte ?", "Non, ils accèdent au déroulé par un lien."],
      ["L'application fonctionne-t-elle sur mobile le jour J ?", "Oui. Mariable s'installe depuis le navigateur sur iPhone et Android, sans passer par les stores."],
      ["Mariable Pro m'apporte-t-il des clients ?", "En plus de l'outil, vous êtes référencé sur Mariable, qui s'adresse aux couples préparant un mariage haut de gamme, et mis en avant sur son compte Instagram."],
      ["Quelle différence avec Wedding Plan, Mariages.net ou Notion ?", "Wedding Plan propose outils événement et admin, sans référencement et avec une prise en main plus lourde. Mariages.net vend surtout de la visibilité, sans outils pro. Notion ou Google sont gratuits au départ mais demandent un abonnement pour l'illimité, sans appli jour J ni plan de table."],
    ],
    coTitle: "Construisons l'outil avec vous",
    coText: "« Mariable est né de mon propre mariage. La version Pro, ce sont des wedding planners qui me l'ont demandée. Si vous voulez tester et nous dire ce qui manque, c'est exactement ce qu'on cherche. » — Mathilde",
    back: "Découvrir aussi Mariable Studio",
    home: "Accueil",
  },
  en: {
    seoTitle: "Wedding planner app & software – Mariable Pro",
    seoDescription: "The app for wedding planners and day-of coordinators: one shared timeline for couples and vendors, powered by AI. From €149/year, 2-month free trial.",
    eyebrow: "Mariable Pro · Wedding planner software",
    h1: "The AI-powered wedding planning solution for professionals",
    answer: "The tool and ecosystem for wedding planners and event organisers: run your weddings from A to Z, centralise all your information and get tailor-made AI solutions for your business.",
    ctaPrices: "See pricing",
    ctaTry: "Try it for free",
    ctaTalk: "Talk with Mathilde",
    painTitle: "What wedding planners tell us most often",
    pains: [
      "“Which is the latest version of the timeline?” The V7 PDF sent to the caterer isn't the one the photographer received.",
      "Last-minute questions by text, WhatsApp and email, often at 11 pm the night before.",
      "Hours spent formatting in Word, Canva or Excel, for every wedding.",
      "On the day: everything is in your head and a binder. If you're unavailable, nobody can take over.",
    ],
    painOutro: "Sound familiar? Mariable Pro was born from this feedback.",
    featuresTitle: "A wedding planner app designed for the wedding day",
    features: [
      ["One timeline, always up to date", "A single source of truth, shared by link with each vendor, no account needed."],
      ["Multi-project", "All your weddings of the season in one dashboard."],
      ["Real-time day-of coordination", "Minute-by-minute timeline, contacts and instructions on mobile."],
      ["Contacts & vendors", "A reusable address book from one wedding to the next."],
      ["Collaboration with your couples", "They follow progress and fill in guests, speeches and preferences themselves."],
    ],
    aiTitle: "AI that supports your organisation, not your judgement",
    aiText: "Automatic timeline formatting, planning suggestions, detection of gaps (overlapping times, vendor without contact…).",
    aiQuote: "“AI doesn't replace a wedding planner. It gives her back the evenings she spent in Word.”",
    visTitle: "A work tool, and a showcase for premium couples",
    visIntro: "You don't get a tool on one side and visibility on the other: with Mariable Pro, you get both.",
    vis: [
      ["Listed on a premium wedding platform", "Your profile appears on mariable.fr, in the vendor selection and regional pages (Provence, Paris, Brittany…)."],
      ["Featured on Instagram", "Mariable speaks to demanding urban couples aged 25-40. Your work can be shared there."],
      ["A selection, not a directory", "Being selected is a quality signal for couples and a premium positioning for you."],
      ["Couples already engaged", "They use the Mariable app for their budget, checklist and wedding day. When they contact you, they know what they want."],
    ],
    compareTitle: "Visibility only, or tool + visibility? Mariable Pro vs Mariages.net",
    compareIntro: "Many pros tell us the same thing about big directories: they pay to be visible, get lots of requests, but few match their price range or style. Is that your case too?",
    compareHead: ["", "Mariable Pro", "Mariages.net"],
    compareRows: [
      ["Model", "Work tool + visibility", "Visibility (directory + contact requests)"],
      ["Positioning", "Premium wedding selection", "General directory, all budgets"],
      ["Type of requests", "Couples already planning on Mariable", "Volume of requests to sort yourself"],
      ["Wedding-day coordination", true, false],
      ["Collaboration with your couples", true, false],
    ],
    compareQuote: "“Getting 50 requests a month isn't useful if 45 don't match your range. Better fewer requests, from couples who look like you.”",
    whoTitle: "Who is it for?",
    who: [
      ["Wedding planners", "Run all your weddings of the season from one space."],
      ["Day-of coordinators", "A minute-by-minute timeline, shared and always up to date."],
      ["Reception venues", "Give every couple and vendor the venue's logistics information."],
      ["Celebrants", "Prepare the ceremony with the couple and share timing with the team."],
    ],
    usesTitle: "Two ways to use Mariable Pro",
    uses: ["You manage your wedding projects in your pro space.", "You offer Mariable to your couples: they get the app, you stay in control."],
    priceTitle: "How much does wedding planner software cost?",
    priceHead: ["", "Mariable Pro", "Typical all-in-one offer"],
    priceRows: [
      ["Price", "€149/year, all your weddings", "€58–70/month (≈ €700/year), before add-ons"],
      ["Commitment", "Yearly, free trial", "Varies"],
      ["Vendors", "Access by link, no account", "Often need an account"],
      ["Real-time wedding day", "Core of the product", "“Programme” module"],
      ["AI", true, false],
      ["Visibility with couples", "Premium platform + Instagram", "Internal vendor directory"],
    ],
    altTitle: "Does Mariable Pro replace Excel, Notion or Google Sheets?",
    altText: "Spreadsheets and generic tools help, but each wedding turns into duplicated files sent as attachments and quickly outdated. Mariable Pro keeps the spreadsheet structure (time, task, assignee) — you can even import your Excel file — and adds link sharing, real-time updates and mobile reading on the day.",
    altLink: "See the shared wedding-day run sheet",
    faqTitle: "Frequently asked questions",
    faq: [
      ["How much does Mariable Pro cost?", "Wedding-day coordination: €149/year. Full planning (includes Wedding-day coordination): €259/year. Pay yearly, or in 3 instalments: €200 (3 × €66.67) for Wedding-day and €310 (3 × €103.33) for Full planning."],
      ["What exactly does the Mariable Pro solution include?", "A wedding coordination and planning tool (day-of timeline, AI planning, budget, seating plan, RSVP, multiple weddings, couple collaboration), a listing and feature on Mariable and its Instagram, and, on quote, tailor-made AI services: training, agents and processes, dedicated apps."],
      ["Who is Mariable Pro for?", "Wedding planners, day-of coordinators, reception venues, celebrants, as well as agencies and wedding planner schools."],
      ["Is there a free trial?", "Yes: one wedding free for 2 months, no commitment."],
      ["What is the best AI tool for wedding planners in 2026?", "Mariable Pro is built for wedding planners and day-of coordinators: a wedding-day timeline shared in real time by link with couples and vendors, AI-generated planning, budget, seating plan and RSVP in one app. From €149/year, with a 2-month free trial."],
      ["How can wedding coordinators use AI to plan timelines?", "Import your Excel file or start from a template: AI generates your planning and helps structure the steps, then you adjust times and assign each task to a team member. The timeline updates live for couples and vendors, who open it with a simple link, no account needed."],
      ["What do all plans include?", "Multiple weddings, collaboration with your couples and a Mariable listing."],
      ["Does Mariable Pro handle invoicing and lead generation?", "No. Mariable Pro is an event management tool: wedding-day timeline, vendors, couples, planning and logistics."],
      ["Do my vendors need an account?", "No, they access the timeline by link."],
      ["Does the app work on mobile on the day?", "Yes. Mariable installs from the browser on iPhone and Android, without app stores."],
      ["Does Mariable Pro bring me clients?", "Besides the tool, you're listed on Mariable for couples planning high-end weddings and featured on its Instagram account."],
      ["How is it different from Wedding Plan, Mariages.net or Notion?", "Wedding Plan offers event and admin tools, with no listing and a steeper learning curve. Mariages.net mainly sells visibility, with no pro tools. Notion or Google start free but need a subscription for unlimited use, with no day-of app or seating plan."],
    ],
    coTitle: "Let's build the tool together",
    coText: "“Mariable was born from my own wedding. The Pro version was requested by wedding planners. If you want to test it and tell us what's missing, that's exactly what we're looking for.” — Mathilde",
    back: "Also discover Mariable Studio",
    home: "Home",
  },
};

const STUDIO = {
  fr: {
    title: "L'agence IA des professionnels de l'événementiel",
    intro: "Au-delà de l'app, Mariable accompagne wedding planners, agences, lieux et écoles à adopter l'IA, sur mesure et sur devis.",
    offers: [
      ["Formation", "Former vos équipes à ChatGPT, Claude ou Gemini : prompts adaptés au mariage, réponses aux couples, briefs, fiches techniques."],
      ["Conseil & accompagnement", "Revoir vos méthodes et mettre en place des agents et process IA dans votre quotidien : leads, relances, feuilles de route."],
      ["Application sur mesure", "Créer un outil ou une application dédiée à votre activité, à votre marque et connectée à vos outils."],
    ],
    outro: "Sur devis : voir la formule « Agences, écoles & sur-mesure » ci-dessus.",
  },
  en: {
    title: "The AI Agency for Event Professionals",
    intro: "Beyond the app, Mariable helps wedding planners, agencies, venues and schools adopt AI, tailor-made and on quote.",
    offers: [
      ["Training", "Train your team on ChatGPT, Claude or Gemini: wedding-specific prompts, replies to couples, briefs, run sheets."],
      ["Consulting & support", "Review your methods and set up AI agents and processes in your daily work: leads, follow-ups, run sheets."],
      ["Custom app", "Build a tool or app dedicated to your business and brand, connected to your existing tools."],
    ],
    outro: "On quote: see the “Agencies, schools & custom” plan above.",
  },
};

const LogicielWeddingPlanner = () => {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language?.startsWith("en");
  const content = isEnglish ? CONTENT.en : CONTENT.fr;
  const studio = isEnglish ? STUDIO.en : STUDIO.fr;
  const [demoLanguage, setDemoLanguage] = useState<"fr" | "en">(isEnglish ? "en" : "fr");

  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mariable Pro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android (PWA)",
    url: `${SITE_URL}${PAGE_PATH}`,
    description: content.seoDescription,
    offers: { "@type": "Offer", price: "149", priceCurrency: "EUR", url: `${SITE_URL}${PAGE_PATH}#tarifs`, description: "À partir de 149 €/an, mariages illimités, essai gratuit 2 mois" },
    publisher: { "@type": "Organization", name: "Mariable", url: SITE_URL },
    keywords: "AI wedding planner tool, wedding planning software, wedding coordinator AI, digital wedding planner, logiciel wedding planner IA, coordination jour J",
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };


  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} canonical={PAGE_PATH}
        keywords="logiciel wedding planner, application wedding planner, outil wedding planner, logiciel organisation mariage professionnel, logiciel coordination jour J, AI wedding planner, AI for event professionals, agence IA événementiel, formation IA wedding planner">
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
            <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
              <Link to="/" className="hover:text-editorial-olive">{content.home}</Link> / Mariable Pro
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">{content.eyebrow}</p>
            <h1 className="text-4xl leading-tight md:text-6xl">{content.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">{content.answer}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
                <a href="#demo"><Play className="mr-2 h-4 w-4" /> {isEnglish ? "Watch the demo" : "Voir la démo"}</a>
              </Button>
              <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
                <a href="#tarifs">{content.ctaPrices} <ArrowDown className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
            </div>
            <figure className="relative">
              <img src={heroPlannerPhoto.url} alt={isEnglish ? "Wedding planner checking the day-of schedule on her phone at a château" : "Wedding planner consultant le planning du jour J sur son téléphone devant un château"} className="aspect-[3/4] w-full object-cover object-top" width={1440} height={1920} fetchPriority="high" />
            </figure>
          </div>
        </section>

        <section id="demo" aria-labelledby="demo-title" className="scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-editorial-olive">{isEnglish ? "Discover · Video" : "Découverte · En vidéo"}</p>
            <h2 id="demo-title" className="mt-3 text-3xl md:text-4xl">{isEnglish ? "Mariable Pro in action: coordination reinvented" : "Mariable Pro en action : la coordination réinventée"}</h2>
            <div className="mt-10 grid items-center gap-10 md:gap-14 md:grid-cols-[minmax(0,340px)_1fr]">
              <div>
                <div className="mb-3 flex gap-2">
                  {(["fr", "en"] as const).map((lang) => (
                    <button key={lang} type="button" onClick={() => setDemoLanguage(lang)}
                      className={`min-h-[40px] flex-1 border px-3 text-xs uppercase tracking-widest ${demoLanguage === lang ? "border-editorial-noir bg-editorial-noir text-primary-foreground" : "border-border"}`}>
                      {lang === "fr" ? "Français" : "English"}
                    </button>
                  ))}
                </div>
                <video key={demoLanguage} src={demoLanguage === "fr" ? proVideoFr.url : proVideoEn.url} controls playsInline preload="metadata" className="aspect-[9/16] w-full bg-editorial-noir object-contain" />
              </div>
              <div className="space-y-8">
                {(isEnglish ? [
                  ["01", "Centralise and coordinate the wedding timeline", "One timeline, always up to date, shared by link with every vendor — no account needed."],
                  ["02", "Collaboration mode with your couples", "Couples fill in guests, speeches and preferences without touching your pro logistics."],
                  ["03", "Advanced, AI-powered tools", "Budget management, seating plan, smart planning and checklist."],
                ] : [
                  ["01", "Mariable centralise et coordonne le déroulé des mariages", "Un déroulé unique toujours à jour, partagé par lien avec chaque prestataire, sans compte à créer."],
                  ["02", "Mode collaboration avec les couples", "Les mariés renseignent invités, discours et préférences sans toucher à votre logistique pro."],
                  ["03", "Outils avancés et boostés à l'IA", "Gestion du budget, plan de table, rétroplanning et checklist."],
                ]).map(([number, heading, copy]) => (
                  <article key={number} className="border-l border-editorial-olive pl-5">
                    <p className="text-xs tracking-widest text-editorial-olive">{number}</p>
                    <h3 className="mt-1 font-serif text-xl">{heading}</h3>
                    <p className="mt-2 text-editorial-noir/75">{copy}</p>
                  </article>
                ))}
                <div className="flex flex-wrap items-center gap-4">
                  <Button asChild className="min-h-12 rounded-none bg-editorial-olive px-7 text-primary-foreground hover:bg-editorial-noir">
                    <Link to="/register-gratuit?type=pro">{isEnglish ? "Try free for 2 months" : "Essayer gratuitement 2 mois"}</Link>
                  </Button>
                  <a href="#tarifs" className="text-sm underline underline-offset-4">{isEnglish ? "See pricing ↓" : "Voir les tarifs ↓"}</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="tarifs" aria-label={content.priceTitle} className="scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl"><ProPricingPlans isEnglish={isEnglish} /></div>
        </section>

        <section id="ai-studio" aria-labelledby="ai-studio-title" className="scroll-mt-24 bg-editorial-noir px-4 py-16 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-70">Mariable AI Studio</p>
            <h2 id="ai-studio-title" className="mt-3 text-3xl md:text-4xl">{studio.title}</h2>
            <p className="mt-4 max-w-3xl text-lg opacity-80">{studio.intro}</p>
            <div className="mt-10 grid gap-px bg-primary-foreground/20 md:grid-cols-3">
              {studio.offers.map(([heading, copy]) => (
                <article key={heading} className="bg-editorial-noir p-6">
                  <h3 className="font-serif text-xl">{heading}</h3>
                  <p className="mt-3 text-sm opacity-80">{copy}</p>
                </article>
              ))}
            </div>
            <p className="mt-8 text-sm opacity-70">{studio.outro}</p>
          </div>
        </section>

        <section className="bg-editorial-beige/40 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl">{content.faqTitle}</h2>
            <div className="mt-8 divide-y divide-editorial-noir/15 border-y border-editorial-noir/15">
              {content.faq.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg">{question}<span className="text-editorial-olive group-open:rotate-45">+</span></summary>
                  <p className="mt-3 text-editorial-noir/75">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                [isEnglish ? "Mariages.net alternative for pros" : "L'alternative à Mariages.net pour les pros", "/pro/alternative-mariages-net"],
                [isEnglish ? "Free AI Playbook for wedding planners" : "Le Playbook IA du Wedding Planner (gratuit)", "/pro/ia-organisation-mariage"],
              ].map(([label, href]) => <Link key={href} to={href} className="flex min-h-11 items-center justify-between border border-editorial-noir/15 p-5 hover:border-editorial-olive"><span>{label}</span><ArrowRight className="h-4 w-4" /></Link>)}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LogicielWeddingPlanner;
