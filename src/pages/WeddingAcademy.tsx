import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Play } from "lucide-react";
import proVideoFr from "@/assets/mariable-pro-9x16-FR-mathilde.mp4.asset.json";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";

const PAGE_PATH = "/weddingacademy";
const ACADEMY_DISCOUNT = 0.15;
const SIGNUP_URL = "/register-gratuit?type=pro&partenaire=weddingacademy";

// Remplacer les liens "" par les URL Loom quand elles sont prêtes
const TUTORIAL_VIDEOS = [
  { number: "01", title: "Présentation générale", text: "Un tour complet de Mariable Pro : espace pro, multi-mariages et collaboration avec les couples.", items: ["Tableau de bord", "Créer un mariage", "Inviter les mariés"], loomUrl: "" },
  { number: "02", title: "Outils d'organisation", text: "Tout ce qu'il faut pour piloter un mariage en amont.", items: ["Planning & rétroplanning", "Budget & acomptes", "Suivi des prestataires"], loomUrl: "" },
  { number: "03", title: "Coordination Jour J", text: "L'application du jour J : équipe, déroulé et documents centralisés.", items: ["Équipe & planning", "Plan de table", "Infos cérémonie", "DJ & décoration"], loomUrl: "" },
];

const ACADEMY_PLANS = [
  { name: "Coordination Jour J", annualPrice: 149, features: ["Application mobile Jour J", "Invités, RSVP & mini-site", "Plan de table", "Cérémonies, décoration, boissons"] },
  { name: "Organisation complète", annualPrice: 259, features: ["Inclut toute la Coordination Jour J", "Planning & rétroplanning IA", "Budget & acomptes", "Suivi des prestataires & formulaires clients"] },
];

const formatEuro = (value: number) => (Math.round(value * 100) / 100).toFixed(2).replace(".", ",").replace(",00", "");

const WeddingAcademy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEO title="Wedding Academy × Mariable – Offre partenaire élèves" description="Partenariat Wedding Academy et Mariable Pro : démo, tutoriels vidéo et -15 % sur l'abonnement annuel pour les élèves wedding planners." canonical={PAGE_PATH} />
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">Partenariat · Wedding Academy × Mariable</p>
            <h1 className="text-4xl leading-tight md:text-6xl">L'outil des futurs wedding planners de la Wedding Academy</h1>
            <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">La Wedding Academy s'associe à Mariable pour équiper ses élèves d'une application professionnelle d'organisation et de coordination de mariage, avec une offre exclusive.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
                <a href="#demo"><Play className="mr-2 h-4 w-4" /> Voir la démo</a>
              </Button>
              <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
                <a href="#tarifs">Offre -15 %</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="demo" aria-labelledby="demo-title" className="scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-md text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-editorial-olive">Démo · En vidéo</p>
            <h2 id="demo-title" className="mt-3 text-3xl md:text-4xl">Mariable Pro en action</h2>
            <video src={proVideoFr.url} controls playsInline preload="metadata" className="mt-8 aspect-[9/16] w-full bg-editorial-noir object-contain" />
          </div>
        </section>

        <section id="tutos" aria-labelledby="tutos-title" className="scroll-mt-24 bg-editorial-beige/40 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-editorial-olive">Tutoriels vidéo</p>
            <h2 id="tutos-title" className="mt-3 text-3xl md:text-4xl">Prenez l'outil en main pas à pas</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {TUTORIAL_VIDEOS.map((video) => (
                <article key={video.number} className="flex flex-col border border-editorial-noir/15 bg-background p-6">
                  <p className="text-xs tracking-widest text-editorial-olive">{video.number}</p>
                  <h3 className="mt-1 font-serif text-xl">{video.title}</h3>
                  <p className="mt-2 text-sm text-editorial-noir/75">{video.text}</p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm">
                    {video.items.map((item) => <li key={item} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-editorial-olive" />{item}</li>)}
                  </ul>
                  {video.loomUrl ? (
                    <a href={video.loomUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-between border border-editorial-noir px-4 hover:bg-editorial-noir hover:text-primary-foreground">
                      Regarder le tuto <Play className="h-4 w-4" />
                    </a>
                  ) : (
                    <span className="mt-6 inline-flex min-h-11 items-center border border-editorial-noir/20 px-4 text-sm text-editorial-noir/50">Vidéo bientôt disponible</span>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tarifs" aria-labelledby="tarifs-title" className="scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-editorial-olive">Offre élèves Wedding Academy</p>
            <h2 id="tarifs-title" className="mt-3 text-3xl md:text-4xl">-15 % sur l'abonnement annuel</h2>
            <p className="mt-4 text-editorial-noir/75">1 mois d'essai gratuit, sans carte bancaire. Mentionnez la Wedding Academy pour bénéficier de la remise.</p>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              {ACADEMY_PLANS.map((plan) => {
                const discountedPrice = plan.annualPrice * (1 - ACADEMY_DISCOUNT);
                return (
                  <article key={plan.name} className="flex flex-col border border-editorial-noir/15 p-6">
                    <h3 className="font-serif text-2xl">{plan.name}</h3>
                    <p className="mt-4 text-sm text-editorial-noir/50 line-through">{plan.annualPrice} €/an</p>
                    <p className="text-4xl">{formatEuro(discountedPrice)} €<span className="text-base text-editorial-noir/60">/an</span></p>
                    <p className="mt-1 text-sm text-editorial-olive">soit {formatEuro(discountedPrice / 12)} €/mois</p>
                    <ul className="mt-6 flex-1 space-y-2 text-sm">
                      {plan.features.map((feature) => <li key={feature} className="flex gap-2"><Check className="h-4 w-4 shrink-0 text-editorial-olive" />{feature}</li>)}
                    </ul>
                    <Button asChild className="mt-6 min-h-12 rounded-none bg-editorial-noir text-primary-foreground hover:bg-editorial-olive">
                      <Link to={SIGNUP_URL}>Démarrer l'essai gratuit <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </article>
                );
              })}
            </div>
            <p className="mt-6 text-sm text-editorial-noir/60">Jusqu'à 30 mariages par an inclus. Référencement dans la sélection Mariable offert. <Link to="/pro-solutions" className="underline underline-offset-4">Découvrir Mariable Pro en détail</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WeddingAcademy;
