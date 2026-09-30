import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Check, X } from 'lucide-react';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';

const PAGE_PATH = '/pro/alternative-mariages-net';

const CONTENT = {
  fr: {
    seoTitle: 'Alternative à Mariages.net pour wedding planners – Mariable Pro',
    seoDescription: "Une alternative à Mariages.net pour les pros du mariage : un outil de coordination jour J et une visibilité auprès de couples premium, dans une seule app.",
    eyebrow: 'Mariable Pro · Alternative à Mariages.net',
    h1: "L'alternative à Mariages.net pour les wedding planners",
    answer: "Mariages.net est un annuaire généraliste : vous payez pour être visible et recevez des demandes à trier. Mariable Pro est une app de travail pour wedding planners, coordinatrices et lieux : déroulé du jour J partagé avec couples et prestataires, suivi de tous vos mariages, et une visibilité dans une sélection premium. 149 € par an, essai gratuit.",
    ctaTry: 'Essayer gratuitement', ctaPilier: 'Découvrir le logiciel wedding planner',
    pain: "Beaucoup de pros nous racontent la même chose à propos des grands annuaires : beaucoup de demandes, mais peu qui correspondent à leur gamme de prix ou à leur style.",
    compareTitle: 'Mariable Pro vs Mariages.net',
    head: ['', 'Mariable Pro', 'Mariages.net'],
    rows: [
      ['Modèle', 'Outil de travail + visibilité', 'Visibilité (annuaire + demandes de contact)'],
      ['Positionnement', 'Sélection mariage premium', 'Annuaire généraliste, tous budgets'],
      ['Type de demandes', 'Couples qui préparent déjà leur mariage sur Mariable', 'Volume de demandes, à trier soi-même'],
      ['Coordination jour J', true, false],
      ['Collaboration avec vos couples', true, false],
    ] as (string | boolean)[][],
    plusTitle: 'Ce que Mariable Pro fait en plus',
    plus: [
      ['Un déroulé unique partagé', 'Une seule version du planning, envoyée par lien à chaque prestataire, sans compte à créer.'],
      ['Tous vos mariages au même endroit', 'Un tableau de bord pour la saison, avec contacts réutilisables.'],
      ["L'IA pour la mise en forme", "Déroulé mis en forme automatiquement, oublis détectés (horaires qui se chevauchent, contact manquant)."],
      ['Vos couples impliqués', 'Ils renseignent invités, discours et préférences directement dans l’app.'],
    ],
    whoTitle: 'Pour qui ?',
    who: 'Wedding planners, coordinatrices jour J, lieux de réception et officiants qui veulent un outil de travail, pas seulement une vitrine.',
    faqTitle: 'Questions fréquentes',
    faq: [
      ['Puis-je garder Mariages.net et utiliser Mariable Pro ?', "Oui. Beaucoup de pros utilisent Mariable Pro pour coordonner leurs mariages, quelle que soit la façon dont les couples les ont trouvés."],
      ['Combien coûte Mariable Pro ?', '149 € par an pour tous vos mariages, avec un essai gratuit.'],
      ['Mes prestataires doivent-ils créer un compte ?', 'Non, ils consultent le déroulé via un simple lien.'],
    ],
    home: 'Accueil',
  },
  en: {
    seoTitle: 'Mariages.net alternative for wedding planners – Mariable Pro',
    seoDescription: 'An alternative to Mariages.net for wedding pros: a wedding-day coordination tool and visibility with premium couples, in one app.',
    eyebrow: 'Mariable Pro · Mariages.net alternative',
    h1: 'The Mariages.net alternative for wedding planners',
    answer: 'Mariages.net is a general directory: you pay to be visible and get leads to sort through. Mariable Pro is a working app for wedding planners, coordinators and venues: a wedding-day timeline shared with couples and vendors, all your weddings in one place, and visibility in a premium selection. €149 a year, free trial.',
    ctaTry: 'Try for free', ctaPilier: 'Discover the wedding planner software',
    pain: 'Many pros tell us the same thing about big directories: lots of leads, but few that match their price range or style.',
    compareTitle: 'Mariable Pro vs Mariages.net',
    head: ['', 'Mariable Pro', 'Mariages.net'],
    rows: [
      ['Model', 'Working tool + visibility', 'Visibility (directory + contact requests)'],
      ['Positioning', 'Premium wedding selection', 'General directory, all budgets'],
      ['Type of leads', 'Couples already planning their wedding on Mariable', 'High volume, to sort yourself'],
      ['Wedding-day coordination', true, false],
      ['Collaboration with your couples', true, false],
    ] as (string | boolean)[][],
    plusTitle: 'What Mariable Pro does on top',
    plus: [
      ['One shared timeline', 'A single version of the schedule, sent by link to each vendor, no account needed.'],
      ['All your weddings in one place', 'One dashboard for the season, with reusable contacts.'],
      ['AI for formatting', 'Timeline formatted automatically, gaps flagged (overlapping times, missing contact).'],
      ['Your couples involved', 'They fill in guests, speeches and preferences directly in the app.'],
    ],
    whoTitle: 'Who is it for?',
    who: 'Wedding planners, day-of coordinators, venues and officiants who want a working tool, not just a showcase.',
    faqTitle: 'FAQ',
    faq: [
      ['Can I keep Mariages.net and use Mariable Pro?', 'Yes. Many pros use Mariable Pro to coordinate their weddings, however couples found them.'],
      ['How much is Mariable Pro?', '€149 a year for all your weddings, with a free trial.'],
      ['Do my vendors need an account?', 'No, they view the timeline via a simple link.'],
    ],
    home: 'Home',
  },
};

const ProAlternativeMariagesNet = () => {
  const { i18n } = useTranslation();
  const content = i18n.language?.startsWith('en') ? CONTENT.en : CONTENT.fr;
  const faqSchema = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: content.faq.map(([question, answer]) => ({ '@type': 'Question', name: question, acceptedAnswer: { '@type': 'Answer', text: answer } })),
  };
  const renderCell = (value: string | boolean) =>
    typeof value === 'boolean'
      ? value ? <Check className="h-5 w-5 text-editorial-olive" aria-label="Oui" /> : <X className="h-5 w-5 text-editorial-noir/40" aria-label="Non" />
      : value;

  const ctaButtons = (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Button asChild className="min-h-12 rounded-none bg-editorial-noir px-7 text-primary-foreground hover:bg-editorial-olive">
        <Link to="/register-gratuit?type=pro">{content.ctaTry} <ArrowRight className="ml-2 h-4 w-4" /></Link>
      </Button>
      <Button asChild variant="outline" className="min-h-12 rounded-none border-editorial-noir bg-transparent px-7">
        <Link to="/logiciel-wedding-planner">{content.ctaPilier}</Link>
      </Button>
    </div>
  );

  return (
    <>
      <SEO title={content.seoTitle} description={content.seoDescription} canonical={PAGE_PATH}
        keywords="alternative mariages.net, mariages.net wedding planner, alternative annuaire mariage, logiciel wedding planner">
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </SEO>
      <PremiumHeader />
      <main className="page-content bg-background text-editorial-noir">
        <section className="bg-editorial-beige/40 px-4 pb-16 pt-10 md:pb-24 md:pt-16">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Fil d'Ariane" className="mb-6 text-sm text-editorial-noir/60">
              <Link to="/" className="hover:text-editorial-olive">{content.home}</Link> / <Link to="/logiciel-wedding-planner" className="hover:text-editorial-olive">Mariable Pro</Link>
            </nav>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-editorial-olive">{content.eyebrow}</p>
            <h1 className="text-4xl leading-tight md:text-6xl">{content.h1}</h1>
            <p className="mt-6 text-lg leading-relaxed text-editorial-noir/75">{content.answer}</p>
            {ctaButtons}
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="font-serif text-xl italic">{content.pain}</p>
            <h2 className="mt-12 text-3xl md:text-4xl">{content.compareTitle}</h2>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm md:text-base">
                <thead><tr className="border-b border-editorial-noir/25">{content.head.map((cell) => <th key={cell} className="p-4 font-serif font-normal">{cell}</th>)}</tr></thead>
                <tbody>
                  {content.rows.map((row) => (
                    <tr key={String(row[0])} className="border-b border-editorial-noir/10">
                      {row.map((cell, index) => <td key={index} className={`p-4 ${index === 0 ? 'font-medium' : 'text-editorial-noir/75'}`}>{renderCell(cell)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="bg-editorial-olive px-4 py-16 text-primary-foreground md:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl md:text-4xl">{content.plusTitle}</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {content.plus.map(([heading, copy]) => (
                <div key={heading} className="border-t border-primary-foreground/35 pt-5">
                  <h3 className="font-serif text-xl">{heading}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-85">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl">{content.whoTitle}</h2>
            <p className="mt-4 text-lg text-editorial-noir/75">{content.who}</p>
            <h2 className="mt-16 text-3xl md:text-4xl">{content.faqTitle}</h2>
            <div className="mt-8 divide-y divide-editorial-noir/15 border-y border-editorial-noir/15">
              {content.faq.map(([question, answer]) => (
                <details key={question} className="group py-5">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-serif text-lg">{question}<span className="text-editorial-olive group-open:rotate-45">+</span></summary>
                  <p className="mt-3 text-editorial-noir/75">{answer}</p>
                </details>
              ))}
            </div>
            {ctaButtons}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProAlternativeMariagesNet;
