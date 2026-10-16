import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import ContactProModal from "@/components/partenariat/ContactProModal";
import { ArrowRight, Check, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type PlanId = "jour-j" | "organisation" | "agence";
type Mark = "yes" | "no" | "partial";
type CompareCell = Mark | { mark: Mark; note: string };

const TEXT = {
  fr: {
    title: "Les formules Mariable Pro",
    intro: "Un outil de gestion d'événement pensé pour les wedding planners. Toutes les formules incluent : multi-mariages, collaboration avec vos couples et référencement sur Mariable.",
    annual: "Paiement annuel",
    threeTimes: "Paiement en 3 fois",
    perYear: "/an",
    total: "au total",
    monthly: (value: string) => `soit ${value} €/mois sur 12 mois`,
    instalments: (value: string) => `3 × ${value} €`,
    onQuote: "Sur devis",
    subscribe: "Souscrire",
    renewal: "Abonnement annuel, renouvelé à date anniversaire de votre souscription.",
    trial: "Offre gratuite : 1 mariage pendant 2 mois pour essayer, sans engagement.",
    trialCta: "Démarrer l'essai gratuit",
    scope: "Mariable Pro est un outil de gestion d'événement : déroulé du jour J, coordination des prestataires, relation avec les mariés, rétroplanning et logistique.",
    plans: {
      "jour-j": { name: "Coordination Jour J", features: ["Déroulé jour J minute par minute", "Appli mobile collaborative le jour J", "Partage par lien aux prestataires", "Multi-mariages", "Collaboration avec vos couples", "Référencement Mariable"] },
      organisation: { name: "Organisation complète", features: ["Inclut toute la Coordination Jour J", "Rétroplanning & tâches assistés par IA", "Budget & acomptes", "Plan de table", "RSVP digital & mini-site des mariés", "Référencement Mariable"] },
      agence: { name: "Agence / multi wedding planners", features: ["Inclut l'Organisation complète", "Plusieurs comptes coordinatrices", "Mariages partagés en équipe", "Accompagnement sur mesure"] },
    },
    compareTitle: "Mariable Pro face aux autres outils",
    groups: { price: "Prix", visibility: "Référencement pour couples", event: "Outils pro événement", admin: "Outils pro admin", ergonomy: "Ergonomie" },
  },
  en: {
    title: "Mariable Pro plans",
    intro: "An event management tool built for wedding planners. Every plan includes: multiple weddings, collaboration with your couples and a Mariable listing.",
    annual: "Yearly payment",
    threeTimes: "Pay in 3 instalments",
    perYear: "/year",
    total: "in total",
    monthly: (value: string) => `i.e. €${value}/month over 12 months`,
    instalments: (value: string) => `3 × €${value}`,
    onQuote: "On quote",
    subscribe: "Subscribe",
    renewal: "Yearly subscription, renewed on the anniversary of your sign-up date.",
    trial: "Free offer: 1 wedding for 2 months to try it, no commitment.",
    trialCta: "Start the free trial",
    scope: "Mariable Pro is an event management tool: wedding-day timeline, vendor coordination, couple relationship, planning schedule and logistics.",
    plans: {
      "jour-j": { name: "Wedding-day coordination", features: ["Minute-by-minute timeline", "Collaborative mobile app on the day", "Link sharing with vendors", "Multiple weddings", "Collaboration with your couples", "Mariable listing"] },
      organisation: { name: "Full planning", features: ["Includes all Wedding-day coordination", "AI-assisted planning & tasks", "Budget & deposits", "Seating plan", "Digital RSVP & couple's mini-site", "Mariable listing"] },
      agence: { name: "Agency / multiple planners", features: ["Includes Full planning", "Several coordinator accounts", "Team-shared weddings", "Tailored support"] },
    },
    compareTitle: "Mariable Pro vs other tools",
    groups: { price: "Price", visibility: "Listing for couples", event: "Pro event tools", admin: "Pro admin tools", ergonomy: "Ease of use" },
  },
};

const PRICES: Record<Exclude<PlanId, "agence">, { annual: number; split: number }> = {
  "jour-j": { annual: 149, split: 200 },
  organisation: { annual: 259, split: 310 },
};

const formatEuro = (value: number) => (Math.round(value * 100) / 100).toFixed(2).replace(".", ",").replace(",00", "");

// Column order: Mariable Pro, Wedding Plan, Mariages.net, Planning.wedding, Notion / Google
const COMPARE_HEAD = ["Mariable Pro", "Wedding Plan", "Mariages.net", "Planning.wedding", "Notion / Google"];

const getCompareRows = (isEnglish: boolean): { group?: string; label: string; cells: CompareCell[] }[] => {
  const fr = !isEnglish;
  return [
    { group: "price", label: fr ? "Prix" : "Price", cells: [
      { mark: "yes", note: fr ? "Dès 149 €/an" : "From €149/yr" },
      { mark: "partial", note: fr ? ">500 € par an selon formules" : ">€500 per year depending on plan" },
      { mark: "partial", note: fr ? ">1000 € par an selon formules" : ">€1000 per year depending on plan" },
      { mark: "partial", note: fr ? "Abonnement" : "Subscription" },
      { mark: "partial", note: fr ? "Gratuit, premium pour l'illimité" : "Free, premium for unlimited" },
    ] },
    { group: "visibility", label: fr ? "Référencement pour couples" : "Listing for couples", cells: [
      { mark: "yes", note: fr ? "Premium, qualifié" : "Premium, qualified" }, "no",
      { mark: "partial", note: fr ? "Pas toujours qualifié" : "Not always qualified" }, "no", "no",
    ] },
    { group: "event", label: fr ? "Appli Jour J collaborative" : "Collaborative day-of app", cells: ["yes", "no", "no", "no", "no"] },
    { label: fr ? "Multi-mariages" : "Multiple weddings", cells: ["yes", "yes", "no", "partial", "yes"] },
    { label: fr ? "Collaboration couples" : "Couple collaboration", cells: ["yes", "yes", "no", "partial", { mark: "partial", note: fr ? "Limitée" : "Limited" }] },
    { label: fr ? "Plan de table" : "Seating plan", cells: ["yes", "yes", "no", "yes", "no"] },
    { label: fr ? "Gestion budget" : "Budget management", cells: ["yes", "yes", "no", "partial", "partial"] },
    { label: fr ? "Tâches & rétroplanning IA" : "Tasks & AI planning", cells: ["yes", "partial", "no", "no", "partial"] },
    { label: fr ? "RSVP digital & mini-site des mariés" : "Digital RSVP & couple's mini-site", cells: ["yes", "partial", "no", "partial", "no"] },
    { group: "admin", label: fr ? "Facturation" : "Invoicing", cells: ["no", "yes", "no", "no", "partial"] },
    { label: fr ? "CRM / prospects" : "CRM / leads", cells: ["no", "yes", "no", "no", "partial"] },
    { label: fr ? "Intégration mail" : "Email integration", cells: ["no", "yes", "no", "no", "partial"] },
    { group: "ergonomy", label: fr ? "Intuitif, simple, en français" : "Intuitive, simple, in French", cells: [
      "yes", { mark: "no", note: fr ? "Peu intuitif" : "Not intuitive" }, "partial", "partial", { mark: "no", note: fr ? "Prise en main longue" : "Steep learning curve" },
    ] },
    { label: fr ? "Export / livrables" : "Export / deliverables", cells: [
      { mark: "yes", note: fr ? "PDF prêts à partager" : "Ready-to-share PDFs" }, "partial", "no", "partial", "partial",
    ] },
  ];
};

const MarkIcon = ({ mark }: { mark: Mark }) => {
  if (mark === "yes") return <Check className="h-5 w-5 text-editorial-olive" aria-label="Oui" />;
  if (mark === "partial") return <Minus className="h-5 w-5 text-editorial-noir/50" aria-label="Partiel" />;
  return <X className="h-5 w-5 text-editorial-noir/30" aria-label="Non" />;
};

const ProPricingPlans = ({ isEnglish }: { isEnglish: boolean }) => {
  const [isSplitPayment, setIsSplitPayment] = useState(false);
  const [subscribeSubject, setSubscribeSubject] = useState<string | null>(null);
  const text = isEnglish ? TEXT.en : TEXT.fr;
  const compareRows = getCompareRows(isEnglish);
  const planIds: PlanId[] = ["jour-j", "organisation", "agence"];

  return (
    <div>
      <h2 className="text-3xl md:text-4xl">{text.title}</h2>
      <p className="mt-4 text-lg text-editorial-noir/75">{text.intro}</p>

      <div className="mt-8 inline-flex border border-editorial-noir" role="group" aria-label={text.title}>
        {[false, true].map((splitOption) => (
          <button key={String(splitOption)} type="button" aria-pressed={isSplitPayment === splitOption}
            onClick={() => setIsSplitPayment(splitOption)}
            className={`min-h-11 px-5 text-sm ${isSplitPayment === splitOption ? "bg-editorial-noir text-primary-foreground" : "bg-transparent"}`}>
            {splitOption ? text.threeTimes : text.annual}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-px bg-editorial-noir/20 md:grid-cols-3">
        {planIds.map((planId) => {
          const plan = text.plans[planId];
          const price = planId === "agence" ? null : PRICES[planId];
          const isHighlighted = planId === "organisation";
          return (
            <article key={planId} className={`flex flex-col p-7 ${isHighlighted ? "bg-editorial-olive text-primary-foreground" : "bg-background"}`}>
              <h3 className="font-serif text-2xl">{plan.name}</h3>
              <div className="mt-5 min-h-24">
                {price ? (
                  isSplitPayment ? (
                    <>
                      <p className="font-serif text-4xl">{price.split} €<span className="text-base opacity-70">{text.perYear}</span></p>
                      <p className="mt-1 text-sm opacity-75">{text.instalments(formatEuro(price.split / 3))}</p>
                    </>
                  ) : (
                    <>
                      <p className="font-serif text-4xl">{price.annual} €<span className="text-base opacity-70">{text.perYear}</span></p>
                      <p className="mt-1 text-sm opacity-75">{text.monthly(formatEuro(price.annual / 12))}</p>
                    </>
                  )
                ) : <p className="font-serif text-4xl">{text.onQuote}</p>}
              </div>
              <ul className="my-6 flex-1 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={feature} className={`flex items-start gap-3 text-sm ${index === 0 && planId !== "jour-j" ? "font-semibold" : ""}`}>
                    <Check className="mt-0.5 h-4 w-4 flex-none" />{feature}
                  </li>
                ))}
              </ul>
              <Button asChild className={`min-h-12 rounded-none ${isHighlighted ? "bg-primary-foreground text-editorial-noir hover:bg-primary-foreground/90" : "bg-editorial-noir text-primary-foreground hover:bg-editorial-olive"}`}>
                <button type="button" onClick={() => setSubscribeSubject(`Souscription Mariable Pro — ${plan.name}${price ? ` (${isSplitPayment ? `${price.split} € en 3 fois` : `${price.annual} €/an`})` : ""}`)}>{text.subscribe} <ArrowRight className="ml-2 h-4 w-4" /></button>
              </Button>
            </article>
          );
        })}
      </div>

      <p className="mt-4 text-sm text-editorial-noir/70">{text.renewal}</p>
      <div className="mt-6 flex flex-col gap-4 border border-editorial-olive p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium">{text.trial}</p>
        <Button asChild variant="outline" className="min-h-11 rounded-none border-editorial-noir bg-transparent">
          <Link to="/register-gratuit?type=pro">{text.trialCta}</Link>
        </Button>
      </div>
      <p className="mt-6 text-editorial-noir/75">{text.scope}</p>

      <h2 className="mt-16 text-3xl md:text-4xl">{text.compareTitle}</h2>
      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-editorial-noir">
              <th className="py-3 pr-4" />
              {COMPARE_HEAD.map((toolName, index) => (
                <th key={toolName} className={`px-2 py-3 font-serif text-base font-normal ${index === 0 ? "bg-editorial-olive/10" : ""}`}>{toolName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <Fragment key={row.label}>
                {row.group && (
                  <tr key={`group-${row.group}`}>
                    <td colSpan={6} className="pb-2 pt-6 text-xs font-semibold uppercase tracking-widest text-editorial-olive">
                      {text.groups[row.group as keyof typeof text.groups]}
                    </td>
                  </tr>
                )}
                <tr className="border-b border-editorial-noir/15 align-top">
                  <td className="py-3 pr-4 font-medium">{row.label}</td>
                  {row.cells.map((cell, index) => {
                    const mark = typeof cell === "string" ? cell : cell.mark;
                    const note = typeof cell === "string" ? null : cell.note;
                    return (
                      <td key={index} className={`px-2 py-3 ${index === 0 ? "bg-editorial-olive/10" : ""}`}>
                        <MarkIcon mark={mark} />
                        {note && <span className="mt-1 block text-xs text-editorial-noir/70">{note}</span>}
                      </td>
                    );
                  })}
                </tr>
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <ContactProModal open={subscribeSubject !== null} onOpenChange={(open) => !open && setSubscribeSubject(null)} defaultSubject={subscribeSubject ?? undefined} />
    </div>
  );
};

export default ProPricingPlans;
