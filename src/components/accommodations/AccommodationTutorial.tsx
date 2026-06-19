import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AccommodationTutorial = () => {
  const { t } = useTranslation('weddingDay');
  const addSteps = t('accommodationGuide.addSteps', { returnObjects: true }) as string[];
  const assignItems = t('accommodationGuide.assignItems', { returnObjects: true }) as string[];
  const statusItems = t('accommodationGuide.statusItems', { returnObjects: true }) as string[];
  const tipsItems = t('accommodationGuide.tipsItems', { returnObjects: true }) as string[];

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="h-5 w-5 text-blue-600" />
        <h3 className="font-semibold text-blue-900">{t('accommodationGuide.title')}</h3>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-sm">
            {t('accommodationGuide.addTitle')}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <ol className="list-decimal pl-4 space-y-1">
              {addSteps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-sm">
            {t('accommodationGuide.assignTitle')}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <p>{t('accommodationGuide.assignIntro')}</p>
            <ul className="list-disc pl-4 space-y-1">
              {assignItems.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-sm">
            {t('accommodationGuide.statusTitle')}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <p>{t('accommodationGuide.statusIntro')}</p>
            <ul className="list-disc pl-4 space-y-1">
              {statusItems.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-4">
          <AccordionTrigger className="text-sm">
            {t('accommodationGuide.tipsTitle')}
          </AccordionTrigger>
          <AccordionContent className="text-sm text-gray-700 space-y-2">
            <ul className="list-disc pl-4 space-y-1">
              {tipsItems.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
