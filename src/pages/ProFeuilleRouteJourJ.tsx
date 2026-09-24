import { Link } from "react-router-dom";
import { ArrowRight, Check, Download, Link2, RefreshCw, UserCheck } from "lucide-react";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import JourJInteractiveDemo from "@/components/pro/JourJInteractiveDemo";

const FAQ = [
  ["Les prestataires doivent-ils créer un compte ?", "Non. Ils consultent le lien partagé sans compte et peuvent filtrer le planning par personne ou par métier."],
  ["Le planning partagé est-il mis à jour automatiquement ?", "Oui. Les changements du planning, de l’équipe, des documents et des informations générales apparaissent sur le lien partagé sans nouvelle version à envoyer."],
  ["Peut-on remplacer notre conducteur Excel ?", "Oui. Vous pouvez importer vos étapes depuis Excel, puis centraliser le conducteur, les contacts et les documents dans Mariable."],
  ["Combien de mariages peut-on gérer ?", "Mariable Pro est proposé à 149 € par an pour autant de projets que nécessaire, avec référencement sur Instagram et la plateforme destinée aux futurs mariés."],
  ["Le filtre DJ masque-t-il automatiquement le reste ?", "Le lien ouvre la vue complète. Chaque prestataire peut ensuite sélectionner son nom ou son métier pour afficher les étapes qui le concernent."],
];

const ProFeuilleRouteJourJ = () => {
  const title = "Un seul lien pour partager votre feuille de route mariage";
  const description = "Créez une feuille de route mariage, partagez-la sans compte à tous les prestataires et gardez toujours la dernière version du déroulé du jour J.";

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Application feuille de route Jour-J Mariable Pro",
    serviceType: "Logiciel de coordination de mariage",
    provider: { "@type": "Organization", name: "Mariable", url: "https://mariable.fr" },
    offers: { "@type": "Offer", price: "149", priceCurrency: "EUR", url: "https://mariable.fr/partenariat" },
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })),
  };

  return (
    <>
      <SEO
        title="Feuille de route mariage prestataires à partager | Mariable Pro"
        description="Partagez le conducteur du mariage à tous les prestataires avec un seul lien, sans compte. Planning filtrable et toujours à jour avec Mariable Pro."
        canonical="/pro/feuille-de-route-jour-j"
        keywords="feuille de route mariage prestataires, conducteur mariage, planning jour j partagé, run of show mariage, feuille de service traiteur"
      >
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <div className="bg-editorial-beige/30 px-4 pt-6">
          <Link to="/partenariat" className="mx-auto flex min-h-11 max-w-6xl items-center gap-2 text-sm text-editorial-noir/70 hover:text-editorial-olive">
            <ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" /> Retour à Mariable Pro
          </Link>
        </div>
        <section className="bg-editorial-beige/30 px-4 pb-16 pt-6 md:pb-24 md:pt-12">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">Mariable Pro · Coordination Jour-J</p>
              <h1 className="max-w-3xl text-4xl leading-tight md:text-6xl">{title}</h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-editorial-noir/75">{description}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
                  <Link to="/register-gratuit?type=pro">Essayer l’appli Jour-J <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
                  <a href="#demo">Voir un exemple</a>
                </Button>
              </div>
              <p className="mt-4 text-sm text-editorial-noir/60">Compte professionnel gratuit · Mariable Pro : 149 €/an, projets illimités</p>
            </div>
            <div id="demo"><JourJInteractiveDemo /></div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <p className="mb-3 text-sm font-medium text-editorial-olive">Le problème des versions multiples</p>
            <h2 className="max-w-3xl text-3xl md:text-4xl">Un conducteur unique plutôt que dix pièces jointes différentes</h2>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-editorial-noir/70">Un horaire change à J-7, le traiteur conserve l’ancien fichier et le DJ ne retrouve plus le dernier mail. Le lien Mariable devient la source commune : une seule feuille de route, consultable sur mobile et actualisée automatiquement.</p>
            <div className="mt-12 grid gap-px bg-editorial-noir/15 md:grid-cols-3">
              {[
                [Link2, "Un lien permanent", "Partagez la dernière version sans renvoyer de fichier."],
                [UserCheck, "Aucun compte prestataire", "Le planning est consultable directement depuis le lien."],
                [RefreshCw, "Toujours à jour", "Planning, équipe, documents et informations évoluent en temps réel."],
              ].map(([Icon, heading, copy]) => {
                const FeatureIcon = Icon as typeof Link2;
                return <div key={String(heading)} className="bg-background p-7"><FeatureIcon className="mb-5 h-6 w-6 text-editorial-olive" /><h3 className="text-xl">{String(heading)}</h3><p className="mt-3 text-sm leading-relaxed text-editorial-noir/65">{String(copy)}</p></div>;
              })}
            </div>
          </div>
        </section>

        <section className="bg-editorial-olive px-4 py-20 text-primary-foreground">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">Votre run of show en 5 étapes</h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-5">
              {["Créez le mariage", "Importez ou ajoutez les étapes", "Assignez l’équipe", "Ajoutez les documents", "Partagez le lien"].map((step, index) => (
                <li key={step} className="border-t border-primary-foreground/35 pt-5"><span className="text-sm opacity-70">0{index + 1}</span><p className="mt-2 font-serif text-lg">{step}</p></li>
              ))}
            </ol>
            <Button asChild variant="secondary" className="mt-10 rounded-none">
              <a href="/assets/modele-feuille-route-mariage.xlsx" download><Download className="mr-2 h-4 w-4" /> Télécharger le modèle Excel</a>
            </Button>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">Une feuille de service adaptée à chaque métier</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[
                ["Wedding planner", "Pilotez plusieurs mariages, centralisez les versions et donnez une expérience client plus structurée."],
                ["Coordinatrice Jour-J", "Retrouvez horaires, responsables, contacts d’urgence et documents depuis votre téléphone."],
                ["Lieu de réception", "Partagez un conducteur commun avec le traiteur, le DJ et les équipes du domaine."],
                ["Agence événementielle", "Gérez autant de projets que nécessaire et donnez à chaque intervenant une lecture filtrée."],
              ].map(([heading, copy]) => <article key={heading} className="border-l-2 border-editorial-olive pl-6"><h3 className="text-2xl">{heading}</h3><p className="mt-3 leading-relaxed text-editorial-noir/70">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section className="bg-editorial-beige/30 px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 md:grid-cols-2">
              <div><p className="text-sm text-editorial-olive">L’écosystème Mariable</p><h2 className="mt-3 text-3xl">Du premier brief au débrief du mariage</h2><p className="mt-5 leading-relaxed text-editorial-noir/70">Planning Jour-J, équipe, documents, budget, checklist et suivi de plusieurs mariages restent réunis dans le même espace professionnel.</p><Button asChild variant="link" className="mt-4 h-auto rounded-none p-0 text-editorial-olive"><Link to="/partenariat">Découvrir Mariable Pro <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
              <div><h2 className="text-3xl">Pourquoi Mariable existe</h2><p className="mt-5 leading-relaxed text-editorial-noir/70">Pour que les outils servent la coordination au lieu de l’alourdir. Les professionnels gardent la maîtrise du déroulé ; chaque prestataire accède simplement à l’information utile, sans nouvelle application à apprendre.</p></div>
            </div>
          </div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">Pour aller plus loin</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                ["Remplacer Excel pour le déroulé du mariage", "/conseils-professionnels/alternative-excel-deroule-mariage"],
                ["Comparer les logiciels wedding planner", "/conseils-professionnels/logiciel-wedding-planner"],
                ["Réussir sa coordination Jour-J", "/conseils-professionnels/coordination-jour-j"],
                ["Organiser le conducteur d’un lieu de réception", "/conseils-professionnels/lieux-reception"],
              ].map(([label, href]) => <Link key={href} to={href} className="flex items-center justify-between border border-editorial-noir/15 p-5 transition-colors hover:border-editorial-olive"><span>{label}</span><ArrowRight className="h-4 w-4" /></Link>)}
            </div>
          </div>
        </section>

        <section className="bg-editorial-noir px-4 py-20 text-primary-foreground">
          <div className="mx-auto max-w-3xl text-center"><h2 className="text-3xl md:text-5xl">Une seule version. Tous vos prestataires alignés.</h2><p className="mx-auto mt-5 max-w-2xl opacity-75">Créez gratuitement votre espace professionnel. Passez à Mariable Pro à 149 €/an pour gérer autant de projets que vous le souhaitez et bénéficier du référencement Mariable.</p><Button asChild className="mt-8 min-h-12 rounded-none bg-editorial-olive px-8 text-primary-foreground hover:bg-editorial-olive/90"><Link to="/register-gratuit?type=pro">Créer mon compte Pro <ArrowRight className="ml-2 h-4 w-4" /></Link></Button></div>
        </section>

        <section className="px-4 py-20">
          <div className="mx-auto max-w-3xl"><h2 className="text-3xl">Questions fréquentes</h2><div className="mt-8 divide-y divide-editorial-noir/15">{FAQ.map(([question, answer]) => <details key={question} className="group py-5"><summary className="cursor-pointer list-none font-serif text-xl">{question}</summary><p className="mt-3 leading-relaxed text-editorial-noir/70">{answer}</p></details>)}</div></div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProFeuilleRouteJourJ;