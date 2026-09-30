import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { ArrowRight, BookOpen, CheckCircle2, Download } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import playbookAsset from '@/assets/playbook-ia-wedding-planner.pdf.asset.json';

const PAGE_PATH = '/pro/ia-organisation-mariage';
const NOTION_URL = 'https://wary-grease-34e.notion.site/Livre-blanc-l-IA-pour-les-Wedding-Planners-3eb894d36ac481e3a65dde6c3659a78a';

const TEXTS = {
  fr: {
    seoTitle: "IA organisation mariage : le Playbook IA du Wedding Planner",
    seoDescription: "Livre blanc gratuit : comment les wedding planners gagnent 2 à 4 h par semaine avec l'IA. Méthode en 4 étapes, 6 cas d'usage et 11 prompts offerts.",
    eyebrow: 'Livre blanc gratuit · Édition 2026',
    h1: "Le Playbook IA du Wedding Planner",
    answer: "Bien utilisée, l'IA peut rendre à une wedding planner 2 à 4 heures par semaine. Ce guide pratique, écrit par Mathilde, fondatrice de Mariable et consultante IA, vous montre comment construire un vrai système adapté à votre métier, sans devenir technique.",
    insideTitle: 'Ce que vous trouverez dedans',
    inside: [
      ["Comprendre l'IA", 'Prompt, assistant, agent : les bases et le panorama des outils (ChatGPT, Gemini, Claude…).'],
      ['Cartographier votre travail', 'Votre métier phase par phase, la matrice IA et une méthode pour prioriser.'],
      ["Briefer l'IA", "La méthode CRAFT pour bien prompter et 6 cas d'usage réels de wedding planners."],
      ['Implémenter en 4 semaines', 'Un plan concret, les règles à fixer dès la semaine 1 et comment continuer.'],
      ['11 prompts offerts', 'Prêts à copier-coller, plus une matrice Google Sheets.'],
    ],
    formTitle: 'Recevez le Playbook', name: 'Nom complet', email: 'Email', job: 'Métier', jobPlaceholder: 'Wedding planner, coordinatrice, lieu…',
    consent: "J'accepte que mes données soient utilisées pour recevoir le livre blanc et des informations de Mariable.", submit: 'RECEVOIR LE PLAYBOOK', sending: 'Envoi…',
    successTitle: 'Votre Playbook est prêt', successText: 'Nous vous l’avons aussi envoyé par email.', readOnline: 'Lire en ligne', download: 'Télécharger le PDF',
    error: 'Une erreur est survenue. Veuillez réessayer.', invalid: 'Merci de vérifier vos informations.', consentRequired: 'Consentement requis',
    pilier: "Pour le jour J, découvrez l'app Mariable Pro", home: 'Accueil',
  },
  en: {
    seoTitle: 'AI for wedding planning: the Wedding Planner AI Playbook',
    seoDescription: 'Free white paper: how wedding planners save 2 to 4 hours a week with AI. A 4-step method, 6 use cases and 11 free prompts.',
    eyebrow: 'Free white paper · 2026 edition',
    h1: 'The Wedding Planner AI Playbook',
    answer: "Used well, AI can give a wedding planner back 2 to 4 hours a week. This practical guide by Mathilde, founder of Mariable and AI consultant, shows you how to build a real system for your job, without getting technical. The guide is written in French.",
    insideTitle: "What's inside",
    inside: [
      ['Understand AI', 'Prompt, assistant, agent: the basics and an overview of tools (ChatGPT, Gemini, Claude…).'],
      ['Map your work', 'Your job phase by phase, the AI matrix and a way to prioritise.'],
      ['Brief the AI', 'The CRAFT method for better prompts and 6 real wedding planner use cases.'],
      ['Roll it out in 4 weeks', 'A concrete plan, the rules to set in week 1 and how to keep going.'],
      ['11 free prompts', 'Ready to copy and paste, plus a Google Sheets matrix.'],
    ],
    formTitle: 'Get the Playbook', name: 'Full name', email: 'Email', job: 'Job', jobPlaceholder: 'Wedding planner, coordinator, venue…',
    consent: 'I agree that my data may be used to send me the white paper and news from Mariable.', submit: 'GET THE PLAYBOOK', sending: 'Sending…',
    successTitle: 'Your Playbook is ready', successText: 'We also sent it to you by email.', readOnline: 'Read online', download: 'Download the PDF',
    error: 'Something went wrong. Please try again.', invalid: 'Please check your details.', consentRequired: 'Consent required',
    pilier: 'For the wedding day, discover the Mariable Pro app', home: 'Home',
  },
};

const leadSchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  job: z.string().trim().min(1).max(100),
});

const ProPlaybookIA = () => {
  const { i18n } = useTranslation();
  const language = i18n.language?.startsWith('en') ? 'en' : 'fr';
  const text = TEXTS[language];
  const { toast } = useToast();
  const [formData, setFormData] = useState({ fullName: '', email: '', job: '', rgpdConsent: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.rgpdConsent) return toast({ title: text.consentRequired, variant: 'destructive' });
    const parsed = leadSchema.safeParse(formData);
    if (!parsed.success) return toast({ title: text.invalid, variant: 'destructive' });
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('whitepaper_leads' as never).insert({
        full_name: parsed.data.fullName, email: parsed.data.email, job: parsed.data.job,
      } as never);
      if (error) throw error;
      const { error: emailError } = await supabase.functions.invoke('send-whitepaper-email', {
        body: { fullName: parsed.data.fullName, email: parsed.data.email, language },
      });
      if (emailError) console.error('❌ Whitepaper email failed:', emailError);
      setIsUnlocked(true);
    } catch (error) {
      console.error('❌ Whitepaper lead failed:', error);
      toast({ title: text.error, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = 'w-full border-b border-editorial-noir/30 bg-transparent py-3 text-base outline-none focus:border-editorial-noir transition-colors';
  const bookSchema = {
    '@context': 'https://schema.org', '@type': 'Book', name: 'Livre blanc : l’IA pour les Wedding Planners',
    author: { '@type': 'Person', name: 'Mathilde Lambert' }, publisher: { '@type': 'Organization', name: 'Mariable', url: 'https://mariable.fr' },
    inLanguage: 'fr', isAccessibleForFree: true, url: `https://mariable.fr${PAGE_PATH}`,
  };

  return (
    <>
      <SEO title={text.seoTitle} description={text.seoDescription} canonical={PAGE_PATH}
        keywords="IA organisation mariage, IA wedding planner, ChatGPT wedding planner, livre blanc IA mariage, prompts wedding planner">
        <script type="application/ld+json">{JSON.stringify(bookSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-2">
            <div>
              <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
                <Link to="/" className="hover:text-editorial-olive">{text.home}</Link> / <Link to="/logiciel-wedding-planner" className="hover:text-editorial-olive">Mariable Pro</Link>
              </nav>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">{text.eyebrow}</p>
              <h1 className="text-4xl leading-tight md:text-6xl">{text.h1}</h1>
              <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">{text.answer}</p>
              <h2 className="mt-12 text-2xl md:text-3xl">{text.insideTitle}</h2>
              <ol className="mt-6 space-y-5">
                {text.inside.map(([heading, copy], index) => (
                  <li key={heading} className="grid grid-cols-[2.5rem_1fr] gap-2">
                    <span className="font-serif text-xl text-editorial-olive">0{index + 1}</span>
                    <div><h3 className="font-serif text-xl">{heading}</h3><p className="mt-1 text-editorial-noir/70">{copy}</p></div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-background p-8 shadow-sm sm:p-10 lg:sticky lg:top-28">
              {isUnlocked ? (
                <div className="py-6 text-center" role="alert">
                  <CheckCircle2 className="mx-auto mb-6 h-14 w-14 text-editorial-olive" aria-hidden />
                  <h2 className="mb-3 text-3xl">{text.successTitle}</h2>
                  <p className="mb-8 text-editorial-noir/70">{text.successText}</p>
                  <div className="flex flex-col gap-3">
                    <a href={NOTION_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 bg-editorial-noir px-6 text-sm tracking-widest text-primary-foreground hover:bg-editorial-olive">
                      <BookOpen className="h-4 w-4" aria-hidden />{text.readOnline.toUpperCase()}
                    </a>
                    <a href={playbookAsset.url} target="_blank" rel="noopener noreferrer" download className="inline-flex min-h-12 items-center justify-center gap-2 border border-editorial-noir px-6 text-sm tracking-widest hover:bg-editorial-noir hover:text-primary-foreground">
                      <Download className="h-4 w-4" aria-hidden />{text.download.toUpperCase()}
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <BookOpen className="mb-4 h-8 w-8 text-editorial-olive" aria-hidden />
                  <h2 className="mb-8 text-3xl">{text.formTitle}</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="lead-name" className="text-xs tracking-widest text-editorial-noir/60">{text.name.toUpperCase()} *</label>
                      <input id="lead-name" required maxLength={100} className={inputClass} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="lead-email" className="text-xs tracking-widest text-editorial-noir/60">{text.email.toUpperCase()} *</label>
                      <input id="lead-email" type="email" required maxLength={255} className={inputClass} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                    </div>
                    <div>
                      <label htmlFor="lead-job" className="text-xs tracking-widest text-editorial-noir/60">{text.job.toUpperCase()} *</label>
                      <input id="lead-job" required maxLength={100} placeholder={text.jobPlaceholder} className={inputClass} value={formData.job} onChange={(e) => setFormData({ ...formData, job: e.target.value })} />
                    </div>
                    <label className="flex cursor-pointer items-start gap-3 text-xs text-editorial-noir/70">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-editorial-olive" checked={formData.rgpdConsent} onChange={(e) => setFormData({ ...formData, rgpdConsent: e.target.checked })} />
                      {text.consent}
                    </label>
                    <button type="submit" disabled={isSubmitting} className="min-h-[52px] w-full bg-editorial-noir text-sm tracking-[0.2em] text-primary-foreground transition-colors hover:bg-editorial-olive disabled:opacity-60">
                      {isSubmitting ? text.sending : text.submit}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </section>
        <section className="px-4 py-12">
          <div className="mx-auto max-w-4xl text-center">
            <Link to="/logiciel-wedding-planner" className="inline-flex min-h-11 items-center gap-2 font-serif text-xl underline underline-offset-4">{text.pilier} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProPlaybookIA;
