import React from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

/** Tuto Gestion Invités : liste → formulaire RSVP principal + mini-site, formulaires annexes indépendants, plan de table. */
const GuestManagementTutorial: React.FC<{ isEnglish: boolean }> = ({ isEnglish }) => {
  const steps = isEnglish
    ? [
        ['Build your guest list', 'Add guests by hand or import them. Diet notes (gluten-free, vegetarian, allergy…) are shown as colour dots on the seating plan.'],
        ['1 main form + 1 mini-site', 'Your first response form is the main one: it is linked to the couple’s mini-site (programme, info, RSVP in one page).'],
        ['Extra forms (optional)', 'You can create other forms (brunch, welcome dinner…). They have their own link and QR code and are not linked to the mini-site.'],
        ['Share the link or QR code', 'Send the mini-site link or each form’s link / QR code to your guests.'],
        ['Track answers & seating', 'Follow confirmations in real time, then import confirmed guests into the seating plan (guests already placed are flagged to avoid duplicates).'],
      ]
    : [
        ['Constituer la liste des invités', 'Ajoutez vos invités à la main ou par import. Les régimes notés (sans gluten, végétarien, allergie…) s’affichent en pastilles de couleur sur le plan de table.'],
        ['1 formulaire principal + 1 mini-site', 'Votre premier formulaire réponse est le principal : il est relié au mini-site des mariés (programme, infos pratiques et RSVP sur une seule page).'],
        ['Formulaires supplémentaires (optionnel)', 'Vous pouvez créer d’autres formulaires (brunch, welcome dinner…). Ils ont leur propre lien et QR code et ne sont pas reliés au mini-site.'],
        ['Partager le lien ou le QR code', 'Envoyez le lien du mini-site ou le lien / QR code de chaque formulaire à vos invités.'],
        ['Suivre les réponses et placer', 'Suivez les confirmations en temps réel, puis importez les invités confirmés dans le plan de table (les invités déjà placés sont signalés pour éviter les doublons).'],
      ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-none min-h-[44px]">
          <Info className="h-4 w-4 mr-2" />Tuto
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-none max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif">{isEnglish ? 'How does guest management work?' : 'Comment fonctionne la gestion des invités ?'}</DialogTitle>
        </DialogHeader>
        <ol className="space-y-4">
          {steps.map(([title, text], index) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{index + 1}</span>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
};

export default GuestManagementTutorial;
