import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, Play } from "lucide-react";
import proVideoFr from "@/assets/mariable-pro-9x16-FR-mathilde.mp4.asset.json";
import PremiumHeader from "@/components/home/PremiumHeader";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import ProPricingPlans from "@/components/pro/ProPricingPlans";
import heroPlannerPhoto from "@/assets/editorial/wedding-planner-chateau.png.asset.json";

const PAGE_PATH = "/weddingacademy";
const ACADEMY_DISCOUNT = 0.15;

// Remplacer les liens "" par les URL Loom quand elles sont prêtes
const TUTORIAL_VIDEOS = [
  { number: "01", title: "Présentation générale", text: "Un tour complet de Mariable Pro : espace pro, multi-mariages et collaboration avec les couples.", items: ["Tableau de bord", "Créer un mariage", "Inviter les mariés"], loomUrl: "https://www.loom.com/share/491237dd9b584d0c959d0bb4dfd0e475" },
  { number: "02", title: "Outils d'organisation", text: "Tout ce qu'il faut pour piloter un mariage en amont.", items: ["Planning & rétroplanning", "Budget & acomptes", "Suivi des prestataires"], loomUrl: "https://www.loom.com/share/mariable-weddingacademy" },
  { number: "03", title: "Coordination Jour J", text: "L'application du jour J : équipe, déroulé et documents centralisés.", items: ["Équipe & planning", "Plan de table", "Infos cérémonie", "DJ & décoration"], loomUrl: "https://www.loom.com/share/mariable-weddingacademy" },
];

const WeddingAcademy = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <SEO title="Wedding Academy × Mariable – Offre partenaire élèves" description="Partenariat Wedding Academy et Mariable Pro : démo, tutoriels vidéo et -15 % sur l'abonnement annuel pour les élèves wedding planners." canonical={PAGE_PATH} />
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-12 pt-10 md:pb-16 md:pt-16">
          <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.3fr_1fr]">
            <div>
              <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
                <Link to="/" className="hover:text-editorial-olive">Accueil</Link> / Wedding Academy
              </nav>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">Partenariat · Wedding Academy × Mariable</p>
              <h1 className="text-4xl leading-tight md:text-6xl">L'outil des futurs wedding planners de la Wedding Academy</h1>
              <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">La Wedding Academy s'associe à Mariable pour équiper ses élèves d'une application professionnelle d'organisation et de coordination de mariage, avec une offre exclusive.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
                  <a href="#demo"><Play className="mr-2 h-4 w-4" /> Voir la démo</a>
                </Button>
                <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
                  <a href="#tarifs">Offre -15 %</a>
                </Button>
              </div>
            </div>
            <figure className="relative">
              <img src={heroPlannerPhoto.url} alt="Wedding planner consultant le planning du jour J sur son téléphone devant un château" className="aspect-[3/4] w-full object-cover object-top" width={1440} height={1920} fetchPriority="high" />
            </figure>
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
                  <a href={video.loomUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-between border border-editorial-noir px-4 hover:bg-editorial-noir hover:text-primary-foreground">
                    Regarder le tuto <Play className="h-4 w-4" />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="tarifs" aria-label="Tarifs Wedding Academy" className="scroll-mt-24 px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="mb-6 border border-editorial-olive p-4 text-sm">Offre élèves Wedding Academy : -15 % sur l'abonnement annuel Organisation complète. Mentionnez la Wedding Academy lors de votre inscription.</p>
            <ProPricingPlans isEnglish={false} organisationAnnualDiscount={ACADEMY_DISCOUNT} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default WeddingAcademy;
