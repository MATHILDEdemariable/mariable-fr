import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { QrCode, Camera, ShieldCheck, Download, ArrowRight, Smartphone } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: "Mes invités doivent-ils créer un compte ou installer une application ?",
    answer:
      "Non. Vos invités scannent le QR code, la page s'ouvre dans leur navigateur et ils déposent leurs photos et vidéos directement. Aucun compte, aucune application à télécharger.",
  },
  {
    question: "Les photos sont-elles conservées en qualité originale ?",
    answer:
      "Oui. Les fichiers sont envoyés dans leur qualité d'origine, sans compression, contrairement aux envois par messagerie qui dégradent fortement les images.",
  },
  {
    question: "Qui peut voir les photos déposées ?",
    answer:
      "Vous seuls. L'album est stocké dans un espace privé : seul le couple propriétaire y accède depuis son tableau de bord, peut modérer les médias et les télécharger.",
  },
  {
    question: "Combien de photos et de vidéos peut-on déposer ?",
    answer:
      "Jusqu'à 400 médias par album, accessibles pendant 90 jours après la création. Vous pouvez télécharger l'intégralité de l'album à tout moment.",
  },
  {
    question: "L'album photo partagé est-il inclus dans l'offre gratuite ?",
    answer:
      "Non, il fait partie des fonctionnalités Premium de Mariable (29 € à vie). Vous créez votre compte, passez Premium et générez votre album en quelques secondes.",
  },
];

const AlbumPhotoPartage: React.FC = () => {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.mariable.fr/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Album photo partagé mariage',
        item: 'https://www.mariable.fr/album-photo-partage-mariage',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF]">
      <Helmet>
        <title>Album photo partagé mariage : QR code pour vos invités | Mariable</title>
        <meta
          name="description"
          content="Récupérez toutes les photos de vos invités grâce à un QR code à imprimer. Album photo partagé mariage privé, sans compte ni application, en qualité originale."
        />
        <link rel="canonical" href="https://www.mariable.fr/album-photo-partage-mariage" />
        <meta property="og:title" content="Album photo partagé mariage : QR code pour vos invités" />
        <meta
          property="og:description"
          content="Un QR code, un lien, toutes les photos de vos invités réunies au même endroit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.mariable.fr/album-photo-partage-mariage" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <PremiumHeader />

      <main className="flex-grow">
        {/* Hero */}
        <section className="container mx-auto px-4 md:px-8 pt-12 pb-14 md:pt-20 md:pb-20">
          <div className="max-w-3xl">
            <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-4">
              Fonctionnalité Premium
            </p>
            <h1 className="font-serif text-3xl md:text-5xl text-wedding-olive leading-tight mb-5">
              Album photo partagé : récupérez toutes les photos de vos invités
            </h1>
            <p className="text-editorial-noir/70 text-base md:text-lg leading-relaxed mb-8">
              Votre photographe capte le beau. Vos invités captent le reste : les fous rires, la
              piste de danse, les moments volés. Avec l'album photo partagé Mariable, un simple QR
              code à imprimer suffit pour tout réunir au même endroit — sans compte, sans
              application, en qualité originale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 bg-wedding-olive text-white px-8 py-4 rounded-none uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Créer mon album (Premium 29 €)
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register-gratuit"
                className="inline-flex items-center justify-center gap-2 bg-white text-editorial-noir border border-editorial-noir px-8 py-4 rounded-none uppercase tracking-widest text-xs hover:bg-editorial-noir hover:text-white transition-colors"
              >
                Créer un compte gratuit
              </Link>
            </div>
          </div>
        </section>

        {/* Problème */}
        <section className="bg-white py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <h2 className="font-serif text-2xl md:text-4xl text-editorial-noir mb-6">
              Le problème : vos photos de mariage sont éparpillées sur 40 téléphones
            </h2>
            <ul className="space-y-3 text-editorial-noir/70 text-base leading-relaxed">
              <li>Personne ne pense à vous envoyer ses photos après le mariage.</li>
              <li>Celles que vous recevez arrivent compressées par les messageries.</li>
              <li>Les vidéos ne passent pas, ou se perdent dans une conversation de groupe.</li>
              <li>Six mois plus tard, la moitié de votre journée a disparu.</li>
            </ul>
          </div>
        </section>

        {/* Comment ça marche */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <h2 className="font-serif text-2xl md:text-4xl text-editorial-noir mb-10 text-center">
              Comment ça marche, en 3 étapes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  Icon: Camera,
                  title: '1. Créez votre album',
                  text: "Depuis votre tableau de bord Mariable, créez votre espace album en un clic.",
                },
                {
                  Icon: QrCode,
                  title: '2. Imprimez le QR code',
                  text: "Posez-le sur les tables, le livre d'or ou le plan de salle. Un lien court l'accompagne.",
                },
                {
                  Icon: Download,
                  title: '3. Récupérez tout',
                  text: 'Photos et vidéos arrivent dans votre espace privé : consultez, modérez, téléchargez.',
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="bg-white border border-editorial-noir/10 p-6">
                  <Icon className="w-6 h-6 text-wedding-olive mb-4" strokeWidth={1.4} />
                  <h3 className="font-serif text-lg text-editorial-noir mb-2">{title}</h3>
                  <p className="text-sm text-editorial-noir/70 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Avantages */}
        <section className="bg-white py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-5xl">
            <h2 className="font-serif text-2xl md:text-4xl text-editorial-noir mb-10">
              Pourquoi l'album Mariable plutôt qu'un Drive partagé
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  Icon: Smartphone,
                  title: 'Aucun compte pour vos invités',
                  text: 'Le lien s\'ouvre dans le navigateur. Pas d\'application, pas d\'inscription, pas de friction.',
                },
                {
                  Icon: Camera,
                  title: 'Qualité originale',
                  text: 'Les fichiers sont envoyés sans compression, y compris les vidéos et les gros formats.',
                },
                {
                  Icon: ShieldCheck,
                  title: 'Album privé',
                  text: 'Stockage sécurisé : vous seuls voyez, modérez et téléchargez les médias reçus.',
                },
                {
                  Icon: Download,
                  title: '400 médias, 90 jours',
                  text: 'Un quota confortable pour un mariage, avec téléchargement complet quand vous le souhaitez.',
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex gap-4 border border-editorial-noir/10 p-6">
                  <Icon className="w-5 h-5 text-wedding-olive flex-shrink-0 mt-1" strokeWidth={1.4} />
                  <div>
                    <h3 className="font-serif text-lg text-editorial-noir mb-1">{title}</h3>
                    <p className="text-sm text-editorial-noir/70 leading-relaxed">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <h2 className="font-serif text-2xl md:text-4xl text-editorial-noir mb-8">
              Questions fréquentes
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="border-t border-editorial-noir/15 pt-5">
                  <h3 className="font-serif text-lg text-editorial-noir mb-2">{item.question}</h3>
                  <p className="text-sm md:text-base text-editorial-noir/70 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="bg-wedding-olive py-14 md:py-20">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
            <h2 className="font-serif text-2xl md:text-4xl text-white mb-4">
              Ne perdez plus une seule photo de votre mariage
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              L'album photo partagé est inclus dans Mariable Premium, 29 € à vie, avec tous les
              outils d'organisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/paiement"
                className="inline-flex items-center justify-center gap-2 bg-white text-editorial-noir px-8 py-4 rounded-none uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
              >
                Passer Premium
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register-gratuit"
                className="inline-flex items-center justify-center text-xs uppercase tracking-widest text-white underline underline-offset-4 hover:opacity-80"
              >
                Créer un compte gratuit
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AlbumPhotoPartage;
