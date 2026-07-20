import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import SEO from '@/components/SEO';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import { SelectionLockProvider } from '@/components/home/editorial/SelectionLockModal';
import { Button } from '@/components/ui/button';

const Histoire = () => {
  return (
    <SelectionLockProvider>
      <SEO
        title="Notre Histoire — Fondée par Mathilde | Mariable"
        description="L'histoire de Mariable commence avec Mathilde, jeune mariée diplômée d'école de commerce, qui révolutionne l'organisation des mariages en France."
        canonical="/about/histoire"
      />

      <div className="min-h-screen bg-editorial-beige text-editorial-noir">
        <EditorialHeader />

        <main>
          {/* Hero éditorial */}
          <section className="pt-16 md:pt-24 pb-12 md:pb-16">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-4xl mx-auto text-center"
              >
                <p className="text-xs tracking-[0.3em] uppercase text-editorial-noir/60 mb-6">
                  Notre histoire
                </p>
                <h1 className="font-serif text-4xl md:text-6xl leading-[1.05] mb-6">
                  L'histoire d'une jeune mariée <em className="italic">qui a décidé de tout changer.</em>
                </h1>
                <p className="text-editorial-noir/75 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  De l'expérience personnelle à la plateforme qui simplifie l'organisation
                  des plus beaux jours.
                </p>
              </motion.div>
            </div>
          </section>

          {/* Portrait fondatrice — split */}
          <section className="py-12 md:py-20">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-6xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="aspect-[4/5] overflow-hidden"
                >
                  <img
                    src="https://bgidfcqktsttzlwlumtz.supabase.co/storage/v1/object/public/visuels/photomathilde.png"
                    alt="Mathilde, fondatrice de Mariable"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive mb-4">
                    Rencontre
                  </p>
                  <h2 className="font-serif text-3xl md:text-4xl mb-6 leading-tight">
                    Mathilde, <em className="italic">fondatrice.</em>
                  </h2>
                  <div className="space-y-4 text-editorial-noir/80 leading-relaxed">
                    <p>
                      L'histoire de Mariable commence avec Mathilde, jeune mariée diplômée
                      d'école de commerce, qui décide de se lancer dans l'entrepreneuriat
                      après son expérience personnelle.
                    </p>
                    <p>
                      Une conviction simple : l'organisation d'un mariage devrait être
                      un moment de joie, pas une charge mentale. Mariable est né de ce constat —
                      pour digitaliser, alléger, et rendre le processus enfin agréable.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Mission / Vision — bloc éditorial */}
          <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="border-t-2 border-wedding-olive pt-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Heart className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">
                      Notre mission
                    </p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    Célébrer l'amour — <em className="italic">simplement.</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">
                    Apporter de la joie et transformer l'organisation des mariages
                    en une expérience simple et agréable, pour tous les couples.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="border-t-2 border-wedding-olive pt-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-wedding-olive" strokeWidth={1.5} />
                    <p className="text-xs tracking-[0.25em] uppercase text-wedding-olive">
                      Notre vision
                    </p>
                  </div>
                  <h3 className="font-serif text-2xl md:text-3xl leading-tight mb-4">
                    Faciliter <em className="italic">le plus beau jour de votre vie.</em>
                  </h3>
                  <p className="text-editorial-noir/75 leading-relaxed">
                    Transformer l'organisation des mariages en une expérience
                    simple, moderne et accessible à tous.
                  </p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Chiffres-clés */}
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4 md:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
                {[
                  { n: '2000+', l: 'Couples accompagnés' },
                  { n: '500+', l: 'Prestataires sélectionnés' },
                  { n: '100%', l: 'Sans sponsoring' },
                  { n: '29€', l: 'Premium à vie' },
                ].map((k, i) => (
                  <motion.div
                    key={k.l}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <p className="font-serif text-4xl md:text-5xl text-editorial-noir mb-2">
                      {k.n}
                    </p>
                    <p className="text-xs tracking-[0.2em] uppercase text-editorial-noir/60">
                      {k.l}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Soutiens */}
          <section className="py-16 md:py-20 bg-white">
            <div className="container mx-auto px-4 md:px-8">
              <motion.header
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-10 md:mb-12"
              >
                <p className="text-xs tracking-[0.25em] uppercase text-editorial-noir/60 mb-3">
                  Avec le soutien de
                </p>
                <h2 className="font-serif text-3xl md:text-4xl">
                  Ils accompagnent <em className="italic">Mariable</em>
                </h2>
              </motion.header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                {[
                  {
                    img: '/lovable-uploads/f6b347a1-f299-4731-8b9a-10e21c0f1b08.png',
                    alt: 'Schoolab',
                    name: 'SCHOOLAB, Paris',
                    sub: 'Incubateur de start-up',
                  },
                  {
                    img: '/lovable-uploads/bea0740d-427b-4f1b-95e3-2468f199ec77.png',
                    alt: 'ECE',
                    name: 'ECE Paris',
                    sub: "École d'ingénieurs",
                  },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="border border-editorial-noir/10 p-8 flex flex-col items-center text-center hover:border-wedding-olive transition-colors"
                  >
                    <img src={s.img} alt={s.alt} className="h-16 mb-4 object-contain" loading="lazy" />
                    <p className="font-serif text-lg text-editorial-noir">{s.name}</p>
                    <p className="text-xs tracking-[0.15em] uppercase text-editorial-noir/60 mt-1">
                      {s.sub}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA final */}
          <section className="py-16 md:py-24 bg-wedding-olive text-white">
            <div className="container mx-auto px-4 md:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="font-serif text-3xl md:text-5xl mb-6 leading-tight">
                  Prêt·e à organiser <em className="italic">votre mariage&nbsp;?</em>
                </h2>
                <p className="text-white/85 text-base md:text-lg mb-8">
                  Rejoignez les milliers de couples qui font confiance à Mariable.
                </p>
                <Link to="/register-gratuit">
                  <Button
                    size="lg"
                    className="bg-white text-editorial-noir hover:bg-white/90 rounded-none px-8 py-6 text-base"
                  >
                    Créer un compte gratuit
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </main>
      </div>
    </SelectionLockProvider>
  );
};

export default Histoire;
