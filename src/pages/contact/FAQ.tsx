
import React from 'react';
import { Helmet } from 'react-helmet-async';
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
    question: "Qu'est-ce que Mariable ?",
    answer: "Mariable est la première plateforme française dédiée à l'organisation complète de votre mariage. Notre mission est de simplifier chaque étape de votre préparation grâce à des outils digitaux innovants : tableau de bord personnalisé, coordination du jour J, sélection de prestataires, gestion de budget et bien plus encore."
  },
  {
    question: "Comment fonctionne le tableau de bord utilisateur ?",
    answer: "Votre tableau de bord Mariable centralise tous les aspects de votre mariage. Vous y retrouvez : votre checklist personnalisée, vos prestataires sélectionnés, votre budget en temps réel, vos documents importants, votre planning jour J et la possibilité de collaborer avec vos proches. Tout est pensé pour vous faire gagner du temps et de la sérénité."
  },
  {
    question: "Qu'est-ce que l'outil 'Mon Jour M' ?",
    answer: "Mon Jour M est notre innovation phare ! C'est votre coordinateur de mariage digital qui vous permet de créer un planning minute par minute pour votre jour J. Vous pouvez assigner des tâches à vos proches, coordonner vos prestataires, partager le planning avec votre équipe et même recevoir des suggestions personnalisées par IA. Fini le stress de l'organisation !"
  },
  {
    question: "Comment sélectionner mes prestataires sur Mariable ?",
    answer: "Notre moteur de recherche intelligent vous propose des prestataires selon vos critères : localisation, budget, style, disponibilité. Chaque prestataire est vérifié selon notre charte qualité. Vous pouvez consulter leurs portfolios, lire les avis, contacter directement et suivre vos échanges dans votre tableau de bord."
  },
  {
    question: "Mariable est-il gratuit ? Quelles sont les fonctionnalités premium ?",
    answer: "Mariable propose un accès gratuit aux fonctionnalités essentielles : recherche de prestataires, tableau de bord de base, checklist standard. Les fonctionnalités premium incluent : suggestions IA personnalisées pour Mon Jour M, exports PDF brandés, coordination avancée, support prioritaire et outils d'analyse détaillés."
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
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>FAQ - Questions fréquentes | Mariable</title>
        <meta name="description" content="Trouvez les réponses à toutes vos questions sur Mariable : fonctionnalités, tableau de bord, Mon Jour M, sélection de prestataires et tarifs." />
        <meta name="keywords" content="faq mariable, questions mariage, aide organisation mariage, tableau de bord mariage, jour j coordination" />
        <link rel="canonical" href="https://www.mariable.fr/contact/faq" />
      </Helmet>

      <PremiumHeader />
      
      <main className="container mx-auto px-4 pt-28 pb-12">
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
