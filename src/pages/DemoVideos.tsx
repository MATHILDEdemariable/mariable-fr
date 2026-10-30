import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Play, X } from 'lucide-react';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import coupleVideo from '@/assets/mariable-couple-9x16-voix.mp4.asset.json';
import proVideo from '@/assets/mariable-pro-9x16-EN-mathilde.mp4.asset.json';

const TEXTS = {
  fr: {
    eyebrow: 'DÉMO · EN VIDÉO', title: 'Mariable en action',
    subtitle: 'Choisissez votre univers et découvrez l’application en moins de deux minutes.',
    coupleTitle: 'Démo couples', coupleText: 'Budget, invités, rétroplanning et Jour J : préparez votre mariage sereinement.', coupleLang: 'Vidéo en français',
    proTitle: 'Démo wedding planners', proText: 'Espace collaboratif, prestataires et coordination du Jour J pour les pros.', proLang: 'Vidéo en anglais',
    watch: 'Lancer la vidéo', close: 'Fermer la vidéo',
  },
  en: {
    eyebrow: 'DEMO · VIDEO', title: 'Mariable in action',
    subtitle: 'Pick your world and discover the app in under two minutes.',
    coupleTitle: 'Couples demo', coupleText: 'Budget, guests, timeline and wedding day: plan your wedding calmly.', coupleLang: 'Video in French',
    proTitle: 'Wedding planners demo', proText: 'Collaborative workspace, vendors and wedding-day coordination for pros.', proLang: 'Video in English',
    watch: 'Watch the video', close: 'Close video',
  },
};

const DemoVideos = () => {
  const { i18n } = useTranslation();
  const text = TEXTS[i18n.language?.startsWith('en') ? 'en' : 'fr'];
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const demoCards = [
    { title: text.coupleTitle, body: text.coupleText, lang: text.coupleLang, url: coupleVideo.url },
    { title: text.proTitle, body: text.proText, lang: text.proLang, url: proVideo.url },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Démo vidéo Mariable – couples et wedding planners</title>
        <meta name="description" content="Découvrez Mariable en vidéo : une démo pour les couples (français) et une démo pour les wedding planners (anglais)." />
        <link rel="canonical" href="https://mariable.fr/demo" />
      </Helmet>
      <EditorialHeader />
      <main className="pt-32 pb-20 px-4">
        <section className="max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] text-primary mb-4">{text.eyebrow}</p>
          <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">{text.title}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">{text.subtitle}</p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {demoCards.map((card) => (
              <article key={card.title} className="border border-border bg-card p-8 flex flex-col rounded-none">
                <p className="text-xs tracking-widest text-primary uppercase mb-3">{card.lang}</p>
                <h2 className="font-serif text-2xl text-foreground mb-3">{card.title}</h2>
                <p className="text-muted-foreground mb-8 flex-1">{card.body}</p>
                <button
                  type="button"
                  onClick={() => setActiveVideoUrl(card.url)}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm tracking-widest uppercase rounded-none hover:opacity-90 transition-opacity"
                >
                  <Play className="h-4 w-4" aria-hidden /> {text.watch}
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Dialog open={!!activeVideoUrl} onOpenChange={(open) => !open && setActiveVideoUrl(null)}>
        <DialogContent className="p-0 border-0 bg-transparent shadow-none max-w-[min(90vw,420px)] [&>button]:hidden">
          <DialogTitle className="sr-only">{text.watch}</DialogTitle>
          <button type="button" aria-label={text.close} onClick={() => setActiveVideoUrl(null)} className="absolute -top-10 right-0 text-primary-foreground">
            <X className="h-7 w-7" />
          </button>
          {activeVideoUrl && (
            <video src={activeVideoUrl} controls autoPlay playsInline className="w-full max-h-[85vh] aspect-[9/16] bg-foreground object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DemoVideos;
