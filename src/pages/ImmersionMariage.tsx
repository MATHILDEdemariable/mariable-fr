import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MapPin, Star, MessageSquareHeart, Users, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { IMMERSION_CATEGORIES, IMMERSION_VENDORS, ImmersionCategory, ImmersionVendor } from '@/data/immersionMariageVendors';
import immersionLogoWhite from '@/assets/immersion/immersion_logo_white.png.asset.json';
import chateauPhoto from '@/assets/immersion/chateau_pourtales_facade.png.asset.json';

const FEEDBACK_QUESTIONS = [
  { key: 'overall', label: "Votre expérience globale de l'événement" },
  { key: 'vendors', label: 'La qualité et la diversité des prestataires' },
  { key: 'ambiance', label: "L'ambiance, la scénographie et les animations" },
  { key: 'welcome', label: "L'accueil et l'organisation" },
  { key: 'recommend', label: 'Recommanderiez-vous Immersion Mariage ?' },
] as const;

type RatingKey = typeof FEEDBACK_QUESTIONS[number]['key'];
const EMPTY_RATINGS: Record<RatingKey, number> = { overall: 0, vendors: 0, ambiance: 0, welcome: 0, recommend: 0 };
const DEFAULT_LEAD_MESSAGE = 'Ravis de vous avoir découvert à Immersion Mariage, nous sommes intéressés par vos services et aimerions avoir un devis personnalisé.';
const EMPTY_LEAD = { firstName: '', lastName: '', email: '', phone: '', weddingDate: '', weddingLocation: '', message: DEFAULT_LEAD_MESSAGE };

const MARIABLE_FEATURES = [
  { title: 'Rétroplanning & checklist', text: 'Les étapes et tâches à suivre au fil des mois.' },
  { title: 'Budget', text: 'Les coûts estimés et réels, poste par poste.' },
  { title: 'Invités, RSVP et mini-site', text: 'Les réponses de vos invités centralisées sur un mini-site avec formulaire de réponse en ligne.' },
  { title: 'Plan de table', text: 'Une organisation visuelle reliée à votre liste d\'invités.' },
  { title: 'Prestataires', text: 'Vos contacts et informations utiles réunis.' },
  { title: 'Outils pratiques', text: 'Calculatrice de boissons, stockage des documents, album photo partagé.' },
];
const JOUR_J_POINTS = ['Déroulé heure par heure', 'Tâches, rôles et responsabilités', 'Contacts clés', 'Prestataires', 'Briefs', 'Documents utiles', 'Informations logistiques', 'Changements de dernière minute'];

const StarRating = ({ value, onChange, label }: { value: number; onChange: (rating: number) => void; label: string }) => (
  <div className="flex gap-1" role="radiogroup" aria-label={label}>
    {[1, 2, 3, 4, 5].map((rating) => (
      <button
        key={rating}
        type="button"
        role="radio"
        aria-checked={value === rating}
        aria-label={`${rating} étoile${rating > 1 ? 's' : ''}`}
        onClick={() => onChange(rating)}
        className="p-1 min-h-[44px] min-w-[40px] flex items-center justify-center"
      >
        <Star className={`h-7 w-7 transition-colors ${rating <= value ? 'fill-primary text-primary' : 'text-border'}`} />
      </button>
    ))}
  </div>
);

const ImmersionMariage = () => {
  const [activeCategory, setActiveCategory] = useState<ImmersionCategory | 'Tous'>('Tous');
  const [selectedVendor, setSelectedVendor] = useState<ImmersionVendor | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [ratings, setRatings] = useState(EMPTY_RATINGS);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [leadForm, setLeadForm] = useState(EMPTY_LEAD);
  const [wantsQuote, setWantsQuote] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredVendors = activeCategory === 'Tous' ? IMMERSION_VENDORS : IMMERSION_VENDORS.filter((vendor) => vendor.category === activeCategory);
  // Pop-up avis ouverte automatiquement à l'arrivée (une fois par session)
  useEffect(() => {
    if (sessionStorage.getItem('immersionFeedbackShown')) return;
    const timer = setTimeout(() => { setIsFeedbackOpen(true); sessionStorage.setItem('immersionFeedbackShown', '1'); }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const isFeedbackComplete = Object.values(ratings).every((rating) => rating > 0);

  const handleFeedbackSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isFeedbackComplete) return;
    setIsSubmitting(true);
    const { error } = await supabase.rpc('submit_immersion_feedback' as never, {
      r1: ratings.overall, r2: ratings.vendors, r3: ratings.ambiance, r4: ratings.welcome, r5: ratings.recommend,
      comment_value: feedbackComment.trim() || null, first_name_value: null, email_value: null,
    } as never);
    setIsSubmitting(false);
    if (error) {
      console.error('❌ submit_immersion_feedback failed:', error);
      toast({ variant: 'destructive', description: "Votre avis n'a pas pu être envoyé. Réessayez." });
      return;
    }
    toast({ description: 'Merci pour votre avis ! 💛' });
    setRatings(EMPTY_RATINGS);
    setFeedbackComment('');
    setIsFeedbackOpen(false);
  };

  const handleLeadSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedVendor) return;
    setIsSubmitting(true);
    const { error } = await supabase.rpc('submit_immersion_lead' as never, {
      vendor_slug_value: selectedVendor.slug, vendor_name_value: selectedVendor.name,
      first_name_value: leadForm.firstName, last_name_value: leadForm.lastName, email_value: leadForm.email,
      phone_value: leadForm.phone || null, wedding_date_value: leadForm.weddingDate || null,
      wedding_location_value: leadForm.weddingLocation || null, message_value: leadForm.message || null,
      wants_quote_value: wantsQuote,
    } as never);
    setIsSubmitting(false);
    if (error) {
      console.error('❌ submit_immersion_lead failed:', error);
      toast({ variant: 'destructive', description: 'Vérifiez vos informations (email notamment) et réessayez.' });
      return;
    }
    const { error: emailError } = await supabase.functions.invoke('notify-immersion-lead', {
      body: { vendorName: selectedVendor.name, vendorEmail: selectedVendor.email ?? '', ...leadForm, wantsQuote },
    });
    if (emailError) console.error('❌ notify-immersion-lead failed:', emailError);
    toast({ description: `Votre demande a été transmise à ${selectedVendor.name}. Un email de confirmation vous a été envoyé.` });
    setLeadForm(EMPTY_LEAD);
    setWantsQuote(true);
    setSelectedVendor(null);
  };

  const updateLeadField = (field: keyof typeof EMPTY_LEAD) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setLeadForm((current) => ({ ...current, [field]: event.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Immersion Mariage × Mariable – Prestataires & avis</title>
        <meta name="description" content="Retrouvez les prestataires d'Immersion Mariage, contactez-les en un clic et donnez votre avis sur l'événement." />
        <link rel="canonical" href="https://mariable.fr/immersion-mariage" />
      </Helmet>

      <main>
        {/* Hero photo avec logos en haut à gauche */}
        <section className="relative min-h-[88svh] flex flex-col overflow-hidden">
          <img src={chateauPhoto.url} alt="Château de Pourtalès, lieu de l'événement Immersion Mariage" className="absolute inset-0 w-full h-full object-cover object-bottom" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-foreground/40 to-foreground/70" aria-hidden="true" />

          <header className="relative z-10 flex items-center gap-3 px-5 pt-5">
            <img src={immersionLogoWhite.url} alt="Immersion Mariage" className="h-11 w-auto drop-shadow" />
            <span className="text-background/80 text-lg font-light" aria-hidden="true">×</span>
            <span className="font-serif text-xl text-background drop-shadow">mariable</span>
          </header>

          <div className="relative z-10 my-auto px-5 py-10 text-background text-center max-w-2xl mx-auto w-full">
            <p className="text-[11px] uppercase tracking-[0.25em] text-background/85 mb-3">Immersion Mariage × Mariable</p>
            <h1 className="font-serif text-3xl md:text-5xl leading-tight mb-3 drop-shadow">Merci d'avoir vécu l'expérience Immersion Mariage</h1>
            <p className="text-background/90 text-sm md:text-base mb-6">Retrouvez les prestataires rencontrés, contactez-les en un clic et préparez votre mariage autrement.</p>
            <button
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full max-w-md mx-auto text-left bg-background text-foreground p-4 flex items-center gap-3 shadow-lg min-h-[64px]"
            >
              <Star className="h-6 w-6 fill-primary text-primary shrink-0" aria-hidden="true" />
              <span className="flex-1">
                <span className="block font-serif text-lg">Donnez votre avis sur l'événement</span>
                <span className="block text-xs text-muted-foreground">5 questions · 1 minute</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* Navigation rapide collante */}
        <nav className="sticky top-0 z-30 bg-primary text-primary-foreground shadow-md" aria-label="Sections de la page">
          <div className="grid grid-cols-3 text-xs">
            <button onClick={() => setIsFeedbackOpen(true)} className="min-h-[52px] flex flex-col items-center justify-center gap-0.5 font-medium text-primary-foreground">
              <MessageSquareHeart className="h-4 w-4" aria-hidden="true" />Mon avis
            </button>
            <a href="#prestataires" className="min-h-[52px] flex flex-col items-center justify-center gap-0.5 font-medium text-primary-foreground border-x border-primary-foreground/30">
              <Users className="h-4 w-4" aria-hidden="true" />Prestataires
            </a>
            <a href="#mariable" className="min-h-[52px] flex flex-col items-center justify-center gap-0.5 font-medium text-primary-foreground">
              <Sparkles className="h-4 w-4" aria-hidden="true" />Offre 19 €
            </a>
          </div>
        </nav>

        {/* Catalogue */}
        <section id="prestataires" className="scroll-mt-14 px-4 pt-8 max-w-6xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-1">Les prestataires</h2>
          <p className="text-sm text-muted-foreground mb-4">Ils ont donné vie à l'événement. Contactez-les directement.</p>
          <div className="flex flex-wrap gap-2 pb-4">
            {(['Tous', ...IMMERSION_CATEGORIES] as const).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`min-h-[40px] px-3 text-sm border transition-colors ${activeCategory === category ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-foreground bg-card'}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pb-12">
            {filteredVendors.map((vendor) => (
              <article key={vendor.slug} className="bg-card border border-border flex sm:flex-col">
                <div className="w-28 sm:w-full shrink-0 sm:aspect-[4/3] bg-muted overflow-hidden">
                  {vendor.image ? (
                    <img src={vendor.image} alt={vendor.name} loading="lazy" className="w-full h-full object-cover object-top" />
                  ) : (
                    <div className="w-full h-full min-h-[120px] flex items-center justify-center font-serif text-3xl text-primary/60">{vendor.name.charAt(0)}</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1 min-w-0">
                  <span className="text-[10px] uppercase tracking-wider text-primary mb-1">{vendor.category}</span>
                  <h3 className="font-serif text-lg text-foreground leading-tight">{vendor.name}</h3>
                  <p className="text-xs text-muted-foreground">{vendor.speciality}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" aria-hidden="true" />{vendor.location}</p>
                  <Button size="sm" className="mt-3 rounded-none min-h-[40px] w-full" onClick={() => setSelectedVendor(vendor)}>
                    Mise en contact
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Mariable */}
        <section id="mariable" className="scroll-mt-14 bg-primary text-primary-foreground px-5 py-12">
          <div className="max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] opacity-80 mb-3">Et maintenant ?</p>
            <h2 className="font-serif text-2xl md:text-4xl mb-3">Une seule plateforme, des préparatifs au jour J</h2>
            <p className="opacity-90 text-sm md:text-base mb-8">Mariable, le wedding planner digital boosté à l'IA, vous accompagne pendant toute la préparation avec les outils essentiels, jusqu'à la coordination finale.</p>
            <div className="grid gap-3 sm:grid-cols-2 mb-8">
              {MARIABLE_FEATURES.map((feature) => (
                <div key={feature.title} className="border border-primary-foreground/25 p-4">
                  <h3 className="font-serif text-lg mb-1">{feature.title}</h3>
                  <p className="text-sm opacity-85">{feature.text}</p>
                </div>
              ))}
            </div>
            <div className="bg-background text-foreground p-5 mb-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-primary mb-2">Mais surtout</p>
              <h3 className="font-serif text-xl md:text-2xl mb-2">L'application du jour J boostée par l'IA</h3>
              <p className="text-sm text-muted-foreground mb-4">Mariable centralise et coordonne le déroulé de votre mariage : horaires, rôles, contacts, prestataires, briefs et documents. Vous préparez votre planning, puis partagez les bonnes informations aux personnes concernées grâce à un simple lien.</p>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm mb-4">
                {JOUR_J_POINTS.map((point) => (
                  <li key={point} className="flex gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" aria-hidden="true" />{point}</li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground">Chaque personne accède aux informations utiles pour elle, depuis son téléphone, sans multiplier les fichiers et les versions.</p>
            </div>
            <p className="opacity-90 text-sm mb-4">Créez votre compte gratuit, ou utilisez le code promo reçu pendant l'événement pour passer Premium à <strong>19 €</strong> au lieu de 29 € : fonctionnalités illimitées (IA comprise), checklist, appli jour J et <strong>8 guides PDF</strong> à télécharger.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild variant="secondary" className="rounded-none min-h-[48px] flex-1"><Link to="/register-gratuit">Créer mon compte gratuit</Link></Button>
              <Button asChild variant="outline" className="rounded-none min-h-[48px] flex-1 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"><Link to="/paiement">J'ai un code promo · Premium 19 €</Link></Button>
            </div>
          </div>
        </section>

        <footer className="px-5 py-6 text-center text-xs text-muted-foreground">
          Immersion Mariage · Propulsé par <Link to="/" className="underline">Mariable</Link>
        </footer>
      </main>

      {/* Tiroir avis */}
      <Dialog open={isFeedbackOpen} onOpenChange={setIsFeedbackOpen}>
        <DialogContent className="rounded-none max-h-[90svh] overflow-y-auto w-[calc(100%-1.5rem)] max-w-lg">
          <DialogHeader className="text-left">
            <DialogTitle className="font-serif text-2xl">Votre avis compte</DialogTitle>
            <DialogDescription>Aidez-nous à rendre la prochaine édition encore plus belle.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFeedbackSubmit} className="space-y-5 mt-5 max-w-lg mx-auto">
            {FEEDBACK_QUESTIONS.map((question) => (
              <div key={question.key}>
                <p className="text-sm text-foreground">{question.label}</p>
                <StarRating label={question.label} value={ratings[question.key]} onChange={(rating) => setRatings((current) => ({ ...current, [question.key]: rating }))} />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="feedbackComment">Ce qui peut être amélioré ? Une remarque pour la prochaine édition ?</Label>
              <Textarea id="feedbackComment" rows={3} maxLength={3000} value={feedbackComment} onChange={(event) => setFeedbackComment(event.target.value)} />
            </div>
            <Button type="submit" className="w-full rounded-none min-h-[48px]" disabled={!isFeedbackComplete || isSubmitting}>
              {isFeedbackComplete ? 'Envoyer mon avis' : 'Notez les 5 questions'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Tiroir contact express */}
      <Sheet open={!!selectedVendor} onOpenChange={(open) => !open && setSelectedVendor(null)}>
        <SheetContent side="bottom" className="rounded-none max-h-[92svh] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle className="font-serif text-2xl">Contacter {selectedVendor?.name}</SheetTitle>
            <SheetDescription>{selectedVendor?.speciality} · réponse directe du prestataire.</SheetDescription>
          </SheetHeader>
          <form onSubmit={handleLeadSubmit} className="space-y-3 mt-5 max-w-lg mx-auto">
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="leadFirstName">Prénom *</Label><Input id="leadFirstName" required value={leadForm.firstName} onChange={updateLeadField('firstName')} /></div>
              <div><Label htmlFor="leadLastName">Nom *</Label><Input id="leadLastName" required value={leadForm.lastName} onChange={updateLeadField('lastName')} /></div>
            </div>
            <div><Label htmlFor="leadEmail">Email *</Label><Input id="leadEmail" type="email" required value={leadForm.email} onChange={updateLeadField('email')} /></div>
            <div><Label htmlFor="leadPhone">Téléphone</Label><Input id="leadPhone" type="tel" value={leadForm.phone} onChange={updateLeadField('phone')} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label htmlFor="leadDate">Date</Label><Input id="leadDate" type="date" value={leadForm.weddingDate} onChange={updateLeadField('weddingDate')} /></div>
              <div><Label htmlFor="leadLocation">Lieu</Label><Input id="leadLocation" value={leadForm.weddingLocation} onChange={updateLeadField('weddingLocation')} /></div>
            </div>
            <div><Label htmlFor="leadMessage">Message</Label><Textarea id="leadMessage" rows={3} maxLength={2000} value={leadForm.message} onChange={updateLeadField('message')} /></div>
            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
              <Checkbox checked={wantsQuote} onCheckedChange={(checked) => setWantsQuote(checked === true)} />
              <span className="text-sm">Recevoir un devis personnalisé</span>
            </label>
            <Button type="submit" className="w-full rounded-none min-h-[48px]" disabled={isSubmitting}>Envoyer ma demande</Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default ImmersionMariage;
