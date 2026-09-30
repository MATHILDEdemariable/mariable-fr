import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, X } from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const PAGE_PATH = "/logiciel-wedding-planner";
const SITE_URL = "https://mariable.fr";

const CONTENT = {
  fr: {
    seoTitle: "Application & logiciel wedding planner – Mariable Pro",
    seoDescription: "L'application des wedding planners et coordinatrices jour J : un déroulé unique partagé avec couples et prestataires, boosté par l'IA. 149 €/an, essai gratuit.",
    eyebrow: "Mariable Pro · Logiciel wedding planner",
    h1: "L'application des wedding planners qui fait tenir le jour J dans un seul document",
    answer: "Mariable Pro est une application pour wedding planners, coordinatrices jour J et lieux de réception. Elle centralise dans un espace par mariage le déroulé du jour J, les contacts prestataires, le rétroplanning et les échanges avec les mariés, sur ordinateur comme sur mobile. Quand vous modifiez le planning, couples et prestataires voient la même version, tout de suite. L'IA vous aide à mettre en forme et à anticiper les questions. Mariable Pro vous rend aussi visible auprès des couples qui préparent un mariage haut de gamme, via la plateforme Mariable et son compte Instagram. L'abonnement coûte 149 € par an pour tous vos mariages, avec un essai gratuit.",
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
    aiTitle: "L'IA au service de votre organisation, pas à la place de votre regard",
    aiText: "Mise en forme automatique du déroulé, suggestions de rétroplanning, détection des oublis (horaires qui se chevauchent, prestataire sans contact…).",
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
      ["Quelle est la meilleure application pour wedding planner en 2026 ?", "Ça dépend de votre activité. Si votre priorité est la facturation et la gestion de stock, un logiciel de gestion tout-en-un conviendra. Si votre priorité est la coordination du jour J et la collaboration avec couples et prestataires, Mariable Pro est conçu pour ça, pour 149 €/an."],
      ["Mes prestataires doivent-ils créer un compte ?", "Non, ils accèdent au déroulé par un lien."],
      ["L'application fonctionne-t-elle sur mobile le jour J ?", "Oui. Mariable s'installe depuis le navigateur sur iPhone et Android, sans passer par les stores."],
      ["Puis-je gérer plusieurs mariages en même temps ?", "Oui, sans limite de projets."],
      ["Existe-t-il un essai gratuit ?", "Oui, vous pouvez créer un compte professionnel et essayer l'application gratuitement."],
      ["Mariable Pro m'apporte-t-il des clients ?", "En plus de l'outil, vous êtes référencé sur la plateforme Mariable, qui s'adresse aux couples préparant un mariage haut de gamme, et mis en avant sur son compte Instagram. C'est une visibilité ciblée, pas un annuaire généraliste."],
      ["Quelle différence avec Mariages.net ?", "Mariages.net vend de la visibilité dans un annuaire tous budgets. Mariable Pro combine un outil de coordination du jour J et une visibilité auprès de couples premium, pour 149 €/an."],
    ],
    coTitle: "Construisons l'outil avec vous",
    coText: "« Mariable est né de mon propre mariage. La version Pro, ce sont des wedding planners qui me l'ont demandée. Si vous voulez tester et nous dire ce qui manque, c'est exactement ce qu'on cherche. » — Mathilde",
    back: "Découvrir aussi Mariable Studio",
    home: "Accueil",
  },
  en: {
    seoTitle: "Wedding planner app & software – Mariable Pro",
    seoDescription: "The app for wedding planners and day-of coordinators: one shared timeline for couples and vendors, powered by AI. €149/year, free trial.",
    eyebrow: "Mariable Pro · Wedding planner software",
    h1: "The wedding planner app that keeps the whole wedding day in one document",
    answer: "Mariable Pro is an app for wedding planners, day-of coordinators and reception venues. It gathers, in one space per wedding, the wedding-day timeline, vendor contacts, the planning schedule and exchanges with the couple, on desktop and mobile. When you update the timeline, couples and vendors see the same version instantly. AI helps you format it and anticipate questions. Mariable Pro also makes you visible to couples planning a high-end wedding, through the Mariable platform and its Instagram account. The subscription costs €149 per year for all your weddings, with a free trial.",
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
      ["What is the best wedding planner app in 2026?", "It depends on your business. If your priority is invoicing and stock, an all-in-one management tool fits. If your priority is wedding-day coordination and collaboration with couples and vendors, Mariable Pro is built for that, for €149/year."],
      ["Do my vendors need an account?", "No, they access the timeline by link."],
      ["Does the app work on mobile on the day?", "Yes. Mariable installs from the browser on iPhone and Android, without app stores."],
      ["Can I manage several weddings at once?", "Yes, with unlimited projects."],
      ["Is there a free trial?", "Yes, you can create a professional account and try the app for free."],
      ["Does Mariable Pro bring me clients?", "Besides the tool, you're listed on the Mariable platform for couples planning high-end weddings and featured on its Instagram account. Targeted visibility, not a general directory."],
      ["What's the difference with Mariages.net?", "Mariages.net sells visibility in an all-budget directory. Mariable Pro combines a wedding-day coordination tool and visibility with premium couples, for €149/year."],
    ],
    coTitle: "Let's build the tool together",
    coText: "“Mariable was born from my own wedding. The Pro version was requested by wedding planners. If you want to test it and tell us what's missing, that's exactly what we're looking for.” — Mathilde",
    back: "Also discover Mariable Studio",
    home: "Home",
  },
};

type Cell = string | boolean;

const renderCell = (cell: Cell) =>
  typeof cell === "boolean"
    ? cell ? <Check className="h-5 w-5 text-editorial-olive" aria-label="Oui" /> : <X className="h-5 w-5 text-editorial-noir/40" aria-label="Non" />
    : cell;

const CompareTable = ({ head, rows }: { head: string[]; rows: Cell[][] }) => (
  <div className="mt-8 overflow-x-auto">
    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
      <thead>
        <tr className="border-b border-editorial-noir">
          {head.map((headCell, index) => <th key={index} className="py-3 pr-4 font-serif text-base font-normal">{headCell}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[0])} className="border-b border-editorial-noir/15 align-top">
            {row.map((cell, index) => <td key={index} className={`py-3 pr-4 ${index === 0 ? "font-medium" : "text-editorial-noir/75"}`}>{renderCell(cell)}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const LogicielWeddingPlanner = () => {
  const { i18n } = useTranslation();
  const content = i18n.language?.startsWith("en") ? CONTENT.en : CONTENT.fr;

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Mariable Pro",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web, iOS, Android (PWA)",
    url: `${SITE_URL}${PAGE_PATH}`,
    description: content.seoDescription,
    offers: { "@type": "Offer", price: "149", priceCurrency: "EUR", url: `${SITE_URL}${PAGE_PATH}`, description: "Abonnement annuel, mariages illimités, essai gratuit" },
    publisher: { "@type": "Organization", name: "Mariable", url: SITE_URL },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };

  const ctaButtons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
        <Link to="/register-gratuit?type=pro">{content.ctaTry} <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
      <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
        <Link to="/contact">{content.ctaTalk}</Link>
      </Button>
    </div>
  );

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} canonical={PAGE_PATH}
        keywords="logiciel wedding planner, application wedding planner, outil wedding planner, logiciel organisation mariage professionnel, logiciel coordination jour J">
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
              <Link to="/" className="hover:text-editorial-olive">{content.home}</Link> / <Link to="/partenariat" className="hover:text-editorial-olive">Mariable Pro</Link>
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">{content.eyebrow}</p>
            <h1 className="text-4xl leading-tight md:text-6xl">{content.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">{content.answer}</p>
            {ctaButtons}
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl">{content.painTitle}</h2>
            <ul className="mt-8 space-y-4">
              {content.pains.map((pain) => <li key={pain} className="border-l-2 border-editorial-olive pl-4 text-lg text-editorial-noir/75">{pain}</li>)}
            </ul>
            <p className="mt-8 font-serif text-xl italic">{content.painOutro}</p>
          </div>
        </section>

        <section className="bg-editorial-olive px-4 py-16 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">{content.featuresTitle}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {content.features.map(([heading, copy]) => (
                <div key={heading} className="border-t border-primary-foreground/35 pt-5">
                  <h3 className="font-serif text-xl">{heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-85">{copy}</p>
                </div>
              ))}
            </div>
            <Link to="/pro/feuille-de-route-jour-j" className="mt-10 inline-flex min-h-11 items-center gap-2 underline underline-offset-4">{content.altLink} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl">{content.aiTitle}</h2>
            <p className="mt-6 text-lg text-editorial-noir/75">{content.aiText}</p>
            <p className="mt-6 font-serif text-2xl italic">{content.aiQuote}</p>
          </div>
        </section>

        <section className="bg-editorial-beige/40 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">{content.visTitle}</h2>
            <p className="mt-4 text-lg text-editorial-noir/75">{content.visIntro}</p>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {content.vis.map(([heading, copy]) => (
                <div key={heading}><h3 className="font-serif text-xl">{heading}</h3><p className="mt-2 text-editorial-noir/70">{copy}</p></div>
              ))}
            </div>
            <h3 className="mt-16 text-2xl md:text-3xl">{content.compareTitle}</h3>
            <p className="mt-4 text-editorial-noir/75">{content.compareIntro}</p>
            <CompareTable head={content.compareHead} rows={content.compareRows} />
            <p className="mt-8 font-serif text-xl italic">{content.compareQuote}</p>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">{content.whoTitle}</h2>
            <div className="mt-8 grid gap-px bg-editorial-noir/15 sm:grid-cols-2">
              {content.who.map(([heading, copy]) => (
                <div key={heading} className="bg-background p-6"><h3 className="font-serif text-xl">{heading}</h3><p className="mt-2 text-sm text-editorial-noir/70">{copy}</p></div>
              ))}
            </div>
            <h2 className="mt-16 text-3xl md:text-4xl">{content.usesTitle}</h2>
            <ol className="mt-6 space-y-3">
              {content.uses.map((use, index) => <li key={use} className="text-lg"><span className="mr-3 text-editorial-olive">0{index + 1}</span>{use}</li>)}
            </ol>
          </div>
        </section>

        <section className="bg-editorial-beige/40 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">{content.priceTitle}</h2>
            <CompareTable head={content.priceHead} rows={content.priceRows} />
            <h2 className="mt-16 text-3xl md:text-4xl">{content.altTitle}</h2>
            <p className="mt-4 text-lg text-editorial-noir/75">{content.altText}</p>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
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

        <section className="bg-editorial-olive px-4 py-16 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl">{content.coTitle}</h2>
            <p className="mt-6 font-serif text-xl italic">{content.coText}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="secondary" className="min-h-12 rounded-none px-7"><Link to="/register-gratuit?type=pro">{content.ctaTry}</Link></Button>
              <Button asChild variant="outline" className="min-h-12 rounded-none border-primary-foreground bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10"><Link to="/partenariat#studio">{content.back}</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default LogicielWeddingPlanner;
