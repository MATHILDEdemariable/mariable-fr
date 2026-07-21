import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import EspaceApercu from '@/components/home/v2/EspaceApercu';
import IncludedSection from '@/components/home/v2/IncludedSection';

/**
 * Fusion 2-en-1 pour /refontejuillet :
 * - Aperçu de l'espace (dashboard mockup)
 * - Le service en détail (grille 6 fonctionnalités)
 * - CTA « Créer un compte gratuit » explicite
 *
 * Réutilise les composants homepage sans les modifier pour ne pas casser `/`.
 * L'alternance de fonds white/beige des sous-sections reste homogène.
 */
export default function EspaceFusionSection() {
  return (
    <div id="ton-espace-mariable" className="bg-white">
      <EspaceApercu />
      <IncludedSection />

      <section className="bg-white pb-20 md:pb-28">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center border-t border-editorial-noir/10 pt-16 md:pt-20">
            <p className="uppercase tracking-[0.3em] text-xs mb-5 text-editorial-olive">
              Ton wedding planner de poche
            </p>
            <h2 className="font-serif text-3xl md:text-5xl text-editorial-noir mb-5 leading-tight">
              Crée ton compte pour tout organiser,
              <br className="hidden md:block" />
              <span className="italic"> où que tu sois.</span>
            </h2>
            <p className="text-editorial-gray text-base md:text-lg mb-10">
              L'intégralité de ton espace Mariable — accessible depuis ton téléphone,
              ta tablette ou ton ordinateur. Sans téléchargement, sans engagement.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register-gratuit"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-wedding-olive hover:bg-wedding-olive/90 text-white px-8 py-4 rounded-none font-medium transition-colors uppercase tracking-widest text-xs"
              >
                Créer un compte gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="text-xs uppercase tracking-widest text-editorial-noir underline underline-offset-4 hover:opacity-70"
              >
                J'ai déjà un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
