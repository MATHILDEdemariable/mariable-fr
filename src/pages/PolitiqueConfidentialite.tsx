import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { OPEN_COOKIE_SETTINGS_EVENT } from '@/components/consent/CookieConsentBanner';

const PolitiqueConfidentialite = () => (
  <div className="min-h-screen bg-background text-foreground">
    <SEO
      title="Politique de confidentialité et cookies | Mariable"
      description="Comment Mariable mesure l'audience du site et l'efficacité de ses publicités, quelles données sont partagées et comment modifier vos choix de cookies."
    />
    <PremiumHeader />
    <main className="container mx-auto max-w-3xl px-4 py-12 page-content">
      <section className="prose prose-neutral max-w-none">
        <h1 className="font-serif">Politique de confidentialité et cookies</h1>
        <p>
          Cette page explique comment Mariable mesure l'utilisation du site et l'efficacité de ses publicités.
          Le traitement des données de votre compte est décrit à l'article 5 des{' '}
          <Link to="/cgv-couples">conditions générales</Link>.
        </p>

        <h2 className="font-serif">Ce qui fonctionne sans votre accord</h2>
        <p>
          Les cookies nécessaires (connexion, sécurité, panier) sont toujours actifs. Nous comptons aussi les visites
          sans cookies et sans vous identifier : pages vues, provenance, pays, type d'appareil, vitesse et erreurs.
        </p>

        <h2 className="font-serif">Mesure d'audience (avec votre accord)</h2>
        <p>
          Si vous l'acceptez, nous mesurons les clics et la navigation sur le site, avec Lovable, Google Analytics
          et Hotjar, pour améliorer nos pages et nos outils.
        </p>

        <h2 className="font-serif">Publicité (avec votre accord)</h2>
        <p>
          Si vous l'acceptez, le site transmet à Meta (Facebook, Instagram) et à Google des informations techniques
          sur votre visite (pages vues, identifiants de cookies publicitaires, navigateur) et le fait qu'une
          inscription a eu lieu. Elles servent à mesurer les inscriptions issues de nos publicités et à
          optimiser leur diffusion. Nous ne transmettons ni votre nom, ni votre email, ni le contenu de votre mariage.
          Sans votre accord, aucune de ces données n'est envoyée : seuls les clics et les affichages de nos
          publicités sont comptés par ces plateformes.
        </p>

        <h2 className="font-serif">Modifier vos choix</h2>
        <p>
          Vous pouvez accepter, refuser ou retirer votre accord à tout moment ; un refus s'applique immédiatement.
          Le signal Global Privacy Control de votre navigateur est respecté comme un refus.
        </p>
        <button
          type="button"
          className="min-h-[44px] border border-foreground px-4 text-sm not-prose"
          onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
        >
          Paramètres des cookies
        </button>

        <h2 className="font-serif">Contact</h2>
        <p>
          Pour toute question ou pour exercer vos droits (accès, rectification, suppression, opposition) :{' '}
          <a href="mailto:mathilde@mariable.fr">mathilde@mariable.fr</a>.
        </p>
      </section>
    </main>
    <Footer />
  </div>
);

export default PolitiqueConfidentialite;
