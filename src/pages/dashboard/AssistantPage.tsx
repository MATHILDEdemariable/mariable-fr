
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeddingChatbot from '@/components/wedding-assistant/v2/WeddingChatbot';

const AssistantPage: React.FC = () => {
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif mb-2">Des questions ?</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Notre assistant virtuel est là pour vous aider dans l'organisation de votre mariage
        </p>
      </div>

      <Card className="w-full">
        <CardHeader className="pb-4">
          <CardTitle className="font-serif text-lg sm:text-xl">Assistant Virtuel</CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6">
          <WeddingChatbot preventScroll={true} />
        </CardContent>
      </Card>
    </div>
  );
};

export default AssistantPage;
