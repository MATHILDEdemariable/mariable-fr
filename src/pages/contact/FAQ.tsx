
import React from 'react';
import ServiceTemplate from '../ServiceTemplate';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "Comment fonctionne Mariable ?",
    answer: "Mariable vous connecte avec des prestataires de mariage soigneusement sélectionnés qui correspondent à vos besoins, votre style et votre budget. Notre plateforme vous permet d'interagir directement avec notre assistant virtuel pour obtenir des recommandations personnalisées et des conseils pour l'organisation de votre mariage."
  },
  {
    question: "Combien coûte l'utilisation de Mariable ?",
    answer: "L'utilisation de base de Mariable est gratuite. Vous pouvez obtenir des recommandations de prestataires et des conseils sans frais. Nous proposons également des services premium avec un accompagnement personnalisé pour les couples qui souhaitent une assistance plus approfondie."
  },
  {
    question: "Comment les prestataires sont-ils sélectionnés ?",
    answer: "Tous les prestataires référencés sur Mariable sont soigneusement évalués selon notre charte d'excellence. Nous vérifions leur professionnalisme, la qualité de leurs services, leur fiabilité et les avis clients. Seuls les prestataires qui répondent à nos standards élevés sont recommandés."
  },
  {
    question: "Puis-je faire confiance aux recommandations ?",
    answer: "Absolument. Nos recommandations sont basées sur vos critères spécifiques et non sur des commissions. Notre but est de vous aider à trouver les prestataires qui correspondent vraiment à vos besoins et à votre vision, sans conflit d'intérêt."
  },
  {
    question: "Mariable est-il disponible partout en France ?",
    answer: "Oui, Mariable est disponible dans toutes les régions de France. Notre réseau de prestataires couvre l'ensemble du territoire, des grandes villes aux zones rurales, pour vous aider où que vous soyez."
  },
  {
    question: "Comment contacter l'équipe Mariable en cas de besoin ?",
    answer: "Vous pouvez nous contacter par email à mathilde@mariable, Whatsapp via la communauté Mariable ou par téléphone en prenant rdv directement. Toutes ces infos sont disponbiles dans la rubrique 'nous contacter'."
  },
  {
    question: "Proposez-vous des services pour d'autres types d'événements ?",
    answer: "Actuellement, Mariable est spécialisé dans l'organisation de mariages. Cependant, certains de nos prestataires peuvent également vous accompagner pour d'autres célébrations comme les fiançailles, les anniversaires de mariage ou les renouvellements de vœux."
  }
];

const FAQContent = () => (
  <>
    <p className="mb-8 text-lg">
      Voici les réponses aux questions les plus fréquemment posées sur Mariable et nos services.
    </p>
    
    <Accordion type="single" collapsible className="w-full">
      {faqItems.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left font-serif">{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </>
);

const FAQ = () => {
  return (
    <ServiceTemplate 
      title="Foire Aux Questions"
      description="Réponses aux questions fréquemment posées"
      content={<FAQContent />}
    />
  );
};

export default FAQ;
