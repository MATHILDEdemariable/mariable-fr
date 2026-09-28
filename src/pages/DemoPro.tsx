import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { z } from 'zod';
import { CalendarDays, Clock, Video, CheckCircle2 } from 'lucide-react';
import EditorialHeader from '@/components/home/editorial/EditorialHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DEMO_START = new Date('2026-10-01T14:30:00+02:00');

const TEXTS = {
  fr: {
    eyebrow: 'LIVE · DÉMO PRO', title: "Découvrez l'appli Jour J en direct",
    subtitle: "Une session en ligne pour les wedding planners, coordinateurs et lieux de réception : voyez comment Mariable Pro simplifie vos déroulés, puis échangez entre pros.",
    date: 'Jeudi 1er octobre', time: '14h30 (Paris)', duration: '40 min · en ligne',
    days: 'j', hours: 'h', minutes: 'min',
    programTitle: 'Au programme', part1: 'Démo live', part1Text: "Tour complet de l'appli Mariable Pro : déroulé Jour J, équipe, partage par lien, modules d'avant Jour J.",
    part2: 'Q&A entre pros', part2Text: 'Vos questions, vos cas concrets, et un échange ouvert entre professionnels du mariage.',
    formTitle: 'Réservez votre place', name: 'Nom complet', email: 'Email', job: 'Métier', jobPlaceholder: 'Wedding planner, lieu de réception…',
    consent: "J'accepte que mes données soient utilisées pour m'envoyer le lien de la démo.", submit: "JE M'INSCRIS", sending: 'Inscription…',
    successTitle: 'Vous êtes bien inscrit !', successText: 'Vous recevrez le lien le jour J. Un email de confirmation vient de vous être envoyé.',
    error: 'Une erreur est survenue. Veuillez réessayer.', invalid: 'Merci de vérifier vos informations.', consentRequired: 'Consentement requis',
    seoTitle: 'Démo live Mariable Pro — jeudi 1er octobre 14h30', seoDescription: "Inscrivez-vous à la démo live de l'appli Jour J Mariable Pro : 20 min de démo et 20 min de Q&A entre pros du mariage, jeudi 1er octobre à 14h30.",
  },
  en: {
    eyebrow: 'LIVE · PRO DEMO', title: 'Discover the wedding-day app live',
    subtitle: 'An online session for wedding planners, coordinators and venues: see how Mariable Pro simplifies your timelines, then chat with other pros.',
    date: 'Thursday, October 1', time: '2:30 pm (Paris)', duration: '40 min · online',
    days: 'd', hours: 'h', minutes: 'min',
    programTitle: 'Program', part1: 'Live demo', part1Text: 'A full tour of the Mariable Pro app: wedding-day timeline, team, link sharing, pre-wedding modules.',
    part2: 'Q&A between pros', part2Text: 'Your questions, your real cases, and an open discussion between wedding professionals.',
    formTitle: 'Save your seat', name: 'Full name', email: 'Email', job: 'Job', jobPlaceholder: 'Wedding planner, venue…',
    consent: 'I agree that my data may be used to send me the demo link.', submit: 'REGISTER', sending: 'Registering…',
    successTitle: "You're registered!", successText: 'You will receive the link on the day. A confirmation email has just been sent.',
    error: 'Something went wrong. Please try again.', invalid: 'Please check your details.', consentRequired: 'Consent required',
    seoTitle: 'Mariable Pro live demo — Thursday Oct 1, 2:30 pm', seoDescription: 'Register for the live demo of the Mariable Pro wedding-day app: 20 min demo and 20 min Q&A between wedding pros, Thursday October 1 at 2:30 pm.',
  },
};

const registrationSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  jobTitle: z.string().trim().min(1).max(100),
});

const getTimeLeft = () => {
  const diff = Math.max(0, DEMO_START.getTime() - Date.now());
  return { days: Math.floor(diff / 86400000), hours: Math.floor((diff / 3600000) % 24), minutes: Math.floor((diff / 60000) % 60) };
};

const DemoPro = () => {
  const { i18n } = useTranslation();
  const language = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const text = TEXTS[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({ fullName: '', email: '', jobTitle: '', rgpdConsent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.rgpdConsent) {
      toast({ title: text.consentRequired, variant: 'destructive' });
      return;
    }
    const parsed = registrationSchema.safeParse(formData);
    if (!parsed.success) {
      toast({ title: text.invalid, variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('demo_registrations' as never).insert({
        full_name: parsed.data.fullName, email: parsed.data.email, job_title: parsed.data.jobTitle, rgpd_consent: true,
      } as never);
      if (error) throw error;
      const { error: emailError } = await supabase.functions.invoke('send-demo-registration-email', {
        body: { ...parsed.data, language },
      });
      if (emailError) console.error('❌ Demo confirmation email failed:', emailError);
      setIsRegistered(true);
    } catch (error) {
      console.error('❌ Demo registration failed:', error);
      toast({ title: text.error, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const eventSchema = {
    '@context': 'https://schema.org', '@type': 'Event', name: text.seoTitle, description: text.seoDescription,
    startDate: '2026-10-01T14:30:00+02:00', endDate: '2026-10-01T15:10:00+02:00',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode', eventStatus: 'https://schema.org/EventScheduled',
    location: { '@type': 'VirtualLocation', url: 'https://mariable.fr/demo-pro' },
    organizer: { '@type': 'Organization', name: 'Mariable', url: 'https://mariable.fr' },
    isAccessibleForFree: true,
  };

  const inputClass = 'w-full border-b border-foreground/30 bg-transparent py-3 text-base outline-none focus:border-foreground transition-colors';

  return (
    <div className="min-h-screen bg-[#F8F5EF] text-foreground">
      <Helmet>
        <title>{text.seoTitle}</title>
        <meta name="description" content={text.seoDescription} />
        <link rel="canonical" href="https://mariable.fr/demo-pro" />
        <meta property="og:title" content={text.seoTitle} />
        <meta property="og:description" content={text.seoDescription} />
        <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>
      </Helmet>
      <EditorialHeader />

      <main className="pt-28 pb-20">
        <section className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-[#63745A] mb-6">
              <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#63745A] opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#63745A]" /></span>
              {text.eyebrow}
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.05] mb-6">{text.title}</h1>
            <p className="text-lg text-foreground/70 leading-relaxed mb-10 max-w-lg">{text.subtitle}</p>

            <div className="bg-[#63745A] text-white p-8 mb-10">
              <p className="font-serif text-3xl sm:text-4xl mb-4">{text.date}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm tracking-wide opacity-90">
                <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4" aria-hidden />{text.time}</span>
                <span className="inline-flex items-center gap-2"><Video className="h-4 w-4" aria-hidden />{text.duration}</span>
              </div>
              <div className="flex gap-6 mt-6 pt-6 border-t border-white/25" aria-live="polite">
                {[[timeLeft.days, text.days], [timeLeft.hours, text.hours], [timeLeft.minutes, text.minutes]].map(([value, label]) => (
                  <div key={String(label)}><span className="font-serif text-3xl">{value}</span><span className="text-sm ml-1 opacity-80">{label}</span></div>
                ))}
              </div>
            </div>

            <h2 className="text-xs tracking-[0.3em] text-foreground/60 mb-6">{text.programTitle.toUpperCase()}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[[text.part1, text.part1Text], [text.part2, text.part2Text]].map(([title, description], index) => (
                <div key={title} className="bg-white p-6">
                  <p className="text-xs tracking-widest text-[#63745A] mb-2">20 MIN · 0{index + 1}</p>
                  <h3 className="font-serif text-2xl mb-2">{title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 lg:sticky lg:top-28 shadow-sm">
            {isRegistered ? (
              <div className="text-center py-10" role="alert">
                <CheckCircle2 className="h-14 w-14 mx-auto text-[#63745A] mb-6" aria-hidden />
                <h2 className="font-serif text-3xl mb-4">{text.successTitle}</h2>
                <p className="text-foreground/70 leading-relaxed">{text.successText}</p>
              </div>
            ) : (
              <>
                <CalendarDays className="h-8 w-8 text-[#63745A] mb-4" aria-hidden />
                <h2 className="font-serif text-3xl mb-8">{text.formTitle}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="demo-name" className="text-xs tracking-widest text-foreground/60">{text.name.toUpperCase()} *</label>
                    <input id="demo-name" required maxLength={100} className={inputClass} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="demo-email" className="text-xs tracking-widest text-foreground/60">{text.email.toUpperCase()} *</label>
                    <input id="demo-email" type="email" required maxLength={255} className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <div>
                    <label htmlFor="demo-job" className="text-xs tracking-widest text-foreground/60">{text.job.toUpperCase()} *</label>
                    <input id="demo-job" required maxLength={100} placeholder={text.jobPlaceholder} className={inputClass} value={formData.jobTitle} onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })} />
                  </div>
                  <label className="flex items-start gap-3 text-xs text-foreground/70 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#63745A]" checked={formData.rgpdConsent} onChange={(e) => setFormData({ ...formData, rgpdConsent: e.target.checked })} />
                    {text.consent}
                  </label>
                  <button type="submit" disabled={isSubmitting} className="w-full min-h-[52px] bg-foreground text-background tracking-[0.2em] text-sm hover:bg-[#63745A] transition-colors disabled:opacity-60">
                    {isSubmitting ? text.sending : text.submit}
                  </button>
                </form>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default DemoPro;
