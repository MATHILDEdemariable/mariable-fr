
import React from 'react';
import SEO from '@/components/SEO';
import PremiumHeader from '@/components/home/PremiumHeader';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Comment organiser mon mariage étape par étape ?",
    answer: "Mariable vous accompagne à chaque étape : 1) Créez votre compte gratuit, 2) Utilisez notre checklist intelligente pour planifier les grandes étapes, 3) Parcourez nos prestataires ou demandez une sélection personnalisée, 4) Gérez votre budget avec notre calculateur, 5) Coordonnez le jour J avec notre outil de planning. Tous nos outils sont accessibles gratuitement depuis votre tableau de bord."
  },
  {
    question: "Comment calculer le budget de mon mariage ?",
    answer: "Notre calculateur de budget vous aide à estimer et répartir votre enveloppe. Il prend en compte : le nombre d'invités, la région, la saison, et vos prestataires souhaités. Vous obtenez une estimation réaliste par poste (lieu, traiteur, photo, DJ, etc.) et pouvez suivre vos dépenses en temps réel. L'outil est 100% gratuit dans votre tableau de bord."
  },
  {
    question: "Mariable est-il vraiment gratuit ?",
    answer: "Oui, de nombreuses fonctionnalités sont 100% gratuites : tableau de bord, checklist, calculateur de budget, gestion des invités, plan de table, et coordination jour J. La recherche de prestataires est également gratuite. Mariable propose également des fonctionnalités premium à découvrir pour aller plus loin dans l'organisation de votre mariage."
  },
  {
    question: "Que comprend le Premium et quel est le prix ?",
    answer: "Le compte Premium Mariable est disponible à 29€ (paiement unique, accès à vie). Il comprend : export illimité de vos PDF personnalisés (budget, plan de table, checklist cérémonies, moodboard, suivi prestataires), accès complet aux checklists et guides, utilisation IA sans limite pour les checklist, rétroplanning et moodboard, stockage illimité de documents, et plus de 3 lignes par catégorie de budget. Sans Premium, vous bénéficiez d'1 génération IA par outil et de 2 documents stockables."
  },
  {
    question: "Qu'est-ce que Mariable ?",
    answer: "Mariable est la première plateforme française dédiée à l'organisation complète de votre mariage. Notre mission est de simplifier chaque étape de votre préparation grâce à des outils digitaux innovants : tableau de bord personnalisé, coordination du jour J, sélection de prestataires, gestion de budget et bien plus encore."
  },
  {
    question: "Comment fonctionne le tableau de bord utilisateur ?",
    answer: "Votre tableau de bord Mariable centralise tous les aspects de votre mariage. Vous y retrouvez : votre checklist personnalisée, vos prestataires sélectionnés, votre budget en temps réel, vos documents importants, votre planning jour J et la possibilité de collaborer avec vos proches. Tout est pensé pour vous faire gagner du temps et de la sérénité."
  },
  {
    question: "Comment créer mon planning de mariage ?",
    answer: "Mariable vous guide à travers plusieurs outils : checklist intelligente qui s'adapte à votre profil, générateur de planning jour J avec suggestions automatiques, calculateur de budget avec répartition par poste, et outils de coordination pour impliquer vos proches dans l'organisation."
  },
  {
    question: "Puis-je partager mon planning avec mes proches ?",
    answer: "Absolument ! Mariable est pensé pour la collaboration. Vous pouvez partager votre planning jour J avec vos témoins, famille et amis. Ils peuvent consulter leurs tâches, confirmer leur participation et vous aider dans l'organisation, même sans créer de compte."
  },
  {
    question: "Comment gérer mon budget mariage avec Mariable ?",
    answer: "Notre calculateur de budget vous aide à répartir votre enveloppe par poste (lieu, traiteur, robe, etc.), suivre vos dépenses en temps réel, comparer les devis de prestataires et ajuster votre budget selon vos priorités. Vous gardez toujours le contrôle de vos finances."
  },
  {
    question: "Mariable fonctionne-t-il sur mobile ?",
    answer: "Oui ! Mariable est une application web responsive qui s'adapte parfaitement à tous vos appareils : smartphone, tablette, ordinateur. Pas besoin de téléchargement, vous accédez à votre espace depuis n'importe quel navigateur web."
  },
  {
    question: "Mariable est-il disponible partout en France ?",
    answer: "Oui, Mariable couvre toute la France métropolitaine et les DOM-TOM. Notre réseau de prestataires partenaires s'étend des grandes métropoles aux petites communes rurales. Où que vous organisiez votre mariage, nous avons des professionnels qualifiés à vous recommander."
  },
  {
    question: "Comment contacter l'équipe Mariable ?",
    answer: "Plusieurs moyens pour nous joindre : email à contact@mariable.fr, WhatsApp via notre communauté Mariable, prise de rendez-vous téléphonique direct sur notre site, ou chat en ligne depuis votre tableau de bord. Notre équipe vous répond rapidement pour vous accompagner."
  }
];

const FAQ = () => {
  // Schema FAQPage pour le GEO (Generative Engine Optimization)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="FAQ - Questions fréquentes"
        description="Trouvez les réponses à toutes vos questions sur Mariable : fonctionnalités, tableau de bord, Mon Jour M, sélection de prestataires et tarifs."
        keywords="faq mariable, questions mariage, aide organisation mariage, tableau de bord mariage, jour j coordination"
        canonical="/contact/faq"
      >
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </SEO>

      <PremiumHeader />
      
      <main className="container mx-auto px-4 pb-12 page-content">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
              Foire Aux Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez tout ce que vous devez savoir sur Mariable et ses fonctionnalités pour organiser votre mariage sereinement.
            </p>
          </header>
          
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-serif text-foreground hover:text-primary">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
