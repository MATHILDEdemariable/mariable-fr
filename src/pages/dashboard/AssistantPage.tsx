
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';

const AssistantPage: React.FC = () => {
  const { t } = useTranslation('weddingDay');
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif mb-2">{t('assistant.title')}</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t('assistant.subtitle')}
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-lg sm:text-xl">{t('assistant.cardTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <WeddingChatbot preventScroll={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantPage;
