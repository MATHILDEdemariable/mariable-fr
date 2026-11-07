import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PAGE_PATH = "/simulateur-temps-wedding-planner";
const MARIABLE_PRO_PRICE = 259;

// Heures par mariage et par poste — A: Drive/Excel/WhatsApp, B: ChatGPT seul, C: Mariable Pro
const TASK_HOURS = {
  complete: [
    { label: "Sourcing prestataires & devis", a: 45, b: 38, c: 28 },
    { label: "Budget & acomptes", a: 25, b: 23, c: 12 },
    { label: "Relation mariés & échanges", a: 40, b: 35, c: 22 },
    { label: "Logistique (plan de table, traiteur, DJ)", a: 30, b: 28, c: 16 },
    { label: "Conducteur Jour J (création & diffusion)", a: 25, b: 20, c: 10 },
    { label: "Présence Jour J (terrain)", a: 20, b: 20, c: 18 },
  ],
  jourJ: [
    { label: "Récupération des infos & prestataires", a: 8, b: 7, c: 4 },
    { label: "Échanges mariés & rendez-vous", a: 6, b: 5, c: 3 },
    { label: "Plan de table & logistique", a: 4, b: 4, c: 2 },
    { label: "Conducteur Jour J (création & diffusion)", a: 7, b: 6, c: 3 },
    { label: "Présence Jour J (terrain)", a: 13, b: 13, c: 12 },
  ],
};

const SCENARIOS = [
  { key: "a", name: "A · Classique", tools: "Google Drive, Excel, WhatsApp, Trello/Notion gratuits" },
  { key: "b", name: "B · ChatGPT seul", tools: "Un LLM pour rédiger, sans données structurées" },
  { key: "c", name: "C · Mariable Pro", tools: "Application métier partagée avec mariés et prestataires" },
] as const;

const FAQ_ITEMS = [
  { q: "Combien d'heures un wedding planner passe-t-il sur un mariage ?", a: "Entre 180 et 220 heures pour une organisation complète de A à Z (environ 200 h en moyenne), et 35 à 40 heures pour une coordination Jour J seule." },
  { q: "Comment un wedding planner peut-il gagner du temps ?", a: "En supprimant la double saisie : un seul espace où budget, prestataires, invités, plan de table et conducteur sont partagés en direct avec les mariés et les prestataires, au lieu de fichiers Excel et de messages WhatsApp dispersés." },
  { q: "ChatGPT suffit-il pour organiser un mariage en tant que pro ?", a: "ChatGPT aide à rédiger un email ou une trame, mais ne centralise pas les données du mariage, ne synchronise rien avec les mariés et ne fournit pas de conducteur à jour sur smartphone le jour J. Le gain mesuré est d'environ 10 %." },
  { q: "Comment améliorer l'expérience des mariés ?", a: "En leur donnant un espace dédié où ils retrouvent et modifient eux-mêmes budget, invités et plan de table : moins de questions le soir sur WhatsApp, moins de fichiers perdus, une relation plus sereine et professionnelle." },
  { q: "Combien coûte Mariable Pro ?", a: "Mariable Pro démarre à 149 €/an (Coordination Jour J) et 259 €/an pour l'Organisation complète, avec 30 jours d'essai gratuit sans carte bancaire." },
];

const formatEuro = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);

const SimulateurTempsWeddingPlanner = () => {
  const [serviceType, setServiceType] = useState<"complete" | "jourJ">("complete");
  const [weddingsPerYear, setWeddingsPerYear] = useState(8);
  const [hourlyRate, setHourlyRate] = useState(45);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const simulation = useMemo(() => {
    const tasks = TASK_HOURS[serviceType];
    const totals = { a: 0, b: 0, c: 0 };
    tasks.forEach((task) => { totals.a += task.a; totals.b += task.b; totals.c += task.c; });
    const yearlyHoursSaved = (totals.a - totals.c) * weddingsPerYear;
    const timeValue = yearlyHoursSaved * hourlyRate;
    return {
      tasks,
      totals,
      yearlyHoursSaved,
      weeksSaved: Math.round(yearlyHoursSaved / 35),
      timeValue,
      extraWeddings: Math.floor(yearlyHoursSaved / totals.c),
      chatGptHoursSaved: (totals.a - totals.b) * weddingsPerYear,
      roi: Math.round(timeValue / MARIABLE_PRO_PRICE),
    };
  }, [serviceType, weddingsPerYear, hourlyRate]);

  const schemas = [
    { type: "FAQ" as const, data: FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a })) },
  ];

  return (
    <>
      <SEO
        title="Simulateur wedding planner : combien de temps gagner ? | Mariable Pro"
        description="Calculez les heures gagnées par mariage : outils classiques (Drive, Excel, WhatsApp), ChatGPT seul ou Mariable Pro. Temps, valeur et rentabilité."
        keywords="gagner du temps wedding planner, logiciel wedding planner, rentabilité wedding planner, outil organisation mariage pro, alternative excel mariage"
        canonical={PAGE_PATH}
        schemas={schemas}
      />
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
              <Link to="/" className="hover:text-editorial-olive">Accueil</Link> / <Link to="/pro-solutions" className="hover:text-editorial-olive">Mariable Pro</Link> / Simulateur
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">Simulateur pour wedding planners</p>
            <h1 className="text-4xl leading-tight md:text-5xl">Combien de temps gagnez-vous par mariage avec le bon outil ?</h1>
            <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">Un wedding planner passe en moyenne 200 heures sur une organisation complète. Comparez trois façons de travailler — outils classiques, ChatGPT seul, Mariable Pro — et découvrez les heures, l'argent et la sérénité que vous récupérez, pour vous comme pour vos mariés.</p>
          </div>
        </section>

        <section aria-labelledby="simulateur-titre" className="px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 id="simulateur-titre" className="text-3xl md:text-4xl">Votre simulation</h2>
            <div className="mt-8 grid gap-8 border border-editorial-noir/10 bg-card p-6 md:grid-cols-3">
              <div>
                <p className="mb-3 text-sm font-semibold">Type de prestation</p>
                <div className="flex flex-col gap-2">
                  {([["complete", "Organisation complète"], ["jourJ", "Coordination Jour J"]] as const).map(([value, label]) => (
                    <button key={value} type="button" onClick={() => setServiceType(value)} aria-pressed={serviceType === value}
                      className={`min-h-11 border px-4 text-left text-sm ${serviceType === value ? "border-editorial-noir bg-editorial-noir text-primary-foreground" : "border-editorial-noir/20 hover:border-editorial-noir"}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-3 block text-sm font-semibold">Mariages par an : <span className="text-editorial-olive">{weddingsPerYear}</span></label>
                <Slider min={3} max={20} step={1} value={[weddingsPerYear]} onValueChange={(value) => setWeddingsPerYear(value[0])} aria-label="Nombre de mariages par an" />
              </div>
              <div>
                <label className="mb-3 block text-sm font-semibold">Valeur de votre heure : <span className="text-editorial-olive">{hourlyRate} €</span></label>
                <Slider min={30} max={80} step={5} value={[hourlyRate]} onValueChange={(value) => setHourlyRate(value[0])} aria-label="Taux horaire" />
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {SCENARIOS.map((scenario) => {
                const hours = simulation.totals[scenario.key];
                const saved = simulation.totals.a - hours;
                const isMariable = scenario.key === "c";
                return (
                  <article key={scenario.key} className={`border p-6 ${isMariable ? "border-editorial-olive bg-editorial-olive/10" : "border-editorial-noir/10"}`}>
                    <h3 className="text-xl">{scenario.name}</h3>
                    <p className="mt-1 text-sm text-editorial-noir/60">{scenario.tools}</p>
                    <p className="mt-5 text-4xl">{hours} h</p>
                    <p className="text-sm text-editorial-noir/60">par mariage</p>
                    <p className="mt-3 text-sm font-semibold">{saved > 0 ? `−${saved} h (${Math.round((saved / simulation.totals.a) * 100)} %) / mariage` : "Référence"}</p>
                  </article>
                );
              })}
            </div>

            <div className="mt-8 grid gap-4 bg-editorial-noir p-6 text-primary-foreground sm:grid-cols-2 md:grid-cols-4">
              <div><p className="text-3xl">{simulation.yearlyHoursSaved} h</p><p className="text-sm opacity-75">gagnées par an avec Mariable Pro (≈ {simulation.weeksSaved} semaines de 35 h)</p></div>
              <div><p className="text-3xl">{formatEuro(simulation.timeValue)}</p><p className="text-sm opacity-75">de temps récupéré chaque année</p></div>
              <div><p className="text-3xl">+{simulation.extraWeddings}</p><p className="text-sm opacity-75">mariage(s) signable(s) en plus, sans week-end supplémentaire</p></div>
              <div><p className="text-3xl">×{simulation.roi}</p><p className="text-sm opacity-75">retour sur l'abonnement de {MARIABLE_PRO_PRICE} €/an</p></div>
            </div>
            <p className="mt-3 text-sm text-editorial-noir/60">À titre de comparaison, ChatGPT seul ne vous fait gagner que {simulation.chatGptHoursSaved} h par an.</p>
          </div>
        </section>

        <section aria-labelledby="detail-titre" className="bg-editorial-beige/30 px-4 py-12 md:py-16">
          <div className="mx-auto max-w-5xl">
            <h2 id="detail-titre" className="text-3xl md:text-4xl">Le détail poste par poste</h2>
            <p className="mt-4 text-editorial-noir/75">Heures moyennes par mariage, issues des pratiques terrain des wedding planners en France.</p>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead><tr className="bg-muted text-left"><th className="p-3">Poste</th><th className="p-3">A · Classique</th><th className="p-3">B · ChatGPT</th><th className="p-3">C · Mariable Pro</th></tr></thead>
                <tbody>
                  {simulation.tasks.map((task) => (
                    <tr key={task.label} className="border-b border-editorial-noir/10"><td className="p-3">{task.label}</td><td className="p-3">{task.a} h</td><td className="p-3">{task.b} h</td><td className="p-3 font-semibold">{task.c} h</td></tr>
                  ))}
                  <tr className="font-semibold"><td className="p-3">Total</td><td className="p-3">{simulation.totals.a} h</td><td className="p-3">{simulation.totals.b} h</td><td className="p-3">{simulation.totals.c} h</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-4 py-12 md:py-16">
          <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-3xl">Pourquoi ChatGPT seul ne suffit pas</h2>
              <p className="mt-4 leading-relaxed text-editorial-noir/75">Une IA générique rédige un email ou une trame de conducteur. Mais elle ne supprime ni la double saisie, ni les fichiers perdus par les mariés, ni le conducteur introuvable sur smartphone au milieu d'un domaine le jour J. Les données du mariage restent éparpillées : le gain plafonne autour de 10 %.</p>
            </div>
            <div>
              <h2 className="text-3xl">Une meilleure expérience pour vos mariés</h2>
              <p className="mt-4 leading-relaxed text-editorial-noir/75">Avec Mariable Pro, vos mariés ont leur propre espace : ils mettent à jour invités, budget et plan de table eux-mêmes. Moins de messages le soir, un suivi clair des acomptes, un conducteur partagé par simple lien avec chaque prestataire. Vous paraissez plus pro, eux sont plus sereins.</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-titre" className="bg-editorial-beige/30 px-4 py-12 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 id="faq-titre" className="text-3xl md:text-4xl">Questions fréquentes</h2>
            <div className="mt-8 space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.q}><h3 className="text-xl">{item.q}</h3><p className="mt-2 leading-relaxed text-editorial-noir/75">{item.a}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 text-center">
          <h2 className="text-3xl md:text-4xl">Récupérez vos heures dès ce mois-ci</h2>
          <p className="mx-auto mt-4 max-w-xl text-editorial-noir/75">30 jours d'essai gratuit, sans carte bancaire.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive"><Link to="/register-gratuit?type=pro">Commencer l'essai gratuit</Link></Button>
            <Button asChild variant="outline" className="min-h-12 rounded-none px-7"><Link to="/pro-solutions">Découvrir Mariable Pro</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default SimulateurTempsWeddingPlanner;
