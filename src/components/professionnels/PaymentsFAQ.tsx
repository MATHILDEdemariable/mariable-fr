import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PaymentsFAQ = () => {
  const faqs = [
    {
      question: "Comment sont gérés les virements ?",
      answer: "Les paiements sont traités par Stripe Connect. Vous recevez des virements regroupés selon la fréquence que vous choisissez (hebdomadaire ou mensuelle)."
    },
    {
      question: "Puis-je choisir mes échéances ?",
      answer: "Oui, vous définissez vos propres règles de paiement : acompte de 30% à la signature, solde à J-15, ou tout autre échéancier personnalisé."
    },
    {
      question: "Quid des remboursements/litiges ?",
      answer: "Vous gérez les remboursements directement depuis votre dashboard. En cas de litige complexe, notre équipe support peut intervenir pour médiation."
    },
    {
      question: "Y a-t-il un engagement ?",
      answer: "Non, aucun engagement de durée. Test gratuit 1 mois, puis abonnement mensuel que vous pouvez résilier à tout moment."
    },
    {
      question: "La facturation est-elle fournie ?",
      answer: "Reçus automatiques pour chaque paiement + export CSV pour votre comptabilité. Facturation intégrée prévue lors du lancement officiel."
    },
    {
      question: "Quels sont les frais ?",
      answer: "Frais de transaction Stripe (1,4% + 0,25€ par transaction) + frais plateforme Mariable selon votre volume de mariages. Détails complets communiqués lors de la démo personnalisée."
    }
  ];

  return (
    <section className="max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl font-serif text-center mb-8">Questions fréquentes</h2>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default PaymentsFAQ;
