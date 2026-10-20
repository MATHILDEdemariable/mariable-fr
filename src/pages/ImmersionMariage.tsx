import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { IMMERSION_CATEGORIES, IMMERSION_VENDORS, ImmersionCategory, ImmersionVendor } from '@/data/immersionMariageVendors';

// Page mockup : aucune donnée n'est enregistrée, la demande de devis est simulée.
const ImmersionMariage = () => {
  const [activeCategory, setActiveCategory] = useState<ImmersionCategory | 'Tous'>('Tous');
  const [selectedVendor, setSelectedVendor] = useState<ImmersionVendor | null>(null);

  const filteredVendors = activeCategory === 'Tous' ? IMMERSION_VENDORS : IMMERSION_VENDORS.filter((vendor) => vendor.category === activeCategory);

  const handleQuoteSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({ description: `Votre demande a été transmise à ${selectedVendor?.name}.` });
    setSelectedVendor(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Immersion Mariage 2026 – Carnet d'adresses des prestataires</title>
        <meta name="description" content="Retrouvez les prestataires rencontrés à Immersion Mariage 2026 et demandez-leur un devis personnalisé." />
        <link rel="canonical" href="https://mariable.fr/immersion-mariage" />
      </Helmet>
      <PremiumHeader />

      <main>
        <section className="px-4 pt-28 pb-12 text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Événement · Immersion Mariage 2026</p>
          <h1 className="font-serif text-3xl md:text-5xl text-foreground mb-5">Le carnet d'adresses de l'expérience</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Vous avez vécu Immersion Mariage ? Retrouvez les prestataires qui ont donné vie à l'événement et poursuivez l'aventure avec eux.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 text-xs">
            {['Sélection coup de cœur', 'Contact direct', 'Sans commission'].map((badge) => (
              <span key={badge} className="border border-border px-3 py-1 text-muted-foreground">{badge}</span>
            ))}
          </div>
        </section>

        <section className="px-4 max-w-6xl mx-auto">
          <h2 className="sr-only">Prestataires partenaires</h2>
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
            {(['Tous', ...IMMERSION_CATEGORIES] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 min-h-[44px] px-4 text-sm border transition-colors ${activeCategory === category ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground hover:bg-muted'}`}
              >
                {category}{category === 'Tous' ? ` (${IMMERSION_VENDORS.length})` : ''}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pb-16">
            {filteredVendors.map((vendor) => (
              <article key={vendor.slug} className="bg-card border border-border flex flex-col">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {vendor.image ? (
                    <img src={vendor.image} alt={vendor.name} loading="lazy" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-3xl text-primary/60">{vendor.name.charAt(0)}</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] uppercase tracking-wider text-primary mb-2">{vendor.category}</span>
                  <h3 className="font-serif text-xl text-foreground">{vendor.name}</h3>
                  <p className="text-sm text-muted-foreground">{vendor.speciality}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" aria-hidden="true" />{vendor.location}</p>
                  <p className="text-sm italic text-foreground/80 mt-3 flex gap-2"><Sparkles className="w-4 h-4 shrink-0 text-primary" aria-hidden="true" />{vendor.experience}</p>
                  <Button className="mt-5 w-full rounded-none min-h-[44px]" onClick={() => setSelectedVendor(vendor)}>
                    Demander un devis personnalisé
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-muted px-4 py-14 text-center">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">Réunissez vos prestataires dans un seul déroulé</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">Avec l'app Mariable, coordonnez gratuitement les pros découverts à Immersion Mariage jusqu'au jour J.</p>
          <Button asChild className="rounded-none min-h-[44px]"><Link to="/register-gratuit">Créer mon espace gratuit</Link></Button>
        </section>
      </main>

      <Footer />

      <Dialog open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <DialogContent className="rounded-none max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Devis personnalisé · {selectedVendor?.name}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleQuoteSubmit} className="space-y-3">
            <div><Label htmlFor="coupleNames">Vos prénoms</Label><Input id="coupleNames" required placeholder="Sophie & Alexandre" /></div>
            <div><Label htmlFor="coupleEmail">Email</Label><Input id="coupleEmail" type="email" required /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="weddingDate">Date du mariage</Label><Input id="weddingDate" type="date" /></div>
              <div><Label htmlFor="weddingPlace">Lieu prévu</Label><Input id="weddingPlace" /></div>
            </div>
            <div><Label htmlFor="quoteMessage">Votre message</Label><Textarea id="quoteMessage" rows={3} defaultValue="Nous vous avons rencontré à Immersion Mariage 2026 et aimerions recevoir un devis." /></div>
            <Button type="submit" className="w-full rounded-none min-h-[44px]">Envoyer ma demande</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImmersionMariage;
