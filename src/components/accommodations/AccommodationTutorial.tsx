import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from 'lucide-react';

export const AccommodationTutorial = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">Guide d'utilisation</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm">
            📝 Comment ajouter un logement ?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <ol className="list-decimal pl-4 space-y-1">
              <li>Cliquez sur "Ajouter un logement"</li>
              <li>Remplissez le nom, type (hôtel, Airbnb, famille...)</li>
              <li>Indiquez le nombre de chambres et la capacité totale</li>
              <li>Ajoutez les dates d'arrivée et de départ</li>
              <li>Renseignez le prix par nuit et le statut (réservé/payé)</li>
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm">
            👥 Comment assigner des invités ?
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <p>
              Lors de la création ou modification d'un logement, vous pouvez :
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Taper les noms des invités dans le champ dédié</li>
              <li>Appuyer sur Entrée pour ajouter chaque invité</li>
              <li>Vérifier que le nombre d'invités ne dépasse pas la capacité</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sm">
            💰 Gérer les statuts et paiements
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <p>Trois statuts disponibles :</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Non réservé</strong> : Logement identifié mais pas encore réservé</li>
              <li><strong>Réservé</strong> : Réservation confirmée, en attente de paiement</li>
              <li><strong>Payé</strong> : Logement payé et confirmé</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-sm">
            💡 Conseils d'utilisation
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <ul className="list-disc pl-4 space-y-1">
              <li>Groupez les invités par affinités (famille, amis...)</li>
              <li>Prévoyez 10-15% de capacité supplémentaire</li>
              <li>Gardez les contacts des hébergements à jour</li>
              <li>Envoyez les informations aux invités 2 mois avant</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
